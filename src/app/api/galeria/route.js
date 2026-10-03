export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('galeria').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar fotos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const formData = await request.formData();
    const file = formData.get('foto');
    
    if (!file) return NextResponse.json({ error: "No hay archivo" }, { status: 400 });

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('galeria')
      .upload(fileName, file, { contentType: file.type });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('galeria')
      .getPublicUrl(fileName);

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

export async function DELETE(request) {
  try {
    const supabase = createServerClient();
    const { id, url } = await request.json();
    
    const fileName = url.split('/').pop();
    await supabase.storage.from('galeria').remove([fileName]);

    const { error } = await supabase.from('galeria').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ message: "Foto eliminada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  }
}