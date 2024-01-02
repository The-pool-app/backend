import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly transporter;
  constructor(private config: ConfigService) {}
  async sendMail(to: string, subject: string, html: string) {
    const resend = new Resend();
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@the-pool.com>',
      to: [`<${to}>`],
      subject: subject,
      html: html,
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  }
}
