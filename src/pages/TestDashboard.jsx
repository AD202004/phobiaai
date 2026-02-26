import { useEffect, useState } from 'react'
import ExposureView from '../shared/ExposureView.jsx'
import WebcamPreview from '../shared/WebcamPreview.jsx'
import FearScoreChart from '../shared/FearScoreChart.jsx'
import io from 'socket.io-client'

export default function TestDashboard() {
  const [images] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', level: 'low' },
    { id: 2, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', level: 'low' },
    { id: 3, url: 'https://images.unsplash.com/photo-1529088742811-f5f2a4a3b397', level: 'medium' },
    { id: 4, url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908', level: 'high' },
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionId] = useState(`test_session_${Date.now()}`)
  const [fearScores, setFearScores] = useState([{ t: 0, score: 0 }])
  const [currentFearScore, setCurrentFearScore] = useState(0)
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [frameCount, setFrameCount] = useState(0)

  const next = () => setCurrentIndex((i) => Math.min(i + 1, images.length - 1))
  const prev = () => setCurrentIndex((i) => Math.max(i - 1, 0))

  // Initialize WebSocket connection
  useEffect(() => {
    console.log('🔌 Initializing Socket.IO connection to http://localhost:8000')
    
    const newSocket = io('http://localhost:8000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('✅ Connected to backend, Socket ID:', newSocket.id)
      setIsConnected(true)
      newSocket.emit('start_session', { sessionId })
      console.log('📤 Sent start_session with sessionId:', sessionId)
    })

    newSocket.on('fear_score', (data) => {
      console.log('📊 Fear score received:', data.score)
      setCurrentFearScore(data.score)
      setFearScores(prev => {
        const newScores = [...prev, { t: prev.length * 0.5, score: data.score }]
        return newScores.slice(-50)
      })
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from backend')
      setIsConnected(false)
    })

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [sessionId])

  // Handle frame capture
  const handleFrameCapture = (frameData) => {
    if (!frameData) {
      console.warn('⚠️ No frame data')
      return
    }

    if (socket && socket.connected && isConnected) {
      setFrameCount(prev => prev + 1)
      socket.emit('send_frame', {
        sessionId,
        frame: frameData,
      })
      console.log(`📨 Frame #${frameCount + 1} sent, size: ${(frameData.length / 1024).toFixed(2)} KB`)
    } else {
      console.warn('⚠️ Socket not ready. Connected:', isConnected, 'Socket exists:', !!socket)
    }
  }

  return (
    <div className="h-screen w-full relative bg-black">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900/80 p-2 text-xs text-white z-50 flex justify-between">
        <div>
          <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
            {isConnected ? '🟢' : '🔴'} {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <span className="ml-4">Session: {sessionId.substring(0, 15)}...</span>
          <span className="ml-4">Frames Sent: {frameCount}</span>
        </div>
      </div>

      {/* Fear Score Display */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-base-800/90 rounded-xl2 px-6 py-3 shadow-lg z-40">
        <p className="text-gray-300 text-sm">Current Fear Level</p>
        <p className="text-3xl font-bold text-accent-500">{currentFearScore.toFixed(1)}/10</p>
      </div>

      <ExposureView
        imageUrl={images[currentIndex].url}
        index={currentIndex}
        total={images.length}
        onNext={next}
        onPrev={prev}
      />

      {/* Webcam Preview */}
      <div className="absolute right-6 top-20 w-64 z-30">
        <WebcamPreview onFrameCapture={handleFrameCapture} sessionId={sessionId} />
      </div>

      {/* Fear Score Chart */}
      <div className="absolute bottom-6 left-6 right-6 max-w-md bg-base-800/90 rounded-xl2 p-4 shadow-lg z-30">
        <h3 className="text-sm text-gray-300 mb-2">Fear Score Trend</h3>
        <FearScoreChart data={fearScores} />
      </div>

      {/* Debug Console */}
      <div className="absolute bottom-6 right-6 w-64 max-h-32 bg-slate-900/90 rounded-lg p-2 text-xs text-gray-300 overflow-y-auto z-30 border border-slate-600">
        <div className="font-bold mb-1">Debug Info:</div>
        <div>Socket Connected: {isConnected ? 'Yes' : 'No'}</div>
        <div>Current Fear Score: {currentFearScore.toFixed(2)}</div>
        <div>Frames Sent: {frameCount}</div>
        <div>Data Points: {fearScores.length}</div>
      </div>
    </div>
  )
}
