export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 30;
};

export const sanitizeUserData = (user) => {
  const safe = { ...(user._doc || user) };
  delete safe.password;
  delete safe.refreshToken;
  return safe;
};
