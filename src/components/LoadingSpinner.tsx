import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  progress?: { loaded: number; total: number } | null;
}

export function LoadingSpinner({ progress }: LoadingSpinnerProps) {
  const percentage = progress ? Math.round((progress.loaded / progress.total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="relative">
        {/* Outer ring */}
        <svg className="w-20 h-20" viewBox="0 0 100 100">
          <circle
            className="text-dark-border"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
          />
          <motion.circle
            className="text-white"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r="42"
            cx="50"
            cy="50"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress ? percentage / 100 : 0.3 }}
            transition={{ duration: 0.5 }}
            style={{
              transformOrigin: '50% 50%',
              transform: 'rotate(-90deg)',
            }}
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * (progress ? percentage : 30)) / 100}
          />
        </svg>

        {/* Percentage text */}
        {progress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-white">{percentage}%</span>
          </div>
        )}
      </div>

      <p className="mt-6 text-gray-400 font-medium">Loading NFTs...</p>
      {progress && (
        <p className="mt-2 text-sm text-gray-600">
          {progress.loaded} of {progress.total} loaded
        </p>
      )}
    </motion.div>
  );
}
