import { useState } from 'react'
import { Cpu, AlertTriangle, MapPin, Inbox, ChevronRight, UserRound } from 'lucide-react'
import { EMPRESAS, SOLICITUDES, PRIORITY_CONFIG } from '../../data/adminData'
import Drawer from '../../components/Drawer'

const STATUS = {
  operativo: { label: 'Operativo', color: '#30BF12' },
  atencion:  { label: 'Atención',  color: '#F59E0B' },
  critico:   { label: 'Crítico',   color: '#EF4444' },
}

// Dummy equipment portfolio per client company (asset ids align with the
// service requests in adminData so both views stay consistent).
const PORTFOLIOS = {
  'EMP-001': {
    uptime: '98.6%',
    equipos: [
      { id: 'GEN-001', model: 'Cummins C500D5',      location: 'Bodega Norte — Quilicura',   health: 91, status: 'operativo' },
      { id: 'GEN-002', model: 'Caterpillar DE350E0', location: 'Bodega Sur — San Bernardo',   health: 58, status: 'atencion' },
      { id: 'GEN-003', model: 'Cummins C500D5',      location: 'Bodega Sur — San Bernardo',   health: 87, status: 'operativo' },
    ],
  },
  'EMP-005': {
    uptime: '97.9%',
    equipos: [
      { id: 'GEN-007', model: 'Kohler 150REOZJ',     location: 'Sala de máquinas — Lo Barnechea',   health: 67, status: 'atencion' },
      { id: 'GEN-008', model: 'FG Wilson P110',      location: 'Estacionamiento -1 — Lo Barnechea',  health: 88, status: 'operativo' },
    ],
  },
  'EMP-006': {
    uptime: '96.4%',
    equipos: [
      { id: 'GEN-021', model: 'Caterpillar DE250E0', location: 'Edificio Cousiño — Vitacura', health: 52, status: 'critico' },
      { id: 'GEN-022', model: 'Cummins C275D5',      location: 'Data center — Vitacura',      health: 90, status: 'operativo' },
      { id: 'GEN-023', model: 'Kohler 200REOZJB',    location: 'Respaldo — Vitacura',         health: 84, status: 'operativo' },
    ],
  },
  'EMP-007': {
    uptime: '99.1%',
    equipos: [
      { id: 'GEN-014', model: 'Cummins C800D5',      location: 'Centro de distribución — Las Condes', health: 63, status: 'atencion' },
      { id: 'GEN-015', model: 'SDMO D700',           location: 'Centro de distribución — Las Condes', health: 92, status: 'operativo' },
      { id: 'GEN-016', model: 'Caterpillar DE550E0', location: 'Bodega refrigerada — Pudahuel',        health: 89, status: 'operativo' },
      { id: 'GEN-017', model: 'Cummins C500D5',      location: 'Oficina central — Las Condes',         health: 95, status: 'operativo' },
    ],
  },
  'EMP-008': {
    uptime: '99.5%',
    equipos: [
      { id: 'GEN-030', model: 'Kohler 150REOZJ',     location: 'Subterráneo -2 — Providencia', health: 93, status: 'operativo' },
      { id: 'GEN-031', model: 'FG Wilson P150',      location: 'Azotea — Providencia',         health: 90, status: 'operativo' },
    ],
  },
}

function EmpresaCard({ emp, solicitudesCount, onOpen }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderLeft: `3px solid ${emp.accent}`,
      borderRadius: '10px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '9px', flexShrink: 0,
            background: `${emp.accent}1f`, color: emp.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700,
          }}>
            {emp.initials}
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{emp.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{emp.rut} · Cliente desde {emp.since}</p>
          </div>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: '5px',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
        }}>
          {emp.plan}
        </span>
      </div>

      {/* Contact + address */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <UserRound size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Persona a cargo: </span>{emp.contact}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{emp.address}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: '7px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            <Cpu size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Activos</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{emp.assets}</p>
        </div>
        <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: '7px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            <AlertTriangle size={12} style={{ color: emp.activeAlerts > 0 ? '#EF4444' : 'var(--text-muted)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Alertas</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: emp.activeAlerts > 0 ? '#EF4444' : '#30BF12', margin: 0, lineHeight: 1 }}>{emp.activeAlerts}</p>
        </div>
        <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: '7px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            <Inbox size={12} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Solicitudes</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{solicitudesCount}</p>
        </div>
      </div>

      <button
        onClick={() => onOpen(emp)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
          padding: '8px', color: 'var(--text-secondary)', fontSize: '12px',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Ver portafolio del cliente <ChevronRight size={12} />
      </button>
    </div>
  )
}

function healthColor(h) {
  if (h >= 80) return '#30BF12'
  if (h >= 65) return '#F59E0B'
  return '#EF4444'
}

function KpiBox({ label, value, color }) {
  return (
    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: '8px', textAlign: 'center' }}>
      <p style={{ fontSize: '19px', fontWeight: 700, color: color || 'var(--text-primary)', margin: '0 0 3px', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</p>
    </div>
  )
}

function PortfolioModal({ emp, solicitudes, onClose }) {
  const pf = PORTFOLIOS[emp.id] || { uptime: '—', equipos: [] }
  const equipos = pf.equipos
  const healthAvg = equipos.length ? Math.round(equipos.reduce((s, e) => s + e.health, 0) / equipos.length) : 0
  const overall = equipos.some(e => e.status === 'critico') ? 'critico'
    : equipos.some(e => e.status === 'atencion') ? 'atencion' : 'operativo'
  const ov = STATUS[overall]
  const sols = solicitudes.filter(s => s.company === emp.id)

  return (
    <Drawer title="Portafolio del cliente" onClose={onClose} width={600}>
        {/* Header */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '11px', flexShrink: 0,
            background: `${emp.accent}1f`, color: emp.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700,
          }}>
            {emp.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px', letterSpacing: '-0.4px' }}>{emp.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{emp.rut} · {emp.plan} · desde {emp.since}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: ov.color, background: `${ov.color}1a`, border: `1px solid ${ov.color}55`, padding: '2px 9px', borderRadius: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ov.color }} />
                {ov.label}
              </span>
            </div>
          </div>
        </div>

        {/* Contact + address */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserRound size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--text-muted)' }}>Persona a cargo: </span>{emp.contact}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <MapPin size={13} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{emp.address}</span>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '22px' }}>
          <KpiBox label="Activos"     value={emp.assets} />
          <KpiBox label="Alertas"     value={emp.activeAlerts} color={emp.activeAlerts > 0 ? '#EF4444' : '#30BF12'} />
          <KpiBox label="Health prom" value={`${healthAvg}%`} color={healthColor(healthAvg)} />
          <KpiBox label="Uptime"      value={pf.uptime} />
          <KpiBox label="Solicitudes" value={sols.length} />
        </div>

        {/* Equipos */}
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 10px' }}>
          Equipos monitoreados ({equipos.length})
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
          {equipos.map(eq => {
            const s = STATUS[eq.status]
            return (
              <div key={eq.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 12px', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Cpu size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 1px' }}>{eq.id} · <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{eq.model}</span></p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eq.location}</p>
                </div>
                <div style={{ width: '90px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Health</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: healthColor(eq.health) }}>{eq.health}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--bg-surface)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${eq.health}%`, background: healthColor(eq.health), borderRadius: '2px' }} />
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: s.color, flexShrink: 0, width: '78px', justifyContent: 'flex-end' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Solicitudes */}
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 10px' }}>
          Solicitudes de servicio ({sols.length})
        </p>
        {sols.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
            Sin solicitudes registradas.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {sols.map((sol, i) => {
              const prio = PRIORITY_CONFIG[sol.priority]
              return (
                <div key={sol.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: i < sols.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '0 0 2px' }}>{sol.reason}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{sol.id} · {sol.asset} · {sol.createdAt}</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: prio.color, background: prio.bg, padding: '3px 9px', borderRadius: '5px', flexShrink: 0 }}>{prio.label}</span>
                </div>
              )
            })}
          </div>
        )}
    </Drawer>
  )
}

export default function Empresas({ showToast }) {
  const [selectedEmp, setSelectedEmp] = useState(null)
  const totalAssets = EMPRESAS.reduce((s, e) => s + e.assets, 0)
  const totalAlerts = EMPRESAS.reduce((s, e) => s + e.activeAlerts, 0)
  const solicitudesCount = (empId) => SOLICITUDES.filter(s => s.company === empId).length

  return (
    <div style={{ padding: '32px', maxWidth: '1180px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Empresas cliente</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Portafolio de clientes de Monitt.io y sus activos monitoreados
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Empresas',           value: EMPRESAS.length, color: 'var(--text-primary)' },
          { label: 'Activos totales',    value: totalAssets, color: 'var(--text-primary)' },
          { label: 'Alertas activas',    value: totalAlerts, color: totalAlerts > 0 ? '#F59E0B' : '#30BF12' },
          { label: 'Planes Enterprise',  value: EMPRESAS.filter(e => e.plan === 'Enterprise').length, color: '#30BF12' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: '10px', padding: '16px 20px',
          }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {EMPRESAS.map(emp => (
          <EmpresaCard key={emp.id} emp={emp} solicitudesCount={solicitudesCount(emp.id)} onOpen={setSelectedEmp} />
        ))}
      </div>

      {selectedEmp && <PortfolioModal emp={selectedEmp} solicitudes={SOLICITUDES} onClose={() => setSelectedEmp(null)} />}
    </div>
  )
}
