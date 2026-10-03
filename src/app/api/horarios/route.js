export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('horarios')
      .select('*')
      .eq('activo', true)
      .order('dia_semana', { ascending: true })
      .order('hora_inicio', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar horarios" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { dia_semana, hora_inicio, hora_fin } = body;

    if (dia_semana === undefined || !hora_inicio || !hora_fin) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('horarios')
      .insert([{ dia_semana, hora_inicio, hora_fin, activo: true }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creando horario:", error);
    return NextResponse.json({ error: "No se pudo crear horario" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { id, dia_semana, hora_inicio, hora_fin, activo } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const updateData = {};
    if (dia_semana !== undefined) updateData.dia_semana = dia_semana;
    if (hora_inicio) updateData.hora_inicio = hora_inicio;
    if (hora_fin) updateData.hora_fin = hora_fin;
    if (activo !== undefined) updateData.activo = activo;

    const { data, error } = await supabase
      .from('horarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const supabase = createServerClient();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const { error } = await supabase.from('horarios').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ message: "Horario eliminado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}