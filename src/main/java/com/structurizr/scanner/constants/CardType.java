package com.structurizr.scanner.constants;

public enum CardType {
    OVERVIEW("overview"),
    ARCHITECTURE("architecture"),
    SEQUENCE("sequence"),
    DEPLOYMENT("deployment"),
    DATAFLOW("dataflow"),
    CUSTOM("custom");

    public static final String VALIDATION_PATTERN = "^(overview|architecture|sequence|deployment|dataflow|custom)$";
    public static final String VALIDATION_MESSAGE = "Card type must be one of: overview, architecture, sequence, deployment, dataflow, custom";

    private final String value;

    CardType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static CardType fromValue(String value) {
        for (CardType type : CardType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid card type: " + value);
    }

    public static boolean isValid(String value) {
        try {
            fromValue(value);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
