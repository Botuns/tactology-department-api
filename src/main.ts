import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seed-database
  const seedService = app.get(SeedService);
  await seedService.seed();

  //  global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // global exception filter for GraphQL
  app.useGlobalFilters(new GraphQLExceptionFilter());

  //  CORS
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => console.error(err));
