package ludus.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ludus.back_end.entity.Review;
import ludus.back_end.enums.GameStatus;
import ludus.back_end.request.ReviewPostRequestBody;
import ludus.back_end.request.ReviewPutRequestBody;
import ludus.back_end.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("reviews")
@RequiredArgsConstructor
public class ReviewController {

    public final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> listAllReviews(){
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<Review> findReviewById(@PathVariable long id){
        return ResponseEntity.ok(reviewService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Review> saveReview(@RequestBody @Valid ReviewPostRequestBody review){
        return new ResponseEntity<>(reviewService.saveReview(review), HttpStatus.CREATED);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody @Valid ReviewPutRequestBody review){
        return new ResponseEntity<>(reviewService.updateReview(id, review), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id){
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Review>> listAllReviews(
            @RequestParam(required = false) GameStatus status) {

        if (status != null) {
            return ResponseEntity.ok(reviewService.getReviewsByStatus(status));
        }
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
}
