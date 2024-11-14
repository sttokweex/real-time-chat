import { User } from '../models/models.js';
import bcrypt from 'bcryptjs';
import tokenService from '../service/token-service.js';
import ApiError from '../exceptions/api-error.js';
import secret from '../config.js';

class AuthController {
  async registration(req, res) {
    try {
      const { username, password } = req.body;
      const role = username === 'admin' ? 'admin' : 'user';

      if (password.length < 5 || password.length > 10) {
        throw ApiError.BadRequest(
          'Password must be more than 5 characters and less than 10',
        );
      }

      const candidate = await User.findOne({ where: { username } });

      if (candidate) {
        throw ApiError.BadRequest('User already exists');
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({
        username,
        password: hashPassword,
        role,
      });

      const tokens = tokenService.generateTokens({
        id: user.id,
        role: user.role,
        username: user.username,
      });
      await tokenService.saveToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: secret.cookie_max_age,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });

      return res.json({
        ...tokens,
        user: { id: user.id, role: user.role, username: user.username },
      });
    } catch (e) {
      return res
        .status(e.status || 500)
        .json({ message: e.message || 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user) {
        throw ApiError.BadRequest('User not found');
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        throw ApiError.BadRequest('Invalid password');
      }

      const tokens = tokenService.generateTokens({
        id: user.id,
        role: user.role,
        username: user.username,
      });
      await tokenService.saveToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: secret.cookie_max_age,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });

      return res.json({
        ...tokens,
        user: { id: user.id, role: user.role, username: user.username },
      });
    } catch (e) {
      return res
        .status(e.status || 500)
        .json({ message: e.message || 'Login error' });
    }
  }

  async logout(req, res) {
    try {
      console.log('qweeqw');
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw ApiError.BadRequest('Token not found');
      }

      await tokenService.removeToken(refreshToken);
      res.clearCookie('refreshToken');

      return res.json({ message: 'Successfully logged out' });
    } catch (e) {
      return res
        .status(e.status || 500)
        .json({ message: e.message || 'Logout error' });
    }
  }

  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw ApiError.UnauthorizedError('Unauthorized');
      }

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);

      if (!userData || !tokenFromDb) {
        await tokenService.removeToken(refreshToken);
        throw ApiError.UnauthorizedError('Invalid token');
      }

      const user = await User.findOne({ where: { id: userData.id } });

      if (!user) {
        throw ApiError.UnauthorizedError('User not found');
      }

      const tokens = tokenService.generateTokens({
        id: user.id,
        role: user.role,
        username: user.username,
      });
      await tokenService.saveToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: secret.cookie_max_age,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });

      return res.json({
        ...tokens,
        user: { id: user.id, role: user.role, username: user.username },
      });
    } catch (e) {
      return res
        .status(e.status || 500)
        .json({ message: e.message || 'Token refresh error' });
    }
  }
}

export default new AuthController();
