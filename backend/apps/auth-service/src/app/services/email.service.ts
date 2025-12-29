import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('SMTP_FROM') || 'noreply@fooddelivery.com';
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST') || 'mailhog';
    const smtpPort = this.configService.get<number>('SMTP_PORT') || 1025;
    const smtpUser = this.configService.get<string>('SMTP_USER') || '';
    const smtpPassword = this.configService.get<string>('SMTP_PASSWORD') || '';

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: smtpUser && smtpPassword ? {
        user: smtpUser,
        pass: smtpPassword,
      } : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.logger.log(`Email service initialized with SMTP host: ${smtpHost}:${smtpPort}`);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${options.to}: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }

  async sendOtpEmail(email: string, otp: string, type: 'verification' | 'password-reset'): Promise<void> {
    const subject = type === 'verification'
      ? 'Verify Your Email - Food Delivery App'
      : 'Reset Your Password - Food Delivery App';

    const html = this.getOtpEmailTemplate(otp, type);
    const text = this.getOtpEmailText(otp, type);

    await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }

  private getOtpEmailTemplate(otp: string, type: 'verification' | 'password-reset'): string {
    const title = type === 'verification' ? 'Email Verification' : 'Password Reset';
    const message = type === 'verification'
      ? 'Thank you for signing up! Please use the OTP code below to verify your email address.'
      : 'You requested to reset your password. Please use the OTP code below to proceed.';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #E95322;
              margin-bottom: 10px;
            }
            h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .otp-container {
              background-color: #FFF9F5;
              border: 2px dashed #E95322;
              border-radius: 8px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #E95322;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .message {
              color: #666;
              font-size: 16px;
              margin: 20px 0;
              line-height: 1.5;
            }
            .warning {
              background-color: #FFF3CD;
              border-left: 4px solid #FFC107;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
              color: #856404;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #999;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🍕 Food Delivery</div>
              <h1>${title}</h1>
            </div>

            <p class="message">${message}</p>

            <div class="otp-container">
              <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 14px;">Valid for 10 minutes</p>
            </div>

            <div class="warning">
              <strong>Security Notice:</strong><br>
              • This OTP is valid for 10 minutes only<br>
              • Maximum 3 verification attempts allowed<br>
              • Do not share this code with anyone<br>
              • If you didn't request this, please ignore this email
            </div>

            <div class="footer">
              <p>This is an automated email, please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Food Delivery App. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getOtpEmailText(otp: string, type: 'verification' | 'password-reset'): string {
    const title = type === 'verification' ? 'Email Verification' : 'Password Reset';
    const message = type === 'verification'
      ? 'Thank you for signing up! Please use the OTP code below to verify your email address.'
      : 'You requested to reset your password. Please use the OTP code below to proceed.';

    return `
${title}

${message}

Your OTP Code: ${otp}

Valid for 10 minutes

Security Notice:
- This OTP is valid for 10 minutes only
- Maximum 3 verification attempts allowed
- Do not share this code with anyone
- If you didn't request this, please ignore this email

This is an automated email, please do not reply.
© ${new Date().getFullYear()} Food Delivery App. All rights reserved.
    `.trim();
  }
}
