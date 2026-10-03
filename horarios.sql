-- Tabla de horarios por día de la semana
-- dia_semana: 0=Domingo, 1=Lunes, ..., 6=Sábado

CREATE TABLE IF NOT EXISTS horarios (
  id BIGSERIAL PRIMARY KEY,
  dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (dia_semana, hora_inicio)
);

-- Índice para consultas rápidas por día
CREATE INDEX IF NOT EXISTS idx_horarios_dia_activo ON horarios (dia_semana, activo) WHERE activo = true;

-- Seed inicial (valores actuales de BookingForm.jsx)
INSERT INTO horarios (dia_semana, hora_inicio, hora_fin, activo) VALUES
-- Lunes (1)
(1, '10:30', '11:30', true),
(1, '13:00', '14:00', true),
(1, '15:00', '16:00', true),
-- Martes (2)
(2, '10:30', '11:30', true),
(2, '13:00', '14:00', true),
(2, '15:00', '16:00', true),
-- Miércoles (3)
(3, '10:30', '11:30', true),
(3, '13:00', '14:00', true),
(3, '15:00', '16:00', true),
-- Jueves (4)
(4, '11:00', '12:00', true),
(4, '14:00', '15:00', true),
(4, '16:00', '17:00', true),
(4, '18:00', '19:00', true),
(4, '20:00', '21:00', true),
-- Viernes (5)
(5, '14:00', '15:00', true),
(5, '17:00', '18:00', true),
(5, '20:00', '21:00', true),
-- Sábado (6)
(6, '14:00', '15:00', true),
(6, '17:00', '18:00', true),
(6, '20:00', '21:00', true)
ON CONFLICT (dia_semana, hora_inicio) DO NOTHING;

-- Domingo (0) queda sin horarios (cerrado)