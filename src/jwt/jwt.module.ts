import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Global()
@Module({
  imports: [],
  providers: [JwtService],
})
export class JwtModule {}
