package ludus.back_end.service;

import lombok.RequiredArgsConstructor;
import ludus.back_end.entity.Review;
import ludus.back_end.entity.User;
import ludus.back_end.enums.GameStatus;
import ludus.back_end.repository.ReviewRepository;
import ludus.back_end.repository.UserRepository;
import ludus.back_end.request.ReviewPostRequestBody;
import ludus.back_end.request.ReviewPutRequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    private User getLoggedUser(){

        var auth = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) auth.getPrincipal();

        @SuppressWarnings("unchecked")
        var details = (Map<String, String>) auth.getDetails();

        return userRepository.findById(uid).orElseGet(() ->
                userRepository.save(User.builder()
                        .uid(uid)
                        .name(details.get("name"))
                        .email(details.get("email"))
                        .picture(details.get("picture"))
                        .build())
        );
    }

    public List<Review> getAllReviews(){
        User user = getLoggedUser();
        return reviewRepository.findByUser(user);
    }

    public Review findById(Long id){
        User user = getLoggedUser();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (!review.getUser().getUid().equals(user.getUid())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acess denied");
        }

        return review;
    }

    public Review saveReview(ReviewPostRequestBody dto){
        User user = getLoggedUser();

        return reviewRepository.save(Review.builder()
                .name(dto.getName())
                .rating(dto.getRating())
                .comment(dto.getComment())
                .backgroundImg(dto.getBackgroundImg())
                .favorite(dto.isFavorite())
                .status(dto.getStatus())
                .user(user)
                .build());
    }

    public Review updateReview(Long id, ReviewPutRequestBody dto){
        User user = getLoggedUser();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (!review.getUser().getUid().equals(user.getUid())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acess denied");
        }

        review.setName(dto.getName());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setFavorite(dto.isFavorite());
        review.setStatus(dto.getStatus());
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id){
        User user = getLoggedUser();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (!review.getUser().getUid().equals(user.getUid())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acess denied");
        }

        reviewRepository.delete(review);
    }

    public Review toggleFavorite(Long id) {
        User user = getLoggedUser();

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));

        if (!review.getUser().getUid().equals(user.getUid())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        review.setFavorite(!review.isFavorite());
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByStatus(GameStatus status){
        User user = getLoggedUser();
        return reviewRepository.findByUserAndStatus(user, status);
    }
}
