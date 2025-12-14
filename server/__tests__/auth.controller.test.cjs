describe('authController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('register success', async () => {
    const authController = (await import('../src/controllers/authController.js'));
    const User = (await import('../src/models/User.js')).default;
    const tokenUtils = (await import('../src/utils/tokenUtils.js'));

    const req = { body: { username: 'u', email: 'e@example.com', password: 'pass' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User.prototype, 'save').mockResolvedValue(undefined);
    jest.spyOn(tokenUtils, 'generateAccessToken').mockReturnValue('at');
    jest.spyOn(tokenUtils, 'generateRefreshToken').mockReturnValue('rt');

    await authController.register(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
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

    jest.spyOn(User, 'findOne').mockResolvedValue(fakeUser);
    jest.spyOn(tokenUtils, 'generateAccessToken').mockReturnValue('at');
    jest.spyOn(tokenUtils, 'generateRefreshToken').mockReturnValue('rt');

    await authController.login(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ accessToken: 'at', refreshToken: 'rt' }));
  });
});
