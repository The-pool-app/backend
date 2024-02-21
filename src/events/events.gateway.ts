import { WebSocketGateway } from '@nestjs/websockets';
import { EventsService } from './events.service';

@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly eventsService: EventsService) {}
}
