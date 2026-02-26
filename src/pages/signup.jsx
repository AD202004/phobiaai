
/*import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firbaseConfig.js'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.'
      })
      return
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid), { role, email })

      // ✅ Success popup & navigate only after "OK"
      Swal.fire({
        icon: 'success',
        title: 'Registered!',
        text: 'Your account has been created successfully.',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          if (role === 'therapist') {
            navigate('/dashboard/therapist')
          } else {
            navigate('/dashboard/patient')
          }
        }
      })

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        Swal.fire({
          icon: 'error',
          title: 'Email in Use',
          text: 'This email is already registered. Please login instead.'
        })
      } else if (err.code === 'auth/invalid-email') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address.'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: err.message
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="w-full max-w-md bg-base-800 p-8 rounded-xl2 shadow-soft">
        <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
        <form onSubmit={handleSignup} className="space-y-4">
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-base-700 rounded-xl2 p-3 outline-none"
          >
            <option value="patient">Patient</option>
            <option value="therapist">Therapist</option>
          </select>
          <button className="w-full bg-accent-500 hover:bg-accent-600 transition rounded-xl2 p-3 font-medium">
            Sign up
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-4">
          Already have an account?{' '}
          <Link className="text-accent-500" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}


import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firbaseConfig.js'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.'
      })
      return
    }

    try {
      // Create user account first
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created:', cred.user.uid) // Debug log
      
      try {
        // Then save to Firestore
        await setDoc(doc(db, 'users', cred.user.uid), { 
          role, 
          email,
          createdAt: new Date().toISOString()
        })
        console.log('User data saved to Firestore') // Debug log
        
        // Success alert - only shown if both operations succeed
        Swal.fire({
          icon: 'success',
          title: 'Registered!',
          text: 'Your account has been created successfully.',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            if (role === 'therapist') {
              navigate('/dashboard/therapist')
            } else {
              navigate('/dashboard/patient')
            }
          }
        })
        
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError)
        // Still show success since user account was created
        Swal.fire({
          icon: 'warning',
          title: 'Account Created',
          text: 'Account created successfully, but there was an issue saving additional data. You can still proceed.',
          confirmButtonText: 'Continue'
        }).then(() => {
          if (role === 'therapist') {
            navigate('/dashboard/therapist')
          } else {
            navigate('/dashboard/patient')
          }
        })
      }

    } catch (authError) {
      console.error('Auth error:', authError)
      
      if (authError.code === 'auth/email-already-in-use') {
        Swal.fire({
          icon: 'error',
          title: 'Email in Use',
          text: 'This email is already registered. Please login instead.'
        })
      } else if (authError.code === 'auth/invalid-email') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address.'
        })
      } else if (authError.code === 'auth/weak-password') {
        Swal.fire({
          icon: 'error',
          title: 'Weak Password',
          text: 'Password must be at least 6 characters long.'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: authError.message || 'An error occurred during signup. Please try again.'
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="w-full max-w-md bg-base-800 p-8 rounded-xl2 shadow-soft">
        <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-base-700 rounded-xl2 p-3 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-base-700 rounded-xl2 p-3 outline-none"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-base-700 rounded-xl2 p-3 outline-none"
          >
            <option value="patient">Patient</option>
            <option value="therapist">Therapist</option>
          </select>
          <button 
            type="submit"
            className="w-full bg-accent-500 hover:bg-accent-600 transition rounded-xl2 p-3 font-medium"
          >
            Sign up
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-4">
          Already have an account?{' '}
          <Link className="text-accent-500" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
  ==============================================================================================
  
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firbaseConfig.js'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [license, setLicense] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.'
      })
      return
    }

    try {
      // Create user account first
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      console.log('User created:', cred.user.uid) 
      
      try {
        // Build user data object
        const userData = {
          role,
          email,
          fullName,
          age,
          createdAt: new Date().toISOString()
        }

        // If therapist, add extra fields
        if (role === 'therapist') {
          userData.specialization = specialization
          userData.license = license
        }

        // Save to Firestore
        await setDoc(doc(db, 'users', cred.user.uid), userData)
        console.log('User data saved to Firestore') 
        
        Swal.fire({
          icon: 'success',
          title: 'Registered!',
          text: 'Your account has been created successfully.',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            if (role === 'therapist') {
              navigate('/dashboard/therapist')
            } else {
              navigate('/dashboard/patient')
            }
          }
        })
        
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError)
        Swal.fire({
          icon: 'warning',
          title: 'Account Created',
          text: 'Account created successfully, but there was an issue saving additional data. You can still proceed.',
          confirmButtonText: 'Continue'
        }).then(() => {
          if (role === 'therapist') {
            navigate('/dashboard/therapist')
          } else {
            navigate('/dashboard/patient')
          }
        })
      }

    } catch (authError) {
      console.error('Auth error:', authError)
      
      if (authError.code === 'auth/email-already-in-use') {
        Swal.fire({
          icon: 'error',
          title: 'Email in Use',
          text: 'This email is already registered. Please login instead.'
        })
      } else if (authError.code === 'auth/invalid-email') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address.'
        })
      } else if (authError.code === 'auth/weak-password') {
        Swal.fire({
          icon: 'error',
          title: 'Weak Password',
          text: 'Password must be at least 6 characters long.'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: authError.message || 'An error occurred during signup. Please try again.'
        })
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-900">
      <div className="w-full max-w-md bg-base-800 p-8 rounded-xl2 shadow-soft">
        <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          
          
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
            required
          />

          
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
            required
          />

          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
            required
          />

          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
            required
          />

          
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-base-700 text-white rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="patient">Patient</option>
            <option value="therapist">Therapist</option>
          </select>

          
          {role === 'therapist' && (
            <>
              <input
                type="text"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
                required
              />
              <input
                type="text"
                placeholder="License Number"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full bg-base-700 text-white placeholder-gray-400 rounded-xl2 p-3 outline-none focus:ring-2 focus:ring-accent-500"
                required
              />
            </>
          )}

          <button 
            type="submit"
            className="w-full bg-accent-500 hover:bg-accent-600 transition rounded-xl2 p-3 font-medium"
          >
            Sign up
          </button>
        </form>

        <p className="text-sm text-gray-300 mt-4">
          Already have an account?{' '}
          <Link className="text-accent-500" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
  */
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firbaseConfig.js'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [license, setLicense] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.'
      })
      return
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)

      const userData = {
        role,
        email,
        fullName,
        age,
        createdAt: new Date().toISOString()
      }

      if (role === 'therapist') {
        userData.specialization = specialization
        userData.license = license
      }

      await setDoc(doc(db, 'users', cred.user.uid), userData)

      Swal.fire({
        icon: 'success',
        title: 'Registered!',
        text: 'Your account has been created successfully.',
        confirmButtonText: 'OK',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          if (role === 'therapist') {
            navigate('/dashboard/therapist')
          } else {
            navigate('/dashboard/patient')
          }
        }
      })

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Swal.fire({
          icon: 'error',
          title: 'Email in Use',
          text: 'This email is already registered. Please login instead.'
        })
      } else if (error.code === 'auth/invalid-email') {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address.'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: error.message
        })
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                 bg-gradient-to-br from-blue-100 via-teal-100 to-blue-50
                 animate-[pulse_14s_ease-in-out_infinite] px-4"
    >
      <div
        className="w-full max-w-md bg-white/70 backdrop-blur-xl 
                   p-8 rounded-2xl shadow-xl border border-white/40
                   transition duration-300 hover:shadow-2xl hover:-translate-y-1"
      >
        <h1 className="text-3xl font-semibold text-teal-800 text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-teal-600 mb-6 text-sm">
          Join your safe exposure therapy platform
        </p>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white/80 text-gray-800 rounded-xl 
                       p-3 shadow-inner placeholder-gray-500
                       focus:ring-2 focus:ring-teal-400 transition"
            required
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full bg-white/80 text-gray-800 rounded-xl 
                       p-3 shadow-inner placeholder-gray-500
                       focus:ring-2 focus:ring-teal-400 transition"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/80 text-gray-800 rounded-xl 
                       p-3 shadow-inner placeholder-gray-500
                       focus:ring-2 focus:ring-teal-400 transition"
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/80 text-gray-800 rounded-xl 
                       p-3 shadow-inner placeholder-gray-500
                       focus:ring-2 focus:ring-teal-400 transition"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white/80 text-gray-800 rounded-xl 
                       p-3 shadow-inner focus:ring-2 
                       focus:ring-teal-400 transition"
          >
            <option value="patient">Patient</option>
            <option value="therapist">Therapist</option>
          </select>

          {role === 'therapist' && (
            <>
              <input
                type="text"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-white/80 text-gray-800 rounded-xl 
                           p-3 shadow-inner placeholder-gray-500
                           focus:ring-2 focus:ring-teal-400 transition"
                required
              />

              <input
                type="text"
                placeholder="License Number"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full bg-white/80 text-gray-800 rounded-xl 
                           p-3 shadow-inner placeholder-gray-500
                           focus:ring-2 focus:ring-teal-400 transition"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-teal-500 text-white rounded-xl 
                       p-3 text-lg font-medium shadow-md
                       hover:bg-teal-600 hover:shadow-lg transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-teal-700 mt-4 text-center">
          Already have an account?{' '}
          <Link className="text-teal-700 font-semibold hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}