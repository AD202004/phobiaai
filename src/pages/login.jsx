/*import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firbaseConfig'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      // rudimentary redirect (role-based happens after context loads)
      navigate('/dashboard/patient')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="w-full max-w-md bg-base-800 p-8 rounded-xl2 shadow-soft">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"/>
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"/>
          <button className="w-full bg-accent-500 hover:bg-accent-600 transition rounded-xl2 p-3 font-medium">
            Sign in
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-4">
          No account? <Link className="text-accent-500" to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
  ---------------------------------------------------


import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firbaseConfig.js'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)

      // 🔥 Fetch role from Firestore
      const userRef = doc(db, 'users', cred.user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const { role ,fullname} = userSnap.data()

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${role}: ${fullname}!`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          if (role === 'therapist') {
            navigate('/dashboard/therapist')
          } else {
            navigate('/dashboard/patient')
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'User Not Found',
          text: 'No role assigned. Please contact support.'
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="w-full max-w-md bg-base-800 p-8 rounded-xl2 shadow-soft">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-base-700 rounded-xl2 p-3 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-base-700 rounded-xl2 p-3 outline-none"
          />
          <button
            disabled={loading}
            className="w-full bg-accent-500 hover:bg-accent-600 transition rounded-xl2 p-3 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-4">
          No account?{' '}
          <Link className="text-accent-500" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
  ==========================================================================================
  
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firbaseConfig.js'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)

      // 🔥 Fetch user data from Firestore
      const userRef = doc(db, 'users', cred.user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const { role, fullName } = userSnap.data()

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${role}: ${fullName}`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          if (role === 'therapist') {
            navigate('/dashboard/therapist')
          } else {
            navigate('/dashboard/patient')
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'User Not Found',
          text: 'No role assigned. Please contact support.'
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="w-full max-w-md bg-base-800 p-8 rounded-xl2 shadow-soft">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
          />
          <button
            disabled={loading}
            className="w-full bg-accent-500 hover:bg-accent-600 transition rounded-xl2 p-3 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-4">
          No account?{' '}
          <Link className="text-accent-500" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
  */
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firbaseConfig.js'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)

      const userRef = doc(db, 'users', cred.user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const { role, fullName } = userSnap.data()

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome back, ${role}: ${fullName}`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          if (role === 'therapist') {
            navigate('/dashboard/therapist')
          } else {
            navigate('/dashboard/patient')
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'User Not Found',
          text: 'No role assigned. Please contact support.'
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                bg-gradient-to-br from-blue-100 via-teal-100 to-blue-50 
                animate-[pulse_14s_ease-in-out_infinite] px-4"
    >
      <div
        className="w-full max-w-md bg-white/60 backdrop-blur-xl 
                   p-8 rounded-2xl shadow-xl border border-white/40
                   transition duration-300 hover:shadow-2xl hover:-translate-y-1"
      >
        <h1 className="text-3xl font-semibold text-teal-800 text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-teal-600 mb-6 text-sm">
          Continue your safe exposure therapy journey
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/80 text-gray-800 
                       placeholder-gray-500 
                       rounded-xl p-3 outline-none shadow-inner
                       focus:ring-2 focus:ring-teal-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/80 text-gray-800 
                       placeholder-gray-500 
                       rounded-xl p-3 outline-none shadow-inner
                       focus:ring-2 focus:ring-teal-400 transition"
          />

          <button
            disabled={loading}
            className="w-full bg-teal-500 text-white 
                       hover:bg-teal-600 transition 
                       rounded-xl p-3 font-medium text-lg
                       shadow-md hover:shadow-lg
                       disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-teal-700 mt-4 text-center">
          No account?{' '}
          <Link className="text-teal-600 font-semibold hover:underline" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

