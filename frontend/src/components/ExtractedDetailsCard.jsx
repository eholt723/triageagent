import { useState } from 'react'

export default function ExtractedDetailsCard({ data, loading }) {
  const [collapsed, setCollapsed] = useState(false)

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Extracted Details</h3>
        </div>
        <div className="mt-3 text-sm text-gray-400 animate-pulse">Extracting key information...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Extracted Details</h3>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {!collapsed && (
        <div className="px-5 pb-5 space-y-2 text-sm border-t border-gray-100 dark:border-gray-800 pt-3">
          <div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">Intent: </span>
            <span className="text-gray-800 dark:text-gray-200">{data.sender_intent}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">Main ask: </span>
            <span className="text-gray-800 dark:text-gray-200">{data.main_ask}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">Tone: </span>
            <span className="text-gray-800 dark:text-gray-200 capitalize">{data.tone}</span>
          </div>
          {data.action_items?.length > 0 && (
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Action items:</span>
              <ul className="mt-1 ml-4 list-disc text-gray-800 dark:text-gray-200 space-y-0.5">
                {data.action_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
