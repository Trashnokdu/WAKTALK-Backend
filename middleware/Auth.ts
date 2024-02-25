import { Context } from 'koa';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function CreatorAuthMiddleware(ctx: Context & { request: any }, next) {
  const parts = ctx.headers.authorization.split(' ');
  if (!parts[1]) {
    ctx.status = 401;
    return (ctx.body = {
      code: 'UNAUTHORIZED',
      message: '인증이 필요한 서비스입니다',
    });
  }
  try {
    jwt.verify(parts[1], process.env.SECRET);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      ctx.status = 401;
      return (ctx.body = {
        code: 'UNAUTHORIZED',
        message: '잘못된 토큰입니다',
      });
    } else if (err.name === 'TokenExpiredError') {
      ctx.status = 401;
      return (ctx.body = {
        code: 'NEED_REFRESH',
        message: '토큰이 만료되었습니다',
      });
    } else if (err.name === 'NotBeforeError') {
      ctx.status = 401;
      return (ctx.body = {
        code: 'UNAUTHORIZED',
        message: '잘못된 토큰입니다',
      });
    } else {
      return (ctx.body = err);
    }
  }
  await next();
}

const AuthMiddleware = async (ctx: Context & { request: any }, next) => {
  const parts = ctx.headers.authorization.split(' ');
  if (!parts[1]) {
    ctx.status = 401;
    return (ctx.body = {
      code: 'UNAUTHORIZED',
      message: '인증이 필요한 서비스입니다',
    });
  }
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    ctx.status = 400;
    return (ctx.body = {
      code: 'INVALID_REQUEST',
      message: '올바르지 않은 요청입니다',
    });
  }
  if (ctx.request.query.isCreator == 'true') {
    try {
      jwt.verify(parts[1], process.env.SECRET);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        ctx.status = 401;
        return (ctx.body = {
          code: 'UNAUTHORIZED',
          message: '잘못된 토큰입니다',
        });
      } else if (err.name === 'TokenExpiredError') {
        ctx.status = 401;
        return (ctx.body = {
          code: 'NEED_REFRESH',
          message: '토큰이 만료되었습니다',
        });
      } else if (err.name === 'NotBeforeError') {
        ctx.status = 401;
        return (ctx.body = {
          code: 'UNAUTHORIZED',
          message: '잘못된 토큰입니다',
        });
      } else {
        return (ctx.body = err);
      }
    }
  } else {
    {
      try {
        await axios.get('https://openapi.naver.com/v1/nid/verify', {
          headers: { Authorization: `Bearer ${parts[1]}` },
        });
      } catch (err) {
        console.log(err.response.data.resultcode);
        if (err.response.data.resultcode == '024') {
          ctx.status = 401;
          return (ctx.body = {
            code: 'AUTH_FAILED',
            message: '토큰이 유효하지않거나 만료되었습니다',
          });
        } else {
          ctx.status = 500;
          return (ctx.body = {
            code: 'COMMON_ERROR',
            message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
          });
        }
      }
    }
  }
  await next();
};

export default AuthMiddleware;
