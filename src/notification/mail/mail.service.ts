import emailjs from '@emailjs/browser';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

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
  async sendMailWithTemplate(to: string, subject: string, message: string) {
    const templateParams = {
      to,
      subject,
      message,
    };
    const serviceID: string = this.config.get('EMAILJS_SERVICE_ID');
    const templateID: string = this.config.get('EMAILJS_TEMPLATE_ID');
    // console.log(serviceID, templateID);
    try {
      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        this.config.get('EMAILJS_PUBLIC_KEY'),
      );
      console.log('SUCCESS!', response.status, response.text);
    } catch (error) {
      console.log('FAILED...', error);
    }
  }
}
