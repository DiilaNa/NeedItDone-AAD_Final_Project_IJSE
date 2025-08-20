package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.Applications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Applications,Integer> {
    List<Applications> findApplicationsByJobTitleContainingIgnoreCase(String jobTitle);

    Optional<Object> findById(Long id);
}
