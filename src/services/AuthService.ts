import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../errors/AppError.ts";
import { userRepository } from "../repositories/UserRepository.ts";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.ts";
import { hashPassword, comparePassword } from "../utils/password.ts";
import { IUser, JWTPayload } from "../types/index.ts";
import { RegisterUserInput, LoginUserInput } from "../dtos/user.dto.ts";
import { notificationService } from "./NotificationService.ts";
import crypto from "crypto";

/**
 * Authentication Service
 * Handles all authentication logic
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterUserInput): Promise<{
    user: Omit<IUser, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      emailVerificationToken,
    });

    // Send email verification
    await notificationService.sendEmailVerification(
      user.email,
      user.name,
      emailVerificationToken,
    );

    // Generate tokens
    const accessToken = generateToken({
      userId: (user as any)._id || user.id || "",
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: (user as any)._id || user.id || "",
      email: user.email,
    });

    // Store refresh token
    await userRepository.updateRefreshToken(
      (user as any)._id || user.id || "",
      refreshToken,
    );

    // Remove sensitive data
    const { password, ...others } = user;
    
    delete (user as any).password

    return {
      user: others,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(input: LoginUserInput): Promise<{
    user: Omit<IUser, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    // Find user by email
    const user = await userRepository.findByEmailWithPassword(input.email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateToken({
      userId: (user as any)._id.toString(),
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: (user as any)._id.toString(),
      email: user.email,
    });

    // Store refresh token
    await userRepository.updateRefreshToken((user as any)._id.toString(), refreshToken);

    // Build user response without password
    const userResponse: IUser = {
      id: (user as any)._id.toString(),
      ...user.toObject(),
    };
    delete (userResponse as any).password;
    delete (userResponse as any).refreshToken;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Get user
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    // Generate new tokens
    const newAccessToken = generateToken({
      userId: payload.userId,
      email: payload.email,
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
    });

    // Update refresh token
    await userRepository.updateRefreshToken(payload.userId, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    // Clear refresh token
    await userRepository.updateRefreshToken(userId, null);
  }

  /**
   * Verify if token is valid
   */
  async verifyToken(token: string): Promise<JWTPayload> {
    // This will throw AuthenticationError if invalid
    const { verifyToken: verify } = await import("../utils/jwt.ts");
    const payload = verify(token);
    return payload;
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    // Find user with this verification token
    const user = await userRepository.findByEmailVerificationToken(token);
    if (!user) {
      throw new NotFoundError("Invalid or expired verification token");
    }

    // Update user as verified and clear token
    await userRepository.update((user as any)._id!.toString(), {
      emailVerified: true,
      emailVerificationToken: undefined,
    });

    return { message: "Email verified successfully" };
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(email: string): Promise<{ message: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User");
    }

    if (user.emailVerified) {
      throw new ConflictError("Email is already verified");
    }

    // Generate new token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Update user with new token
    await userRepository.update((user as any)._id!.toString(), {
      emailVerificationToken,
    });

    // Send verification email
    await notificationService.sendEmailVerification(
      user.email,
      user.name,
      emailVerificationToken,
    );

    return { message: "Verification email sent successfully" };
  }
}

export const authService = new AuthService();
