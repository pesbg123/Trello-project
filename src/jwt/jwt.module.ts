import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Global()
@Module({
  providers: [JwtService],
})
export class JwtModule {}
