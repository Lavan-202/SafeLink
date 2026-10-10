import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env';
import { User, toPublicUser } from '../../models/User.model';
import { AppError } from '../../utils/AppError';
import { signToken } from '../../utils/jwt';

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  preferredLanguage?: 'en' | 'ta' | 'si';
};

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function register(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    name: input.name,
    email: input.email,
    phone: input.phone,
    passwordHash,
    preferredLanguage: input.preferredLanguage === 'ta' || input.preferredLanguage === 'si' ? input.preferredLanguage : 'en',
  });

  return {
    token: signToken(user.id),
    user: toPublicUser(user),
  };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw new AppError('Email or password is incorrect', 401);
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new AppError('Email or password is incorrect', 401);
  }

  return {
    token: signToken(user.id),
    user: toPublicUser(user),
  };
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+resetTokenHash +resetTokenExpires');
  const response: { message: string; resetToken?: string } = {
    message: 'If an account exists for that email, a reset token has been created.',
  };

  if (!user) {
    return response;
  }

  const resetToken = crypto.randomBytes(24).toString('hex');
  user.resetTokenHash = hashResetToken(resetToken);
  user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  if (!env.isProduction) {
    response.resetToken = resetToken;
  }

  return response;
}

export async function resetPassword(email: string, token: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash +resetTokenHash +resetTokenExpires',
  );

  if (!user?.resetTokenHash || !user.resetTokenExpires || user.resetTokenExpires.getTime() < Date.now()) {
    throw new AppError('Reset token is invalid or expired', 400);
  }

  const matches = user.resetTokenHash === hashResetToken(token);
  if (!matches) {
    throw new AppError('Reset token is invalid or expired', 400);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.updateOne(
    { _id: user._id },
    { $set: { passwordHash }, $unset: { resetTokenHash: 1, resetTokenExpires: 1 } },
  );

  return { message: 'Password updated. You can sign in now.' };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('Account not found', 404);
  return toPublicUser(user);
}
