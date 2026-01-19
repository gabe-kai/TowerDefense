# CI/CD Process

## Overview

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main`, `develop`, or `feature/**` branches
- Pull requests to `main` or `develop`

**Jobs:**

#### Test & Coverage
- Runs on Ubuntu latest
- Tests Node.js 20.x
- Installs dependencies
- Runs test suite
- Generates coverage report
- Uploads coverage artifacts

#### Build
- Runs after tests pass
- Builds the project
- Uploads build artifacts

**Artifacts:**
- Coverage reports (retained 7 days)
- Build output (retained 7 days)

### 2. PR Checks Workflow (`.github/workflows/pr-checks.yml`)

**Triggers:**
- Pull request opened, updated, or reopened

**Actions:**
- Runs test suite
- Validates build
- Comments on PR with results

## Local Testing

Before pushing, ensure:

```bash
# Run tests
npm test -- --run

# Check build
npm run build

# Check coverage
npm run test:coverage
```

## Coverage Requirements

Current thresholds (configured in `vitest.config.ts`):
- Lines: 50%
- Functions: 50%
- Branches: 40%
- Statements: 50%

These thresholds are set for MVP. As the project matures, they should be increased.

## Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/**` - Feature branches
- All branches trigger CI on push

## Manual Workflow Triggers

Workflows can be manually triggered from the GitHub Actions tab if needed.

## Future Enhancements

Potential additions:
- [ ] Automated deployment to staging/production
- [ ] Linting checks (ESLint, Prettier)
- [ ] Type checking in CI
- [ ] Security scanning
- [ ] Performance testing
- [ ] Automated dependency updates (Dependabot)
