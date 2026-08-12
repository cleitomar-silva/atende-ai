const TOKEN_KEY = 'atendeai_token'
const USER_KEY = 'atendeai_user'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const clearUser = () => localStorage.removeItem(USER_KEY)

export function isAuthError(status) {
  return status === 401
}

export async function api(path, { method = 'GET', body, headers, query } = {}) {
  const token = getToken()
  const finalHeaders = { ...headers }
  if (body && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json'
  }
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  let url = `/api${path}`
  if (query) {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v !== '' && v !== null && v !== undefined) params.append(`${key}[]`, v)
        })
      } else {
        params.set(key, value)
      }
    })
    const qs = params.toString()
    if (qs) url += `?${qs}`
  }

  let payload
  if (body && !(body instanceof FormData)) {
    payload = JSON.stringify(body)
  } else {
    payload = body
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: payload,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (res.status === 401 && getToken()) {
    clearToken()
    clearUser()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  if (!res.ok) {
    const message = data?.message || data?.errors?.[Object.keys(data?.errors || {})[0]]?.[0] || 'Erro inesperado na requisição.'
    throw new Error(message)
  }

  return data
}

export const apiGet = (path, query) => api(path, { query })
export const apiPost = (path, body) => api(path, { method: 'POST', body })
export const apiPut = (path, body) => api(path, { method: 'PUT', body })
export const apiDelete = (path) => api(path, { method: 'DELETE' })

export const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export const formatNumber = (min) => {
  if (!min || min <= 0) return '—'
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}h ${m}m` : `${h}h`
}