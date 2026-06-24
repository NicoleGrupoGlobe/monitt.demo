import { ArrowLeft, Sparkles, AlertTriangle, Clock, CalendarCheck, CheckCircle } from 'lucide-react'
import { useState } from 'react'

function FormField({ label, value, multiline = false }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: '5px' }}>{label}</label>
      {multiline ? (
        <div style={{
          width: '100%', padding: '10px 12px', borderRadius: '6px',
          border: '1px solid var(--border)', background: 'var(--bg-elevated)',
          fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6,
          minHeight: '72px',
        }}>
          {value}
        </div>
      ) : (
        <div style={{
          padding: '8px 12px', borderRadius: '6px',
          border: '1px solid var(--border)', background: 'var(--bg-elevated)',
          fontSize: '13px', color: 'var(--text-primary)',
        }}>
          {value}
        </div>
      )}
    </div>
  )
}

export default function AlertDispatch({ navigate }) {
  const [priority, setPriority] = useState('alta')
  const [notes, setNotes] = useState('')

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <button onClick={() => navigate('activo-gen002')} style={{
        display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none',
        color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', padding: 0,
        marginBottom: '24px', fontFamily: 'inherit',
      }}>
        <ArrowLeft size={14} /> Volver a GEN-002
      </button>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
          Solicitar revisión técnica
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Monitt asignará el técnico más adecuado para esta intervención.
        </p>
      </div>

      {/* Alert summary */}
      <div style={{
        background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
        borderLeft: '3px solid #EF4444',
        borderRadius: '8px', padding: '14px 18px', marginBottom: '20px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px',
      }}>
        {[
          ['Activo',         'GEN-002 — Bodega Sur, San Bernardo'],
          ['Tipo de falla',  'Anomalía en sistema de lubricación'],
          ['Urgencia',       'Alta'],
          ['Detectado',      'Hace 5 días'],
          ['Prob. de falla', '73% en los próximos 7 días'],
        ].map(([k, v]) => (
          <div key={k}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 1px' }}>{k}</p>
            <p style={{ fontSize: '13px', fontWeight: 500, color: k === 'Urgencia' ? '#EF4444' : 'var(--text-primary)', margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>

      {/* AI-filled work order */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>

        {/* AI notice */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          background: 'rgba(168,230,61,0.06)', border: '1px solid rgba(168,230,61,0.18)',
          borderRadius: '7px', padding: '10px 14px', marginBottom: '18px',
        }}>
          <Sparkles size={14} style={{ color: 'var(--green-400)', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Monitt completó este formulario automáticamente con base en los datos del activo y el historial de intervenciones.
            Revisa la información antes de enviar.
          </p>
        </div>

        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          Detalle de la solicitud
        </h2>
        <FormField label="Activo" value="GEN-002 — Bodega Sur, San Bernardo" />
        <FormField label="Tipo de trabajo" value="Inspección y mantención preventiva" />
        <FormField label="Descripción" multiline
          value="Revisar sistema de lubricación. Presión de aceite registra 2.6 bar (rango normal: 3.2–4.1). Posible desgaste de filtro o bomba de aceite." />
        <FormField label="Contexto adjunto" value="Historial de las últimas 3 intervenciones + datos de sensores 30 días" />
      </div>

      {/* Priority + notes */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          Configuración de la solicitud
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 8px' }}>Prioridad</p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['baja', 'normal', 'alta'].map(p => {
              const isSelected = priority === p
              const isAlta = p === 'alta'
              return (
                <button key={p} onClick={() => setPriority(p)} style={{
                  padding: '5px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                  border: isSelected
                    ? `1px solid ${isAlta ? '#EF4444' : 'var(--green-500)'}`
                    : '1px solid var(--border)',
                  background: isSelected
                    ? (isAlta ? 'rgba(239,68,68,0.1)' : 'rgba(48,191,18,0.1)')
                    : 'transparent',
                  color: isSelected
                    ? (isAlta ? '#EF4444' : 'var(--green-500)')
                    : 'var(--text-secondary)',
                  transition: 'all 150ms',
                }}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 6px' }}>Notas adicionales (opcional)</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Ej: el acceso al generador requiere llave de bodega sur..."
            rows={3}
            style={{
              width: '100%', padding: '8px 12px', borderRadius: '6px',
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.5,
              fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* What happens next */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: '10px', padding: '16px 20px', marginBottom: '20px',
      }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          ¿Qué pasa después?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { icon: CheckCircle, color: 'var(--green-400)', text: 'Monitt recibe tu solicitud con todo el contexto del activo' },
            { icon: CalendarCheck, color: 'var(--green-400)', text: 'Se asigna el técnico más adecuado según disponibilidad y especialidad' },
            { icon: Clock, color: 'var(--text-muted)', text: 'Recibirás confirmación con nombre del técnico y hora estimada de llegada' },
          ].map(({ icon: Icon, color, text }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Icon size={14} style={{ color, flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={() => navigate('tecnico-orden001')}
        style={{
          width: '100%', padding: '14px', borderRadius: '8px',
          background: 'var(--green-500)', border: 'none', color: '#fff',
          fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          marginBottom: '10px', transition: 'opacity 150ms',
        }}
      >
        Enviar solicitud de revisión →
      </button>
      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
        Monitt coordinará la visita técnica y te notificará por correo
      </p>

    </div>
  )
}
