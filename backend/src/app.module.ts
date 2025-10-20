import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import ormConfig from './config/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ArticlesModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
