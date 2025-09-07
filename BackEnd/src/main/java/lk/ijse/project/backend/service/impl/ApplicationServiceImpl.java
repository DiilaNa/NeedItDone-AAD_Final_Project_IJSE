package lk.ijse.project.backend.service.impl;

import lk.ijse.project.backend.dto.ActiveJobDTO;
import lk.ijse.project.backend.dto.ApplicationDTO;
import lk.ijse.project.backend.dto.JobPostDTO;
import lk.ijse.project.backend.entity.Applications;
import lk.ijse.project.backend.entity.JobPosts;
import lk.ijse.project.backend.entity.User;
import lk.ijse.project.backend.entity.enums.ApplicationStatus;
import lk.ijse.project.backend.entity.enums.JobPostStatus;
import lk.ijse.project.backend.entity.enums.RatingStatus;
import lk.ijse.project.backend.repository.ApplicationRepository;
import lk.ijse.project.backend.repository.JobPostRepository;
import lk.ijse.project.backend.repository.RatingRepository;
import lk.ijse.project.backend.repository.UserRepository;
import lk.ijse.project.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private final ModelMapper modelMapper;
    private final ApplicationRepository applicationRepository;
    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
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
        applications.setStatus(ApplicationStatus.PENDING);
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
        return Collections.emptyList();
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
    public Page<ApplicationDTO> getAllApplicationsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Applications> applications = applicationRepository.findAll(pageable);
        return applications.map(application -> modelMapper.map(application, ApplicationDTO.class));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationDTO> getApplicationsForHomeowner(Long homeownerId) {
        List<Applications> apps = applicationRepository.findAllApplicationsForHomeowner(homeownerId);

        if (apps.isEmpty()) {
            return Collections.emptyList();
        }

        return apps.stream().map(app -> {
            ApplicationDTO dto = modelMapper.map(app, ApplicationDTO.class);
            dto.setJobTitle(app.getJobPosts().getJobTitle());
            dto.setWorkerName(app.getUsers().getUsername());
            dto.setSkills(app.getSkills());
            dto.setExperience(app.getExperience());
            dto.setDescription(app.getDescription());
            dto.setUserId(app.getUsers().getId());
            Long jobPostId = app.getJobPosts().getId();
            Long workerId = app.getUsers().getId();
            System.out.println(workerId);
            System.out.println(jobPostId);

            if (ratingRepository.existsByUsers_IdAndJobPosts_Id(workerId, jobPostId)) {
                dto.setRatingStatus(RatingStatus.ADDED);
            } else {
                dto.setRatingStatus(RatingStatus.PENDING);
            }

            return dto;
        }).toList();
    }


    @Override
    @Transactional
    public void updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        Applications application = (Applications) applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        applicationRepository.save(application);
    }

    @Override
    public List<ActiveJobDTO> findActiveJobs(Long workerId) {
        List<Applications> apps = applicationRepository.findByUsersIdAndStatus(workerId, ApplicationStatus.ACCEPTED);

        return apps.stream()
                .map(app -> ActiveJobDTO.builder()
                        .applicationId(app.getId())
                        .jobPostId(app.getJobPosts().getId())
                        .jobTitle(app.getJobTitle())
                        .description(app.getDescription())
                        .cost(app.getAmount())
                        .deadline(app.getJobPosts().getDeadline().toString())
                        .build())
                .toList();
    }


    @Override
    @Transactional
    public Applications markAsComplete(Long applicationID,Long userId) {
        Applications application = applicationRepository
                .findByIdAndUsers_Id(applicationID, userId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(ApplicationStatus.COMPLETED);

        JobPosts jobPost = application.getJobPosts();
        jobPost.setJobPostStatus(JobPostStatus.COMPLETED);

        jobPostRepository.save(jobPost);
        return applicationRepository.save(application);

    }

    @Override
    @Transactional
    public List<ApplicationDTO> getRecentApplications(Long homeownerId) {
        System.out.println(homeownerId);
        List<Applications> apps = applicationRepository
                .findTop3ByJobPosts_Users_IdOrderByDateDesc(homeownerId);

        return apps.stream()
                .map(app -> {
                    ApplicationDTO dto = new ApplicationDTO();
                    dto.setId(app.getId());
                    dto.setWorkerName(app.getUsers().getUsername());
                    dto.setJobTitle(app.getJobPosts().getJobTitle());
                    dto.setDate(app.getDate());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    @Override
    @Transactional(readOnly = true)
    public List<ApplicationDTO> getRecentApplicationsDashBoard(Long workerId) {
        List<Applications> applications = applicationRepository.findTop3ByUsers_IdOrderByDateDesc(workerId);

        return applications.stream()
                .map(app -> {
                    ApplicationDTO dto = modelMapper.map(app, ApplicationDTO.class);

                    // If the entity's jobTitle is null, use JobPosts title
                    if (dto.getJobTitle() == null && app.getJobPosts() != null) {
                        dto.setJobTitle(app.getJobPosts().getJobTitle());
                    }

                    // Map the date and status manually if needed (optional)
                    dto.setDate(app.getDate());
                    dto.setStatus(app.getStatus());

                    return dto;
                })
                .toList();
    }

}

