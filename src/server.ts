import * as Router from 'koa-router';
import IndexController from './controllers/index.controller';
import ArtistController from './controllers/creator.controller';
import UserController from './controllers/user.controller';
// import { AES, enc } from 'crypto-js';
import AuthMiddleware from '../middleware/Auth';
const router = new Router();

// 현재로써는 전화번호를 사용할곳이 없기에 코드 아카이빙 해둡니다
// const decryptedBytes = AES.decrypt(ctx.request.body, process.env.SECRET);
// const decrypted = decryptedBytes.toString(enc.Utf8);
// ctx.Phone = decrypted;

router.get('/', IndexController.getIndex);
router.get('/creator', AuthMiddleware, ArtistController.Login);
router.post('/user/login', UserController.Login);

export default router;
