import { useState } from 'react'

export default function ClassificationCard({ data, loading }) {
  const [collapsed, setCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Classification</h3>
        </div>
        <div className="mt-3 text-sm text-gray-400 animate-pulse">Analyzing email...</div>
      </div>
    )
  }

  if (!data) return null

  const highConfidence = data.confidence >= 0.75
  const confidencePct = Math.round(data.confidence * 100)

  const urgencyColor = {
    low: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
    medium: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30',
    high: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
  }[data.urgency] || 'text-gray-600 bg-gray-50'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Classification</h3>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {!collapsed && (
        <div className="px-5 pb-5 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
              {data.email_type?.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Urgency</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${urgencyColor}`}>
              {data.urgency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Confidence</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              highConfidence
                ? 'text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-900/40'
                : 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/40'
            }`}>
              {highConfidence ? 'High Confidence' : 'Low Confidence — Review Recommended'} ({confidencePct}%)
            </span>
          </div>
          {data.suggested_subject && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Subject</span>
              <span className="text-sm text-gray-700 dark:text-gray-300 italic">{data.suggested_subject}</span>
            </div>
          )}
          {!highConfidence && (
            <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
              The agent was uncertain about this classification. Please review the draft carefully before sending.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
