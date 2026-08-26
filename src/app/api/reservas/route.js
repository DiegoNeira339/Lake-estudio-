export const dynamic = 'force-dynamic'; 
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);


// 2. SUBIR UNA FOTO (POST)
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('foto');
    
    if (!file) return NextResponse.json({ error: "No hay archivo" }, { status: 400 });

    // Crear un nombre único
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // === EL TRUCO MÁGICO: Convertir la foto a Buffer ===
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir al Storage usando el buffer
    const { error: uploadError } = await supabase.storage
      .from('galeria')
      .upload(fileName, buffer, { 
        contentType: file.type,
        upsert: false
      });

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
    console.error("DETALLE DEL ERROR AL SUBIR:", error);
    return NextResponse.json({ error: "No se pudo subir la foto" }, { status: 500 });
  }
}

export async function GET() {
  try {
    
    const { data, error } = await supabase
      .from('reservas')
      .select('*');

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error("Error al leer reservas:", error);
    return NextResponse.json(
      { error: "Error al obtener las reservas" }, 
      { status: 500 }
    );
  }
}

// 3. ELIMINAR RESERVA DESDE EL DASHBOARD (DELETE)
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from('reservas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: "Reserva eliminada" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  }
}

// 4. MODIFICAR RESERVA (PUT)
export async function PUT(request) {
  try {
    const body = await request.json();

    const { error } = await supabase
      .from('reservas')
      .update({
        nombre: body.nombre,
        whatsapp: body.whatsapp,
        email: body.email,
        servicio: body.servicio,
        fecha_hora: body.fecha_hora // Mantenemos el formato original
      })
      .eq('id', body.id); // Busca la reserva por su ID y la chanca

    if (error) throw error;
    return NextResponse.json({ message: "Reserva actualizada" }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar:", error);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }
}