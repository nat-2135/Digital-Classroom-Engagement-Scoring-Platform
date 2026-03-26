package com.platform.models;

import jakarta.persistence.*;

@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String icon;

    @Column(name = "trigger_condition")
    private String triggerCondition;

    public Badge() {
    }

    public Badge(Long id, String name, String description, String icon, String triggerCondition) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.triggerCondition = triggerCondition;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getTriggerCondition() {
        return triggerCondition;
    }

    public void setTriggerCondition(String triggerCondition) {
        this.triggerCondition = triggerCondition;
    }

    public static class BadgeBuilder {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private String triggerCondition;

        public BadgeBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BadgeBuilder name(String name) {
            this.name = name;
            return this;
        }

        public BadgeBuilder description(String description) {
            this.description = description;
            return this;
        }

        public BadgeBuilder icon(String icon) {
            this.icon = icon;
            return this;
        }

        public BadgeBuilder triggerCondition(String triggerCondition) {
            this.triggerCondition = triggerCondition;
            return this;
        }

        public Badge build() {
            return new Badge(id, name, description, icon, triggerCondition);
        }
    }

    public static BadgeBuilder builder() {
        return new BadgeBuilder();
    }
}
