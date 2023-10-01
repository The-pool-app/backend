import { SendmaiLDto } from './dto';
import { MailService } from './mail.service';

export class MailController {
  constructor(private mailService: MailService) {
    this.mailService = mailService;
  }
  async sendMail(data: SendmaiLDto) {
    return this.mailService.sendMail(
      data.receivermail,
      data.subject,
      data.content,
    );
  }
}
