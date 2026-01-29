import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

type InviteEmailPayload = {
  to: string;
  organizerName: string;
  role: string;
  inviteToken?: string | null;
  inviteExpiresAt?: Date | null;
};

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  private transporter: Transporter | null = null;

  private getOverrideRecipient(): string {
    return (
      this.configService.get<string>('INVITE_EMAIL_OVERRIDE') ||
      'teekay_oh@hotmail.com'
    );
  }

  private getFrontendBaseUrl(): string {
    return (
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:3000'
    );
  }

  private getFromAddress(): string {
    return (
      this.configService.get<string>('SMTP_FROM') ||
      this.configService.get<string>('SMTP_USER') ||
      'no-reply@lurexo.com'
    );
  }

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;

    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const host = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const portRaw = this.configService.get<string>('SMTP_PORT');
    const secureRaw = this.configService.get<string>('SMTP_SECURE');
    const startTlsRaw = this.configService.get<string>('SMTP_USE_STARTTLS');

    if (!user || !pass) {
      throw new Error('SMTP_USER and SMTP_PASS must be set to send email.');
    }

    const useStartTls = String(startTlsRaw ?? '')
      .trim()
      .toLowerCase() === 'true';
    const secure =
      String(secureRaw ?? '').trim().length > 0
        ? String(secureRaw).trim().toLowerCase() === 'true'
        : !useStartTls;
    const port =
      typeof portRaw === 'string' && portRaw.trim().length > 0
        ? Number(portRaw)
        : secure
          ? 465
          : 587;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: useStartTls,
      auth: { user, pass },
    });

    return this.transporter;
  }

  async sendCollaboratorInvite(payload: InviteEmailPayload) {
    const to = this.getOverrideRecipient();
    const frontendUrl = this.getFrontendBaseUrl();
    const from = this.getFromAddress();
    const token = payload.inviteToken ? encodeURIComponent(payload.inviteToken) : '';
    const inviteUrl = token ? `${frontendUrl}/invite/accept?token=${token}` : frontendUrl;
    const expiresText = payload.inviteExpiresAt
      ? `This invite expires on ${payload.inviteExpiresAt.toISOString()}.`
      : '';

    const subject = `Lurexo invite: join ${payload.organizerName}`;
    const text = [
      `You have been invited to join ${payload.organizerName} on Lurexo.`,
      `Role: ${payload.role}`,
      token ? `Set your password: ${inviteUrl}` : '',
      expiresText,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <p>You have been invited to join <strong>${payload.organizerName}</strong> on Lurexo.</p>
      <p><strong>Role:</strong> ${payload.role}</p>
      ${token ? `<p><a href="${inviteUrl}">Accept invite</a></p>` : ''}
      ${expiresText ? `<p>${expiresText}</p>` : ''}
    `;

    const transporter = this.getTransporter();
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return { to, subject, from };
  }
}
