export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. LEER LAS FOTOS (GET)
export async function GET() {
  try {
    const { data, error } = await supabase.from('galeria').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar fotos" }, { status: 500 });
  }
}

// 2. SUBIR UNA FOTO (POST)
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('foto');
    
    if (!file) return NextResponse.json({ error: "No hay archivo" }, { status: 400 });

    // Crear un nombre único para que no choquen si se llaman igual
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Subir al Storage (al bucket 'galeria')
    const { error: uploadError } = await supabase.storage
      .from('galeria')
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) throw uploadError;

    // Obtener el link público
    const { data: { publicUrl } } = supabase.storage
      .from('galeria')
      .getPublicUrl(fileName);

    // Guardar el link en la tabla 'galeria'
    const { error: dbError } = await supabase
      .from('galeria')
      .insert([{ url: publicUrl }]);

    if (dbError) throw dbError;

    return NextResponse.json({ message: "Foto subida", url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo subir la foto" }, { status: 500 });
  }
}

// 3. BORRAR UNA FOTO (DELETE)
export async function DELETE(request) {
  try {
    const { id, url } = await request.json();
    
    // Extraer el nombre del archivo para borrarlo del Storage
    const fileName = url.split('/').pop();
    await supabase.storage.from('galeria').remove([fileName]);

    // Borrar de la tabla
    const { error } = await supabase.from('galeria').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ message: "Foto eliminada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  }
}