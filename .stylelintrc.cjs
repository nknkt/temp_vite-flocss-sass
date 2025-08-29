module.exports = {
  ignoreFiles: ['src/assets/styles/foundation/_destyle.scss'],

  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-rational-order',
  ],

  plugins: [
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-scss',
    'stylelint-order',
    '@stylistic/stylelint-plugin',
  ],

  rules: {
    'plugin/declaration-block-no-ignored-properties': true,
    'at-rule-no-unknown': null,
    '@stylistic/number-leading-zero': 'never',
    'number-max-precision': 2,
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'blockless-after-same-name-blockless'],
      },
    ],

    'color-named': 'never',
    'declaration-no-important': true,
    'font-family-name-quotes': 'always-unless-keyword',
    'font-weight-notation': 'numeric',
    'function-calc-no-unspaced-operator': true,
    'no-empty-source': null,
    'order/order': [['custom-properties', 'declarations', 'rules']],
    'order/properties-order': [
      // use the rational-order configuration as the base
      require('stylelint-config-rational-order').rules['order/properties-order'],
      { unspecified: 'bottomAlphabetical' },
    ],

    // SCSS specific
    'scss/at-mixin-argumentless-call-parentheses': 'always',
    'scss/at-rule-no-unknown': true,
    'scss/declaration-nested-properties': 'never',
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/selector-no-redundant-nesting-selector': true,
  },
};
