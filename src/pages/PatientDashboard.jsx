/*import { useEffect, useState } from 'react'
import ExposureView from '../shared/ExposureView.jsx'
import WebcamPreview from '../shared/WebcamPreview.jsx'

export default function PatientDashboard() {
  const [images] = useState([
    // Replace with your curated Pexels/Unsplash or backend-provided URLs
    { id: 1, url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', level: 'low' },
    { id: 2, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', level: 'low' },
    { id: 3, url: 'https://images.unsplash.com/photo-1529088742811-f5f2a4a3b397', level: 'medium' },
    { id: 4, url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908', level: 'high' },
  ])

  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((i) => Math.min(i+1, images.length-1))
  const prev = () => setCurrentIndex((i) => Math.max(i-1, 0))

  // Future: subscribe to fear-score via WS
  useEffect(() => {
    // placeholder for integration
  }, [])

  return (
    <div className="h-screen w-full relative bg-black">
      <ExposureView
        imageUrl={images[currentIndex].url}
        index={currentIndex}
        total={images.length}
        onNext={next}
        onPrev={prev}
      />
      <div className="absolute right-6 top-6 w-64">
        <WebcamPreview />
      </div>
    </div>
  )
}
  --------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import ExposureView from '../shared/ExposureView.jsx'
import WebcamPreview from '../shared/WebcamPreview.jsx'
import FearScoreChart from '../shared/FearScoreChart.jsx'
import { signOut } from 'firebase/auth'
import { auth } from '../firbaseConfig.js'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import io from 'socket.io-client'

export default function PatientDashboard() {
  const [images] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', level: 'low' },
    { id: 2, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', level: 'low' },
    { id: 3, url: 'https://images.unsplash.com/photo-1529088742811-f5f2a4a3b397', level: 'medium' },
    { id: 4, url: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908', level: 'high' },
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionId] = useState(`session_${Date.now()}`)
  const [fearScores, setFearScores] = useState([{ t: 0, score: 0 }])
  const [currentFearScore, setCurrentFearScore] = useState(0)
  const [detectedEmotion, setDetectedEmotion] = useState('Analyzing...')
  const [emotionConfidence, setEmotionConfidence] = useState(0)
  const [allEmotions, setAllEmotions] = useState({
    '😠 Angry': 0,
    '🤢 Disgust': 0,
    '😨 Fear': 0,
    '😊 Happy': 0,
    '😢 Sad': 0,
    '😲 Surprise': 0,
    '😐 Neutral': 0,
  })
  const [showEmotionDetails, setShowEmotionDetails] = useState(false)
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)

  const next = () => setCurrentIndex((i) => Math.min(i + 1, images.length - 1))
  const prev = () => setCurrentIndex((i) => Math.max(i - 1, 0))

  // Initialize WebSocket connection for receiving fear scores
  useEffect(() => {
    const newSocket = io('http://localhost:8000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      console.log('✅ Connected to backend')
      newSocket.emit('start_session', { sessionId })
    })

    newSocket.on('fear_score', (data) => {
      console.log('📊 Fear score received:', data.score, 'Emotion:', data.emotion)
      setCurrentFearScore(data.score)
      setDetectedEmotion(data.emotion || 'Analyzing...')
      setEmotionConfidence(data.confidence || 0)
      if (data.allEmotions) {
        setAllEmotions(data.allEmotions)
      }
      setFearScores(prev => {
        const newScores = [...prev, { t: prev.length * 0.5, score: data.score }]
        return newScores.slice(-50) // Keep last 50 points
      })
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from backend')
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [sessionId])

  // Handle frame capture from WebcamPreview
  const handleFrameCapture = (frameData) => {
    if (!frameData) {
      console.warn('⚠️ No frame data provided')
      return
    }
    
    if (socket && socket.connected) {
      console.log('📨 Emitting frame via Socket.IO, size:', frameData.length, 'bytes')
      socket.emit('send_frame', {
        sessionId,
        frame: frameData,
      })
      console.log('✅ Frame emitted to backend')
    } else {
      console.warn('⚠️ Socket not connected. Connected:', socket?.connected)
    }
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth)
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate('/')
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: err.message
      })
    }
  }

  return (
    <div className="h-screen w-full relative bg-black">
      // Logout button 
      <button
        onClick={handleLogout}
        className="absolute left-6 top-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition z-50"
      >
        Logout
      </button>

      // Fear Score Display 
      <div 
        className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-base-800/90 rounded-xl px-6 py-4 shadow-lg z-40 cursor-pointer hover:bg-base-700/90 transition"
        onClick={() => setShowEmotionDetails(!showEmotionDetails)}
      >
        <p className="text-gray-300 text-sm">Current Fear Level</p>
        <p className="text-3xl font-bold text-accent-500">{currentFearScore.toFixed(1)}/10</p>
        <p className="text-sm text-gray-300 mt-2 font-semibold">
          🎯 {detectedEmotion} {emotionConfidence > 0 ? `(${emotionConfidence.toFixed(0)}%)` : ''}
        </p>
        {showEmotionDetails && (
          <div className="mt-4 pt-4 border-t border-gray-600 max-h-48 overflow-y-auto">
            <p className="text-xs text-gray-400 mb-2">All Emotions:</p>
            <div className="space-y-1">
              {Object.entries(allEmotions).map(([emotion, value]) => {
                const barLength = Math.round(value / 5)
                const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength)
                return (
                  <div key={emotion} className="flex items-center justify-between text-xs">
                    <span className="w-16">{emotion}</span>
                    <span className="font-mono text-green-400">{bar}</span>
                    <span className="w-12 text-right text-gray-300">{value.toFixed(1)}%</span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Click to collapse
            </p>
          </div>
        )}
      </div>

      <ExposureView
        imageUrl={images[currentIndex].url}
        index={currentIndex}
        total={images.length}
        onNext={next}
        onPrev={prev}
      />

      // Webcam Preview with Frame Capture 
      <div className="absolute right-6 top-6 w-64 z-30">
        <WebcamPreview onFrameCapture={handleFrameCapture} sessionId={sessionId} />
      </div>

      // Fear Score Chart 
      <div className="absolute bottom-6 left-6 right-6 max-w-md bg-base-800/90 rounded-xl2 p-4 shadow-lg z-30">
        <h3 className="text-sm text-gray-300 mb-2">Fear Score Trend</h3>
        <FearScoreChart data={fearScores} />
      </div>
    </div>
  )
}
  ----------------------------------------------------------------------------------------------------------
 // first version with fear score update 

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const PatientDashboard = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [sessionId, setSessionId] = useState("");
  const [fearScore, setFearScore] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  // -----------------------------
  // Backend Socket Connection
  // -----------------------------
  useEffect(() => {
    socketRef.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("⚡ Connected to backend via socket");
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected from backend");
    });

    socketRef.current.on("emotion_update", (data) => {
      console.log("🎯 Emotion update received:", data);
      if (data.emotion === "😨 Fear") {
        setFearScore(data.confidence.toFixed(2));
      }
      setEmotion(data.emotion);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // -----------------------------
  // Initialize webcam + session
  // -----------------------------
  useEffect(() => {
    const id = `session_${Math.floor(Math.random() * 10000)}`;
    setSessionId(id);

    const socket = socketRef.current;
    if (socket) socket.emit("start_session", { session_id: id });

    let stream;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);

          // Fix the play() interrupted error
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setCameraActive(false);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      socket.disconnect();
    };
  }, []);

  // -----------------------------
  // Capture and send frames every 5 seconds
  // -----------------------------
  useEffect(() => {
    const sendFrame = () => {
      const socket = socketRef.current;
      const video = videoRef.current;

      if (!socket || !video || !cameraActive) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL("image/jpeg");

      socket.emit("send_frame", { sessionId, frame });
    };

    const interval = setInterval(sendFrame, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, [cameraActive, sessionId]);

  // -----------------------------
  // UI Rendering
  // -----------------------------
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧠 Phobia AI - Patient Dashboard</h1>

      <div style={styles.videoContainer}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={styles.video}
        />
      </div>

      <div style={styles.statusContainer}>
        <p>
          <strong>Camera Status:</strong>{" "}
          {cameraActive ? "🎥 Active" : "❌ Not Active"}
        </p>
        <p>
          <strong>Session ID:</strong> {sessionId || "Starting..."}
        </p>
        <p>
          <strong>Detected Emotion:</strong> {emotion || "Analysing..."}
        </p>
        <p>
          <strong>Fear Score:</strong>{" "}
          {fearScore !== null ? `${fearScore}%` : "Waiting..."}
        </p>
      </div>
    </div>
  );
};

export default PatientDashboard;

// -----------------------------
// Inline Styles
// -----------------------------
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#0d1117",
    minHeight: "100vh",
    color: "#fff",
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#00bfff",
  },
  videoContainer: {
    border: "2px solid #00bfff",
    borderRadius: "12px",
    overflow: "hidden",
    width: "640px",
    height: "480px",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  statusContainer: {
    marginTop: "1.5rem",
    fontSize: "1.2rem",
    backgroundColor: "#161b22",
    padding: "1rem 2rem",
    borderRadius: "10px",
    boxShadow: "0 0 15px rgba(0, 191, 255, 0.3)",
  },
};
 
-----------------------------------------------------------------------------------------
// Final Version with working graph big and exposer vd small

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const PatientDashboard = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [sessionId, setSessionId] = useState("");
  const [fearScore, setFearScore] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [trend, setTrend] = useState([]);
  const [exposureIndex, setExposureIndex] = useState(0);

  const exposureImages = [
    "/images/spider.jpg",
    "/images/height.jpg",
    "/images/dark.jpg",
  ];

  // -----------------------------
  // Socket Connection
  // -----------------------------
  useEffect(() => {
    socketRef.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("⚡ Connected to backend via socket");
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected from backend");
    });

    socketRef.current.on("emotion_update", (data) => {
      if (data.emotion === "😨 Fear") {
        setFearScore(data.confidence.toFixed(2));
        setTrend((prev) => [...prev.slice(-9), data.confidence]); // Keep last 10
      }
      setEmotion(data.emotion);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // -----------------------------
  // Webcam Init
  // -----------------------------
  useEffect(() => {
    const id = `session_${Math.floor(Math.random() * 10000)}`;
    setSessionId(id);
    const socket = socketRef.current;
    if (socket) socket.emit("start_session", { session_id: id });

    let stream;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setCameraActive(false);
      }
    };
    initCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      socket.disconnect();
    };
  }, []);

  // -----------------------------
  // Send Frames Every 5s
  // -----------------------------
  useEffect(() => {
    const sendFrame = () => {
      const socket = socketRef.current;
      const video = videoRef.current;
      if (!socket || !video || !cameraActive) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL("image/jpeg");
      socket.emit("send_frame", { sessionId, frame });
    };
    const interval = setInterval(sendFrame, 5000);
    return () => clearInterval(interval);
  }, [cameraActive, sessionId]);

  // -----------------------------
  // UI
  // -----------------------------
  const fearData = {
    labels: trend.map((_, i) => i + 1),
    datasets: [
      {
        label: "Fear Score",
        data: trend,
        borderColor: "#00bfff",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center relative overflow-hidden font-sans">
      
      <button className="absolute top-4 left-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md transition-all">
        Logout
      </button>

      
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500/20 to-blue-700/20 border border-cyan-400/40 px-8 py-4 rounded-2xl text-center shadow-lg cursor-pointer hover:scale-105 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold text-cyan-300">Fear Level</h2>
        <p className="text-3xl font-bold mt-2 text-cyan-400">
          {fearScore !== null ? `${fearScore}%` : "Waiting..."}
        </p>
        <p className="mt-1 text-gray-300">
          Emotion: <span className="font-semibold">{emotion || "Analyzing..."}</span>
        </p>

        {expanded && (
          <div className="mt-4 bg-gray-900/60 rounded-xl p-4 border border-gray-700">
            <p className="text-sm mb-2 text-gray-400">Detailed Emotion Breakdown</p>
            {["Fear", "Anger", "Happy", "Neutral"].map((emo) => (
              <div key={emo} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>{emo}</span>
                  <span>{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
                  <div
                    className="bg-cyan-400 h-2 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="absolute top-4 right-6 border border-cyan-500/50 rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-48 h-36 object-cover rounded-xl"
        />
      </div>

      
      <div className="flex flex-col items-center justify-center flex-1 mt-24">
        <div className="relative border border-cyan-500/30 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={exposureImages[exposureIndex]}
            alt="Exposure"
            className="w-[640px] h-[400px] object-cover"
          />
          <button
            onClick={() =>
              setExposureIndex((prev) =>
                prev === 0 ? exposureImages.length - 1 : prev - 1
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 px-3 py-2 rounded-full text-cyan-300"
          >
            ◀
          </button>
          <button
            onClick={() =>
              setExposureIndex((prev) => (prev + 1) % exposureImages.length)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 px-3 py-2 rounded-full text-cyan-300"
          >
            ▶
          </button>
        </div>

        <div className="mt-6 bg-gray-900/60 px-6 py-3 rounded-xl border border-gray-800 shadow-md">
          <p className="text-sm">
            <strong>Camera:</strong>{" "}
            {cameraActive ? "🎥 Active" : "❌ Not Active"} |{" "}
            <strong>Session ID:</strong> {sessionId || "Starting..."}
          </p>
        </div>
      </div>

      <div className="w-[80%] bg-gray-900/70 rounded-2xl p-4 border border-gray-800 shadow-lg mb-6">
        <h3 className="text-cyan-400 font-semibold mb-2 text-center">
          Fear Score Trend
        </h3>
        <Line data={fearData} />
      </div>
    </div>
  );
};

export default PatientDashboard;

-----------------------------------------------------------------------------------------------

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const PatientDashboard = () => {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [sessionId, setSessionId] = useState("");
  const [fearScore, setFearScore] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [trend, setTrend] = useState([]);
  const [exposureIndex, setExposureIndex] = useState(0);

  const exposureImages = [
    "/images/spider.jpg",
    "/images/height.jpg",
    "/images/dark.jpg",
  ];

  // -----------------------------
  // Socket Connection
  // -----------------------------
  useEffect(() => {
    socketRef.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => console.log("⚡ Connected"));
    socketRef.current.on("disconnect", () => console.log("❌ Disconnected"));

    socketRef.current.on("emotion_update", (data) => {
      if (data.emotion === "😨 Fear") {
        setFearScore(data.confidence.toFixed(2));
        setTrend((prev) => [...prev.slice(-9), data.confidence]);
      }
      setEmotion(data.emotion);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // -----------------------------
  // Webcam Init
  // -----------------------------
  useEffect(() => {
    const id = `session_${Math.floor(Math.random() * 10000)}`;
    setSessionId(id);
    const socket = socketRef.current;
    if (socket) socket.emit("start_session", { session_id: id });

    let stream;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setCameraActive(false);
      }
    };
    initCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      socket.disconnect();
    };
  }, []);

  // -----------------------------
  // Send Frames Every 5s
  // -----------------------------
  useEffect(() => {
    const sendFrame = () => {
      const socket = socketRef.current;
      const video = videoRef.current;
      if (!socket || !video || !cameraActive) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL("image/jpeg");
      socket.emit("send_frame", { sessionId, frame });
    };
    const interval = setInterval(sendFrame, 5000);
    return () => clearInterval(interval);
  }, [cameraActive, sessionId]);

  // -----------------------------
  // UI
  // -----------------------------
  const fearData = {
    labels: trend.map((_, i) => i + 1),
    datasets: [
      {
        label: "Fear Score",
        data: trend,
        borderColor: "#00bfff",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans flex flex-col items-center justify-center">
      
      <button className="absolute top-4 left-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md transition-all z-20">
        Logout
      </button>

      
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500/20 to-blue-700/20 border border-cyan-400/40 px-8 py-4 rounded-2xl text-center shadow-lg cursor-pointer hover:scale-105 transition z-20"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold text-cyan-300">Fear Level</h2>
        <p className="text-3xl font-bold mt-2 text-cyan-400">
          {fearScore !== null ? `${fearScore}%` : "Waiting..."}
        </p>
        <p className="mt-1 text-gray-300">
          Emotion: <span className="font-semibold">{emotion || "Analyzing..."}</span>
        </p>

        {expanded && (
          <div className="mt-4 bg-gray-900/60 rounded-xl p-4 border border-gray-700">
            <p className="text-sm mb-2 text-gray-400">Detailed Emotion Breakdown</p>
            {["Fear", "Anger", "Happy", "Neutral"].map((emo) => (
              <div key={emo} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>{emo}</span>
                  <span>{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-1">
                  <div
                    className="bg-cyan-400 h-2 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="absolute top-4 right-6 border border-cyan-500/50 rounded-xl overflow-hidden shadow-lg z-20">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-48 h-36 object-cover rounded-xl"
        />
      </div>

      
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={exposureImages[exposureIndex]}
          alt="Exposure"
          className="w-full h-full object-cover opacity-70"
        />

        
        <button
          onClick={() =>
            setExposureIndex((prev) =>
              prev === 0 ? exposureImages.length - 1 : prev - 1
            )
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full text-cyan-300 z-10"
        >
          ◀
        </button>
        <button
          onClick={() =>
            setExposureIndex((prev) => (prev + 1) % exposureImages.length)
          }
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full text-cyan-300 z-10"
        >
          ▶
        </button>
      </div>

      
      <div className="absolute bottom-4 right-6 bg-gray-900/60 px-6 py-3 rounded-xl border border-gray-800 shadow-md z-20">
        <p className="text-sm">
          <strong>Camera:</strong>{" "}
          {cameraActive ? "🎥 Active" : "❌ Not Active"} |{" "}
          <strong>Session ID:</strong> {sessionId || "Starting..."}
        </p>
      </div>

      
      <div className="absolute bottom-4 left-6 w-[350px] bg-gray-900/80 rounded-2xl p-4 border border-gray-800 shadow-lg z-20">
        <h3 className="text-cyan-400 font-semibold mb-2 text-center">
          Fear Score Trend
        </h3>
        <Line data={fearData} />
      </div>
    </div>
  );
};

export default PatientDashboard;
===================================================================================================
// working final 

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

// 🔥 Added imports
import { signOut } from "firebase/auth";
import { auth } from "../firbaseConfig.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [started, setStarted] = useState(false);

  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [sessionId, setSessionId] = useState("");
  const [fearScore, setFearScore] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [trend, setTrend] = useState([]);
  const [exposureIndex, setExposureIndex] = useState(0);

  const navigate = useNavigate();

  // 🔥 Replace image exposure with videos
  const exposureVideos = [
    "/videos/POV from a small wooden balcony eight story above the ground, looking down at people and dogs walking and pavement. Calm and safe atmosphere, daylight. --motion tilt-down --ar 16_9 --style cinematic.mp4",
    "/videos/videoplayback.mp4",
    "/videos/burj.mp4",
  ];

  // 🔥 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate("/"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: err.message,
      });
    }
  };

  // -----------------------------
  // Socket Connection
  // -----------------------------
  useEffect(() => {
    if (!started) return;

    socketRef.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => console.log("⚡ Connected"));
    socketRef.current.on("disconnect", () => console.log("❌ Disconnected"));

    socketRef.current.on("emotion_update", (data) => {
      if (data.emotion === "😨 Fear") {
        setFearScore(data.confidence.toFixed(2));
        setTrend((prev) => [...prev.slice(-9), data.confidence]);
      }
      setEmotion(data.emotion);
    });

    return () => socketRef.current.disconnect();
  }, [started]);

  // -----------------------------
  // Webcam Init
  // -----------------------------
  useEffect(() => {
    if (!started) return;

    const id = `session_${Math.floor(Math.random() * 10000)}`;
    setSessionId(id);

    const socket = socketRef.current;
    if (socket) socket.emit("start_session", { session_id: id });

    let stream;
    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setCameraActive(false);
      }
    };

    initCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (socket) socket.disconnect();
    };
  }, [started]);

  // -----------------------------
  // Send Frames Every 5s
  // -----------------------------
  useEffect(() => {
    if (!started) return;

    const sendFrame = () => {
      const socket = socketRef.current;
      const video = videoRef.current;
      if (!socket || !video || !cameraActive) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = canvas.toDataURL("image/jpeg");
      socket.emit("send_frame", { sessionId, frame });
    };

    const interval = setInterval(sendFrame, 5000);
    return () => clearInterval(interval);
  }, [cameraActive, sessionId, started]);

  // -----------------------------
  // Chart Data
  // -----------------------------
  const fearData = {
    labels: trend.map((_, i) => i + 1),
    datasets: [
      {
        label: "Fear Score",
        data: trend,
        borderColor: "#00bfff",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // -----------------------------
  // LANDING PAGE
  // -----------------------------
  if (!started) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white px-10 text-center">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">
          Welcome to PhobiaAI
        </h1>

        <h2 className="text-2xl text-gray-300 mb-6">
          Exposure Therapy for Acrophobia (Fear of Heights)
        </h2>

        <div className="bg-gray-900/70 p-6 rounded-2xl border border-gray-700 shadow-xl max-w-xl text-left">
          <h3 className="text-xl text-cyan-300 font-semibold mb-3">
            Instructions:
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Sit in a comfortable and safe environment.</li>
            <li>• Make sure your face is clearly visible to the camera.</li>
            <li>• Stay calm and relaxed while the exposure videos play.</li>
            <li>• You can pause anytime if you feel overwhelmed.</li>
            <li>• Your fear score updates every 5 seconds.</li>
          </ul>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="mt-8 px-10 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-lg shadow-lg transition-all"
        >
          Start Exposure
        </button>
      </div>
    );
  }

  // -----------------------------
  // DASHBOARD PAGE
  // -----------------------------
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans flex flex-col items-center justify-center">
      
      
      <button
        onClick={handleLogout}
        className="absolute top-4 left-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md transition-all z-20"
      >
        Logout
      </button>

      
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500/20 to-blue-700/20 border border-cyan-400/40 px-8 py-4 rounded-2xl text-center shadow-lg cursor-pointer hover:scale-105 transition z-20"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold text-cyan-300">Fear Level</h2>
        <p className="text-3xl font-bold mt-2 text-cyan-400">
          {fearScore !== null ? `${fearScore}%` : "Waiting..."}
        </p>
        <p className="mt-1 text-gray-300">
          Emotion: <span className="font-semibold">{emotion || "Analyzing..."}</span>
        </p>
      </div>

      
      <div className="absolute top-4 right-6 border border-cyan-500/50 rounded-xl overflow-hidden shadow-lg z-20">
        <video ref={videoRef} autoPlay playsInline muted className="w-48 h-36 object-cover rounded-xl" />
      </div>

      
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          key={exposureVideos[exposureIndex]}
          src={exposureVideos[exposureIndex]}
          autoPlay
          loop
          className="w-full h-full object-cover opacity-70"
        />

        
        <button
          onClick={() =>
            setExposureIndex((prev) =>
              prev === 0 ? exposureVideos.length - 1 : prev - 1
            )
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full text-cyan-300 z-10"
        >
          ◀
        </button>

        
        <button
          onClick={() =>
            setExposureIndex((prev) => (prev + 1) % exposureVideos.length)
          }
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full text-cyan-300 z-10"
        >
          ▶
        </button>
      </div>

      
      <div className="absolute bottom-4 right-6 bg-gray-900/60 px-6 py-3 rounded-xl border border-gray-800 shadow-md z-20">
        <p className="text-sm">
          <strong>Camera:</strong> {cameraActive ? "🎥 Active" : "❌ Not Active"} |{" "}
          <strong>Session ID:</strong> {sessionId || "Starting..."}
        </p>
      </div>

      
      <div className="absolute bottom-4 left-6 w-[350px] bg-gray-900/80 rounded-2xl p-4 border border-gray-800 shadow-lg z-20">
        <h3 className="text-cyan-400 font-semibold mb-2 text-center">
          Fear Score Trend
        </h3>
        <Line data={fearData} />
      </div>
    </div>
  );
};

export default PatientDashboard;
*/
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

// 🔥 Added imports
import { signOut } from "firebase/auth";
import { auth, db } from "../firbaseConfig.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

const SOCKET_URL = "http://localhost:8000"; // update if backend on different host

const PatientDashboard = () => {
  const [started, setStarted] = useState(false);

  const videoRef = useRef(null);
  const socketRef = useRef(null);

  const [sessionId, setSessionId] = useState("");
  const sessionIdRef = useRef(""); // keep latest session id for cleanup

  const [fearScore, setFearScore] = useState(null);
  const [emotion, setEmotion] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [trend, setTrend] = useState([]);
  const [exposureIndex, setExposureIndex] = useState(0);

  const navigate = useNavigate();

  // Guard to ensure initSession only runs once per "started" true (avoids StrictMode double calls)
  const sessionStartedRef = useRef(false);

  // Videos used in exposure therapy (unchanged)
  const exposureVideos = [
    "/videos/POV from a small wooden balcony eight story above the ground, looking down at people and dogs walking and pavement. Calm and safe atmosphere, daylight. --motion tilt-down --ar 16_9 --style cinematic.mp4",
    "/videos/videoplayback.mp4",
    "/videos/burj.mp4",
  ];

  // -----------------------------
  // Logout (also clear session_id)
  // -----------------------------
  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          session_id: "",
          latestSessionId: "",
        }).catch(() => {});
      }

      // if socket active, leave & disconnect
      if (socketRef.current && sessionIdRef.current) {
        try {
          socketRef.current.emit("leave_session", { session_id: sessionIdRef.current });
        } catch (e) {}
        try {
          socketRef.current.disconnect();
        } catch (e) {}
      }

      await signOut(auth);

      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate("/"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: err.message,
      });
    }
  };

  // -----------------------------
  // Initialize socket once when session "started"
  // -----------------------------
  useEffect(() => {
    if (!started) return;

    // create socket once
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    const sock = socketRef.current;

    sock.on("connect", () => {
      console.log("⚡ Socket connected:", sock.id);
      // if sessionId already known, join room
      if (sessionIdRef.current) {
        try {
          sock.emit("join_session", { session_id: sessionIdRef.current });
          console.log("Re-join_session emitted for", sessionIdRef.current);
        } catch (e) {
          console.warn("join_session emit failed:", e);
        }
      }
    });

    sock.on("disconnect", () => {
      console.log("⚠ Socket disconnected");
    });

    sock.on("emotion_update", (data) => {
      if (!data) return;

      if (data.emotion) setEmotion(data.emotion);

      // Prefer specific 'Fear' entry in allEmotions if present
      let fearConfidence = null;
      if (data.allEmotions) {
        for (const key of Object.keys(data.allEmotions)) {
          if (key.toLowerCase().includes("fear")) {
            fearConfidence = Number(data.allEmotions[key]);
            break;
          }
        }
      }

      // fallback: if detected emotion includes 'fear', use confidence
      if (fearConfidence === null && data.emotion?.toLowerCase().includes("fear")) {
        fearConfidence = Number(data.confidence);
      }

      if (fearConfidence !== null && !Number.isNaN(fearConfidence)) {
        setFearScore(fearConfidence.toFixed(2));
        setTrend((prev) => {
          const next = [...prev.slice(-9), fearConfidence];
          return next;
        });
      }
    });

    // cleanup on unmount or when started toggles false
    return () => {
      if (socketRef.current) {
        try {
          if (sessionIdRef.current) socketRef.current.emit("leave_session", { session_id: sessionIdRef.current });
        } catch (e) {}
        try {
          socketRef.current.disconnect();
        } catch (e) {}
        socketRef.current = null;
      }
    };
    // only depend on started
  }, [started]);

  // -----------------------------
  // Start session (call backend once and save to Firestore)
  // -----------------------------
  useEffect(() => {
    if (!started) return;
    if (sessionStartedRef.current) return; // guard for StrictMode / double render
    sessionStartedRef.current = true;

    let stream = null;
    let mounted = true;

    const initSession = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        console.log("🔥 Starting session - calling backend");

        // 1) Call backend start_session
        const res = await fetch(`${SOCKET_URL}/start_session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("Backend start_session failed:", res.status, text);
          throw new Error("Backend refused to start session");
        }

        const json = await res.json();
        const newSessionId = json.session_id;
        if (!newSessionId) throw new Error("Backend did not return session_id");

        // 2) save to Firestore so therapist can discover it
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            session_id: newSessionId,
            latestSessionId: newSessionId,
          });
          console.log("Saved session_id to Firestore:", newSessionId);
        } catch (e) {
          console.warn("Failed to update Firestore with session_id:", e);
        }

        if (!mounted) return;

        // update state & refs
        setSessionId(newSessionId);
        sessionIdRef.current = newSessionId;

        // show success popup
        Swal.fire({
          icon: "success",
          title: "Session Started Successfully",
          text: "Your therapist can now monitor you in real-time.",
          timer: 2200,
          showConfirmButton: false,
        });

        // 3) emit join to socket (socket might not be connected yet; emit will buffer)
        if (socketRef.current) {
          try {
            socketRef.current.emit("start_session", { session_id: newSessionId });
            socketRef.current.emit("join_session", { session_id: newSessionId });
            console.log("Emitted start_session/join_session for", newSessionId);
          } catch (e) {
            console.warn("Socket join emit failed (will retry on connect):", e);
          }
        }

        // 4) start camera AFTER session id exists
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (!mounted) {
            // stop tracks if we unmounted while acquiring
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // ensure play after metadata
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play().catch((err) => {
                console.warn("video play failed:", err);
              });
            };
            setCameraActive(true);
          }
        } catch (err) {
          console.error("Camera error:", err);
          setCameraActive(false);
          Swal.fire({
            icon: "error",
            title: "Camera Error",
            text: "Unable to access camera. Please check permissions and try again.",
          });
        }
      } catch (err) {
        console.error("Session Init Error:", err);
        Swal.fire({
          icon: "error",
          title: "Session Start Failed",
          text: err.message || "Could not start session",
        });
        // rollback started so user can try again
        setStarted(false);
        sessionStartedRef.current = false;
      }
    };

    initSession();

    return () => {
      mounted = false;
      // stop camera
      if (stream) {
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch (e) {}
      }

      // clear session_id from Firestore
      const user = auth.currentUser;
      if (user && sessionIdRef.current) {
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, { session_id: "", latestSessionId: "" }).catch(() => {});
      }

      // leave socket room & disconnect
      if (socketRef.current && sessionIdRef.current) {
        try {
          socketRef.current.emit("leave_session", { session_id: sessionIdRef.current });
        } catch (e) {}
        try {
          socketRef.current.disconnect();
        } catch (e) {}
        socketRef.current = null;
      }

      // reset guards
      sessionStartedRef.current = false;
      sessionIdRef.current = "";
      setSessionId("");
    };
    // run once when started becomes true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // -----------------------------
  // SEND FRAME EVERY 5 SECONDS (requires cameraActive & sessionId)
  // -----------------------------
  useEffect(() => {
    if (!started || !cameraActive || !sessionId) return;

    const sendFrame = () => {
      const socket = socketRef.current;
      const video = videoRef.current;
      if (!socket || !video) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = canvas.toDataURL("image/jpeg");
      socket.emit("send_frame", { sessionId, frame });
    };

    const interval = setInterval(sendFrame, 5000);
    return () => clearInterval(interval);
  }, [started, cameraActive, sessionId]);

  // -----------------------------
  // Chart data (unchanged)
  // -----------------------------
  const fearData = {
    labels: trend.map((_, i) => i + 1),
    datasets: [
      {
        label: "Fear Score",
        data: trend,
        borderColor: "#00bfff",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // -----------------------------
  // LANDING SCREEN
  // -----------------------------
  if (!started) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white px-10 text-center">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">
          Welcome to PhobiaAI
        </h1>

        <h2 className="text-2xl text-gray-300 mb-6">
          Exposure Therapy for Acrophobia (Fear of Heights)
        </h2>

        <div className="bg-gray-900/70 p-6 rounded-2xl border border-gray-700 shadow-xl max-w-xl text-left">
          <h3 className="text-xl text-cyan-300 font-semibold mb-3">
            Instructions:
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Sit comfortably and safely.</li>
            <li>• Ensure your face is clearly visible to the camera.</li>
            <li>• Exposure videos will play full screen.</li>
            <li>• Fear score updates every 5 seconds.</li>
            <li>• You may pause anytime.</li>
          </ul>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="mt-8 px-10 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-lg shadow-lg transition-all"
        >
          Start Exposure Therapy
        </button>
      </div>
    );
  }

  // -----------------------------
  // MAIN DASHBOARD
  // -----------------------------
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans flex flex-col items-center justify-center">

      <button
        onClick={handleLogout}
        className="absolute top-4 left-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md transition-all z-20"
      >
        Logout
      </button>

      {/* Fear Level Display */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500/20 to-blue-700/20 border border-cyan-400/40 px-8 py-4 rounded-2xl text-center shadow-lg cursor-pointer hover:scale-105 transition z-20"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold text-cyan-300">Fear Level</h2>
        <p className="text-3xl font-bold mt-2 text-cyan-400">
          {fearScore !== null ? `${fearScore}%` : "Waiting..."}
        </p>
        <p className="mt-1 text-gray-300">
          Emotion: <span className="font-semibold">{emotion || "Analyzing..."}</span>
        </p>
      </div>

      {/* Webcam */}
      <div className="absolute top-4 right-6 border border-cyan-500/50 rounded-xl overflow-hidden shadow-lg z-20">
        <video ref={videoRef} autoPlay playsInline muted className="w-48 h-36 object-cover rounded-xl" />
      </div>

      {/* Full-screen Exposure Video */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          key={exposureVideos[exposureIndex]}
          src={exposureVideos[exposureIndex]}
          autoPlay
          loop
          className="w-full h-full object-cover opacity-70"
        />

        <button
          onClick={() =>
            setExposureIndex((prev) =>
              prev === 0 ? exposureVideos.length - 1 : prev - 1
            )
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full text-cyan-300 z-10"
        >
          ◀
        </button>

        <button
          onClick={() =>
            setExposureIndex((prev) => (prev + 1) % exposureVideos.length)
          }
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 px-4 py-2 rounded-full text-cyan-300 z-10"
        >
          ▶
        </button>
      </div>

      {/* Session Info */}
      <div className="absolute bottom-4 right-6 bg-gray-900/60 px-6 py-3 rounded-xl border border-gray-800 shadow-md z-20">
        <p className="text-sm">
          <strong>Camera:</strong> {cameraActive ? "🎥 Active" : "❌ Not Active"} |{" "}
          <strong>Session ID:</strong> {sessionId || "Starting..."}
        </p>
      </div>

      {/* Fear Score Graph */}
      <div className="absolute bottom-4 left-6 w-[350px] bg-gray-900/80 rounded-2xl p-4 border border-gray-800 shadow-lg z-20">
        <h3 className="text-cyan-400 font-semibold mb-2 text-center">Fear Score Trend</h3>
        <Line data={fearData} />
      </div>
    </div>
  );
};

export default PatientDashboard;