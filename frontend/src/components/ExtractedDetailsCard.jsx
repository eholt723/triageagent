export default function ExtractedDetailsCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="font-semibold text-gray-700">Extracted Details</h3>
        </div>
        <div className="text-sm text-gray-400 animate-pulse">Extracting key information...</div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3">Extracted Details</h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-500 font-medium">Intent: </span>
          <span className="text-gray-800">{data.sender_intent}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Main ask: </span>
          <span className="text-gray-800">{data.main_ask}</span>
        </div>
        <div>
          <span className="text-gray-500 font-medium">Tone: </span>
          <span className="text-gray-800 capitalize">{data.tone}</span>
        </div>
        {data.action_items?.length > 0 && (
          <div>
            <span className="text-gray-500 font-medium">Action items:</span>
            <ul className="mt-1 ml-4 list-disc text-gray-800 space-y-0.5">
              {data.action_items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
