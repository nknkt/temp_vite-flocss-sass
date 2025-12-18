module.exports = {
  ignoreFiles: ['src/assets/styles/foundation/_destyle.scss'],

  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-rational-order'
  ],

  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    '@stylistic/stylelint-plugin'
  ],

  rules: {
    'plugin/declaration-block-no-ignored-properties': true,
    'at-rule-no-unknown': null,
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': null,
    '@stylistic/number-leading-zero': 'always',
    'number-max-precision': 2,
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'blockless-after-same-name-blockless']
      }
    ],

    'color-named': 'never',
    'declaration-no-important': true,
    'font-family-name-quotes': 'always-unless-keyword',
    'font-weight-notation': 'numeric',
    'function-calc-no-unspaced-operator': true,

    // SCSS specific
    'scss/at-mixin-argumentless-call-parentheses': 'always',
    'scss/at-rule-no-unknown': true,
    'scss/declaration-nested-properties': 'never',
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/selector-no-redundant-nesting-selector': true,

    // Nesting rules
    'selector-nested-pattern': null
  }
}