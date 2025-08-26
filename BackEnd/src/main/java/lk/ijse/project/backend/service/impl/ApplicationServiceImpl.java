package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.ApplicationDTO;
import lk.ijse.project.backend.entity.Applications;
import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.repository.ApplicationRepository;
import lk.ijse.project.backend.repository.JobPostRepository;
import lk.ijse.project.backend.repository.UserRepository;
import lk.ijse.project.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private final ModelMapper modelMapper;
    private final ApplicationRepository applicationRepository;
    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;
    @Override
    @Transactional
    public void saveApplications(ApplicationDTO applicationDTO) {
        JobPosts posts = (JobPosts) jobPostRepository.findById(applicationDTO.getJobPostsId())
                .orElseThrow(() -> new RuntimeException("JobPost not found"));
        User user = (User) userRepository.findById(applicationDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(applicationRepository.existsByUsersIdAndJobPostsId(user.getId(), posts.getId())) {
            throw new RuntimeException("You already applied for this job");
        }

        Applications applications = modelMapper.map(applicationDTO, Applications.class);
        applications.setJobPosts(posts);
        applications.setUsers(user);
        applications.setStatus("PENDING");
        applications.setDate(new Date());

        applicationRepository.save(applications);



    }

    @Override
    @Transactional
    public void updateApplications(ApplicationDTO applicationDTO) {
        Applications existing = (Applications) applicationRepository.findById(applicationDTO.getId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        JobPosts posts = (JobPosts) jobPostRepository.findById(applicationDTO.getJobPostsId())
                .orElseThrow(() -> new RuntimeException("JobPost not found"));

        User user = (User) userRepository.findById(applicationDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setJobTitle(applicationDTO.getJobTitle());
        existing.setCategory(applicationDTO.getCategory());
        existing.setDate(applicationDTO.getDate());
        existing.setStatus(applicationDTO.getStatus());
        existing.setAmount(applicationDTO.getAmount());
        existing.setJobPosts(posts);
        existing.setUsers(user);

        applicationRepository.save(existing);




    }

    @Override
    @Transactional
    public void deleteApplications(ApplicationDTO applicationDTO) {
        Applications existing = (Applications) applicationRepository.findById(applicationDTO.getId())
                .orElseThrow(() -> new RuntimeException("Application not found"));
        applicationRepository.delete(existing);
    }

@Override
@Transactional(readOnly = true)
public List<ApplicationDTO> getAllApplications(Long userID) {
    List<Applications> list = applicationRepository.findByUsersId(userID);

    if (list.isEmpty()){
        throw new RuntimeException("No applications found");
    }

    List<ApplicationDTO> dtos = new ArrayList<>();
    for (Applications app : list) {
        ApplicationDTO dto = modelMapper.map(app, ApplicationDTO.class);
        dto.setJobTitle(app.getJobPosts().getJobTitle());
        dto.setCategory(app.getJobPosts().getCategories() != null
                ? app.getJobPosts().getCategories().getName() : "");
        dto.setAmount(app.getJobPosts().getCost());
        dto.setDate(app.getDate());
        dto.setStatus(app.getStatus());
        dto.setJobPostsId(app.getJobPosts().getId());
        dto.setUserId(app.getUsers().getId());
        dtos.add(dto);
    }

    return dtos;
}


    @Override
    @Transactional(readOnly = true)
    public List<ApplicationDTO> getAllApplicationsByKeyword(String keyword) {
        List<Applications> list = applicationRepository.findApplicationsByJobTitleContainingIgnoreCase(keyword);
        if (list.isEmpty()){
            throw new RuntimeException("No applications found");
        }
        return modelMapper.map(list, new TypeToken<List<ApplicationDTO>>() {}.getType());

    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationDTO> getAllApplicationsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Applications> applications = applicationRepository.findAll(pageable);
        return applications.map(application -> modelMapper.map(application, ApplicationDTO.class));
    }
}
