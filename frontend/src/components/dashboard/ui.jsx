import { useState } from 'react'

export function Badge({ color, children }) {
  const style = color ? { backgroundColor: `${color}1a`, color } : {}
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-md font-semibold" style={style}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color || '#64748b' }}></span>
      {children}
    </span>
  )
}

export function StatusBadge({ label, color }) {
  return <Badge color={color}>{label}</Badge>
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
        {subtitle && <p className="font-body-md text-body-md text-on-surface-variant">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-sm">{actions}</div>}
    </div>
  )
}

export function Spinner() {
  return <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
}

export function EmptyState({ message }) {
  return (
    <div className="text-center py-xl">
      <span className="material-symbols-outlined text-[48px] text-outline">inbox</span>
      <p className="font-body-md text-body-md text-on-surface-variant mt-md">{message}</p>
    </div>
  )
}

export function Modal({ open, title, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
          <h3 className="font-title-lg text-title-lg text-on-surface">{title}</h3>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-lg">{children}</div>
      </div>
    </div>
  )
}

export function Drawer({ open, title, onClose, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-surface-container-lowest shadow-xl w-full max-w-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
          <h3 className="font-title-lg text-title-lg text-on-surface">{title}</h3>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-lg">{children}</div>
        {footer && <div className="px-lg py-md border-t border-outline-variant flex justify-end gap-sm">{footer}</div>}
      </div>
    </div>
  )
}

export function useForm(initial = {}) {
  const [values, setValues] = useState(initial)
  const setValue = (name, value) => setValues((prev) => ({ ...prev, [name]: value }))
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setValue(name, type === 'checkbox' ? checked : value)
  }
  return { values, setValues, setValue, handleChange }
}

export function Field({ label, children, required }) {
  return (
    <div className="space-y-base">
      {label && <label className="font-label-md text-label-md text-on-surface-variant">{label}{required && <span className="text-error"> *</span>}</label>}
      {children}
    </div>
  )
}

export const inputClass =
  'w-full bg-transparent border border-outline-variant rounded-lg px-md py-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'

export function toggleButton(on, onClick) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-12 h-7 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-outline'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`}
      ></span>
    </button>
  )
}

export function LoadingRow() {
  return (
    <tr>
      <td colSpan={8} className="py-lg">
        <Spinner />
      </td>
    </tr>
  )
}