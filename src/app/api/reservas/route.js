export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. LEER RESERVAS
export async function GET() {
  try {
    const { data, error } = await supabase.from('reservas').select('*').order('fecha_hora', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar reservas" }, { status: 500 });
  }
}

// 2. CREAR RESERVA
export async function POST(request) {
  try {
    const body = await request.json(); 
    
    const { error } = await supabase
      .from('reservas')
      .insert([{ 
        nombre: body.nombre, 
        servicio: body.servicio, 
        whatsapp: body.whatsapp, 
        email: body.email, 
        fecha_hora: body.fechaHora 
      }]);

    if (error) throw error;

    return NextResponse.json({ message: "Reserva exitosa" }, { status: 200 });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "No se pudo agendar" }, { status: 500 });
  }
}

// 3. EDITAR RESERVA
export async function PUT(request) {
  try {
    const body = await request.json();
    const { error } = await supabase
      .from('reservas')
      .update({ nombre: body.nombre, servicio: body.servicio, whatsapp: body.whatsapp, fecha_hora: body.fecha_hora })
      .eq('id', body.id);
    
    if (error) throw error;
    return NextResponse.json({ message: "Reserva actualizada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// 4. BORRAR RESERVA
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from('reservas').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ message: "Reserva eliminada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}