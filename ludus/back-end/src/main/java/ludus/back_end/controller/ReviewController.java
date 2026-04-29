package ludus.back_end.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ludus.back_end.entity.Review;
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
        return ResponseEntity.ok(reviewService.listAllReviews());
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<Review> findReviewById(@PathVariable long id){
        return ResponseEntity.ok(reviewService.findByIdReview(id));
    }

    @PostMapping
    public ResponseEntity<Review> saveReview(@RequestBody @Valid ReviewPostRequestBody review){
        return new ResponseEntity<>(reviewService.saveReview(review), HttpStatus.CREATED);
    }

    @PostMapping(path = "/update/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody @Valid ReviewPutRequestBody review){
        return new ResponseEntity<>(reviewService.updateReview(id, review), HttpStatus.OK);
    }
}
