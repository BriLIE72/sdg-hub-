import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    // In production, fetch from database
    // For now, return mock data matching your frontend
    const bestPractices = [
      {
        id: 1,
        title: 'National Literacy Campaign - Rwanda',
        sdg: 'SDG 4: Quality Education',
        sdgId: 4,
        country: 'Rwanda',
        region: 'Africa',
        description:
          'Comprehensive adult literacy program that increased literacy rates from 58% to 73% in 5 years through community-based learning centers and mobile education units.',
        impact: 'Reached 2.5 million adults, 73% literacy rate achieved',
        budget: '$45M over 5 years',
        rating: 4.8,
        category: 'Education',
        tags: ['Literacy', 'Community Engagement', 'Mobile Learning'],
        year: '2019-2024',
        status: 'Completed',
      },
      {
        id: 2,
        title: 'Universal Healthcare Coverage - Thailand',
        sdg: 'SDG 3: Good Health',
        sdgId: 3,
        country: 'Thailand',
        region: 'Asia',
        description:
          'Universal healthcare scheme providing comprehensive medical coverage to all citizens through a network of public hospitals and primary care centers.',
        impact: '99.5% population coverage, reduced out-of-pocket expenses by 60%',
        budget: '$8B annually',
        rating: 4.9,
        category: 'Health',
        tags: ['Healthcare', 'Universal Coverage', 'Public Health'],
        year: '2002-Present',
        status: 'Ongoing',
      },
      {
        id: 3,
        title: 'Renewable Energy Transition - Costa Rica',
        sdg: 'SDG 7: Clean Energy',
        sdgId: 7,
        country: 'Costa Rica',
        region: 'Latin America',
        description:
          'Ambitious renewable energy program achieving 99% renewable electricity generation through hydroelectric, wind, solar, and geothermal sources.',
        impact: '99% renewable electricity, carbon neutral by 2021',
        budget: '$2.3B over 10 years',
        rating: 5.0,
        category: 'Energy',
        tags: ['Renewable Energy', 'Climate Action', 'Sustainability'],
        year: '2014-2024',
        status: 'Completed',
      },
      {
        id: 4,
        title: 'Conditional Cash Transfer - Brazil',
        sdg: 'SDG 1: No Poverty',
        sdgId: 1,
        country: 'Brazil',
        region: 'Latin America',
        description:
          'Bolsa Família program providing cash transfers to low-income families conditional on children attending school and receiving vaccinations.',
        impact: 'Lifted 36 million people out of poverty, reduced inequality by 15%',
        budget: '$30B over 15 years',
        rating: 4.7,
        category: 'Social Protection',
        tags: ['Poverty Reduction', 'Cash Transfers', 'Education'],
        year: '2003-2018',
        status: 'Completed',
      },
      {
        id: 5,
        title: 'Gender Equality in Parliament - Rwanda',
        sdg: 'SDG 5: Gender Equality',
        sdgId: 5,
        country: 'Rwanda',
        region: 'Africa',
        description:
          'Constitutional reforms and quota systems ensuring women hold 61% of parliamentary seats, the highest globally.',
        impact: '61% women in parliament, improved gender policies',
        budget: '$12M for capacity building',
        rating: 4.9,
        category: 'Governance',
        tags: ['Gender Equality', 'Political Participation', 'Governance'],
        year: '2003-Present',
        status: 'Ongoing',
      },
      {
        id: 6,
        title: 'Clean Water Access - Singapore',
        sdg: 'SDG 6: Clean Water',
        sdgId: 6,
        country: 'Singapore',
        region: 'Asia',
        description:
          'Integrated water management system including rainwater harvesting, desalination, and wastewater recycling achieving water self-sufficiency.',
        impact: '100% population access to clean water, 40% water self-sufficiency',
        budget: '$5B over 20 years',
        rating: 4.8,
        category: 'Water Management',
        tags: ['Water Security', 'Desalination', 'Recycling'],
        year: '2000-2020',
        status: 'Completed',
      },
      {
        id: 7,
        title: 'Digital Education Platform - Estonia',
        sdg: 'SDG 4: Quality Education',
        sdgId: 4,
        country: 'Estonia',
        region: 'Europe',
        description:
          'Nationwide digital learning platform providing free online education to all students with personalized learning paths and real-time progress tracking.',
        impact: '98% student digital literacy, improved learning outcomes by 25%',
        budget: '$120M over 8 years',
        rating: 4.7,
        category: 'Education',
        tags: ['Digital Learning', 'Technology', 'Innovation'],
        year: '2015-2023',
        status: 'Completed',
      },
      {
        id: 8,
        title: 'Urban Green Spaces - Singapore',
        sdg: 'SDG 11: Sustainable Cities',
        sdgId: 11,
        country: 'Singapore',
        region: 'Asia',
        description:
          'Comprehensive urban greening program transforming the city into a "Garden City" with vertical gardens, rooftop parks, and green corridors.',
        impact: '47% green coverage, reduced urban heat by 2°C',
        budget: '$3.5B over 15 years',
        rating: 4.9,
        category: 'Urban Development',
        tags: ['Green Infrastructure', 'Urban Planning', 'Sustainability'],
        year: '2008-2023',
        status: 'Ongoing',
      },
      {
        id: 9,
        title: 'Microfinance for Women - Bangladesh',
        sdg: 'SDG 5: Gender Equality',
        sdgId: 5,
        country: 'Bangladesh',
        region: 'Asia',
        description:
          'Grameen Bank microfinance model providing small loans to women entrepreneurs, enabling economic independence and poverty reduction.',
        impact: '9 million women borrowers, 98% repayment rate',
        budget: '$15B in loans disbursed',
        rating: 4.8,
        category: 'Economic Empowerment',
        tags: ['Microfinance', 'Women Empowerment', 'Entrepreneurship'],
        year: '1983-Present',
        status: 'Ongoing',
      },
    ];

    // Optional: Filter by query parameters
    const { category, region, sdgId, status } = req.query;

    let filteredPractices = bestPractices;

    if (category) {
      filteredPractices = filteredPractices.filter(
        (p) => p.category.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (region) {
      filteredPractices = filteredPractices.filter(
        (p) => p.region.toLowerCase() === String(region).toLowerCase()
      );
    }

    if (sdgId) {
      filteredPractices = filteredPractices.filter((p) => p.sdgId === Number(sdgId));
    }

    if (status) {
      filteredPractices = filteredPractices.filter(
        (p) => p.status.toLowerCase() === String(status).toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      data: filteredPractices,
      count: filteredPractices.length,
      total: bestPractices.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get best practices error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: String(error),
    });
  }
}
