package ludus.back_end.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private int rating;
    
    @Column(length = 1000)
    private String comment;

    private String backgroundImg;

    @ManyToOne
    @JoinColumn(name = "user_uid")
    private User user;
}
