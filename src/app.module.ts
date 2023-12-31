import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './_common/orm.config';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { BoardsModule } from './boards/boards.module';
import { MailModule } from './mail/mail.module';
import { BoardColumnsModule } from './board-columns/board-columns.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { ViewModule } from './view/view.module';
import { CommentsModule } from './comments/comments.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UsersModule,
    JwtModule,
    BoardsModule,
    ProjectsModule,
    MailModule,
    BoardColumnsModule,
    CommentsModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        };
      },
    }),
    ViewModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
