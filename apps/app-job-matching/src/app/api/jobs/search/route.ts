import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@matchpro/config/src/supabase';
import { Job, JobSearchResponse } from '../../../../types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const query = searchParams.get('query') || '';
    const location = searchParams.get('location') || '';
    const employmentType = searchParams.getAll('employmentType') as Job['employment_type'][];
    const remoteType = searchParams.getAll('remoteType') as Job['remote_type'][];
    const minSalary = searchParams.get('minSalary') ? parseInt(searchParams.get('minSalary')!) : undefined;
    const postedWithin = searchParams.get('postedWithin') ? parseInt(searchParams.get('postedWithin')!) : undefined;

    // Query jobs from Supabase
    let dbQuery = supabase.from('jobs').select('*', { count: 'exact' });

    // Add filters
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }
    if (location) {
      dbQuery = dbQuery.ilike('location', `%${location}%`);
    }
    if (employmentType && employmentType.length > 0) {
      dbQuery = dbQuery.in('employment_type', employmentType);
    }
    if (remoteType && remoteType.length > 0) {
      dbQuery = dbQuery.in('remote_type', remoteType);
    }
    if (minSalary) {
      dbQuery = dbQuery.gte('salary_range->min', minSalary);
    }
    if (postedWithin) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - postedWithin);
      dbQuery = dbQuery.gte('posted_date', cutoffDate.toISOString());
    }

    // Add pagination
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    dbQuery = dbQuery.range(start, start + pageSize - 1);

    // Execute query
    const { data: jobs, count, error } = await dbQuery;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    const response: JobSearchResponse = {
      jobs: jobs || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / pageSize),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in jobs search API:', error);
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    );
  }
}
