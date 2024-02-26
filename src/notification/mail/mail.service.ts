import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Client, SendEmailV3_1, LibraryResponse } from 'node-mailjet';

@Injectable()
export class MailService {
  constructor(private config: ConfigService) {}
  async sendMailWithResend(to: string, subject: string, html: string) {
    const resend = new Resend(this.config.get('RESEND_API_KEY'));
    const { data, error } = await resend.emails.send({
      from: 'support@jointhepool.com',
      to,
      subject,
      html,
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  }
  async sendMailWithMailJet(to: string, subject: string, html: string) {
    const mailjet = new Client({
      apiKey: this.config.get('MAILJET_API_KEY'),
      apiSecret: this.config.get('MAILJET_SECRET_KEY'),
    });

    const data: SendEmailV3_1.Body = {
      Messages: [
        {
          From: {
            Email: 'abdulsalamlukmon9@gmail.com',
            Name: 'Osita from ThePool',
          },
          To: [
            {
              Email: to,
            },
          ],
          // TemplateErrorReporting: {
          //   Email: 'reporter@test.com',
          //   Name: 'Reporter',
          // },
          Subject: subject,
          HTMLPart: html,
          // TextPart: 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
        },
      ],
    };
    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
      .post('send', { version: 'v3.1' })
      .request(data);
    //console.log(result.body);

    const { Status } = result.body.Messages[0];
    if (Status) {
      Logger.log(' Sending mail with mailjet successful');
      // console.log(result.body);
      return;
    }
    Logger.log(' Sending mail with mailjet not successful');
  }
}
