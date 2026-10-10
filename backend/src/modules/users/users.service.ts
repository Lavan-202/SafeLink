import { User, toPublicUser } from '../../models/User.model';
import { AppError } from '../../utils/AppError';

export async function getProfile(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('Account not found', 404);
  return toPublicUser(user);
}

export async function updateProfile(
  userId: string,
  input: { name?: string; email?: string; phone?: string; role?: string; preferredLanguage?: 'en' | 'ta' | 'si' },
) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('Account not found', 404);

  if (input.email && input.email.toLowerCase() !== user.email) {
    const taken = await User.findOne({ email: input.email.toLowerCase() });
    if (taken) throw new AppError('An account with this email already exists', 409);
    user.email = input.email.toLowerCase();
  }
  if (input.name) user.name = input.name;
  if (input.phone) user.phone = input.phone;
  if (input.role) user.role = input.role;
  if (input.preferredLanguage) user.preferredLanguage = input.preferredLanguage;
  await user.save();

  return toPublicUser(user);
}
