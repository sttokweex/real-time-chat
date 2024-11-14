import ApiError from '../exceptions/api-error.js';
import tokenService from '../service/token-service.js';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw ApiError.UnauthorizedError('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.UnauthorizedError('Token is missing');
    }

    const userData = tokenService.validateAccessToken(token);

    if (!userData) {
      throw ApiError.UnauthorizedError('Invalid token');
    }

    req.user = userData;
    next();
  } catch (e) {
    console.error(e); // Логирование ошибки для отладки
    next(e); // Передача ошибки дальше в цепочку middleware
  }
};
