package com.errorcapa8.ailifequest.domain.valueobject;

import java.util.Locale;

public final class TitleNormalizer {
    private TitleNormalizer() {
    }

    public static String normalize(String title) {
        if (title == null) {
            return null;
        }
        return title.strip().replaceAll("(?U)\\s+", " ").toLowerCase(Locale.ROOT);
    }
}
