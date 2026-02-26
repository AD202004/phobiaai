import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuth } from "firebase/auth"
import { doc, getDoc, getDocs, collection, updateDoc } from "firebase/firestore"
import { db } from "../firebase" // adjust import path

export default function PatientLanding() {
  const [patient, setPatient] = useState(null)
  const [therapists, setTherapists] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch patient + therapist data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) return

        // get patient profile
        const patientRef = doc(db, "users", user.uid)
        const patientSnap = await getDoc(patientRef)
        if (patientSnap.exists()) {
          setPatient(patientSnap.data())
        }

        // get therapists list
        const therapistsSnap = await getDocs(collection(db, "therapists"))
        const therapistList = therapistsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setTherapists(therapistList)
      } catch (err) {
        console.error("Error loading data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleContinue = async () => {
    if (!selected || !patient) return
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) return

      const patientRef = doc(db, "users", user.uid)
      await updateDoc(patientRef, { assignedTherapist: selected.id })

      alert(`You selected ${selected.name}. Let's start your sessions!`)
      // redirect to patient dashboard here (use react-router)
      // e.g., navigate("/patient/dashboard")
    } catch (err) {
      console.error("Error assigning therapist:", err)
    }
  }

  if (loading) return <div className="text-center text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {patient?.name || "Patient"} 👋
          </h1>
          <p className="text-gray-300">
            You are registered as <span className="font-semibold">{patient?.role || "Patient"}</span>.
          </p>
          <p className="mt-2 text-lg">Let’s get started by choosing your therapist.</p>
        </div>

        {/* Therapist Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {therapists.map((t) => (
            <Card
              key={t.id}
              className={`cursor-pointer transition-transform hover:scale-105 ${
                selected?.id === t.id ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => setSelected(t)}
            >
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">{t.role}</p>
                <p className="text-sm mt-1">{t.specialization}</p>
                <p className="text-xs text-gray-400 mt-2">{t.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <div className="mt-10 text-center">
          <Button
            disabled={!selected}
            className="px-6 py-2 rounded-xl text-lg font-medium"
            onClick={handleContinue}
          >
            {selected ? `Continue with ${selected.name}` : "Select a Therapist"}
          </Button>
        </div>
      </div>
    </div>
  )
}