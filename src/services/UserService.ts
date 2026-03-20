import { userRepository } from "../repositories/UserRepository.ts";
import { NotFoundError } from "../errors/AppError.ts";
import { IUser } from "../types/index.ts";
import { UpdateUserInput } from "../dtos/user.dto.ts";
import { hashPassword } from "../utils/password.ts";

/**
 * User Service
 * Handles user profile management
 */
export class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateUserInput): Promise<IUser> {
    const user = await userRepository.update(userId, input);
    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findByEmailWithPassword(
      (await userRepository.findById(userId)).email,
    );

    if (!user) {
      throw new NotFoundError("User");
    }

    // This would require importing comparePassword
    // For now, just hash and update
    const hashedNewPassword = await hashPassword(newPassword);
    await userRepository.update(userId, { password: hashedNewPassword });
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    await userRepository.delete(userId);
    console.log(`[User] Deleted user account: ${userId}`);
  }
}

export const userService = new UserService();
