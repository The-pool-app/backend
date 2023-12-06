import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import emailjs from '@emailjs/nodejs';

@Injectable()
export class MailService {
  private readonly transporter;
  constructor(private config: ConfigService) {
    // this.transporter = nodemailer.createTransport({
    //   host: config.get('MAIL_HOST'),
    //   port: 1025,
    //   secure: false,
    //   // auth: {
    //   //     user: this.config.get('MAIL_USER'),
    //   //     pass: this.config.get('MAIL_PASS'),
    //   // },
    // });
    // emailjs.init({
    //   publicKey: '<YOUR_PUBLIC_KEY>',
    //   privateKey: '<YOUR_PRIVATE_KEY>', // optional, highly recommended for security reasons
    // });
  }
  async sendMail(to: string, subject: string, html: string) {
    // const mailOptions = {
    //   from: this.config.get('MAIL_FROM'),
    //   to,
    //   subject,
    //   html,
    // };
    try {
      await emailjs.send('service_f2ja3b8', '<YOUR_TEMPLATE_ID>');
      console.log('Email sent');
    } catch (error) {
      console.log('Error sending email', error);
    }
  }
}
