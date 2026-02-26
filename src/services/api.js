// Replace baseURL when backend is ready
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export async function fetchExposureImages() {
  const res = await fetch(`${baseURL}/exposure/images`)
  if (!res.ok) throw new Error('Failed to fetch images')
  return res.json()
}

export async function fetchSessionHistory(patientId) {
  const res = await fetch(`${baseURL}/sessions?patient=${patientId}`)
  if (!res.ok) throw new Error('Failed to fetch sessions')
  return res.json()
}

export function connectFearScoreWS(sessionId, onData) {
  const wsURL = (baseURL.replace('http', 'ws')) + `/ws/fear-score?session=${sessionId}`
  const ws = new WebSocket(wsURL)
  ws.onmessage = (evt) => {
    try {
      const payload = JSON.parse(evt.data)
      onData(payload) // { score, timestamp }
    } catch {}
  }
  return () => ws.close()
}