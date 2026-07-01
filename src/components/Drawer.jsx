import { useEffect } from 'react'
import { X } from 'lucide-react'

// Full-height side drawer used for all overlay panels (view/edit).
// Spans the whole screen height so forms and detail views have ample room.
export default function Drawer({ title, onClose, children, width = 520 }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9995,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', justifyContent: 'flex-end',
        animation: 'fadeIn 150ms ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: `${width}px`, maxWidth: '100%', height: '100vh',
          background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-24px 0 60px rgba(0,0,0,0.4)',
          animation: 'drawerIn 220ms ease-out',
        }}
      >
        {/* Sticky header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0,
        }}>
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</p>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: '30px', height: '30px', borderRadius: '7px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
