import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Building2, ShieldCheck, Cpu, AlertTriangle, Activity, Calendar, ChevronRight } from 'lucide-react'

const STATUS = {
  operativo: { label: 'Operativo', color: '#30BF12' },
  atencion:  { label: 'Atención',  color: '#F59E0B' },
  critico:   { label: 'Crítico',   color: '#EF4444' },
}

// Client sites (sedes). Bodega Norte = GEN-001; Bodega Sur = GEN-002 + GEN-003.
const SEDES = [
  {
    id: 'norte',
    name: 'Bodega Norte',
    address: 'Av. Américo Vespucio 1200, Quilicura',
    status: 'operativo',
    lat: -33.367, lng: -70.729,
    health: 91, equipos: 1, alertas: 0, uptime: '99.4%', inspection: '18 may 2026',
  },
  {
    id: 'sur',
    name: 'Bodega Sur',
    address: 'Camino Lo Blanco 2050, San Bernardo',
    status: 'critico',
    lat: -33.592, lng: -70.699,
    health: 58, equipos: 2, alertas: 1, uptime: '97.1%', inspection: '21 may 2026',
  },
]

const markerStyle = (sede, selected) => ({
  radius: selected ? 11 : 8,
  fillColor: STATUS[sede.status].color,
  color: '#fff',
  weight: selected ? 3 : 2,
  fillOpacity: 1,
})

function LegendChip({ status, count }) {
  const cfg = STATUS[status]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        {cfg.label}{count > 0 ? ` (${count})` : ''}
      </span>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <Icon size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <span style={{ fontSize: '14px', fontWeight: 700, color: valueColor || 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

export default function FleetMap({ navigate, theme }) {
  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const tileRef = useRef(null)
  const [selectedId, setSelectedId] = useState('sur')

  // Initialize the map once
  useEffect(() => {
    if (mapRef.current || !mapEl.current) return
    const map = L.map(mapEl.current, {
      center: [-33.47, -70.68],
      zoom: 10,
      scrollWheelZoom: false,
      attributionControl: true,
    })
    mapRef.current = map

    SEDES.forEach(sede => {
      const marker = L.circleMarker([sede.lat, sede.lng], markerStyle(sede, sede.id === 'sur'))
      marker.on('click', () => setSelectedId(sede.id))
      marker.addTo(map)
      markersRef.current[sede.id] = marker
    })

    const bounds = L.latLngBounds(SEDES.map(s => [s.lat, s.lng]))
    map.fitBounds(bounds, { padding: [70, 70] })
    setTimeout(() => map.invalidateSize(), 0)

    return () => { map.remove(); mapRef.current = null; markersRef.current = {}; tileRef.current = null }
  }, [])

  // Swap tile layer to match the theme (CARTO dark / light)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (tileRef.current) map.removeLayer(tileRef.current)
    const url = theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    tileRef.current = L.tileLayer(url, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)
    tileRef.current.bringToBack()
  }, [theme])

  // Reflect selection on the markers
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const sede = SEDES.find(s => s.id === id)
      marker.setStyle(markerStyle(sede, id === selectedId))
      marker.setRadius(id === selectedId ? 11 : 8)
    })
  }, [selectedId])

  const selected = SEDES.find(s => s.id === selectedId)
  const cfg = STATUS[selected.status]
  const counts = {
    operativo: SEDES.filter(s => s.status === 'operativo').length,
    atencion:  SEDES.filter(s => s.status === 'atencion').length,
    critico:   SEDES.filter(s => s.status === 'critico').length,
  }

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--card-glow)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '18px 22px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(48,191,18,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={17} style={{ color: 'var(--green-400)' }} />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>Ubicaciones de tus equipos</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{SEDES.length} sedes monitoreadas · click para ver KPIs</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LegendChip status="operativo" count={counts.operativo} />
          <LegendChip status="atencion"  count={counts.atencion} />
          <LegendChip status="critico"   count={counts.critico} />
        </div>
      </div>

      {/* Body: map + detail panel */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Map */}
        <div
          ref={mapEl}
          style={{ flex: '1 1 380px', minWidth: '300px', height: '400px', background: 'var(--bg-elevated)' }}
        />

        {/* Detail panel */}
        <div style={{ width: '340px', flex: '1 1 300px', padding: '22px', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content',
            fontSize: '12px', fontWeight: 600, color: cfg.color,
            background: `${cfg.color}1a`, border: `1px solid ${cfg.color}55`,
            padding: '4px 11px', borderRadius: '6px', marginBottom: '14px',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color }} />
            {cfg.label}
          </span>

          <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{selected.name}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 14px' }}>{selected.address}</p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <DetailRow icon={ShieldCheck}   label="Health score"      value={`${selected.health}%`} valueColor={cfg.color} />
            <DetailRow icon={Cpu}           label="Equipos"           value={selected.equipos} />
            <DetailRow icon={AlertTriangle} label="Alertas activas"   value={selected.alertas} valueColor={selected.alertas > 0 ? '#EF4444' : '#30BF12'} />
            <DetailRow icon={Activity}      label="Uptime"            value={selected.uptime} />
            <DetailRow icon={Calendar}      label="Última inspección" value={selected.inspection} />
          </div>

          <button
            onClick={() => navigate('activos')}
            style={{
              marginTop: '18px', width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px',
              padding: '11px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Ver equipos de la sede <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
