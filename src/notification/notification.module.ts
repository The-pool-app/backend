import { Global, Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
// import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';
import { NovuProvider } from './notification.provider';

@Global()
@Module({
  imports: [MailModule, ConfigModule],
  providers: [MailService, NovuProvider],
})
export class NotificationModule {}
