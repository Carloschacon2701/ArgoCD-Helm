import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./books/book.entity";
import { BooksModule } from "./books/books.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? "books",
      password: process.env.DB_PASSWORD ?? "books",
      database: process.env.DB_NAME ?? "books",
      entities: [Book],
      // Auto-creates/updates tables from entities. Fine for this simple
      // example; use migrations instead in a real application.
      synchronize: true,
    }),
    BooksModule,
  ],
})
export class AppModule {}
