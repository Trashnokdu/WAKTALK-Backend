import { Context } from 'koa';
import { Creator } from '../../models/Creator';
import { WaitingCreator } from '../../models/WaitingCreator';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export default class CreatorController {
  public static async SignUp(ctx: Context & { request: any }) {
    const { id, pw, uuid } = ctx.request.body;
    if (!id || !pw || !uuid) {
      ctx.status = 400;
      return (ctx.body = {
        code: 'INVALID_REQUIRED_PARAM',
        message: '필수 파라미터가 누락되었습니다.',
      });
    } else {
      const creator = await WaitingCreator.findOne({
        where: { uuid: uuid },
      });
      if (!creator) {
        ctx.status = 403;
        return (ctx.body = {
          code: 'INVALID_UUID',
          message: '잘못된 UUID값입니다',
        });
      }
      const salt = crypto.randomBytes(64).toString('base64');
      const HashPassword = CryptoJS.SHA512(pw + salt).toString();
      try {
        await Creator.create({
          classificationId: creator.classificationId,
          userId: id,
          password: HashPassword,
          salt: salt,
          color: creator.color,
          displayName: creator.displayName,
        });
        await WaitingCreator.destroy({ where: { uuid: uuid } });
        ctx.status = 201;
        ctx.body = {
          code: 'CREATE_COMPLETE',
          displayName: creator.displayName,
          color: creator.color,
        };
      } catch (err) {
        console.error(err);
        ctx.status = 500;
        ctx.body = {
          code: 'COMMON_ERROR',
          message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
        };
      }
    }
  }
  public static async SignIn(ctx: Context & { request: any }) {
    const { user_id, pw } = ctx.request.body;
    if (!user_id || !pw) {
      ctx.status = 400;
      return (ctx.body = {
        code: 'INVALID_REQUIRED_PARAM',
        message: '필수 파라미터가 누락되었습니다.',
      });
    } else {
      try {
        const userdata = await Creator.findOne({ where: { userId: user_id } });
        if (!userdata) {
          ctx.status = 401;
          return (ctx.body = {
            code: 'UNAUTHORIZED',
            message: '아이디 혹은 패스워드가 일치하지 않습니다',
          });
        }
        const salt = userdata.salt;
        const HashPassword = CryptoJS.SHA512(pw + salt).toString();
        if (HashPassword === userdata.password) {
          ctx.status = 401;
          return (ctx.body = {
            code: 'UNAUTHORIZED',
            message: '아이디 혹은 패스워드가 일치하지 않습니다',
          });
        }
        const accessToken = jwt.sign(
          { id: user_id, type: 'access_token' },
          `${process.env.SECRET}`,
          {
            expiresIn: '1h',
          },
        );
        const refreshToken = jwt.sign(
          { id: user_id, type: 'refresh_token' },
          `${process.env.SECRET}`,
          { expiresIn: '5y' },
        );
        ctx.status = 200;
        return (ctx.body = {
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } catch (err) {
        console.log(err);
        ctx.status = 500;
        return (ctx.body = {
          code: 'COMMON_ERROR',
          message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
        });
      }
    }
  }
  public static async Index(ctx: Context & { request: any }) {
    try {
      const creators = await Creator.findAll();
      ctx.body = creators.map((data) => {
        return {
          id: data.userId,
          name: data.displayName,
          color: data.color,
        };
      });
    } catch (err) {
      console.log(err);
      ctx.status = 500;
      return (ctx.body = {
        code: 'COMMON_ERROR',
        message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
      });
    }
  }
  public static async UpdateToken(ctx: Context & { request: any }) {
    const { refresh_token } = ctx.request.body;
    if (!refresh_token) {
      ctx.status = 400;
      return (ctx.body = {
        code: 'INVALID_REQUIRED_PARAM',
        message: '필수 파라미터가 누락되었습니다.',
      });
    } else {
      try {
        const verify = <any>jwt.verify(refresh_token, `${process.env.SECRET}`);
        const newToken = jwt.sign(
          { id: verify.id, type: 'access_token' },
          `${process.env.SECRET}`,
        );
        ctx.status = 200;
        ctx.body = {
          access_token: newToken,
        };
      } catch (error) {
        ctx.status = 401;
        return (ctx.body = {
          code: 'AUTH_FAILED',
          message: '토큰이 유효하지않거나 만료되었습니다',
        });
      }
    }
  }
  public static async SignUpData(ctx: Context & { request: any }) {
    const uuid = ctx.query.uuid;
    if (!uuid) {
      ctx.status = 400;
      return (ctx.body = {
        code: 'INVALID_REQUIRED_PARAM',
        message: '필수 파라미터가 누락되었습니다.',
      });
    } else {
      const creator = await WaitingCreator.findOne({
        where: { uuid: uuid },
      });
      if (!creator) {
        ctx.status = 403;
        return (ctx.body = {
          code: 'INVALID_UUID',
          message: '잘못된 UUID값입니다',
        });
      }
      ctx.status = 200;
      ctx.body = {
        id: creator.classificationId,
        name: creator.displayName,
        color: creator.color,
      };
    }
  }
}
