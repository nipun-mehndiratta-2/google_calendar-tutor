const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.split(" ")[1]; // Split by space and get the second part
  }
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, "SECRE8");

    req.userData = { userId: decoded.userId, userEmail: decoded.userEmail };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticateToken;
