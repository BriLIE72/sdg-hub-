import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Find user by email
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userList.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const user = userList[0];

    // In production, you should use bcrypt to compare hashed passwords
    // For now, we'll do a simple comparison (NOT SECURE - just for demo)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Successful login
    // In production, generate JWT token here
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
      // In production, include JWT token here
      token: 'demo-jwt-token-' + user.id,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: String(error),
    });
  }
}
