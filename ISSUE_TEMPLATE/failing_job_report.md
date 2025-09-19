### Issue: Failing Job - Test and Upload Coverage

#### Description:
The job 'Test and Upload Coverage' has failed due to 4 failing tests in `test/competitor-enrichment.test.ts`.

#### Common Causes:
- Incomplete or invalid competitor data.
- Missing or malformed output fields in `enrichCompetitorProfile` or its associated class methods.

#### Specific Test Failures:
Refer to the test file at commit `1e6a65d95dbb74ff6088cb7b406dd15a77363bb6` for detailed scenarios.

#### Recommendations:
- Review error handling implementations.
- Check the structure of `result.data`.
- Validate social media URL logic as tested in the file.

#### Action Needed:
Please investigate the above issues to resolve the failing tests.