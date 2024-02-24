import * as Router from 'koa-router';
import IndexController from './controllers/index.controller';
import ArtistController from './controllers/artist.controller';

const router = new Router();

router.get('/', IndexController.getIndex);
router.get('/artist', ArtistController.getIndex);

export default router;
