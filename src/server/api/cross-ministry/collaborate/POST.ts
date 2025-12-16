import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const { ministry1, ministry2, projectName, sdgs, budget, description } = req.body;

    // Validation
    if (!ministry1 || !ministry2 || !projectName) {
      return res.status(400).json({
        success: false,
        error: 'Ministry names and project name are required',
      });
    }

    // In production, create collaboration in database
    // For now, return success response
    const collaboration = {
      id: Date.now(),
      ministry1,
      ministry2,
      projectName,
      sdgs: sdgs || [],
      budget: budget || 0,
      description: description || '',
      status: 'proposed',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
    };

    return res.status(201).json({
      success: true,
      data: collaboration,
      message: 'Collaboration proposal created successfully',
    });
  } catch (error) {
    console.error('Collaboration creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: String(error),
    });
  }
}
