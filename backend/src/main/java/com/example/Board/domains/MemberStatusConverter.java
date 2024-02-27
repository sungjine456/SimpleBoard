package com.example.Board.domains;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MemberStatusConverter implements AttributeConverter<MemberStatus, Integer> {

    @Override
    public Integer convertToDatabaseColumn(MemberStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getId();
    }

    @Override
    public MemberStatus convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }
        return MemberStatus.getStatus(dbData);
    }
}
