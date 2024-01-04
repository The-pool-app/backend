import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { InjectNovu } from './notification.provider';
import { Novu } from '@novu/node';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailService: MailService,
    @InjectNovu()
    private readonly novu: Novu,
  ) {}

  async createSubcriber(subscriberId: string, email: string) {
    const result = await this.novu.subscribers.identify(subscriberId, {
      email,
      firstName: 'Subscriber',
    });
    return result.data;
  }

  async sendEmailToSubscriber(
    subscriberId: string,
    email: string,
    description: string,
  ) {
    const result = await this.novu.trigger('Email Quickstart', {
      to: {
        subscriberId,
        email,
      },
      payload: {
        email,
        description,
      },
    });
    return result.data;
  }
}
