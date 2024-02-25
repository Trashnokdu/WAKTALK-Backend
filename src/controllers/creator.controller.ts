import { Context } from 'koa';
import { Creator } from '../../models/Creator';
import { WaitingCreator } from '../../models/WaitingCreator';
import * as crypto from 'crypto';
import CryptoJS = require('crypto-js');
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
}
