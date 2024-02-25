import { Context } from 'koa';
import axios from 'axios';
import { AES } from 'crypto-js';
import { User } from '../../models/User';
import * as dotenv from 'dotenv';
dotenv.config();

export default class UserController {
  public static async Login(ctx: Context & { request: any }) {
    const code = ctx.request.body.code;
    if (!code) {
      ctx.status = 400;
      return (ctx.body = {
        code: 'NEED_CODE',
        message: '인증코드값이 필요합니다.',
      });
    }
    await axios
      .get(
        `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=dA8eK17D33C_mskvQWqp&client_secret=${process.env.NAVER_SECRET}&code=${code}&state=${Math.random().toString(36).substring(2, 12)}`,
      )
      .then(async (data) => {
        if (!data.data.access_token) {
          if (data.data.error === 'INVALID_REQUEST') {
            ctx.status = 401;
            return (ctx.body = {
              code: 'INVALID_CODE',
              message: '코드가 만료되었거나 유효하지않습니다',
            });
          } else {
            ctx.status = 500;
            return (ctx.body = {
              code: 'COMMON_ERROR',
              message:
                '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
            });
          }
        }
        const access_token = data.data.access_token;
        const refresh_token = data.data.refresh_token;
        const expires_in = data.data.expires_in;
        await axios
          .get('https://openapi.naver.com/v1/nid/me', {
            headers: { Authorization: 'Bearer ' + data.data.access_token },
          })
          .then(async (data) => {
            const user = await User.findOne({
              where: { id: data.data.response.id },
            });
            if (user) {
              return (ctx.body = {
                access_token: access_token,
                refresh_token: refresh_token,
                expires_in: expires_in,
              });
            } else {
              const nickname = await User.findOne({
                where: { nickname: data.data.response.nickname },
              });
              if (!nickname) {
                await User.create({
                  id: data.data.response.id,
                  nickname: data.data.response.nickname,
                  phone: AES.encrypt(
                    data.data.response.mobile_e164,
                    process.env.SECRET,
                  ).toString(),
                });
              } else {
                let newNickname;
                let checkNickname;

                // 새로운 닉네임이 DB에 없을 때까지 랜덤 숫자를 추가
                do {
                  newNickname =
                    data.data.response.nickname +
                    Math.floor(Math.random() * 1000);
                  checkNickname = await User.findOne({
                    where: { nickname: newNickname },
                  });
                } while (checkNickname);

                // 새로운 닉네임으로 사용자를 생성
                await User.create({
                  id: data.data.response.id,
                  nickname: newNickname,
                  phone: AES.encrypt(
                    data.data.response.mobile_e164,
                    process.env.SECRET,
                  ).toString(),
                });
              }
              return (ctx.body = {
                access_token: access_token,
                refresh_token: refresh_token,
                expires_in: expires_in,
              });
            }
          });
      })
      .catch((err) => {
        console.error(err);
        ctx.status = 500;
        return (ctx.body = {
          code: 'COMMON_ERROR',
          message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
        });
      });
  }
}
