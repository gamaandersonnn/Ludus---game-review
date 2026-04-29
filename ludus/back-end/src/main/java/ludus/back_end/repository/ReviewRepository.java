package ludus.back_end.repository;

import ludus.back_end.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReviewRepository extends JpaRepository<Review, Long> {

}
