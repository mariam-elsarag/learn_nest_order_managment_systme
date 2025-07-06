import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // for swagger
  const swagger = new DocumentBuilder().setVersion("1.0").build();
  const docs = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup("swagger", app, docs);
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // this for security header
  app.use(helmet());

  // core policy
  app.enableCors({
    origin: "http://localhost:3000",
  });
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
