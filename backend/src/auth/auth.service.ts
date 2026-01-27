import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      username,
      avatar,
      organizerName,
      organizerUsername,
      organizerAvatar,
    } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Username is optional, but if provided it must be unique
    if (username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });

      if (existingUsername) {
        throw new ConflictException('Username already taken');
      }
    }

    // Hash password
    const saltRounds = parseInt(
      this.configService.get('BCRYPT_ROUNDS') || '12',
      10,
    );
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: role || 'BUYER',
        verificationToken,

        ...(username ? { username } : {}),
        ...(avatar ? { avatar } : {}),

        ...(organizerName ? { organizerName } : {}),
        ...(organizerUsername ? { organizerUsername } : {}),
        ...(organizerAvatar ? { organizerAvatar } : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // TODO: Send verification email (Phase 1B with SendGrid)
    // await this.emailService.sendVerificationEmail(user.email, verificationToken);

    // ✅ Dev-only: return verification token to enable local verification UX
    const nodeEnv = (this.configService.get('NODE_ENV') || '').toLowerCase();
    const isDev = nodeEnv !== 'production';

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      user,
      ...(isDev ? { verificationToken } : {}),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is suspended or deleted');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        verificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = uuidv4();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // TODO: Send password reset email (Phase 1B with SendGrid)
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const saltRounds = parseInt(
      this.configService.get('BCRYPT_ROUNDS') || '12',
      10,
    );
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        phoneNumber: true,
        profilePicture: true,
        organizerName: true,
        organizerUsername: true,
        organizerAvatar: true,
        organizerVerified: true,
        organizerBio: true,
        organizerCompanyName: true,
        organizerWebsite: true,
        organizerAddress: true,
        organizerVatNumber: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!existing) {
      throw new UnauthorizedException('User not found');
    }

    if (updateProfileDto.email && updateProfileDto.email !== existing.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateProfileDto.email },
        select: { id: true },
      });
      if (emailExists) {
        throw new ConflictException('Email already registered');
      }
    }

    const data = {
      ...(updateProfileDto.firstName !== undefined ? { firstName: updateProfileDto.firstName } : {}),
      ...(updateProfileDto.lastName !== undefined ? { lastName: updateProfileDto.lastName } : {}),
      ...(updateProfileDto.email !== undefined ? { email: updateProfileDto.email } : {}),
      ...(updateProfileDto.phoneNumber !== undefined ? { phoneNumber: updateProfileDto.phoneNumber } : {}),
      ...(updateProfileDto.profilePicture !== undefined ? { profilePicture: updateProfileDto.profilePicture } : {}),
      ...(updateProfileDto.avatar !== undefined ? { avatar: updateProfileDto.avatar } : {}),
      ...(updateProfileDto.organizerName !== undefined ? { organizerName: updateProfileDto.organizerName } : {}),
      ...(updateProfileDto.organizerUsername !== undefined ? { organizerUsername: updateProfileDto.organizerUsername } : {}),
      ...(updateProfileDto.organizerAvatar !== undefined ? { organizerAvatar: updateProfileDto.organizerAvatar } : {}),
      ...(updateProfileDto.organizerBio !== undefined ? { organizerBio: updateProfileDto.organizerBio } : {}),
      ...(updateProfileDto.organizerCompanyName !== undefined ? { organizerCompanyName: updateProfileDto.organizerCompanyName } : {}),
      ...(updateProfileDto.organizerWebsite !== undefined ? { organizerWebsite: updateProfileDto.organizerWebsite } : {}),
      ...(updateProfileDto.organizerAddress !== undefined ? { organizerAddress: updateProfileDto.organizerAddress } : {}),
      ...(updateProfileDto.organizerVatNumber !== undefined ? { organizerVatNumber: updateProfileDto.organizerVatNumber } : {}),
    };

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        emailVerified: true,
        phoneNumber: true,
        profilePicture: true,
        organizerName: true,
        organizerUsername: true,
        organizerAvatar: true,
        organizerVerified: true,
        organizerBio: true,
        organizerCompanyName: true,
        organizerWebsite: true,
        organizerAddress: true,
        organizerVatNumber: true,
        avatar: true,
        createdAt: true,
      },
    });

    return updated;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
