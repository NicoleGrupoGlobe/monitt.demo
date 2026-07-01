import { useState } from 'react'
import { Wrench, MapPin, Phone, Star, Briefcase, ChevronRight, Mail, Clock, Award, CheckCircle, Calendar, TrendingUp } from 'lucide-react'
import { TECNICOS, PROVEEDORES, TEC_STATUS, proveedorById } from '../../data/adminData'
import Drawer from '../../components/Drawer'

// Extended (dummy) profile data per technician — powers the full-profile modal.
const PROFILES = {
  'TEC-001': {
    email: 'lponce@genservice.cl', since: 2019, total: 512, onTime: '98%', response: '1.8 h',
    history: [
      { date: '25 may 2026', action: 'Diagnóstico de sistema de lubricación', ref: 'TransAndina · GEN-002' },
      { date: '12 may 2026', action: 'Mantención preventiva 500 h',           ref: 'TransAndina · GEN-001' },
      { date: '28 abr 2026', action: 'Cambio de inyectores',                   ref: 'A&R Freight · GEN-014' },
    ],
  },
  'TEC-002': {
    email: 'cmendez@tecnodiesel.cl', since: 2020, total: 421, onTime: '96%', response: '2.1 h',
    history: [
      { date: '20 may 2026', action: 'Revisión de tablero de transferencia', ref: 'Inversiones Trece · GEN-021' },
      { date: '06 may 2026', action: 'Prueba de generación bajo carga',       ref: 'TransAndina · GEN-003' },
      { date: '22 abr 2026', action: 'Reemplazo de batería de arranque',      ref: 'Plaza Condell · GEN-030' },
    ],
  },
  'TEC-003': {
    email: 'sparedes@genservice.cl', since: 2017, total: 684, onTime: '99%', response: '1.5 h',
    history: [
      { date: '24 may 2026', action: 'Inspección de alta carga',       ref: 'A&R Freight · GEN-014' },
      { date: '15 may 2026', action: 'Cambio de filtros y aceite',     ref: 'A&R Freight · GEN-015' },
      { date: '02 may 2026', action: 'Puesta en marcha de respaldo',   ref: 'Jardín del Roble · GEN-041' },
    ],
  },
  'TEC-004': {
    email: 'mdiaz@andespower.cl', since: 2018, total: 559, onTime: '97%', response: '1.9 h',
    history: [
      { date: '24 may 2026', action: 'Intervención por desgaste (en curso)',  ref: 'Inversiones Trece · GEN-021' },
      { date: '10 may 2026', action: 'Mantención de respaldo crítico',        ref: 'Inversiones Trece · GEN-022' },
      { date: '25 abr 2026', action: 'Prueba de transferencia automática',    ref: 'Plaza Condell · GEN-031' },
    ],
  },
  'TEC-005': {
    email: 'arojas@tecnodiesel.cl', since: 2022, total: 214, onTime: '94%', response: '2.6 h',
    history: [
      { date: '24 may 2026', action: 'Mantención preventiva recomendada por IA', ref: 'Jardín del Roble · GEN-007' },
      { date: '09 may 2026', action: 'Diagnóstico general',                      ref: 'Plaza Condell · GEN-030' },
      { date: '18 abr 2026', action: 'Cambio de filtros',                        ref: 'A&R Freight · GEN-016' },
    ],
  },
  'TEC-006': {
    email: 'vsoto@andespower.cl', since: 2021, total: 298, onTime: '96%', response: '2.2 h',
    history: [
      { date: '19 may 2026', action: 'Calibración de telemetría',      ref: 'Inversiones Trece · GEN-021' },
      { date: '03 may 2026', action: 'Actualización de controlador',   ref: 'TransAndina · GEN-001' },
      { date: '20 abr 2026', action: 'Configuración de monitoreo',     ref: 'Plaza Condell · GEN-031' },
    ],
  },
  'TEC-007': {
    email: 'psalas@genservice.cl', since: 2023, total: 158, onTime: '93%', response: '2.9 h',
    history: [
      { date: '14 may 2026', action: 'Cambio de refrigerante',   ref: 'A&R Freight · GEN-015' },
      { date: '30 abr 2026', action: 'Limpieza de filtros',      ref: 'Jardín del Roble · GEN-041' },
      { date: '12 abr 2026', action: 'Reposición de combustible', ref: 'TransAndina · GEN-003' },
    ],
  },
}

function TechCard({ tech, onOpenProfile }) {
  const st = TEC_STATUS[tech.status]
  const prov = proveedorById(tech.provider)

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '14px',
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
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: st.color, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: st.color }}>{st.label}</span>
        </div>
      </div>

      {/* Provider badge — outsourced third-party firm the technician belongs to */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        background: `${prov.accent}14`,
        border: `1px solid ${prov.accent}40`,
        borderRadius: '7px', padding: '7px 10px',
      }}>
        <Briefcase size={13} style={{ color: prov.accent, flexShrink: 0 }} />
        <span style={{ fontSize: '12px', fontWeight: 500, color: prov.accent }}>
          Proveedor · {prov.name}
        </span>
      </div>

      {/* Specialty */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
        <Wrench size={12} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tech.specialty}</span>
      </div>

      {/* Zone & phone */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tech.zone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tech.phone}</span>
        </div>
      </div>

      {/* Stats */}
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
        {tech.certs.map(cert => (
          <span key={cert} style={{
            fontSize: '11px', padding: '2px 8px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '4px', color: 'var(--text-secondary)',
          }}>{cert}</span>
        ))}
      </div>

      <button
        onClick={() => onOpenProfile(tech)}
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

function ProfileStat({ icon: Icon, label, value, accent }) {
  return (
    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
        <Icon size={12} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</span>
      </div>
      <p style={{ fontSize: '19px', fontWeight: 700, color: accent || 'var(--text-primary)', margin: 0, lineHeight: 1 }}>{value}</p>
    </div>
  )
}

function ContactRow({ icon: Icon, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{value}</span>
    </div>
  )
}

function TechProfileModal({ tech, onClose }) {
  const st = TEC_STATUS[tech.status]
  const prov = proveedorById(tech.provider)
  const p = PROFILES[tech.id] || {}

  return (
    <Drawer title="Perfil del técnico" onClose={onClose} width={520}>
        {/* Header */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: 700, color: 'var(--green-400)', flexShrink: 0,
          }}>
            {tech.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 3px', letterSpacing: '-0.4px' }}>{tech.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{tech.role}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: st.color }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: st.color }} />
                {st.label}
              </span>
            </div>
          </div>
        </div>

        {/* Provider + tenure */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
          background: `${prov.accent}14`, border: `1px solid ${prov.accent}40`,
          borderRadius: '8px', padding: '10px 12px', marginBottom: '18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={14} style={{ color: prov.accent, flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: 500, color: prov.accent }}>Proveedor · {prov.name}</span>
          </div>
          {p.since && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contratado desde {p.since}</span>}
        </div>

        {/* Contact */}
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 10px' }}>Contacto</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
          {p.email && <ContactRow icon={Mail} value={p.email} />}
          <ContactRow icon={Phone} value={tech.phone} />
          <ContactRow icon={MapPin} value={tech.zone} />
        </div>

        {/* Performance stats */}
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 10px' }}>Desempeño</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
          <ProfileStat icon={Star}        label="Rating"        value={tech.rating}         accent="#F59E0B" />
          <ProfileStat icon={Wrench}      label="Activas"       value={tech.activeOrders} />
          <ProfileStat icon={Calendar}    label="Este mes"      value={tech.completedMonth} />
          <ProfileStat icon={CheckCircle} label="Total"         value={p.total ?? '—'} />
          <ProfileStat icon={TrendingUp}  label="Cumplimiento"  value={p.onTime ?? '—'}   accent="#30BF12" />
          <ProfileStat icon={Clock}       label="Resp. prom."   value={p.response ?? '—'} />
        </div>

        {/* Specialty */}
        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 8px' }}>Especialidad</p>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', marginBottom: '18px' }}>
          <Wrench size={13} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tech.specialty}</span>
        </div>

        {/* Certifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px' }}>
          <Award size={13} style={{ color: 'var(--text-muted)' }} />
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', margin: 0 }}>Certificaciones</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {tech.certs.map(cert => (
            <span key={cert} style={{
              fontSize: '12px', padding: '4px 10px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '5px', color: 'var(--text-secondary)',
            }}>{cert}</span>
          ))}
        </div>

        {/* Work history */}
        {p.history && (
          <>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 10px' }}>Historial reciente</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {p.history.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < p.history.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-500)', flexShrink: 0, marginTop: '6px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: '0 0 2px' }}>{h.action}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{h.ref}</p>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>{h.date}</span>
                </div>
              ))}
            </div>
          </>
        )}
    </Drawer>
  )
}

export default function TecnicosAdmin({ showToast }) {
  const [providerFilter, setProviderFilter] = useState('all')
  const [profileTech, setProfileTech] = useState(null)

  const filtered = TECNICOS.filter(t => providerFilter === 'all' || t.provider === providerFilter)

  const available = TECNICOS.filter(t => t.status === 'available').length
  const onSite    = TECNICOS.filter(t => t.status === 'on-site').length

  const tab = (id, label) => (
    <button
      key={id}
      onClick={() => setProviderFilter(id)}
      style={{
        padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
        fontSize: '13px', fontFamily: 'inherit', fontWeight: 500,
        background: providerFilter === id ? 'var(--bg-elevated)' : 'transparent',
        color: providerFilter === id ? 'var(--text-primary)' : 'var(--text-muted)',
        transition: 'all 150ms',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ padding: '32px', maxWidth: '1180px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Técnicos</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Servicio técnico tercerizado — proveedores externos coordinados por Monitt
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total técnicos', value: TECNICOS.length, color: 'var(--text-primary)' },
          { label: 'Disponibles',    value: available, color: '#30BF12' },
          { label: 'En terreno',     value: onSite, color: '#F59E0B' },
          { label: 'Proveedores',    value: PROVEEDORES.length, color: '#0EA5E9' },
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

      {/* Provider filter */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 12px' }}>
        {tab('all', 'Todos')}
        {PROVEEDORES.map(p => tab(p.id, p.short))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map(tech => (
          <TechCard key={tech.id} tech={tech} onOpenProfile={setProfileTech} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
          No hay técnicos en esta categoría.
        </div>
      )}

      {profileTech && <TechProfileModal tech={profileTech} onClose={() => setProfileTech(null)} />}
    </div>
  )
}
