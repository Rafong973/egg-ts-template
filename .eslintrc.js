module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    plugins: [
        'html',
        'vue'
    ],
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 'off',
        'semi':['error','always'],
        'indent': ['error', 4],
        // 数字2表示统一缩进2个空格，数字1表示1倍缩进
        'vue/script-indent': ['error', 4, {'baseIndent': 1}]
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    globals: {
        _hmt: 0
    },
    overrides: [
        {
          'files': ['*.vue'],
          'rules': {
          'indent': 'off'
          }
        }
      ]

}
