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
import { BoardColumnsModule } from './board-columns/board-columns.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    UsersModule,
    JwtModule,
    BoardsModule,
    ProjectsModule,
    BoardColumnsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
