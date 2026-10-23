const auth = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8082/api/auth'
const registration = import.meta.env.VITE_REGISTRATION_API_URL || 'http://localhost:8081/api/registration'
async function request(base, path, options = {}) {
  const { token, ...config } = options
  const response = await fetch(`${base}${path}`, { ...config, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...config.headers } })
  const result = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.message || 'Request failed')
  return result
}
export const api = {
  register: data => request(registration, '/register', { method: 'POST', body: JSON.stringify(data) }),
  login: data => request(auth, '/login', { method: 'POST', body: JSON.stringify(data) }),
  me: token => request(auth, '/me', { token }), logout: token => request(auth, '/logout', { method: 'POST', token }),
  forgot: identifier => request(auth, '/forgot-password', { method: 'POST', body: JSON.stringify({ identifier }) }),
  verify: data => request(auth, '/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  reset: data => request(auth, '/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  change: (data, token) => request(auth, '/change-password', { method: 'POST', body: JSON.stringify(data), token })
}
