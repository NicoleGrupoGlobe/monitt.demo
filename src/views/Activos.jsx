import { useState } from 'react'
import { Cpu, MapPin, Activity, Wrench, ChevronRight, Plus, Calendar, Clock, CheckCircle } from 'lucide-react'
import Drawer from '../components/Drawer'

function StatusDot({ status }) {
  const colors = { online: '#30BF12', warning: '#F59E0B', critical: '#EF4444', offline: '#6B7280' }
  return (
    <span style={{
      display: 'inline-block', width: '8px', height: '8px',
      borderRadius: '50%', background: colors[status] || colors.offline,
    }} />
  )
}

function HealthBar({ score, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '72px', height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
        <div className="health-bar" style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '2px' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color }}>{score}</span>
    </div>
  )
}

const ASSETS = [
  {
    id: 'GEN-001',
    name: 'Generador Diésel 500 kVA',
    location: 'Bodega Norte',
    sublocation: 'Quilicura',
    status: 'online',
    statusLabel: 'Operativo',
    score: 91,
    scoreColor: '#30BF12',
    brand: 'Cummins',
    model: 'C500D5',
    lastMaint: '18 may 2026',
    nextMaint: '15 jun 2026',
    hours: '4 280 h',
  },
  {
    id: 'GEN-002',
    name: 'Generador Diésel 350 kVA',
    location: 'Bodega Sur',
    sublocation: 'San Bernardo',
    status: 'warning',
    statusLabel: 'Atención requerida',
    score: 58,
    scoreColor: '#F59E0B',
    brand: 'Caterpillar',
    model: 'DE350E0',
    lastMaint: '02 may 2026',
    nextMaint: 'Pendiente',
    hours: '6 741 h',
  },
  {
    id: 'GEN-003',
    name: 'Generador Diésel 500 kVA',
    location: 'Bodega Sur',
    sublocation: 'San Bernardo',
    status: 'online',
    statusLabel: 'Operativo',
    score: 87,
    scoreColor: '#30BF12',
    brand: 'Cummins',
    model: 'C500D5',
    lastMaint: '15 may 2026',
    nextMaint: '29 jun 2026',
    hours: '3 105 h',
  },
]

function AssetCard({ asset, navigate }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderLeft: asset.status === 'warning' ? '3px solid #F59E0B' : '1px solid var(--border)',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Cpu size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{asset.id}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{asset.name}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StatusDot status={asset.status} />
          <span style={{ fontSize: '12px', color: asset.status === 'warning' ? '#F59E0B' : '#30BF12' }}>{asset.statusLabel}</span>
        </div>
      </div>

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{asset.location} — {asset.sublocation}</span>
      </div>

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { label: 'Marca / Modelo', value: `${asset.brand} ${asset.model}` },
          { label: 'Horas de uso', value: asset.hours },
          { label: 'Última mantención', value: asset.lastMaint },
          { label: 'Próxima mantención', value: asset.nextMaint, warn: asset.nextMaint === 'Pendiente' },
        ].map(({ label, value, warn }) => (
          <div key={label}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
            <p style={{ fontSize: '13px', fontWeight: 500, color: warn ? '#F59E0B' : 'var(--text-secondary)', margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Health score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Health score</p>
          <HealthBar score={asset.score} color={asset.scoreColor} />
        </div>
        <button
          onClick={() => navigate(`activo-${asset.id.toLowerCase().replace('-', '')}`)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
            padding: '6px 12px', color: 'var(--text-secondary)', fontSize: '12px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Ver detalle <ChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
      <span style={{ fontSize: '28px', fontWeight: 700, color: color || 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
    </div>
  )
}

const SEDES = [
  { label: 'Bodega Norte', address: 'Av. Américo Vespucio 1200, Quilicura' },
  { label: 'Bodega Sur',   address: 'Camino Lo Blanco 2050, San Bernardo' },
]
const TIPOS = ['Generador Diésel', 'Grupo electrógeno', 'UPS / equipo de respaldo', 'Otro equipo']
const SLOTS = ['Mañana · 09:00–13:00', 'Tarde · 14:00–18:00', 'Horario flexible']

const fieldLabel = { fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '7px' }
const inputStyle = {
  width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
  borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--text-primary)',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '7px 12px', borderRadius: '7px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px',
        fontWeight: 500,
        border: `1px solid ${active ? 'var(--green-500)' : 'var(--border)'}`,
        background: active ? 'rgba(48,191,18,0.1)' : 'var(--bg-elevated)',
        color: active ? 'var(--green-500)' : 'var(--text-secondary)',
        transition: 'all 150ms',
      }}
    >
      {children}
    </button>
  )
}

function RequestVisitModal({ onClose }) {
  const [tipo, setTipo] = useState('')
  const [direccion, setDireccion] = useState('')
  const [dia, setDia] = useState('')
  const [slot, setSlot] = useState('')
  const [notas, setNotas] = useState('')
  const [sent, setSent] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const canSubmit = tipo && direccion.trim() && dia && slot
  const diaFmt = dia ? dia.split('-').reverse().join('-') : ''

  return (
    <Drawer title="Solicitar agregar activo" onClose={onClose} width={520}>
        {sent ? (
          /* ── Success ── */
          <div style={{ paddingTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(48,191,18,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={20} style={{ color: 'var(--green-500)' }} />
              </div>
              <div>
                <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>Solicitud de visita enviada</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Monitt coordinará la visita para agregar el equipo</p>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.6 }}>
              Un técnico asistirá presencialmente a instalar y registrar el nuevo activo. Te confirmaremos el técnico asignado y la hora exacta por correo.
            </p>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
              {[
                ['Equipo', tipo],
                ['Día preferido', diaFmt],
                ['Bloque horario', slot],
                ['Dirección', direccion],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '5px 0' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              style={{ width: '100%', padding: '11px', background: 'var(--green-500)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Listo
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Agregar un equipo requiere una visita presencial. Indícanos cuándo puedes recibir al técnico y dónde, y coordinaremos la visita.
            </p>

            {/* Tipo */}
            <div style={{ marginBottom: '16px' }}>
              <label style={fieldLabel}>Equipo a agregar</label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Selecciona el tipo de equipo…</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Dirección */}
            <div style={{ marginBottom: '16px' }}>
              <label style={fieldLabel}>Dirección del lugar</label>
              <input
                type="text" value={direccion} onChange={e => setDireccion(e.target.value)}
                placeholder="Calle, número, comuna…"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--green-500)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                {SEDES.map(s => (
                  <Chip key={s.label} active={direccion === s.address} onClick={() => setDireccion(s.address)}>
                    {s.label}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Día */}
            <div style={{ marginBottom: '16px' }}>
              <label style={fieldLabel}><Calendar size={12} style={{ verticalAlign: '-1px', marginRight: '5px', color: 'var(--text-muted)' }} />Día preferido</label>
              <input
                type="date" value={dia} min={today} onChange={e => setDia(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>

            {/* Bloque horario */}
            <div style={{ marginBottom: '16px' }}>
              <label style={fieldLabel}><Clock size={12} style={{ verticalAlign: '-1px', marginRight: '5px', color: 'var(--text-muted)' }} />Disponibilidad de horario</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {SLOTS.map(s => (
                  <Chip key={s} active={slot === s} onClick={() => setSlot(s)}>{s}</Chip>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div style={{ marginBottom: '22px' }}>
              <label style={fieldLabel}>Comentarios <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opcional)</span></label>
              <textarea
                value={notas} onChange={e => setNotas(e.target.value)}
                placeholder="Detalles de acceso, contacto en terreno, etc."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
                onFocus={e => e.target.style.borderColor = 'var(--green-500)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button
              onClick={() => canSubmit && setSent(true)}
              disabled={!canSubmit}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                fontFamily: 'inherit', transition: 'all 150ms',
                ...(canSubmit
                  ? { background: 'var(--green-500)', border: 'none', color: '#fff', cursor: 'pointer' }
                  : { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'not-allowed' }),
              }}
            >
              Enviar solicitud de visita
            </button>
          </>
        )}
    </Drawer>
  )
}

export default function Activos({ showToast, navigate }) {
  const [showRequest, setShowRequest] = useState(false)
  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Activos</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Inventario de equipos monitoreados — TransAndina Logística
          </p>
        </div>
        <button
          onClick={() => setShowRequest(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--green-500)', border: 'none', borderRadius: '7px',
            padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Plus size={14} /> Solicitar agregar activo
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <StatPill label="Total activos"      value="3"          color="var(--text-primary)" />
        <StatPill label="Operativos"         value="2"          color="#30BF12" />
        <StatPill label="Con alertas"        value="1"          color="#F59E0B" />
        <StatPill label="Score promedio"     value="79/100"     color="#F59E0B" />
      </div>

      {/* Asset grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {ASSETS.map(asset => (
          <AssetCard key={asset.id} asset={asset} navigate={navigate} />
        ))}
      </div>

      {/* Footer hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
        <Activity size={12} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Datos actualizados en tiempo real · Última sincronización: hace 2 min
        </span>
      </div>

      {showRequest && <RequestVisitModal onClose={() => setShowRequest(false)} />}
    </div>
  )
}
