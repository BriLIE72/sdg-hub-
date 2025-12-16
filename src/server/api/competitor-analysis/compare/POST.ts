import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const { countries } = req.body;

    // Validation
    if (!countries || !Array.isArray(countries) || countries.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 countries required for comparison',
      });
    }

    // In production, fetch from database
    // For now, return comparison data
    const comparison = {
      countries: countries,
      comparisonDate: new Date().toISOString(),
      metrics: {
        overallScore: countries.map((c: string) => ({
          country: c,
          score: Math.floor(Math.random() * 30) + 70,
        })),
        sdgPerformance: {
          sdg1: countries.map((c: string) => ({
            country: c,
            score: Math.floor(Math.random() * 30) + 70,
          })),
          sdg4: countries.map((c: string) => ({
            country: c,
            score: Math.floor(Math.random() * 30) + 70,
          })),
          sdg7: countries.map((c: string) => ({
            country: c,
            score: Math.floor(Math.random() * 30) + 70,
          })),
          sdg13: countries.map((c: string) => ({
            country: c,
            score: Math.floor(Math.random() * 30) + 70,
          })),
        },
      },
      winner: countries[0],
      gaps: [
        {
          sdg: 'SDG 7',
          gap: 31,
          leader: countries[0],
        },
        {
          sdg: 'SDG 13',
          gap: 26,
          leader: countries[0],
        },
      ],
    };

    return res.status(200).json({
      success: true,
      data: comparison,
      message: 'Comparison completed successfully',
    });
  } catch (error) {
    console.error('Comparison error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: String(error),
    });
  }
}
