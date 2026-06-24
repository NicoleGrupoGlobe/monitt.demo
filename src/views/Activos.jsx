import { Cpu, MapPin, Activity, Wrench, ChevronRight, Plus } from 'lucide-react'

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

export default function Activos({ showToast, navigate }) {
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
          onClick={() => showToast('Función no disponible en esta demo.')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--green-500)', border: 'none', borderRadius: '7px',
            padding: '8px 16px', color: '#fff', fontSize: '13px', fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Plus size={14} /> Agregar activo
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
    </div>
  )
}
