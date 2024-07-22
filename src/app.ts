import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import * as helmet from 'koa-helmet';
import * as json from 'koa-json';
import * as logger from 'koa-logger';
import 'reflect-metadata';
import router from './server';
import sequelize from '../sequelize';
import axios from 'axios';

try {
  const app = new Koa();
  const port = process.env.PORT || 3000;
  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(logger());
  app.use(bodyParser());

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(port, async () => {
    while (true) {
      try {
        await sequelize.authenticate();
        break;
      } catch (e) {
        axios.post(
          'https://discord.com/api/webhooks/1256945682531745904/nXHSmKkfyowhZJywV-SnLgqZB4IoWFlYGVUhnqrnG08utfweTPmEp5EcasullVZQybNf',
          {
            embeds: [
              {
                title: '링크 백엔드 실행도중 오류가 발생했습니다!',
                description:
                  '\n\n:warning: **[오류 로그]**\n```오류 로그: ' + e + '```',
                color: 16711680,
              },
            ],
          },
        );
      }
    }
    console.log(`🚀 App listening on the port ${port}`);
  });
} catch (e) {
  axios.post(
    'https://discord.com/api/webhooks/1256945682531745904/nXHSmKkfyowhZJywV-SnLgqZB4IoWFlYGVUhnqrnG08utfweTPmEp5EcasullVZQybNf',
    {
      embeds: [
        {
          title: '링크 백엔드 실행도중 오류가 발생했습니다!',
          description:
            '\n\n:warning: **[오류 로그]**\n```오류 로그: ' + e + '```',
          color: 16711680,
        },
      ],
    },
  );
}
