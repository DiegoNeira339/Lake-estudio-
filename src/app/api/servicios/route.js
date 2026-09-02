export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const subir = async (file) => {
  const ext = file.name.split('.').pop();
  const name = `serv_${Date.now()}_${Math.random().toString(36).substring(5)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage.from('galeria').upload(name, Buffer.from(bytes), { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from('galeria').getPublicUrl(name).data.publicUrl;
};

export async function GET() {
  try {
    const { data, error } = await supabase.from('servicios').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const titulo = formData.get('titulo');
    const precio = formData.get('precio');
    const descripcion = formData.get('descripcion');
    const file = formData.get('foto');
    const fotosExtra = formData.getAll('fotos_extra');

    let publicUrl = null;
    if (file && file.size > 0 && file.name !== 'undefined') publicUrl = await subir(file);

    let urlsExtra = [];
    for (const f of fotosExtra) {
      if (f && f.size > 0 && f.name !== 'undefined') urlsExtra.push(await subir(f));
    }

    const { error } = await supabase.from('servicios').insert([{
      titulo, precio, descripcion, foto_url: publicUrl, fotos_extra: urlsExtra.length ? urlsExtra.join(',') : null
    }]);
    
    if (error) throw error;
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const titulo = formData.get('titulo');
    const precio = formData.get('precio');
    const descripcion = formData.get('descripcion');
    const file = formData.get('foto');
    const url_actual = formData.get('foto_url'); 
    const fotosExtra = formData.getAll('fotos_extra');
    const urls_actuales = formData.get('fotos_extra_actuales');

    let publicUrl = url_actual; 
    if (file && file.size > 0 && file.name !== 'undefined') publicUrl = await subir(file);

    let urlsExtra = urls_actuales ? urls_actuales.split(',').filter(Boolean) : [];
    for (const f of fotosExtra) {
      if (f && f.size > 0 && f.name !== 'undefined') urlsExtra.push(await subir(f));
    }

    const { error } = await supabase.from('servicios').update({
      titulo, precio, descripcion, foto_url: publicUrl, fotos_extra: urlsExtra.length ? urlsExtra.join(',') : null
    }).eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from('servicios').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}