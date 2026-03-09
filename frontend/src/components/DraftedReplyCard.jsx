import { useState, useEffect } from 'react'

export default function DraftedReplyCard({ text, loading, subject }) {
  const [draft, setDraft] = useState('')
  const [recipient, setRecipient] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(text)
  }, [text])

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h3 className="font-semibold text-gray-700">Drafted Reply</h3>
        </div>
        <div className="text-sm text-gray-400 animate-pulse">Drafting reply...</div>
      </div>
    )
  }

  if (!text && !loading) return null

  async function handleSend() {
    if (!recipient) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipient, subject: subject || 'Re: Your email', body: draft }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'Failed to send')
      }
      setSent(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3">Drafted Reply</h3>
      <textarea
        className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-3 resize-y min-h-[160px] focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <div className="mt-3 space-y-2">
        <input
          type="email"
          placeholder="Enter your email to receive the reply"
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <p className="text-xs text-gray-400">Test it — enter your email and watch the AI-drafted reply land in your inbox</p>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {sent ? (
          <p className="text-sm text-green-600 font-medium">Email sent successfully!</p>
        ) : (
          <button
            onClick={handleSend}
            disabled={sending || !recipient}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {sending ? 'Sending...' : 'Approve and Send'}
          </button>
        )}
      </div>
    </div>
  )
}
