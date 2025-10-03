# Tests

This directory contains tests for core functionality.

## Running Tests

Tests are currently scaffolded but not fully implemented. To set up testing:

1. Install Jest and dependencies:
```bash
npm install --save-dev jest @babel/preset-env @babel/preset-react
```

2. Create `.babelrc` in project root:
```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

3. Add test script to `package.json`:
```json
"scripts": {
  "test": "jest"
}
```

4. Run tests:
```bash
npm test
```

## Test Structure

- `core/` - Tests for core business logic (parser, codegen, etc.)
- Tests should be browser API-free and focus on pure functions

## TODO

- Implement actual test cases for parser
- Implement actual test cases for code generator
- Add test coverage reporting
- Set up CI/CD for automated testing
