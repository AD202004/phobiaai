import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

const items = [
  { to: '/dashboard/therapist', label: 'Dashboard' },
  { to: '#', label: 'Patients' },
  { to: '#', label: 'Sessions' },
  { to: '#', label: 'Settings' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="bg-base-800 min-h-screen p-4">
      <div className="text-xl font-semibold mb-6">Therapist</div>
      <nav className="space-y-2">
        {items.map(i => (
          <Link key={i.label} to={i.to}
            className={clsx('block rounded-xl2 px-3 py-2',
              pathname===i.to ? 'bg-accent-500/20 text-accent-500' : 'hover:bg-base-700')}
          >{i.label}</Link>
        ))}
      </nav>
    </aside>
  )
}