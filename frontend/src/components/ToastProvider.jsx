import { createContext, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

const META = {
  success: { icon: 'check', label: 'Sucesso', color: '#16a34a', ring: 'bg-green-500/10 text-green-600' },
  error: { icon: 'close', label: 'Erro', color: '#ba1a1a', ring: 'bg-red-500/10 text-[#ba1a1a]' },
  info: { icon: 'info', label: 'Atenção', color: '#004ccd', ring: 'bg-blue-500/10 text-primary' },
}

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const remove = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }

  const push = (type, message, duration = 4500) => {
    const id = ++idCounter
    const meta = META[type] || META.info
    setToasts((prev) => [...prev, { id, type, message, label: meta.label, color: meta.color, icon: meta.icon, duration }])
    timers.current[id] = setTimeout(() => remove(id), duration)
  }

  const toast = useMemo(
    () => ({
      success: (message, duration) => push('success', message, duration),
      error: (message, duration) => push('error', message, duration),
      info: (message, duration) => push('info', message, duration),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="fixed top-4 right-4 z-[80] flex flex-col gap-sm min-w-[320px] max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto animate-toast-in" style={{ boxShadow: `0 8px 30px ${t.color}22, 0 2px 8px rgba(0,0,0,0.08)` }}>
            <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest border" style={{ borderColor: `${t.color}33` }}>
              <div className="flex items-start gap-md px-md py-sm pl-lg pr-md">
                <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.ring}`}>
                  <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                </span>
                <div className="flex-1 min-w-0 -mt-xs">
                  <p className="font-label-md font-bold text-on-surface uppercase tracking-wide text-[11px]">{t.label}</p>
                  <p className="text-body-md text-on-surface break-words leading-snug -mt-px">{t.message}</p>
                </div>
                <button onClick={() => remove(t.id)} className="text-on-surface-variant hover:text-on-surface shrink-0 p-0.5 rounded-full hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: `${t.color}22` }}>
                <div
                  key={`${t.id}-bar`}
                  className="h-full rounded-full"
                  style={{ backgroundColor: t.color, animation: `toast-progress ${t.duration}ms linear forwards` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}