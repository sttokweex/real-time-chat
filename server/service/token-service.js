import jwt from 'jsonwebtoken';
import secret from '../config.js';
import { Token } from '../models/models.js';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, secret.access_secret, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, secret.refresh_secret, {
      expiresIn: '30d',
    });
    const expirationTime = Math.floor(Date.now() / 1000) + 30 * 60;

    return { accessToken, refreshToken, expirationTime };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, secret.access_secret);

      return userData;
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, secret.refresh_secret);

      return userData;
    } catch (e) {
      console.log(e);

      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { userId: userId } });

    if (tokenData) {
      tokenData.refresh = refreshToken;

      return tokenData.save();
    }
    const token = await Token.create({
      userId: userId,
      refresh: refreshToken,
    });

    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.destroy({
      where: { refresh: refreshToken },
    });

    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({
      where: { refresh: refreshToken },
    });

    return tokenData;
  }
}

export default new TokenService();
