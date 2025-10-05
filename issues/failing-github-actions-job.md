### Issue: Node.js Module Loading Error in Test and Upload Coverage Workflow

#### Description:
The GitHub Actions workflow for "Test and Upload Coverage" (`.github/workflows/coverage.yml`) is failing with a **Node.js ES Module error**. The root cause is that `jest.config.js` uses CommonJS syntax (`require()` and `module.exports`), but the project is configured as an ES module in `package.json` with `"type": "module"`.

#### Error Details:
```
ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and 
'/home/runner/work/solosuccess-ai/solosuccess-ai/package.json' contains "type": "module". 
To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
    at file:///home/runner/work/solosuccess-ai/solosuccess-ai/jest.config.js:1:18
```

#### Failing Workflow Step:
- **Workflow File**: `.github/workflows/coverage.yml`
- **Failing Step**: Step 5 - "Run tests with coverage" (`npm run coverage:ci`)
- **Latest Job Run**: [View Job #51984067733](https://github.com/prettyinpurple2021/solosuccess-ai/actions/runs/18258884835/job/51984067733#step:5:21)
- **Commit**: `bd689a6778d39c9ac96c040e32da7f8041f4dfbf`

#### Root Cause Analysis:
1. **Package Configuration**: `package.json` line 5 declares `"type": "module"`, making all `.js` files use ES module syntax
2. **Jest Configuration**: `jest.config.js` line 1 uses `const nextJest = require('next/jest')` (CommonJS syntax)
3. **Conflict**: Node.js cannot use `require()` in an ES module context

#### Steps to Investigate and Fix:

##### 1. Check the Failing Workflow File
Examine `.github/workflows/coverage.yml` for the failing step:
```bash
# View the workflow configuration
cat .github/workflows/coverage.yml
```

The failing command on line 25 is:
```yaml
- name: Run tests with coverage
  run: npm run coverage:ci
```

##### 2. Verify Dependencies Installation
Check that all required dependencies in `package.json` are installed:
```bash
# Install all dependencies (with legacy peer deps flag if needed)
npm install

# Or for CI environments (clean install)
npm ci

# Verify jest and related packages are installed
npm list jest next @jest/globals ts-jest
```

##### 3. Confirm Module Import/Require Paths
Verify that local file and module paths are correct:
```bash
# Check jest configuration exists and review its syntax
cat jest.config.js

# Check package.json type field
grep '"type"' package.json
```

#### Recommended Solutions:

##### Option 1: Rename jest.config.js to jest.config.cjs (Recommended)
This tells Node.js to treat the file as CommonJS:
```bash
# Rename the file to use .cjs extension
mv jest.config.js jest.config.cjs

# Update any references to the config file if needed
# Jest automatically looks for jest.config.cjs
```

##### Option 2: Convert jest.config.js to ES Module Syntax
Convert the configuration to use ES module syntax:
```javascript
// jest.config.js (ES Module syntax)
import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/tests/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'json-summary', 'clover', 'text', 'text-summary'],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
  globalTeardown: '<rootDir>/jest.teardown.js',
};

export default createJestConfig(customJestConfig);
```

##### Option 3: Update Workflow to Use --legacy-peer-deps
Modify `.github/workflows/coverage.yml` line 22 to match other workflows:
```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps
```

#### Code Suggestions:

**Add missing dependencies** (if any are found missing after running `npm list`):
```bash
npm install <module-name>
```

**Fix require paths for local files** (if any are using incorrect paths):
- Use `@/` prefix for absolute imports (already configured in tsconfig.json)
- Ensure relative paths start with `./` or `../`
- Example: Change `require('utils/helper')` to `require('./utils/helper')` or `import { helper } from '@/utils/helper'`

#### Additional Files to Check:
- `jest.teardown.js` - May also need to be renamed to `.cjs` or converted to ES module syntax
- Any other `.js` configuration files in the root directory that use `require()`

#### Testing the Fix:
After implementing a solution, test locally:
```bash
# Run the exact command that fails in CI
npm run coverage:ci

# Or run jest directly
npx jest --coverage --runInBand

# Test regular jest command
npm test
```

#### Related Documentation:
- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)
- [Jest Configuration - ES Modules](https://jestjs.io/docs/ecmascript-modules)
- [Next.js Jest Setup](https://nextjs.org/docs/app/building-your-application/testing/jest)

#### Previous Job References:
- Original Issue: [View Failing Job](https://github.com/prettyinpurple2021/solosuccess-ai/actions/runs/18233696410/job/51922927422)
- Latest Failure: [View Job #51984067733](https://github.com/prettyinpurple2021/solosuccess-ai/actions/runs/18258884835/job/51984067733#step:5:21)

#### Priority: HIGH
This issue blocks all test coverage reporting in CI/CD pipeline.