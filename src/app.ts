import { Application } from './config/deps.ts';

export class App {
    public app: Application;

    constructor(public port: number) {
        this.app = new Application();

        this.initializeEventListener();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeEventListener() {
        this.app.addEventListener('listen', ({ hostname, port, secure }) => {
            console.log(`🦕 Deno/GraphQL OAK Server running onc: ${
                secure ? "https://" : "http://"
            }${hostname ?? "localhost"}:${port}/ 🦕`);
        });

        this.app.addEventListener("error", (evt) => {
            console.error(evt.error);
        });
    }
    private async initializeMiddlewares() {
        this.app.use(async (ctx, next) => {
            await next();
            const rt = ctx.response.headers.get("X-Response-Time");
            console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
          });
      
        this.app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.response.headers.set("X-Response-Time", `${ms}ms`);
        });
    }
    private initializeRoutes() {}

    public async listen() {
        return await this.app.listen({ port: this.port });
    }
}