import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  providers: [EventsGateway, JwtService],
  exports: [EventsGateway],
})
export class EventsModule {}
