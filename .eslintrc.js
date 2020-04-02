module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // 不需要以下规则
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 函数小括号前加空格
    'space-before-function-paren':0,
    'space-infix-ops': 0,
    // 文件末尾有太多的空行
    'no-multiple-empty-lines': 0
  }
}
