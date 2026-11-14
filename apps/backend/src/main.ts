import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";
  app.enableCors({ origin: corsOrigin.split(",") });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${port}`);
}

bootstrap();
