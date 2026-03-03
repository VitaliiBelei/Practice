export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
  ],
  ignoreFiles: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
  ],
  rules: {
    "color-function-notation": null,
    "declaration-empty-line-before": null,
    "media-feature-range-notation": null,
    "no-descending-specificity": null,
    "no-empty-source": null,
    "rule-empty-line-before": null,
    "scss/at-extend-no-missing-placeholder": null,
    "scss/dollar-variable-colon-space-after": null,
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "shorthand-property-no-redundant-values": null,
    "value-keyword-case": null,
  },
};
