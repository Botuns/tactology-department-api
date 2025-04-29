import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async seed() {
    await this.seedUsers();
    this.logger.debug('Seeding complete!');
  }

  private async seedUsers() {
    const usersCount = await this.usersRepository.count();

    // Only seed if no users exist
    if (usersCount === 0) {
      this.logger.debug('No users found, seeding admin user...');

      //   const passwordHash = await bcrypt.hash('admin123', 10);

      const admin = this.usersRepository.create({
        username: 'admin',
        password: 'admin123',
      });

      await this.usersRepository.save(admin);
      this.logger.debug('Admin user created!');
    } else {
      this.logger.debug('Users already exist, skipping seed...');
    }
  }
}
