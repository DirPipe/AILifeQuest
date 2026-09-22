package com.errorcapa8.ailifequest.infrastructure.jpa;

import com.errorcapa8.ailifequest.infrastructure.entity.XpTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpringDataXpTransactionRepository extends JpaRepository<XpTransactionEntity, UUID> {
}
