export default function ClassificationCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="font-semibold text-gray-700">Classification</h3>
        </div>
        <div className="text-sm text-gray-400 animate-pulse">Analyzing email...</div>
      </div>
    )
  }

  if (!data) return null

  const highConfidence = data.confidence >= 0.75
  const confidencePct = Math.round(data.confidence * 100)

  const urgencyColor = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-red-600 bg-red-50',
  }[data.urgency] || 'text-gray-600 bg-gray-50'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3">Classification</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Type</span>
          <span className="text-sm font-medium text-gray-800 capitalize">
            {data.email_type?.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Urgency</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${urgencyColor}`}>
            {data.urgency}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Confidence</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              highConfidence
                ? 'text-green-700 bg-green-100'
                : 'text-yellow-700 bg-yellow-100'
            }`}
          >
            {highConfidence ? 'High Confidence' : 'Low Confidence — Review Recommended'} ({confidencePct}%)
          </span>
        </div>
        {data.suggested_subject && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Subject</span>
            <span className="text-sm text-gray-700 italic">{data.suggested_subject}</span>
          </div>
        )}
      </div>
      {!highConfidence && (
        <p className="mt-3 text-xs text-yellow-600 bg-yellow-50 rounded-lg p-2">
          The agent was uncertain about this classification. Please review the draft carefully before sending.
        </p>
      )}
    </div>
  )
}
