package com.errorcapa8.ailifequest.infrastructure.mapper;

import com.errorcapa8.ailifequest.domain.model.XpTransaction;
import com.errorcapa8.ailifequest.domain.valueobject.ChallengeId;
import com.errorcapa8.ailifequest.domain.valueobject.UserId;
import com.errorcapa8.ailifequest.domain.valueobject.XP;
import com.errorcapa8.ailifequest.infrastructure.entity.XpTransactionEntity;

public final class XpTransactionMapper {
    private XpTransactionMapper() {
    }

    public static XpTransaction toDomain(XpTransactionEntity entity) {
        ChallengeId challengeId = entity.getChallengeId() == null ? null : new ChallengeId(entity.getChallengeId());
        return new XpTransaction(
                entity.getId(),
                new UserId(entity.getUserId()),
                challengeId,
                new XP(entity.getAmount()),
                entity.getReason(),
                entity.getCreatedAt()
        );
    }

    public static XpTransactionEntity toEntity(XpTransaction transaction) {
        XpTransactionEntity entity = new XpTransactionEntity();
        entity.setId(transaction.getId());
        entity.setUserId(transaction.getUserId().value());
        entity.setChallengeId(transaction.getChallengeId() == null ? null : transaction.getChallengeId().value());
        entity.setAmount(transaction.getAmount().value());
        entity.setReason(transaction.getReason());
        entity.setCreatedAt(transaction.getCreatedAt());
        return entity;
    }
}
