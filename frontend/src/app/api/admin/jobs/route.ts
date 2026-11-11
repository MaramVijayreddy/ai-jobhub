import { createClient, createServiceClient } from '../../../../lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Helper: verify admin via Supabase Auth session OR admin secret header/cookie
async function checkAdminAuth(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'PravalikaReddy@123';
  const authHeader = request.headers.get('x-admin-key');
  const cookieKey = request.cookies.get('ai_jobhub_admin_key')?.value;

  if (authHeader === adminSecret || cookieKey === adminSecret) {
    return true;
  }

  // Also verify Supabase Auth session if user configured it
  const supabase = createClient();
  if (supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) return true;
    } catch {
      // Continue
    }
  }

  return false;
}

// GET /api/admin/jobs — list all jobs
export async function GET(request: NextRequest) {
  const isAuthorized = await checkAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const service = createServiceClient() || createClient();
  if (!service) {
    return NextResponse.json({
      error: 'Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
    }, { status: 503 });
  }

  const { data, error } = await service
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/admin/jobs — create a new job
export async function POST(request: NextRequest) {
  const isAuthorized = await checkAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    company,
    location,
    type,
    is_remote,
    batch,
    salary,
    description,
    requirements,
    apply_link,
    resume_prompt,
    is_active,
  } = body;

  if (!title || !company || !location || !type || !description || !apply_link) {
    return NextResponse.json({ error: 'Title, Company, Location, Type, Description, and Apply Link are required.' }, { status: 400 });
  }

  const service = createServiceClient() || createClient();
  if (!service) {
    return NextResponse.json({
      error: 'Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
    }, { status: 503 });
  }

  const { data, error } = await service
    .from('jobs')
    .insert([
      {
        title,
        company,
        location,
        type,
        is_remote: Boolean(is_remote),
        batch: batch || null,
        salary: salary || null,
        description,
        requirements: requirements || null,
        apply_link,
        resume_prompt: resume_prompt || null,
        is_active: is_active ?? true,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
