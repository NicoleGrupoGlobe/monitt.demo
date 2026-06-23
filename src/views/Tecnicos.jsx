import { Wrench, MapPin, Phone, CheckCircle, Clock, Star, Plus, ChevronRight } from 'lucide-react'

const TECHNICIANS = [
  {
    id: 'TEC-001',
    name: 'Carlos Méndez',
    initials: 'CM',
    role: 'Técnico Senior',
    specialty: 'Motores diésel & sistemas de lubricación',
    phone: '+56 9 8234 5670',
    location: 'Santiago Centro',
    status: 'available',
    statusLabel: 'Disponible',
    activeOrders: 1,
    completedMonth: 8,
    rating: 4.9,
    certifications: ['Cummins Certified', 'Cat Certified'],
    currentOrder: 'ORD-001 — GEN-002 / Bodega Sur',
  },
  {
    id: 'TEC-002',
    name: 'Luis Torres',
    initials: 'LT',
    role: 'Técnico Especialista',
    specialty: 'Sistemas eléctricos & transferencia automática',
    phone: '+56 9 7612 3490',
    location: 'San Bernardo',
    status: 'on-site',
    statusLabel: 'En terreno',
    activeOrders: 2,
    completedMonth: 11,
    rating: 4.7,
    certifications: ['Kohler Certified', 'NFPA 110'],
    currentOrder: 'ORD-002 — Inspección GEN-003',
  },
  {
    id: 'TEC-003',
    name: 'Andrés Rojas',
    initials: 'AR',
    role: 'Técnico Junior',
    specialty: 'Mantenimiento preventivo & diagnóstico',
    phone: '+56 9 9045 8812',
    location: 'Quilicura',
    status: 'available',
    statusLabel: 'Disponible',
    activeOrders: 0,
    completedMonth: 5,
    rating: 4.5,
    certifications: ['Curso AVL DiTEST'],
    currentOrder: null,
  },
  {
    id: 'TEC-004',
    name: 'Sofía Paredes',
    initials: 'SP',
    role: 'Coordinadora de Servicio',
    specialty: 'Coordinación de órdenes & logística de repuestos',
    phone: '+56 9 6789 0123',
    location: 'Oficina central',
    status: 'available',
    statusLabel: 'En oficina',
    activeOrders: 0,
    completedMonth: 14,
    rating: 5.0,
    certifications: ['PMP', 'ISO 55001'],
    currentOrder: null,
  },
]

const STATUS_COLOR = {
  available: '#30BF12',
  'on-site': '#F59E0B',
  offline:   '#6B7280',
}

function TechCard({ tech, showToast }) {
  const color = STATUS_COLOR[tech.status] || '#6B7280'

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 700, color: 'var(--green-400)', flexShrink: 0,
          }}>
            {tech.initials}
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{tech.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{tech.role}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{
            display: 'inline-block', width: '7px', height: '7px',
            borderRadius: '50%', background: color, flexShrink: 0,
          }} />
          <span style={{ fontSize: '12px', color }}>{tech.statusLabel}</span>
        </div>
      </div>

      {/* Specialty */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
        <Wrench size={12} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tech.specialty}</span>
      </div>

      {/* Location & phone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tech.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tech.phone}</span>
        </div>
      </div>

      {/* Current order */}
      {tech.currentOrder && (
        <div style={{
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '6px', padding: '8px 10px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Clock size={12} style={{ color: '#F59E0B', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#F59E0B' }}>{tech.currentOrder}</span>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', lineHeight: 1 }}>{tech.activeOrders}</p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>Activas</p>
        </div>
        <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px', lineHeight: 1 }}>{tech.completedMonth}</p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>Este mes</p>
        </div>
        <div style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginBottom: '2px' }}>
            <Star size={11} style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{tech.rating}</span>
          </div>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>Rating</p>
        </div>
      </div>

      {/* Certifications */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {tech.certifications.map(cert => (
          <span key={cert} style={{
            fontSize: '11px', padding: '2px 8px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '4px', color: 'var(--text-secondary)',
          }}>{cert}</span>
        ))}
      </div>

      {/* Action */}
      <button
        onClick={() => showToast('Función no disponible en esta demo.')}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
          padding: '8px', color: 'var(--text-secondary)', fontSize: '12px',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Ver perfil completo <ChevronRight size={12} />
      </button>
    </div>
  )
}

export default function Tecnicos({ showToast }) {
  const available  = TECHNICIANS.filter(t => t.status === 'available').length
  const onSite     = TECHNICIANS.filter(t => t.status === 'on-site').length
  const totalOrders = TECHNICIANS.reduce((s, t) => s + t.activeOrders, 0)

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Técnicos</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Equipo de servicio y mantenimiento</p>
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
          <Plus size={14} /> Nuevo técnico
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total equipo',    value: TECHNICIANS.length, color: 'var(--text-primary)' },
          { label: 'Disponibles',     value: available,          color: '#30BF12' },
          { label: 'En terreno',      value: onSite,             color: '#F59E0B' },
          { label: 'Órdenes activas', value: totalOrders,        color: '#F59E0B' },
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {TECHNICIANS.map(tech => (
          <TechCard key={tech.id} tech={tech} showToast={showToast} />
        ))}
      </div>
    </div>
  )
}
