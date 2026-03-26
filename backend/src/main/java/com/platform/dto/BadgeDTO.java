package com.platform.dto;

import java.time.LocalDateTime;

public class BadgeDTO {
    private String name;
    private String description;
    private String icon;
    private LocalDateTime earnedAt;
    private boolean earned;

    public BadgeDTO() {
    }

    public BadgeDTO(String name, String description, String icon, LocalDateTime earnedAt, boolean earned) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.earnedAt = earnedAt;
        this.earned = earned;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }

    public boolean isEarned() {
        return earned;
    }

    public void setEarned(boolean earned) {
        this.earned = earned;
    }

    public static class BadgeDTOBuilder {
        private String name;
        private String description;
        private String icon;
        private LocalDateTime earnedAt;
        private boolean earned;

        public BadgeDTOBuilder name(String name) {
            this.name = name;
            return this;
        }

        public BadgeDTOBuilder description(String description) {
            this.description = description;
            return this;
        }

        public BadgeDTOBuilder icon(String icon) {
            this.icon = icon;
            return this;
        }

        public BadgeDTOBuilder earnedAt(LocalDateTime earnedAt) {
            this.earnedAt = earnedAt;
            return this;
        }

        public BadgeDTOBuilder earned(boolean earned) {
            this.earned = earned;
            return this;
        }

        public BadgeDTO build() {
            return new BadgeDTO(name, description, icon, earnedAt, earned);
        }
    }

    public static BadgeDTOBuilder builder() {
        return new BadgeDTOBuilder();
    }
}
