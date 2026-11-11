import { createClient, createServiceClient } from '../../../../../lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

async function checkAdminAuth(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'PravalikaReddy@123';
  const authHeader = request.headers.get('x-admin-key');
  const cookieKey = request.cookies.get('ai_jobhub_admin_key')?.value;

  if (authHeader === adminSecret || cookieKey === adminSecret) {
    return true;
  }

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

// PUT /api/admin/jobs/[id] — update a job
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthorized = await checkAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const service = createServiceClient() || createClient();
  if (!service) {
    return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 503 });
  }

  const { data, error } = await service
    .from('jobs')
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/admin/jobs/[id] — delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthorized = await checkAdminAuth(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const { id } = await params;
  const service = createServiceClient() || createClient();
  if (!service) {
    return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 503 });
  }

  const { error } = await service.from('jobs').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Job deleted successfully' });
}
