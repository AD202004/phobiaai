import { motion } from 'framer-motion'

export default function ExposureView({ imageUrl, index, total, onNext, onPrev }) {
  return (
    <div className="h-full w-full overflow-hidden">
      <motion.img
        key={imageUrl}
        src={imageUrl}
        alt="exposure"
        className="h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* controls overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-base-800/70 backdrop-blur px-4 py-2 rounded-xl2 shadow-soft">
        <button onClick={onPrev} className="px-4 py-2 bg-base-700 rounded-xl2 disabled:opacity-40" disabled={index===0}>Prev</button>
        <span className="text-sm text-gray-200">{index+1} / {total}</span>
        <button onClick={onNext} className="px-4 py-2 bg-accent-500 hover:bg-accent-600 rounded-xl2" disabled={index===total-1}>Next</button>
      </div>
    </div>
  )
}