const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Rollback Strategy Workflow', () => {
  const workflowPath = path.join(__dirname, '../../.github/workflows/rollback.yml');

  it('should verify rollback.yml exists', () => {
    expect(fs.existsSync(workflowPath)).toBe(true);
  });

  it('should verify rollback.yml is a valid YAML file', () => {
    const content = fs.readFileSync(workflowPath, 'utf8');
    expect(() => {
      yaml.load(content);
    }).not.toThrow();
  });

  it('should verify rollback.yml has workflow_dispatch trigger', () => {
    const content = fs.readFileSync(workflowPath, 'utf8');
    const doc = yaml.load(content);
    expect(doc.on).toBeDefined();
    expect(doc.on.workflow_dispatch).toBeDefined();
  });
});
