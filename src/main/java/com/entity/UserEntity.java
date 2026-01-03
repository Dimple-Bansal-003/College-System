package com.entity;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name="users")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long userId;

    @Column(nullable = false, unique = true)
     String username;

    @Column(nullable = false)
     String password;
    
    @Column(nullable = false)
    String email;
    
   // ADMIN, FACULTY, STAFF, STUDENT

    @Column(nullable = false)
     Boolean isActive = true;

     LocalDateTime createdAt = LocalDateTime.now();
     
     @ManyToOne
     @JoinColumn(name = "role_id")
     RoleEntity role;
     
    // getters & setters
}
