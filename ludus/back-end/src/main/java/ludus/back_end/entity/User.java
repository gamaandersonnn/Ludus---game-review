package ludus.back_end.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
public class User {

    @Id
    private String uid;

    private String name;
    private String email;
    private String picture;
}
