import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "./book.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.booksRepository.find({ order: { createdAt: "DESC" } });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with id "${id}" not found`);
    }
    return book;
  }

  create(dto: CreateBookDto): Promise<Book> {
    const book = this.booksRepository.create(dto);
    return this.booksRepository.save(book);
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, dto);
    return this.booksRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const result = await this.booksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with id "${id}" not found`);
    }
  }
}
