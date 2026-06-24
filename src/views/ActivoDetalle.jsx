import { useState, useEffect } from 'react'
import { ArrowLeft, Cpu, MapPin, Thermometer, Zap, Droplets, Clock, CheckCircle, AlertTriangle, Sparkles, RotateCcw } from 'lucide-react'

const ASSET_DATA = {
  'GEN-001': {
    id: 'GEN-001',
    name: 'Generador Diésel 500 kVA',
    location: 'Bodega Norte — Quilicura',
    brand: 'Cummins', model: 'C500D5',
    hours: '4 280 h', year: '2019',
    lastMaint: '18 may 2026', nextMaint: '15 jun 2026',
    score: 91, scoreColor: '#A8E63D',
    status: 'online', statusLabel: 'Operativo',
    sensors: [
      { label: 'Presión de aceite', value: '3.8 bar', normal: true, range: '3.2 – 4.1 bar', icon: Droplets },
      { label: 'Temperatura motor', value: '82 °C',  normal: true, range: '75 – 95 °C',   icon: Thermometer },
      { label: 'Voltaje salida',    value: '230 V',   normal: true, range: '220 – 240 V',  icon: Zap },
      { label: 'Horas ciclo',       value: '312 h',   normal: true, range: '< 500 h',      icon: Clock },
    ],
    diagnosis: {
      score: 91,
      status: 'healthy',
      title: 'Sin anomalías detectadas',
      summary: 'Todos los parámetros operan dentro del rango nominal. El sistema muestra un comportamiento consistente con los últimos 90 días.',
      findings: [
        { type: 'ok', text: 'Presión de aceite estable — sin tendencia descendente' },
        { type: 'ok', text: 'Temperatura de motor dentro del rango óptimo' },
        { type: 'ok', text: 'Voltaje de salida nominal — sin fluctuaciones detectadas' },
      ],
      recommendation: 'Próxima mantención preventiva programada en 27 días (15 jun 2026). No se requiere acción inmediata.',
      confidence: '96%',
    },
  },
  'GEN-003': {
    id: 'GEN-003',
    name: 'Generador Diésel 500 kVA',
    location: 'Bodega Sur — San Bernardo',
    brand: 'Cummins', model: 'C500D5',
    hours: '3 105 h', year: '2021',
    lastMaint: '15 may 2026', nextMaint: '29 jun 2026',
    score: 87, scoreColor: '#A8E63D',
    status: 'online', statusLabel: 'Operativo',
    sensors: [
      { label: 'Presión de aceite', value: '3.9 bar', normal: true,  range: '3.2 – 4.1 bar', icon: Droplets },
      { label: 'Temperatura motor', value: '91 °C',   normal: true,  range: '75 – 95 °C',   icon: Thermometer },
      { label: 'Voltaje salida',    value: '229 V',   normal: true,  range: '220 – 240 V',  icon: Zap },
      { label: 'Horas ciclo',       value: '187 h',   normal: true,  range: '< 500 h',      icon: Clock },
    ],
    diagnosis: {
      score: 87,
      status: 'monitor',
      title: 'Operativo — monitoreo recomendado',
      summary: 'El sistema opera correctamente. Se detectó una tendencia leve en temperatura de motor que conviene monitorear en las próximas semanas.',
      findings: [
        { type: 'ok',   text: 'Presión de aceite y voltaje dentro del rango normal' },
        { type: 'warn', text: 'Temperatura motor: 91 °C — en límite superior del rango (95 °C max)' },
        { type: 'ok',   text: 'Sin patrones de desgaste acelerado en los últimos 30 días' },
      ],
      recommendation: 'Revisar sistema de refrigeración en la próxima mantención (29 jun 2026). No requiere intervención inmediata.',
      confidence: '91%',
    },
  },
}

const LOADING_STEPS = [
  'Leyendo sensores en tiempo real...',
  'Comparando con 12 483 patrones históricos...',
  'Evaluando tendencias de los últimos 30 días...',
  'Generando diagnóstico...',
]

function SensorCard({ sensor }) {
  const Icon = sensor.icon
  return (
    <div style={{
      background: 'var(--bg-elevated)', borderRadius: '8px', padding: '12px 14px',
      border: `1px solid ${sensor.normal ? 'var(--border)' : 'rgba(245,158,11,0.3)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <Icon size={13} style={{ color: sensor.normal ? 'var(--text-muted)' : '#F59E0B' }} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          {sensor.label}
        </span>
      </div>
      <p style={{ fontSize: '20px', fontWeight: 700, color: sensor.normal ? 'var(--text-primary)' : '#F59E0B', margin: '0 0 2px', lineHeight: 1 }}>
        {sensor.value}
      </p>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Rango: {sensor.range}</p>
    </div>
  )
}

export default function ActivoDetalle({ navigate, assetId }) {
  const asset = ASSET_DATA[assetId]
  const [diagState, setDiagState] = useState('idle') // idle | loading | done
  const [loadingStep, setLoadingStep] = useState(0)

  const requestDiagnosis = () => {
    setDiagState('loading')
    setLoadingStep(0)
    LOADING_STEPS.forEach((_, i) => {
      setTimeout(() => setLoadingStep(i), i * 700)
    })
    setTimeout(() => setDiagState('done'), LOADING_STEPS.length * 700 + 300)
  }

  if (!asset) return null

  const diag = asset.diagnosis
  const isHealthy = diag.status === 'healthy'

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <button onClick={() => navigate('activos')} style={{
        display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none',
        color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', padding: 0,
        marginBottom: '24px', fontFamily: 'inherit',
      }}>
        <ArrowLeft size={14} /> Volver a Activos
      </button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Cpu size={20} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
                {asset.id}
              </h1>
              <span style={{
                fontSize: '11px', fontWeight: 600, color: '#A8E63D',
                background: 'rgba(168,230,61,0.1)', border: '1px solid rgba(168,230,61,0.2)',
                borderRadius: '4px', padding: '1px 7px',
              }}>
                {asset.statusLabel}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {asset.name} · {asset.brand} {asset.model}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{asset.location}</span>
        </div>
      </div>

      {/* Body: left | right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Specs */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 14px' }}>
              Ficha técnica
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                ['Marca / Modelo', `${asset.brand} ${asset.model}`],
                ['Año de instalación', asset.year],
                ['Horas de uso', asset.hours],
                ['Última mantención', asset.lastMaint],
                ['Próxima mantención', asset.nextMaint],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{k}</p>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{v}</p>
                </div>
              ))}
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Health score</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '5px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div className="health-bar" style={{ height: '100%', width: `${asset.score}%`, background: asset.scoreColor, borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: asset.scoreColor }}>{asset.score}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live sensors */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                Sensores en tiempo real
              </p>
              <span style={{
                fontSize: '10px', color: '#A8E63D', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A8E63D', display: 'inline-block' }} />
                En vivo
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {asset.sensors.map(s => <SensorCard key={s.label} sensor={s} />)}
            </div>
          </div>

        </div>

        {/* RIGHT — AI Diagnosis */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '12px', overflow: 'hidden', position: 'sticky', top: '20px',
        }}>
          {/* Card header */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(168,230,61,0.06) 0%, transparent 100%)',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Sparkles size={15} style={{ color: 'var(--green-400)' }} />
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Diagnóstico IA</p>
          </div>

          <div style={{ padding: '20px' }}>

            {/* IDLE */}
            {diagState === 'idle' && (
              <>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.6 }}>
                  Monitt analiza los datos del hardware en tiempo real para detectar anomalías, tendencias de desgaste y riesgos antes de que ocurran.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {[
                    'Lectura de sensores en tiempo real',
                    'Análisis de 12 483 patrones históricos',
                    'Detección de tendencias y desgaste',
                  ].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green-400)', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={requestDiagnosis}
                  style={{
                    width: '100%', padding: '11px', borderRadius: '8px',
                    background: 'var(--green-400)', border: 'none', color: '#111',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                  }}
                >
                  <Sparkles size={14} /> Solicitar diagnóstico
                </button>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0 0' }}>
                  Análisis completado en ~3 segundos
                </p>
              </>
            )}

            {/* LOADING */}
            {diagState === 'loading' && (
              <div style={{ padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    border: '2px solid var(--border)',
                    borderTop: '2px solid var(--green-400)',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {LOADING_STEPS.map((step, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      opacity: i <= loadingStep ? 1 : 0.3,
                      transition: 'opacity 400ms',
                    }}>
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                        background: i < loadingStep ? 'var(--green-400)' : i === loadingStep ? 'rgba(168,230,61,0.2)' : 'var(--bg-elevated)',
                        border: i === loadingStep ? '2px solid var(--green-400)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {i < loadingStep && (
                          <svg width="8" height="8" viewBox="0 0 8 8">
                            <path d="M1.5 4l1.5 1.5L6.5 2" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: i <= loadingStep ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DONE */}
            {diagState === 'done' && (
              <div style={{ animation: 'fadeIn 300ms ease-out' }}>
                {/* Score */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: isHealthy ? 'rgba(168,230,61,0.06)' : 'rgba(245,158,11,0.06)',
                  border: `1px solid ${isHealthy ? 'rgba(168,230,61,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  borderRadius: '8px', padding: '12px 14px', marginBottom: '14px',
                }}>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <p style={{
                      fontSize: '28px', fontWeight: 700, lineHeight: 1, margin: '0 0 2px',
                      color: isHealthy ? '#A8E63D' : '#F59E0B',
                    }}>{diag.score}</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>Score</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{diag.title}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Confianza: {diag.confidence}</p>
                  </div>
                </div>

                {/* Summary */}
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.6 }}>
                  {diag.summary}
                </p>

                {/* Findings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {diag.findings.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      {f.type === 'ok'
                        ? <CheckCircle size={13} style={{ color: '#A8E63D', flexShrink: 0, marginTop: '1px' }} />
                        : <AlertTriangle size={13} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '1px' }} />
                      }
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div style={{
                  background: 'var(--bg-elevated)', borderRadius: '7px',
                  padding: '10px 12px', marginBottom: '14px',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Recomendación
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                    {diag.recommendation}
                  </p>
                </div>

                <button
                  onClick={() => { setDiagState('idle'); setLoadingStep(0) }}
                  style={{
                    width: '100%', padding: '8px', borderRadius: '7px',
                    background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)',
                    fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  }}
                >
                  <RotateCcw size={12} /> Nuevo diagnóstico
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
