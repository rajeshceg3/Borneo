const fs = require('fs');
const path = require('path');

describe('Operational Runbooks', () => {
    const runbooksPath = path.join(__dirname, '../docs/runbooks.md');

    it('should exist', () => {
        expect(fs.existsSync(runbooksPath)).toBe(true);
    });

    it('should contain Incident Response Procedures', () => {
        const content = fs.readFileSync(runbooksPath, 'utf8');
        expect(content).toContain('## 1. Incident Response Procedures');
    });

    it('should contain Recovery Procedures', () => {
        const content = fs.readFileSync(runbooksPath, 'utf8');
        expect(content).toContain('## 2. Recovery Procedures');
    });

    it('should contain Offline Mode Fallback Guide', () => {
        const content = fs.readFileSync(runbooksPath, 'utf8');
        expect(content).toContain('## 3. Offline Mode Fallback Guide');
    });
});
