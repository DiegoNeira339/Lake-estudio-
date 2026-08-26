import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // Lee la contraseña segura desde tu archivo .env.local
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Si coinciden, le damos un pase VIP
    if (password === adminPassword) {
      return NextResponse.json({ message: "Bienvenido jefe" }, { status: 200 });
    } else {
      // Si no, lo pateamos
      return NextResponse.json({ error: "Intruso detectado" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}