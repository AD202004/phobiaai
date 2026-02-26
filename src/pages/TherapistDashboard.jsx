/*import { useMemo, useState } from 'react'
import Sidebar from '../shared/Sidebar.jsx'
import FearScoreChart from '../shared/FearScoreChart.jsx'
import { signOut } from 'firebase/auth'
import { auth } from '../firbaseConfig.js'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function TherapistDashboard() {
  const [trend] = useState([
    { t: 0, score: 0.15 }, { t: 10, score: 0.22 }, { t: 20, score: 0.40 },
    { t: 30, score: 0.55 }, { t: 40, score: 0.38 }, { t: 50, score: 0.60 },
  ])

  const sessions = useMemo(() => ([
    { id: 'S-001', patient: 'John D', date: '2025-08-20', avg: 0.42 },
    { id: 'S-002', patient: 'John D', date: '2025-08-22', avg: 0.36 },
  ]), [])

  const navigate = useNavigate()

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
    <div className="min-h-screen grid grid-cols-[260px_1fr] relative">
      
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition"
      >
        Logout
      </button>

      <Sidebar />
      <main className="p-6 bg-base-900">
        <h1 className="text-2xl font-semibold mb-6">Therapist Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 bg-base-800 rounded-xl2 p-4 shadow-soft">
            <h2 className="text-lg mb-2">Real-time Fear Score</h2>
            <FearScoreChart data={trend} />
          </div>
          <div className="bg-base-800 rounded-xl2 p-4 shadow-soft">
            <h2 className="text-lg mb-3">Recent Sessions</h2>
            <ul className="space-y-3">
              {sessions.map(s => (
                <li key={s.id} className="bg-base-700 rounded-xl2 p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.id} • {s.patient}</p>
                    <p className="text-xs text-gray-300">{s.date}</p>
                  </div>
                  <span className="text-sm">Avg: {(s.avg*100).toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
-----------------------------------------------------------------------
import { useMemo, useState } from "react"
import { LogOut, Users, BarChart2, Clock, Target } from "lucide-react"
import Sidebar from "../shared/Sidebar.jsx"
import FearScoreChart from "../shared/FearScoreChart.jsx"

export default function TherapistDashboard() {
  const [trend] = useState([
    { t: 0, score: 3.1 }, { t: 10, score: 3.2 }, { t: 20, score: 3.0 },
    { t: 30, score: 3.4 }, { t: 40, score: 3.3 }, { t: 50, score: 3.2 },
  ])

  const sessions = useMemo(() => ([
    { id: "S-001", patient: "Sarah M.", level: "Level 3 - City Rooftop", score: 6.2, status: "completed" },
    { id: "S-002", patient: "Michael K.", level: "Level 2 - Mountain Vista", score: 7.8, status: "in-progress" },
    { id: "S-003", patient: "Emma L.", level: "Level 4 - Bridge View", score: 5.4, status: "completed" },
    { id: "S-004", patient: "David R.", level: "Level 1 - Low Height", score: 8.1, status: "paused" },
  ]), [])

  const stats = [
    { label: "Active Patients", value: 12, icon: <Users size={20} />, color: "bg-emerald-600/20 text-emerald-400" },
    { label: "Avg. Fear Reduction", value: "34%", icon: <BarChart2 size={20} />, color: "bg-green-600/20 text-green-400" },
    { label: "Total Sessions", value: 156, icon: <Clock size={20} />, color: "bg-blue-600/20 text-blue-400" },
    { label: "Completion Rate", value: "87%", icon: <Target size={20} />, color: "bg-purple-600/20 text-purple-400" },
  ]

  const statusColors = {
    completed: "text-emerald-400",
    "in-progress": "text-blue-400",
    paused: "text-yellow-400",
  }

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f172a] text-white">
      <Sidebar />

      <main className="p-6">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Therapist Dashboard</h1>
            <p className="text-gray-400 text-sm">Monitor patient progress and session analytics in real-time</p>
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl shadow">
            <LogOut size={18} /> Logout
          </button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 shadow flex flex-col gap-2">
              <div className={`p-2 rounded-lg w-fit ${s.color}`}>
                {s.icon}
              </div>
              <h3 className="text-sm text-gray-400">{s.label}</h3>
              <p className="text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          <div className="md:col-span-2 bg-slate-800 rounded-xl p-5 shadow">
            <h2 className="text-lg mb-3">Real-time Fear Score</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-emerald-400 text-sm">● Live Monitoring</span>
              <span className="text-emerald-400 font-bold text-xl">3.3</span>
            </div>
            <FearScoreChart data={trend} />
            <button className="mt-4 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow">
              Pause Monitoring
            </button>
          </div>

          
          <div className="bg-slate-800 rounded-xl p-5 shadow">
            <h2 className="text-lg mb-3">Recent Sessions</h2>
            <ul className="space-y-3">
              {sessions.map(s => (
                <li key={s.id} className="bg-slate-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{s.patient}</p>
                    <span className={`text-sm font-semibold ${statusColors[s.status]}`}>
                      Fear Score: {s.score}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{s.level}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
        <div className="mt-6 bg-slate-800 p-4 rounded-xl text-sm flex items-center justify-between">
          <span className="text-emerald-400">● System Active</span>
          <span className="text-gray-400">AI monitoring enabled</span>
        </div>
      </main>
    </div>
  )
} 
----------------------------------------------------------------------------------------
  import { useMemo, useState, useEffect } from "react"
  import { LogOut, Users, BarChart2, Clock, Target } from "lucide-react"
  import Sidebar from "../shared/Sidebar.jsx"
  import FearScoreChart from "../shared/FearScoreChart.jsx"
  
  export default function TherapistDashboard() {
    const [trend, setTrend] = useState([
      { t: 0, score: 3.1 },
      { t: 10, score: 3.2 },
      { t: 20, score: 3.0 },
      { t: 30, score: 3.4 },
      { t: 40, score: 3.3 },
      { t: 50, score: 3.2 },
    ])
  
    // Simulate live monitoring updates
    useEffect(() => {
      let time = 60
      const interval = setInterval(() => {
        setTrend(prev => {
          const nextScore = +(Math.max(2, Math.min(9, prev[prev.length - 1].score + (Math.random() - 0.5))).toFixed(1))
          const newData = [...prev, { t: time, score: nextScore }]
          time += 10
          return newData.slice(-10) // keep last 10 points for smooth graph
        })
      }, 2000)
  
      return () => clearInterval(interval)
    }, [])
  
    const sessions = useMemo(() => ([
      { id: "S-001", patient: "Sarah M.", level: "Level 3 - City Rooftop", score: 6.2, status: "completed" },
      { id: "S-002", patient: "Michael K.", level: "Level 2 - Mountain Vista", score: 7.8, status: "in-progress" },
      { id: "S-003", patient: "Emma L.", level: "Level 4 - Bridge View", score: 5.4, status: "completed" },
      { id: "S-004", patient: "David R.", level: "Level 1 - Low Height", score: 8.1, status: "paused" },
    ]), [])
  
    const stats = [
      { label: "Active Patients", value: 12, icon: <Users size={20} />, color: "bg-emerald-600/20 text-emerald-400" },
      { label: "Avg. Fear Reduction", value: "34%", icon: <BarChart2 size={20} />, color: "bg-green-600/20 text-green-400" },
      { label: "Total Sessions", value: 156, icon: <Clock size={20} />, color: "bg-blue-600/20 text-blue-400" },
      { label: "Completion Rate", value: "87%", icon: <Target size={20} />, color: "bg-purple-600/20 text-purple-400" },
    ]
  
    const statusColors = {
      completed: "text-emerald-400",
      "in-progress": "text-blue-400",
      paused: "text-yellow-400",
    }
  
    return (
      <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f172a] text-white">
        <Sidebar />
  
        <main className="p-6">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Therapist Dashboard</h1>
              <p className="text-gray-400 text-sm">Monitor patient progress and session analytics in real-time</p>
            </div>
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl shadow">
              <LogOut size={18} /> Logout
            </button>
          </div>
  
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-4 shadow flex flex-col gap-2">
                <div className={`p-2 rounded-lg w-fit ${s.color}`}>
                  {s.icon}
                </div>
                <h3 className="text-sm text-gray-400">{s.label}</h3>
                <p className="text-2xl font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
  
          <div className="grid gap-6 md:grid-cols-3">
            
            <div className="md:col-span-2 bg-slate-800 rounded-xl p-5 shadow">
              <h2 className="text-lg mb-3">Real-time Fear Score</h2>
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-400 text-sm">● Live Monitoring</span>
                <span className="text-emerald-400 font-bold text-xl">
                  {trend.length ? trend[trend.length - 1].score : "—"}
                </span>
              </div>
              <FearScoreChart data={trend} />
              <button className="mt-4 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow">
                Pause Monitoring
              </button>
            </div>
  
            
            <div className="bg-slate-800 rounded-xl p-5 shadow">
              <h2 className="text-lg mb-3">Recent Sessions</h2>
              <ul className="space-y-3">
                {sessions.map(s => (
                  <li key={s.id} className="bg-slate-700 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{s.patient}</p>
                      <span className={`text-sm font-semibold ${statusColors[s.status]}`}>
                        Fear Score: {s.score}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{s.level}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          
          <div className="mt-6 bg-slate-800 p-4 rounded-xl text-sm flex items-center justify-between">
            <span className="text-emerald-400">● System Active</span>
            <span className="text-gray-400">AI monitoring enabled</span>
          </div>
        </main>
      </div>
    )
  }
  */

 // TherapistDashboard.jsx
 /*
import React, { useEffect, useState, useMemo, useRef } from "react";
import { LogOut, Users, BarChart2, Clock, Target } from "lucide-react";
import Sidebar from "../shared/Sidebar.jsx";
import FearScoreChart from "../shared/FearScoreChart.jsx";
import { io } from "socket.io-client";

import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firbaseConfig.js"; // adjust path if needed

// --- Socket: adjust backend URL as needed ---
const SOCKET_URL = "http://localhost:8000"; // <-- change this to your backend
const socket = io(SOCKET_URL, { autoConnect: true, transports: ["websocket", "polling"] });

export default function TherapistDashboard() {
  // patient list + selection
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // live data
  const [liveTrend, setLiveTrend] = useState([]); // array of {t, scorePercent}
  const [liveFearPercent, setLiveFearPercent] = useState(null); // 0-100 %
  const [liveFearScaled, setLiveFearScaled] = useState(null); // 0-10 scaled
  const [liveExpression, setLiveExpression] = useState("—"); // latest detected emotion label

  // UI
  const [loadingPatients, setLoadingPatients] = useState(true);
  const currentSessionRef = useRef(null);

  // Stats (unchanged UI blocks)
  const stats = [
    { label: "Active Patients", value: 12, icon: <Users size={20} />, color: "bg-emerald-600/20 text-emerald-400" },
    { label: "Avg. Fear Reduction", value: "34%", icon: <BarChart2 size={20} />, color: "bg-green-600/20 text-green-400" },
    { label: "Total Sessions", value: 156, icon: <Clock size={20} />, color: "bg-blue-600/20 text-blue-400" },
    { label: "Completion Rate", value: "87%", icon: <Target size={20} />, color: "bg-purple-600/20 text-purple-400" },
  ];

  // ------------------------------
  // Firestore: subscribe to users where role == "patient"
  // ------------------------------
  useEffect(() => {
    setLoadingPatients(true);
    const q = query(collection(db, "users"), where("role", "==", "patient"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPatients(list);
        setLoadingPatients(false);
      },
      (err) => {
        console.error("Error fetching patients snapshot:", err);
        setLoadingPatients(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ------------------------------
  // Utility: try common session id fields from patient doc
  // ------------------------------
  function findSessionIdFromPatient(patient) {
    if (!patient) return null;
    return (
      patient.session_id ||
      patient.sessionId ||
      patient.currentSession ||
      patient.current_session ||
      patient.latestSessionId ||
      patient.activeSession ||
      patient.latest_session ||
      null
    );
  }

  // ------------------------------
  // Join/leave session room
  // ------------------------------
  const joinSessionRoom = (sessionId) => {
    if (!sessionId) return;
    // leave previous
    if (currentSessionRef.current) {
      try {
        socket.emit("leave_session", { session_id: currentSessionRef.current });
      } catch (e) {
        console.warn("leave_session emit failed", e);
      }
      socket.off("emotion_update");
      socket.offAny(); // optional cleanup of debug handler if used
    }

    currentSessionRef.current = sessionId;
    socket.emit("join_session", { session_id: sessionId });
    console.log("Joining session room:", sessionId);
  };

  const leaveCurrentSession = () => {
    if (currentSessionRef.current) {
      try {
        socket.emit("leave_session", { session_id: currentSessionRef.current });
      } catch (e) {
        console.warn("leave_session emit failed", e);
      }
      socket.off("emotion_update");
      currentSessionRef.current = null;
    }
  };

  // ------------------------------
  // When selecting a patient
  // - load historical fearTrend from Firestore doc (if present)
  // - join session room and listen for emotion_update
  // ------------------------------
  const handleSelectPatient = async (patient) => {
    if (!patient) return;

    setSelectedPatient(patient);
    setLiveTrend([]);
    setLiveFearPercent(null);
    setLiveFearScaled(null);
    setLiveExpression("—");

    // fetch fresh doc
    try {
      const docRef = doc(db, "users", patient.id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.fearTrend) && data.fearTrend.length > 0) {
          // expected shape: [{ t: 166xxxxxxx, scorePercent: 54 }, ...]
          setLiveTrend(data.fearTrend.slice(-50));
        } else if (Array.isArray(data.fearScores) && data.fearScores.length > 0) {
          // fallback: convert numeric array to percent (assuming numbers are 0-10)
          const converted = data.fearScores.map((s, i) => {
            const percent = typeof s === "number" ? Math.max(0, Math.min(100, (s / 10) * 100)) : 0;
            return { t: i, scorePercent: percent };
          });
          setLiveTrend(converted.slice(-50));
        }

        if (data.latestFear !== undefined && data.latestFear !== null) {
          // handle cases where latestFear stored as percent (0-100) or scale (0-10)
          const val = Number(data.latestFear);
          if (!Number.isNaN(val)) {
            if (val <= 10) {
              setLiveFearPercent((val / 10) * 100);
              setLiveFearScaled(val.toFixed(1));
            } else {
              setLiveFearPercent(val);
              setLiveFearScaled((val / 10).toFixed(1));
            }
          }
        }

        if (data.latestExpression) {
          setLiveExpression(data.latestExpression);
        }
      }
    } catch (err) {
      console.error("Error loading patient doc:", err);
    }

    // determine sessionId to join
    const sessionId = findSessionIdFromPatient(patient);
    if (!sessionId) {
      console.warn("No session_id found in patient doc. Therapist must join the same session id the patient created.");
      // If there's no session id, we cannot join the room. Inform user in UI (we render message below).
    } else {
      joinSessionRoom(sessionId);

      // Register listener for backend's `emotion_update` event
      socket.on("emotion_update", (payload) => {
        try {
          // payload example from your backend:
          // {
          //   'emotion': '😨 Fear',
          //   'confidence': 72.5,
          //   'allEmotions': { '😠 Angry': 1.2, '😨 Fear': 72.5, ... },
          //   'timestamp': '...'
          // }
          if (!payload) return;

          // Optional: if your backend also sends session info in payload in future, check it
          // if (payload.session_id && payload.session_id !== sessionId) return;

          const all = payload.allEmotions || {};
          let fearPercent = null;

          // Try to find an emotion label that contains 'Fear' (robust to emoji + text)
          for (const key of Object.keys(all)) {
            if (key.toLowerCase().includes("fear")) {
              fearPercent = Number(all[key]);
              break;
            }
          }

          // fallback: use 'confidence' if that corresponds to the detected emotion (and it's fear)
          if (fearPercent === null) {
            // if payload.emotion includes 'fear', use confidence
            if (payload.emotion && payload.emotion.toLowerCase().includes("fear") && payload.confidence !== undefined) {
              fearPercent = Number(payload.confidence);
            }
          }

          // final fallback: try any numeric in allEmotions by index 2 if label order known (risky)
          if (fearPercent === null && Object.values(all).length > 2) {
            // don't rely on this unless necessary
            const vals = Object.values(all).map((v) => Number(v));
            if (!Number.isNaN(vals[2])) fearPercent = vals[2];
          }

          // if we found a percent, update state
          if (fearPercent !== null && !Number.isNaN(fearPercent)) {
            const percent = Math.max(0, Math.min(100, Number(fearPercent)));
            setLiveFearPercent(percent);
            setLiveFearScaled((percent / 10).toFixed(1)); // scale 0-10
            const ts = payload.timestamp ? new Date(payload.timestamp).getTime() : Date.now();
            setLiveTrend((prev) => {
              const next = [...prev, { t: ts, scorePercent: percent }];
              return next.slice(-100);
            });
          }

          // update detected expression string
          if (payload.emotion) {
            setLiveExpression(payload.emotion);
          }
        } catch (err) {
          console.error("Error processing emotion_update payload", err);
        }
      });

      // DEBUG: log all socket events temporarily (uncomment to debug)
      socket.onAny((event, data) => {
        // console.debug("Socket event:", event, data);
      });
    }
  };

  // Cleanup socket listeners when unmounting
  useEffect(() => {
    return () => {
      leaveCurrentSession();
      try {
        socket.disconnect();
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For UI: displayable strings
  const displayPercent = liveFearPercent !== null ? `${Number(liveFearPercent).toFixed(1)}%` : "—";
  const displayScaled = liveFearScaled !== null ? `${liveFearScaled}/10` : "—";

  // status colors for recent sessions (kept from your previous file)
  const statusColors = {
    completed: "text-emerald-400",
    "in-progress": "text-blue-400",
    paused: "text-yellow-400",
  };

  // dummy recent sessions kept unchanged (you can replace with real)
  const sessions = useMemo(
    () => [
      { id: "S-001", patient: "Sarah M.", level: "Level 3 - City Rooftop", score: 6.2, status: "completed" },
      { id: "S-002", patient: "Michael K.", level: "Level 2 - Mountain Vista", score: 7.8, status: "in-progress" },
      { id: "S-003", patient: "Emma L.", level: "Level 4 - Bridge View", score: 5.4, status: "completed" },
      { id: "S-004", patient: "David R.", level: "Level 1 - Low Height", score: 8.1, status: "paused" },
    ],
    []
  );

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f172a] text-white">
      <Sidebar />

      <main className="p-6">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Therapist Dashboard</h1>
            <p className="text-gray-400 text-sm">Monitor patient progress and session analytics in real-time</p>
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl shadow">
            <LogOut size={18} /> Logout
          </button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 shadow flex flex-col gap-2">
              <div className={`p-2 rounded-lg w-fit ${s.color}`}>{s.icon}</div>
              <h3 className="text-sm text-gray-400">{s.label}</h3>
              <p className="text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          <div className="md:col-span-1 bg-slate-800 rounded-xl p-5 shadow h-fit">
            <h2 className="text-lg mb-3">Registered Patients</h2>

            {loadingPatients && <p className="text-gray-400 text-sm">Loading patients…</p>}
            {!loadingPatients && patients.length === 0 && <p className="text-gray-400 text-sm">No patients found</p>}

            <ul className="space-y-2 max-h-[45vh] overflow-y-auto">
              {patients.map((p) => (
                <li
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-slate-700 transition ${
                    selectedPatient?.id === p.id ? "bg-slate-700 ring-2 ring-emerald-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.name ?? "Unnamed Patient"}</p>
                      <p className="text-xs text-gray-400">{p.email ?? ""}</p>
                      
                      {findSessionIdFromPatient(p) ? null : (
                        <p className="text-xs text-yellow-300">No active session id in record</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-300">{p.latestFear ? Number(p.latestFear).toFixed(1) : "—"}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="md:col-span-2 bg-slate-800 rounded-xl p-5 shadow">
            <h2 className="text-lg mb-3">Real-time Fear Score</h2>

            <div className="flex justify-between items-center mb-2">
              <span className="text-emerald-400 text-sm">● Live Monitoring</span>

              <div className="text-right">
                <p className="text-sm text-gray-300">{selectedPatient ? selectedPatient.name : "No patient selected"}</p>
                <p className="text-xl font-bold text-emerald-400">
                  {displayScaled} <span className="text-sm text-gray-300">/ {displayPercent} • Emotion: {liveExpression}</span>
                </p>
              </div>
            </div>

            <div className="mb-4">
              
              <FearScoreChart data={liveTrend.map((p) => ({ t: p.t, score: p.scorePercent }))} />
            </div>

            <div className="flex gap-3">
              <button
                className="mt-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow"
                onClick={() => {
                  // Pause monitoring: leave session but keep displayed data
                  leaveCurrentSession();
                }}
              >
                Pause Monitoring
              </button>

              <button
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow"
                onClick={() => {
                  // Re-join current selected patient session
                  if (selectedPatient) {
                    const sessionId = findSessionIdFromPatient(selectedPatient);
                    if (sessionId) handleSelectPatient(selectedPatient);
                  }
                }}
              >
                Resume Monitoring
              </button>
            </div>

            
            {selectedPatient && !findSessionIdFromPatient(selectedPatient) && (
              <div className="mt-4 bg-yellow-900/20 p-3 rounded">
                <p className="text-yellow-200 text-sm">
                  This patient has no `session_id` field in the Firestore document. To receive live `emotion_update`
                  events the therapist must join the same session room that the patient created. Make sure the patient
                  starts a session (backend `start_session`) and that the produced `session_id` is saved to the user's
                  Firestore doc under one of: <code>session_id</code>, <code>currentSession</code>, <code>latestSessionId</code>.
                </p>
              </div>
            )}
          </div>
        </div>

        
        <div className="mt-6 bg-slate-800 p-4 rounded-xl text-sm flex items-center justify-between">
          <div>
            <span className="text-emerald-400">● System Active</span>
            <p className="text-gray-400">AI monitoring enabled</p>
          </div>

          <div className="w-1/3">
            <h3 className="text-sm text-gray-400">Recent Sessions</h3>
            <ul className="space-y-2">
              {sessions.map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span>{s.patient}</span>
                  <span className={`font-semibold ${statusColors[s.status]}`}>Fear: {s.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
  ------------------------------------------------------------------------------------------------
  // working without p name

import React, { useEffect, useState, useMemo, useRef } from "react";
import { LogOut, Users, BarChart2, Clock, Target } from "lucide-react";
import Sidebar from "../shared/Sidebar.jsx";
import FearScoreChart from "../shared/FearScoreChart.jsx";
import { io } from "socket.io-client";

import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firbaseConfig.js"; // adjust path if needed

// --- Socket backend URL ---
const SOCKET_URL = "http://localhost:8000";

export default function TherapistDashboard() {
  // patient list + selection
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // live data
  const [liveTrend, setLiveTrend] = useState([]); // array of {t, scorePercent}
  const [liveFearPercent, setLiveFearPercent] = useState(null); // 0-100 %
  const [liveFearScaled, setLiveFearScaled] = useState(null); // 0-10 scaled
  const [liveExpression, setLiveExpression] = useState("—"); // latest detected emotion label

  // UI
  const [loadingPatients, setLoadingPatients] = useState(true);
  const currentSessionRef = useRef(null);
  const socketRef = useRef(null);

  // Stats (unchanged UI blocks)
  const stats = [
    { label: "Active Patients", value: 12, icon: <Users size={20} />, color: "bg-emerald-600/20 text-emerald-400" },
    { label: "Avg. Fear Reduction", value: "34%", icon: <BarChart2 size={20} />, color: "bg-green-600/20 text-green-400" },
    { label: "Total Sessions", value: 156, icon: <Clock size={20} />, color: "bg-blue-600/20 text-blue-400" },
    { label: "Completion Rate", value: "87%", icon: <Target size={20} />, color: "bg-purple-600/20 text-purple-400" },
  ];

  // ------------------------------
  // Init socket once
  // ------------------------------
  useEffect(() => {
    // create a socket but don't create multiple instances
    socketRef.current = io(SOCKET_URL, { autoConnect: true, transports: ["websocket", "polling"] });

    const s = socketRef.current;
    s.on("connect", () => console.log("⚡ Socket connected:", s.id));
    s.on("disconnect", (reason) => console.log("⚠ Socket disconnected:", reason));
    s.on("connect_error", (err) => console.error("Socket connect_error:", err));

    // optional debug: log all events
    // s.onAny((event, ...args) => console.debug("socket event:", event, args));

    return () => {
      try {
        s.off("connect");
        s.off("disconnect");
        s.off("connect_error");
        s.off("emotion_update");
        s.disconnect();
        console.log("Socket disconnected on unmount");
      } catch (e) {
        console.warn("Socket cleanup error", e);
      }
    };
  }, []);

  // ------------------------------
  // Firestore: subscribe to users where role == "patient"
  // ------------------------------
  useEffect(() => {
    setLoadingPatients(true);
    const q = query(collection(db, "users"), where("role", "==", "patient"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPatients(list);
        setLoadingPatients(false);
      },
      (err) => {
        console.error("Error fetching patients snapshot:", err);
        setLoadingPatients(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ------------------------------
  // Utility: try common session id fields from patient doc
  // ------------------------------
  function findSessionIdFromPatient(patient) {
    if (!patient) return null;
    return (
      patient.session_id ||
      patient.sessionId ||
      patient.currentSession ||
      patient.current_session ||
      patient.latestSessionId ||
      patient.activeSession ||
      patient.latest_session ||
      null
    );
  }

  // ------------------------------
  // Join/leave session room
  // ------------------------------
  const joinSessionRoom = (sessionId) => {
    if (!sessionId) return;
    const s = socketRef.current;
    if (!s) {
      console.warn("Socket not initialized yet");
      return;
    }

    // Leave previous room
    if (currentSessionRef.current && currentSessionRef.current !== sessionId) {
      try {
        s.emit("leave_session", { session_id: currentSessionRef.current });
        console.log("Left previous session:", currentSessionRef.current);
      } catch (e) {
        console.warn("leave_session emit failed", e);
      }
    }

    // Clean previous handler to avoid duplicates
    s.off("emotion_update");

    // Set current session and join
    currentSessionRef.current = sessionId;
    s.emit("join_session", { session_id: sessionId });
    console.log("Joining session room:", sessionId);

    // Register listener for emotion updates (single listener)
    s.on("emotion_update", (payload) => {
      try {
        console.debug("🔥 emotion_update received:", payload);

        if (!payload) return;

        const all = payload.allEmotions || {};
        let fearPercent = null;

        // Try to find 'fear' label
        for (const key of Object.keys(all)) {
          if (key.toLowerCase().includes("fear")) {
            fearPercent = Number(all[key]);
            break;
          }
        }

        // fallback to confidence when detected emotion is fear
        if (fearPercent === null) {
          if (payload.emotion && payload.emotion.toLowerCase().includes("fear") && payload.confidence !== undefined) {
            fearPercent = Number(payload.confidence);
          }
        }

        // final fallback: use the largest numeric value in allEmotions (risky but safe)
        if (fearPercent === null && Object.values(all).length > 0) {
          const vals = Object.values(all).map((v) => Number(v)).filter((v) => !Number.isNaN(v));
          if (vals.length > 0) {
            // choose the max as a fallback
            fearPercent = Math.max(...vals);
          }
        }

        if (fearPercent !== null && !Number.isNaN(fearPercent)) {
          const percent = Math.max(0, Math.min(100, Number(fearPercent)));
          setLiveFearPercent(percent);
          setLiveFearScaled((percent / 10).toFixed(1)); // scale 0-10
          const ts = payload.timestamp ? new Date(payload.timestamp).getTime() : Date.now();
          setLiveTrend((prev) => {
            const next = [...prev, { t: ts, scorePercent: percent }];
            return next.slice(-100);
          });
        }

        if (payload.emotion) setLiveExpression(payload.emotion);
      } catch (err) {
        console.error("Error processing emotion_update payload", err);
      }
    });
  };

  const leaveCurrentSession = () => {
    const s = socketRef.current;
    if (!s) return;
    if (currentSessionRef.current) {
      try {
        s.emit("leave_session", { session_id: currentSessionRef.current });
      } catch (e) {
        console.warn("leave_session emit failed", e);
      }
      s.off("emotion_update");
      currentSessionRef.current = null;
      console.log("Left current session (therapist).");
    }
  };

  // ------------------------------
  // When selecting a patient
  // - load historical fearTrend from Firestore doc (if present)
  // - join session room and listen for emotion_update
  // ------------------------------
  const handleSelectPatient = async (patient) => {
    if (!patient) return;

    setSelectedPatient(patient);
    setLiveTrend([]);
    setLiveFearPercent(null);
    setLiveFearScaled(null);
    setLiveExpression("—");

    // fetch fresh doc
    try {
      const docRef = doc(db, "users", patient.id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.fearTrend) && data.fearTrend.length > 0) {
          setLiveTrend(data.fearTrend.slice(-50));
        } else if (Array.isArray(data.fearScores) && data.fearScores.length > 0) {
          const converted = data.fearScores.map((s, i) => {
            const percent = typeof s === "number" ? Math.max(0, Math.min(100, (s / 10) * 100)) : 0;
            return { t: i, scorePercent: percent };
          });
          setLiveTrend(converted.slice(-50));
        }

        if (data.latestFear !== undefined && data.latestFear !== null) {
          const val = Number(data.latestFear);
          if (!Number.isNaN(val)) {
            if (val <= 10) {
              setLiveFearPercent((val / 10) * 100);
              setLiveFearScaled(val.toFixed(1));
            } else {
              setLiveFearPercent(val);
              setLiveFearScaled((val / 10).toFixed(1));
            }
          }
        }

        if (data.latestExpression) {
          setLiveExpression(data.latestExpression);
        }
      }
    } catch (err) {
      console.error("Error loading patient doc:", err);
    }

    // determine sessionId to join
    const sessionId = findSessionIdFromPatient(patient);
    if (!sessionId) {
      console.warn("No session_id found in patient doc. Therapist must join the same session id the patient created.");
    } else {
      joinSessionRoom(sessionId);
    }
  };

  // Cleanup socket listeners when unmounting
  useEffect(() => {
    return () => {
      leaveCurrentSession();
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For UI: displayable strings
  const displayPercent = liveFearPercent !== null ? `${Number(liveFearPercent).toFixed(1)}%` : "—";
  const displayScaled = liveFearScaled !== null ? `${liveFearScaled}/10` : "—";

  // status colors for recent sessions (kept from your previous file)
  const statusColors = {
    completed: "text-emerald-400",
    "in-progress": "text-blue-400",
    paused: "text-yellow-400",
  };

  // dummy recent sessions kept unchanged (you can replace with real)
  const sessions = useMemo(
    () => [
      { id: "S-001", patient: "Sarah M.", level: "Level 3 - City Rooftop", score: 6.2, status: "completed" },
      { id: "S-002", patient: "Michael K.", level: "Level 2 - Mountain Vista", score: 7.8, status: "in-progress" },
      { id: "S-003", patient: "Emma L.", level: "Level 4 - Bridge View", score: 5.4, status: "completed" },
      { id: "S-004", patient: "David R.", level: "Level 1 - Low Height", score: 8.1, status: "paused" },
    ],
    []
  );

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f172a] text-white">
      <Sidebar />

      <main className="p-6">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Therapist Dashboard</h1>
            <p className="text-gray-400 text-sm">Monitor patient progress and session analytics in real-time</p>
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl shadow">
            <LogOut size={18} /> Logout
          </button>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 shadow flex flex-col gap-2">
              <div className={`p-2 rounded-lg w-fit ${s.color}`}>{s.icon}</div>
              <h3 className="text-sm text-gray-400">{s.label}</h3>
              <p className="text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          <div className="md:col-span-1 bg-slate-800 rounded-xl p-5 shadow h-fit">
            <h2 className="text-lg mb-3">Registered Patients</h2>

            {loadingPatients && <p className="text-gray-400 text-sm">Loading patients…</p>}
            {!loadingPatients && patients.length === 0 && <p className="text-gray-400 text-sm">No patients found</p>}

            <ul className="space-y-2 max-h-[45vh] overflow-y-auto">
              {patients.map((p) => (
                <li
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-slate-700 transition ${
                    selectedPatient?.id === p.id ? "bg-slate-700 ring-2 ring-emerald-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.name ?? "Unnamed Patient"}</p>
                      <p className="text-xs text-gray-400">{p.email ?? ""}</p>
                      
                      {findSessionIdFromPatient(p) ? null : (
                        <p className="text-xs text-yellow-300">No active session id in record</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-300">{p.latestFear ? Number(p.latestFear).toFixed(1) : "—"}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="md:col-span-2 bg-slate-800 rounded-xl p-5 shadow">
            <h2 className="text-lg mb-3">Real-time Fear Score</h2>

            <div className="flex justify-between items-center mb-2">
              <span className="text-emerald-400 text-sm">● Live Monitoring</span>

              <div className="text-right">
                <p className="text-sm text-gray-300">{selectedPatient ? selectedPatient.name : "No patient selected"}</p>
                <p className="text-xl font-bold text-emerald-400">
                  {displayScaled} <span className="text-sm text-gray-300">/ {displayPercent} • Emotion: {liveExpression}</span>
                </p>
              </div>
            </div>

            <div className="mb-4">
              <FearScoreChart data={liveTrend.map((p) => ({ t: p.t, score: p.scorePercent }))} />
            </div>

            <div className="flex gap-3">
              <button
                className="mt-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow"
                onClick={() => {
                  // Pause monitoring: leave session but keep displayed data
                  leaveCurrentSession();
                }}
              >
                Pause Monitoring
              </button>

              <button
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow"
                onClick={() => {
                  // Re-join current selected patient session
                  if (selectedPatient) {
                    const sessionId = findSessionIdFromPatient(selectedPatient);
                    if (sessionId) handleSelectPatient(selectedPatient);
                  }
                }}
              >
                Resume Monitoring
              </button>
            </div>

            {selectedPatient && !findSessionIdFromPatient(selectedPatient) && (
              <div className="mt-4 bg-yellow-900/20 p-3 rounded">
                <p className="text-yellow-200 text-sm">
                  This patient has no `session_id` field in the Firestore document. To receive live `emotion_update`
                  events the therapist must join the same session room that the patient created. Make sure the patient
                  starts a session (backend `start_session`) and that the produced `session_id` is saved to the user's
                  Firestore doc under one of: <code>session_id</code>, <code>currentSession</code>, <code>latestSessionId</code>.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-slate-800 p-4 rounded-xl text-sm flex items-center justify-between">
          <div>
            <span className="text-emerald-400">● System Active</span>
            <p className="text-gray-400">AI monitoring enabled</p>
          </div>

          <div className="w-1/3">
            <h3 className="text-sm text-gray-400">Recent Sessions</h3>
            <ul className="space-y-2">
              {sessions.map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span>{s.patient}</span>
                  <span className={`font-semibold ${statusColors[s.status]}`}>Fear: {s.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
  
*/
import React, { useEffect, useState, useMemo, useRef } from "react";
import { LogOut, Users, BarChart2, Clock, Target } from "lucide-react";
import Sidebar from "../shared/Sidebar.jsx";
import { signOut } from "firebase/auth";
import FearScoreChart from "../shared/FearScoreChart.jsx";
import { io } from "socket.io-client";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth,db } from "../firbaseConfig.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SOCKET_URL = "http://localhost:8000";

export default function TherapistDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [liveTrend, setLiveTrend] = useState([]);
  const [liveFearPercent, setLiveFearPercent] = useState(null);
  const [liveFearScaled, setLiveFearScaled] = useState(null);
  const [liveExpression, setLiveExpression] = useState("—");
  const [loadingPatients, setLoadingPatients] = useState(true);

  const currentSessionRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const stats = [
    { label: "Active Patients", value: 12, icon: <Users size={20} />, color: "bg-emerald-600/20 text-emerald-400" },
    { label: "Avg. Fear Reduction", value: "34%", icon: <BarChart2 size={20} />, color: "bg-green-600/20 text-green-400" },
    { label: "Total Sessions", value: 156, icon: <Clock size={20} />, color: "bg-blue-600/20 text-blue-400" },
    { label: "Completion Rate", value: "87%", icon: <Target size={20} />, color: "bg-purple-600/20 text-purple-400" },
  ];
  const handleLogout = async () => {
    await signOut(auth);
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been successfully logged out.",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => navigate("/"));  
    navigate("/");
  };  

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { autoConnect: true, transports: ["websocket", "polling"] });
    const s = socketRef.current;

    s.on("connect", () => console.log("⚡ Socket connected:", s.id));
    s.on("disconnect", (reason) => console.log("⚠ Socket disconnected:", reason));

    return () => {
      try {
        s.off("connect");
        s.off("disconnect");
        s.off("emotion_update");
        s.disconnect();
      } catch {}
    };
  }, []);

  useEffect(() => {
    setLoadingPatients(true);
    const q = query(collection(db, "users"), where("role", "==", "patient"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPatients(list);
        setLoadingPatients(false);
      },
      () => setLoadingPatients(false)
    );

    return () => unsubscribe();
  }, []);

  function findSessionIdFromPatient(patient) {
    if (!patient) return null;
    return (
      patient.session_id ||
      patient.sessionId ||
      patient.currentSession ||
      patient.latestSessionId ||
      null
    );
  }

  const joinSessionRoom = (sessionId) => {
    const s = socketRef.current;
    if (!s) return;

    if (currentSessionRef.current && currentSessionRef.current !== sessionId) {
      s.emit("leave_session", { session_id: currentSessionRef.current });
    }

    s.off("emotion_update");
    currentSessionRef.current = sessionId;
    s.emit("join_session", { session_id: sessionId });

    s.on("emotion_update", (payload) => {
      try {
        if (!payload) return;

        const all = payload.allEmotions || {};
        let fearPercent = null;

        for (const key of Object.keys(all)) {
          if (key.toLowerCase().includes("fear")) {
            fearPercent = Number(all[key]);
            break;
          }
        }

        if (fearPercent === null && payload.emotion?.toLowerCase().includes("fear")) {
          fearPercent = Number(payload.confidence);
        }

        if (fearPercent !== null) {
          const percent = Math.min(100, Math.max(0, fearPercent));
          setLiveFearPercent(percent);
          setLiveFearScaled((percent / 10).toFixed(1));
          setLiveTrend((prev) => [...prev, { t: Date.now(), scorePercent: percent }].slice(-100));
        }

        if (payload.emotion) setLiveExpression(payload.emotion);
      } catch (e) {
        console.error("emotion_update error", e);
      }
    });
  };

  const leaveCurrentSession = () => {
    const s = socketRef.current;
    if (!s) return;

    if (currentSessionRef.current) {
      s.emit("leave_session", { session_id: currentSessionRef.current });
      s.off("emotion_update");
      currentSessionRef.current = null;
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setLiveTrend([]);
    setLiveFearPercent(null);
    setLiveFearScaled(null);
    setLiveExpression("—");

    try {
      const snapshot = await getDoc(doc(db, "users", patient.id));
      if (snapshot.exists()) {
        const data = snapshot.data();

        if (Array.isArray(data.fearTrend)) setLiveTrend(data.fearTrend.slice(-50));
        if (data.latestFear !== undefined) {
          const v = Number(data.latestFear);
          setLiveFearPercent(v <= 10 ? (v / 10) * 100 : v);
          setLiveFearScaled(v <= 10 ? v.toFixed(1) : (v / 10).toFixed(1));
        }
        if (data.latestExpression) setLiveExpression(data.latestExpression);
      }
    } catch {}

    const sessionId = findSessionIdFromPatient(patient);
    if (sessionId) joinSessionRoom(sessionId);
  };

  const displayPercent = liveFearPercent !== null ? `${liveFearPercent.toFixed(1)}%` : "—";
  const displayScaled = liveFearScaled !== null ? `${liveFearScaled}/10` : "—";

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[#0f172a] text-white">
      <Sidebar />

      <main className="p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Therapist Dashboard</h1>
            <p className="text-gray-400 text-sm">Monitor patient progress and session analytics in real-time</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl shadow">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 shadow flex flex-col gap-2">
              <div className={`p-2 rounded-lg w-fit ${s.color}`}>{s.icon}</div>
              <h3 className="text-sm text-gray-400">{s.label}</h3>
              <p className="text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          <div className="md:col-span-1 bg-slate-800 rounded-xl p-5 shadow h-fit">
            <h2 className="text-lg mb-3">Registered Patients</h2>

            {loadingPatients && <p className="text-gray-400 text-sm">Loading patients…</p>}

            <ul className="space-y-2 max-h-[45vh] overflow-y-auto">
              {patients.map((p) => (
                <li
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-slate-700 transition ${
                    selectedPatient?.id === p.id ? "bg-slate-700 ring-2 ring-emerald-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.fullName ?? "Unnamed Patient"}</p>
                      <p className="text-xs text-gray-400">{p.email ?? ""}</p>
                      {findSessionIdFromPatient(p) ? null : (
                        <p className="text-xs text-yellow-300">No active session id</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-300">{p.latestFear ? Number(p.latestFear).toFixed(1) : "—"}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="md:col-span-2 bg-slate-800 rounded-xl p-5 shadow">
            <h2 className="text-lg mb-3">Real-time Fear Score</h2>

            <div className="flex justify-between items-center mb-2">
              <span className="text-emerald-400 text-sm">● Live Monitoring</span>

              <div className="text-right">
                <p className="text-sm text-gray-300">
                  {selectedPatient ? selectedPatient.fullName : "No patient selected"}
                </p>

                <p className="text-xl font-bold text-emerald-400">
                  {displayScaled} <span className="text-sm text-gray-300">/ {displayPercent} • Emotion: {liveExpression}</span>
                </p>
              </div>
            </div>

            <div className="mb-4">
              <FearScoreChart data={liveTrend.map((p) => ({ t: p.t, score: p.scorePercent }))} />
            </div>

            <div className="flex gap-3">
              <button
                className="mt-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow"
                onClick={leaveCurrentSession}
              >
                Pause Monitoring
              </button>

              <button
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow"
                onClick={() => selectedPatient && handleSelectPatient(selectedPatient)}
              >
                Resume Monitoring
              </button>
            </div>

            {selectedPatient && !findSessionIdFromPatient(selectedPatient) && (
              <div className="mt-4 bg-yellow-900/20 p-3 rounded">
                <p className="text-yellow-200 text-sm">
                  This patient has no active session ID. Ask the patient to start a session.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ONLY System Active — removed Sarah etc. */}
        <div className="mt-6 bg-slate-800 p-4 rounded-xl text-sm">
          <span className="text-emerald-400">● System Active</span>
          <p className="text-gray-400">AI monitoring enabled</p>
        </div>

      </main>
    </div>
  );
}
