const fs = require('fs');
const path = require('path');

describe('Operational Readiness', () => {
  it('should have a runbook documenting incident response, recovery procedures, and offline mode fallback', () => {
    const runbookPath = path.join(__dirname, '../docs/runbooks.md');
    expect(fs.existsSync(runbookPath)).toBe(true);

    const content = fs.readFileSync(runbookPath, 'utf8');
    expect(content.toLowerCase()).toContain('incident response');
    expect(content.toLowerCase()).toContain('recovery procedures');
    expect(content.toLowerCase()).toContain('offline mode fallback');
  });

  it('should have a rollback strategy implemented via GitHub Actions', () => {
    const workflowPath = path.join(__dirname, '../.github/workflows/rollback.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);

    const content = fs.readFileSync(workflowPath, 'utf8');
    expect(content).toContain('git read-tree');
    expect(content).toContain('git push origin HEAD:${{ github.ref_name }}');
    expect(content).toContain('TARGET_COMMIT: ${{ inputs.commit_sha }}');
  });
});
