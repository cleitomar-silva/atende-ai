import { createContext, useCallback, useContext, useState } from 'react'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null)

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({ ...options, resolve })
    })
  }, [])

  const close = (result) => {
    if (state?.resolve) state.resolve(result)
    setState(null)
  }

  const confirmText = state?.confirmText ?? 'Confirmar'
  const danger = Boolean(state?.danger)
  const icon = state?.icon ?? (danger ? 'warning' : 'help_outline')
  const iconTone = danger ? 'text-error bg-error/10' : 'text-primary bg-primary/10'

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {state && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => close(false)}>
          <div
            className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary-container to-tertiary" />

            <div className="p-lg pt-xl text-center">
              <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-md ${iconTone}`}>
                <span className="material-symbols-outlined text-[28px]">{icon}</span>
              </div>

              <h3 className="font-title-lg text-title-lg text-on-surface mb-sm">{state.title || 'Confirmação'}</h3>

              {state.render ? (
                <div>{state.render}</div>
              ) : (
                <p className="text-body-md text-on-surface-variant whitespace-pre-wrap leading-relaxed">{state.message}</p>
              )}
            </div>

            <div className="flex gap-sm p-lg bg-surface-container-low/60 mt-lg">
              <button
                type="button"
                onClick={() => close(false)}
                className="flex-1 px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-all"
              >
                {state.cancelText || 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={`flex-1 px-md py-sm rounded-lg font-label-md transition-all ${
                  danger
                    ? 'bg-error text-on-error hover:bg-error/90 shadow-md shadow-error/20'
                    : 'bg-primary text-on-primary hover:bg-surface-tint shadow-md shadow-primary/20'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm deve ser usado dentro de ConfirmProvider')
  return ctx
}