import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { progress, status, kpis, notes } = req.body;

    // Validation
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Policy ID is required',
      });
    }

    // In production, update database
    // For now, return success response
    const updatedPolicy = {
      id: Number(id),
      progress: progress || 0,
      status: status || 'on-track',
      kpis: kpis || [],
      notes: notes || '',
      lastUpdate: new Date().toISOString(),
      updatedBy: 'Current User',
    };

    return res.status(200).json({
      success: true,
      data: updatedPolicy,
      message: 'Policy status updated successfully',
    });
  } catch (error) {
    console.error('Update policy error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: String(error),
    });
  }
}
