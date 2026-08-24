export const dynamic = 'force-dynamic'; 
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);


export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Intentando guardar esta reserva:", body);

    const { data, error } = await supabase
      .from('reservas')
      .insert([
        {
          nombre: body.nombre,
          whatsapp: body.whatsapp,
          email: body.email,
          servicio: body.servicio,
          fecha_hora: body.fechaHora 
        }
      ]);

    if (error) {
      console.error("Error de Supabase:", error);
      throw error;
    }

    return NextResponse.json(
      { message: "¡Reserva guardada con éxito en la base de datos!" }, 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error crítico en el backend:", error);
    return NextResponse.json(
      { message: "Hubo un error al procesar la reserva" }, 
      { status: 500 }
    );
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