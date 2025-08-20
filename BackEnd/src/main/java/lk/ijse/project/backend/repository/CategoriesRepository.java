package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.Categories;
import lk.ijse.project.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriesRepository extends JpaRepository<Categories, Integer> {
    Optional<Categories> findByName(String name);
}
