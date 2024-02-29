package com.example.Board.domains;

import java.time.LocalDateTime;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
@NoArgsConstructor
public class TimeEntity {

    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    @PrePersist
    public void prePersist() {
        this.createDate = LocalDateTime.now();
        this.updateDate = this.createDate;
    }

    @PreUpdate
    public void preUpdate() {
        this.updateDate = LocalDateTime.now();
    }
}
