import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  findByUsername(username: string) {
    return this.repo.findOneBy({ username });
  }
  findById(id: string) {
    return this.repo.findOneBy({ id });
  }
  create(user: Partial<User>) {
    const newUser = this.repo.create(user);
    return this.repo.save(newUser);
  }
}
