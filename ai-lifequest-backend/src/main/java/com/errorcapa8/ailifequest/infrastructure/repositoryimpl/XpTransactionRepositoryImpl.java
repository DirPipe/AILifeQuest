package com.errorcapa8.ailifequest.infrastructure.repositoryimpl;

import com.errorcapa8.ailifequest.domain.model.XpTransaction;
import com.errorcapa8.ailifequest.domain.repository.XpTransactionRepository;
import com.errorcapa8.ailifequest.infrastructure.jpa.SpringDataXpTransactionRepository;
import com.errorcapa8.ailifequest.infrastructure.mapper.XpTransactionMapper;
import org.springframework.stereotype.Repository;

@Repository
public class XpTransactionRepositoryImpl implements XpTransactionRepository {
    private final SpringDataXpTransactionRepository springDataXpTransactionRepository;

    public XpTransactionRepositoryImpl(SpringDataXpTransactionRepository springDataXpTransactionRepository) {
        this.springDataXpTransactionRepository = springDataXpTransactionRepository;
    }

    @Override
    public XpTransaction save(XpTransaction transaction) {
        return XpTransactionMapper.toDomain(springDataXpTransactionRepository.save(XpTransactionMapper.toEntity(transaction)));
    }
}
