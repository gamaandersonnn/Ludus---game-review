package ludus.back_end.repository;

import ludus.back_end.entity.Review;
import ludus.back_end.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUser(User user);
}
