import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOne(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOne(username);
    if (!user) {
      return null;
    }
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async createUser(username: string, password: string): Promise<User> {
    return this.usersRepository.create(username, password);
  }
}
