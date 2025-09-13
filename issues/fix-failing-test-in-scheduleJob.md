### Issue Title
Fix failing test in scheduleJob

### Issue Body
**Description:**
There is a failing test in `scheduleJob` located in `lib/scraping-scheduler.ts`. The error occurs when running `test/scraping-scheduler.test.ts` at line 86. The error message is: 
```
Error in scheduleJob: Error: Test error
```

**Steps to Reproduce:**
1. Run the test suite for `test/scraping-scheduler.test.ts`.
2. Observe the failure at line 86.

**Expected Behavior:**
The job should pass without errors.

**Proposed Solution:**
Please investigate the cause of the error and update the test to properly handle expected errors or mock dependencies. Ensure that the job passes in CI.

**Reference:**
- CI run: [GitHub Actions Run](https://github.com/prettyinpurple2021/solosuccess-ai/actions/runs/17701932427/job/50308720453)
- Commit Reference: `682c34d84eab31004fe5201cba43b7ff2d9f480a`