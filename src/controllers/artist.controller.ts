import { BaseContext } from 'koa';

export default class ArtistController {
  public static async Login(ctx: BaseContext) {
    ctx.status = 200;
    ctx.body = {
      happy: 'hacking',
    };
  }
}
