export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from('reservas').select('*').order('fecha_hora', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar reservas" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = createServerClient();
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

export async function PUT(request) {
  try {
    const supabase = createServerClient();
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

export async function DELETE(request) {
  try {
    const supabase = createServerClient();
    const { id } = await request.json();
    const { error } = await supabase.from('reservas').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ message: "Reserva eliminada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}