import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [],
  providers: [JwtService],
})
export class JwtModule {}
