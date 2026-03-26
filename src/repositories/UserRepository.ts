import { User } from "../models/User";
import { IUser } from "../types/index";
import { NotFoundError, ConflictError } from "../errors/AppError";

/**
 * User Repository
 * Handles all user database operations
 */
export class UserRepository {
  /**
   * Create a new user
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData);
      await user.save();
      return user.toObject();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictError("User with this email already exists");
      }
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser> {
    const user = await User.findById(id).lean();
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).lean();
    return user;
  }

  /**
   * Find user by email with password
   */
  async findByEmailWithPassword(email: string): Promise<any> {
    const user = await User.findOne({ email }).lean();
    return user;
  }

  /**
   * Update user
   */
  async update(id: string, updateData: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    }).lean();

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  /**
   * Update refresh token
   */
  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await User.findByIdAndUpdate(id, { refreshToken }, { returnDocument: 'after' });
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundError("User");
    }
  }

  /**
   * Check if user exists
   */
  async exists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email });
    return count > 0;
  }

  /**
   * Get all users (for admin purposes)
   */
  async getAll(page: number = 1, limit: number = 10): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);
    return { users, total };
  }

  /**
   * Find user by email verification token
   */
  async findByEmailVerificationToken(token: string): Promise<IUser | null> {
    const user = await User.findOne({ emailVerificationToken: token }).lean();
    return user;
  }
}

export const userRepository = new UserRepository();
