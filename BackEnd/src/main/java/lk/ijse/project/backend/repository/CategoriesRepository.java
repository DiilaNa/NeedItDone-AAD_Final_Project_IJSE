package lk.ijse.project.backend.repository;

import lk.ijse.project.backend.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Integer> {
    Optional<Categories> findByName(String categoryName);
}
