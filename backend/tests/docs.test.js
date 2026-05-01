const fs = require('fs');
const path = require('path');

describe('Operational Runbooks', () => {
  const runbooksPath = path.join(__dirname, '../../docs/runbooks.md');

  it('should verify docs/runbooks.md exists', () => {
    expect(fs.existsSync(runbooksPath)).toBe(true);
  });

  it('should verify docs/runbooks.md contains required sections', () => {
    const content = fs.readFileSync(runbooksPath, 'utf8');
    expect(content).toContain('## Incident response steps');
    expect(content).toContain('## Recovery procedures');
    expect(content).toContain('## Offline mode fallback guide');
  });
});
