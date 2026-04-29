package ludus.back_end.service;

import lombok.RequiredArgsConstructor;
import ludus.back_end.entity.Review;
import ludus.back_end.repository.ReviewRepository;
import ludus.back_end.request.ReviewPostRequestBody;
import ludus.back_end.request.ReviewPutRequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> listAllReviews(){
        return reviewRepository.findAll();
    }

    public Review findByIdReview(long id){
        return reviewRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review not found"));
    }

    public Review saveReview(ReviewPostRequestBody reviewPostRequestBody){
        return reviewRepository.save(Review.builder()
                .name(reviewPostRequestBody.getName())
                .rating(reviewPostRequestBody.getRating())
                .comment(reviewPostRequestBody.getComment())
                .build());
    }

    public Review updateReview(Long id, ReviewPutRequestBody reviewPutRequestBody){
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review not found"));

        return reviewRepository.save(Review.builder()
                .id(review.getId())
                .name(reviewPutRequestBody.getName())
                .rating(reviewPutRequestBody.getRating())
                .comment(reviewPutRequestBody.getComment())
                .build());
    }
}
