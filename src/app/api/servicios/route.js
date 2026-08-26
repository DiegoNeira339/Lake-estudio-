export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. LEER LOS SERVICIOS (GET)
export async function GET() {
  try {
    const { data, error } = await supabase.from('servicios').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar servicios" }, { status: 500 });
  }
}

// 2. CREAR UN NUEVO SERVICIO (POST)
export async function POST(request) {
  try {
    const formData = await request.formData();
    const titulo = formData.get('titulo');
    const descripcion = formData.get('descripcion');
    const file = formData.get('foto');

    let publicUrl = null;

    // Si mandan foto, aplicamos el truco mágico del Buffer y la subimos al bucket 'galeria'
    if (file && file.size > 0 && file.name !== 'undefined') {
      const fileExt = file.name.split('.').pop();
      const fileName = `servicio_${Date.now()}.${fileExt}`;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: uploadError } = await supabase.storage
        .from('galeria')
        .upload(fileName, buffer, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('galeria').getPublicUrl(fileName);
      publicUrl = data.publicUrl;
    }

    const { error: dbError } = await supabase
      .from('servicios')
      .insert([{ titulo, descripcion, foto_url: publicUrl }]);

    if (dbError) throw dbError;

    return NextResponse.json({ message: "Servicio creado" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo crear" }, { status: 500 });
  }
}

// 3. EDITAR UN SERVICIO EXISTENTE (PUT)
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    const titulo = formData.get('titulo');
    const descripcion = formData.get('descripcion');
    const file = formData.get('foto');
    const url_actual = formData.get('foto_url'); 

    let publicUrl = url_actual; // Por defecto mantenemos la foto que ya tenía

    // Si tu novia decide subir una foto NUEVA para reemplazar la vieja
    if (file && file.size > 0 && file.name !== 'undefined') {
      const fileExt = file.name.split('.').pop();
      const fileName = `servicio_${Date.now()}.${fileExt}`;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: uploadError } = await supabase.storage
        .from('galeria')
        .upload(fileName, buffer, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('galeria').getPublicUrl(fileName);
      publicUrl = data.publicUrl;
    }

    const { error: dbError } = await supabase
      .from('servicios')
      .update({ titulo, descripcion, foto_url: publicUrl })
      .eq('id', id);

    if (dbError) throw dbError;

    return NextResponse.json({ message: "Servicio actualizado" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// 4. BORRAR UN SERVICIO (DELETE)
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from('servicios').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ message: "Servicio eliminado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}