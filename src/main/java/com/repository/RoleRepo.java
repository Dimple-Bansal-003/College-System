package com.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.entity.RoleEntity;



@Repository
public interface RoleRepo extends JpaRepository<RoleEntity, Long> {

    Optional<RoleEntity> findByName(String role_name);
}