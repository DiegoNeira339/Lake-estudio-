"use client";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function HorariosManager({ horarios, onRefresh }) {
  const [formHorario, setFormHorario] = useState({ 
    id: null, 
    dia_semana: 1, 
    hora_inicio: '10:00', 
    hora_fin: '11:00', 
    activo: true 
  });
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const resetForm = () => {
    setFormHorario({ id: null, dia_semana: 1, hora_inicio: '10:00', hora_fin: '11:00', activo: true });
    setEditando(false);
  };

  const guardarHorario = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const metodo = editando ? 'PUT' : 'POST';
      const res = await fetch('/api/horarios', { 
        method: metodo, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formHorario) 
      });
      if (res.ok) {
        Swal.fire('¡Éxito!', `Horario ${editando ? 'actualizado' : 'creado'}`, 'success');
        onRefresh?.();
        resetForm();
      } else throw new Error();
    } catch (error) { 
      Swal.fire('Error', 'Hubo un problema guardando el horario', 'error'); 
    } finally { setGuardando(false); }
  };

  const eliminarHorario = async (id) => {
    const { isConfirmed } = await Swal.fire({ 
      title: '¿Borrar horario?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#ef4444' 
    });
    if (!isConfirmed) return;
    try {
      const res = await fetch('/api/horarios', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }) 
      });
      if (res.ok) { onRefresh?.(); Swal.fire('Eliminado', 'El horario se borró', 'success'); }
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar', 'error');
    }
  };

  const editarHorario = (h) => {
    setFormHorario(h);
    setEditando(true);
  };

  const horariosPorDia = {};
  horarios.forEach(h => {
    if (!horariosPorDia[h.dia_semana]) horariosPorDia[h.dia_semana] = [];
    horariosPorDia[h.dia_semana].push(h);
  });

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
      <h2 className="text-2xl font-bold text-lake-dark mb-2">Gestión de Horarios ⏰</h2>
      <p className="text-gray-500 mb-8">Define los horarios de atención por día de la semana.</p>

      <form onSubmit={guardarHorario} className="mb-12 bg-lake-pink/10 p-6 rounded-3xl border-2 border-lake-pink/30">
        <h3 className="font-bold text-xl mb-4 text-lake-dark">
          {editando ? '✏️ Editar Horario' : '➕ Crear Nuevo Horario'}
        </h3>
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Día</label>
            <select 
              value={formHorario.dia_semana} 
              onChange={e => setFormHorario({...formHorario, dia_semana: Number(e.target.value)})} 
              className="border-2 p-3 rounded-xl w-full outline-none focus:border-lake-pink bg-white shadow-sm"
            >
              {DIAS.map((dia, idx) => (
                <option key={idx} value={idx}>{dia}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Hora Inicio</label>
            <input 
              type="time" 
              value={formHorario.hora_inicio} 
              onChange={e => setFormHorario({...formHorario, hora_inicio: e.target.value})} 
              className="border-2 p-3 rounded-xl w-full outline-none focus:border-lake-pink bg-white shadow-sm" 
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Hora Fin</label>
            <input 
              type="time" 
              value={formHorario.hora_fin} 
              onChange={e => setFormHorario({...formHorario, hora_fin: e.target.value})} 
              className="border-2 p-3 rounded-xl w-full outline-none focus:border-lake-pink bg-white shadow-sm" 
              required 
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formHorario.activo} 
                onChange={e => setFormHorario({...formHorario, activo: e.target.checked})} 
                className="w-4 h-4 rounded border-gray-300 text-lake-matcha focus:ring-lake-pink"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {editando && (
            <button 
              type="button" 
              onClick={resetForm} 
              className="w-1/4 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors shadow-sm"
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit" 
            disabled={guardando} 
            className={`${editando ? 'w-3/4' : 'w-full'} bg-lake-dark text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 shadow-sm`}
          >
            {guardando ? '⏳ Guardando...' : (editando ? 'Guardar Cambios' : 'Crear Horario')}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {DIAS.map((dia, idx) => {
          const horariosDia = horariosPorDia[idx] || [];
          return (
            <div key={idx} className="border-2 border-gray-100 rounded-2xl p-4">
              <h4 className="font-bold text-lg text-lake-dark mb-3 flex items-center gap-2">
                {dia}
                {idx === 0 && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Cerrado</span>}
              </h4>
              {horariosDia.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin horarios configurados</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {horariosDia.map(h => (
                    <div 
                      key={h.id} 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium ${
                        h.activo 
                          ? 'bg-lake-matcha/20 text-lake-dark border border-lake-matcha/30' 
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      <span>{h.hora_inicio.slice(0,5)} - {h.hora_fin.slice(0,5)}</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => editarHorario(h)} 
                          className="text-blue-600 hover:text-blue-800 font-bold"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => eliminarHorario(h.id)} 
                          className="text-red-600 hover:text-red-800 font-bold"
                          title="Borrar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}