import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;
  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: 1025,
      secure: false,
      // auth: {
      //     user: this.config.get('MAIL_USER'),
      //     pass: this.config.get('MAIL_PASS'),
      // },
    });
  }
  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: this.config.get('MAIL_FROM'),
      to,
      subject,
      html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent');
    } catch (error) {
      console.log('Error sending email', error);
    }
  }
}
