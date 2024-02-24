import * as Router from 'koa-router';
import IndexController from './controllers/index.controller';
import ArtistController from './controllers/artist.controller';
import UserController from './controllers/user.controller';
import { AES, enc } from 'crypto-js';
import { Context } from 'koa';

const router = new Router();

const AuthMiddleware = async (ctx: Context & { request: any }, next) => {
  const decryptedBytes = AES.decrypt(ctx.request.body, process.env.SECRET);
  const decrypted = decryptedBytes.toString(enc.Utf8);
  ctx.Phone = decrypted;
  await next();
};

router.get('/', IndexController.getIndex);
router.get('/artist', ArtistController.Login);
router.post('/user/login', AuthMiddleware, UserController.Login);

export default router;
