describe('authController', () => {
  // Mock token utils module to avoid needing environment secrets
  beforeAll(() => {
    jest.unstable_mockModule('../src/utils/tokenUtils.js', () => ({
      generateAccessToken: () => 'access-token',
      generateRefreshToken: () => 'refresh-token',
      verifyRefreshToken: () => ({ userId: '1' }),
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('register success', async () => {
    const authController = (await import('../src/controllers/authController.js'));
    const User = (await import('../src/models/User.js')).default;
    const tokenUtils = (await import('../src/utils/tokenUtils.js'));

    // use a password that passes validation (min 6 chars)
    const req = { body: { username: 'user1', email: 'e@example.com', password: 'password1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User.prototype, 'save').mockResolvedValue(undefined);

    const next = jest.fn();
    await authController.register(req, res, next);

    if (next.mock.calls.length > 0) {
      // Surface the actual error for debugging
      throw next.mock.calls[0][0];
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ accessToken: expect.any(String), refreshToken: expect.any(String) }));
  });

  test('login success', async () => {
    const authController = (await import('../src/controllers/authController.js'));
    const User = (await import('../src/models/User.js')).default;
    const tokenUtils = (await import('../src/utils/tokenUtils.js'));

    const req = { body: { email: 'e@example.com', password: 'pass' } };
    const res = { json: jest.fn() };

    const fakeUser = {
      _id: '1',
      comparePassword: jest.fn().mockResolvedValue(true),
      toJSON: jest.fn().mockReturnValue({ id: '1' }),
      save: jest.fn().mockResolvedValue(undefined),
    };

    // Mock chained query: User.findOne(...).select('+password') -> resolves to fakeUser
    jest.spyOn(User, 'findOne').mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

    const next = jest.fn();
    await authController.login(req, res, next);

    if (next.mock.calls.length > 0) {
      throw next.mock.calls[0][0];
    }

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ accessToken: expect.any(String), refreshToken: expect.any(String) }));
  });
});
