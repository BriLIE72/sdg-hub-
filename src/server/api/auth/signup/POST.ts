import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { name, email, password, organization, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Password length validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters',
      });
    }

    // Check if user already exists
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Create new user
    // In production, hash the password with bcrypt before storing
    const result = await db.insert(users).values({
      name,
      email,
      password, // In production: await bcrypt.hash(password, 10)
      organization: organization || null,
      role: role || 'user',
    });

    // Get the newly created user
    const insertId = Number(result[0].insertId);
    const newUserList = await db.select().from(users).where(eq(users.id, insertId)).limit(1);
    const newUser = newUserList[0];

    // Successful signup
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization,
      },
      // In production, generate and include JWT token here
      token: 'demo-jwt-token-' + newUser.id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: String(error),
    });
  }
}
