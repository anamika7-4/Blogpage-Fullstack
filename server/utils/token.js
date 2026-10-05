const jwt = require('jsonwebtoken');

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 1 day
});

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.cookie('token', token, getCookieOptions());
  return token;
};

module.exports = { generateTokenAndSetCookie, getCookieOptions };
