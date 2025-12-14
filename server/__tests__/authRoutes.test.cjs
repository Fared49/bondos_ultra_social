const fs = require('fs');
const path = require('path');

describe('auth routes file', () => {
  it('contains the main auth route paths', () => {
    const filePath = path.resolve(__dirname, '../src/routes/authRoutes.js');
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toEqual(expect.stringContaining("'/login'"));
    expect(content).toEqual(expect.stringContaining("'/register'"));
    expect(content).toEqual(expect.stringContaining("'/refresh'"));
    expect(content).toEqual(expect.stringContaining("'/profile'"));
  });
});
