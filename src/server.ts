import * as Router from 'koa-router';
import IndexController from './controllers/index.controller';
import UserController from './controllers/user.controller';
import AuthMiddleware from '../middleware/Auth';
import CreatorAuthMiddleware from '../middleware/Auth';
import CreatorController from './controllers/creator.controller';

const router = new Router();

// 현재로써는 전화번호를 사용할곳이 없기에 코드 아카이빙 해둡니다
// const decryptedBytes = AES.decrypt(ctx.request.body, process.env.SECRET);
// const decrypted = decryptedBytes.toString(enc.Utf8);
// ctx.Phone = decrypted;

router.get('/', IndexController.getIndex);
router.post('/user/login', UserController.Login);
router.post('/user/refresh', UserController.UpdateToken);
router.get('/creator', AuthMiddleware, CreatorController.Index);
router.get('/creator/signup/data', CreatorController.SignUpData);
router.post('/creator/signup', CreatorController.SignUp);
router.post('/creator/signin', CreatorController.SignIn);
router.post('/creator/refresh', CreatorController.UpdateToken);

export default router;
