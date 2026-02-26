import { useEffect, useRef, useState, useCallback } from 'react'

export default function WebcamPreview({ onFrameCapture, sessionId }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [error, setError] = useState('')
  const frameIntervalRef = useRef(null)

  const captureAndSendFrames = useCallback(() => {
    frameIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        try {
          const ctx = canvasRef.current.getContext('2d')
          if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
            ctx.drawImage(videoRef.current, 0, 0)
            
            // Convert to base64 and send
            const frameData = canvasRef.current.toDataURL('image/jpeg', 0.7)
            if (frameData && frameData.length > 100) {
              onFrameCapture(frameData)
              console.log('📤 Frame sent:', frameData.substring(0, 50) + '..., size:', frameData.length, 'bytes')
            } else {
              console.warn('⚠️ Invalid frame data')
            }
          } else {
            console.warn('⚠️ Video dimensions not ready:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
          }
        } catch (err) {
          console.error('❌ Error capturing frame:', err)
        }
      } else {
        console.warn('⚠️ Video or canvas ref not available')
      }
    }, 500)
  }, [onFrameCapture])

  useEffect(() => {
    let stream
    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          
          // Start capturing frames every 500ms if callback provided
          if (onFrameCapture && sessionId) {
            captureAndSendFrames()
          }
        }
      } catch (e) {
        setError('Camera permission denied or not available')
      }
    }
    init()
    return () => {
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current)
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [onFrameCapture, sessionId, captureAndSendFrames])

  return (
    <div className="bg-base-800/80 rounded-xl2 p-3 shadow-soft">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-40 object-cover rounded-xl2" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      <p className="text-xs text-gray-300 mt-2">📹 Webcam (real-time analysis)</p>
    </div>
  )
}
