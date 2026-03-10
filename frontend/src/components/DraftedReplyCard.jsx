import { useState, useEffect, useRef } from 'react'

function NameModal({ onConfirm, onCancel }) {
  const [name, setName] = useState(() => localStorage.getItem('senderName') || '')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleConfirm() {
    const trimmed = name.trim()
    if (!trimmed) return
    localStorage.setItem('senderName', trimmed)
    onConfirm(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-80 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Sign the reply as</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">This will replace [Your Name] in the draft.</p>
        <input
          ref={inputRef}
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          className="w-full text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            className="flex-1 py-2 text-sm rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DraftedReplyCard({ text, loading, subject }) {
  const [draft, setDraft] = useState('')
  const [recipient, setRecipient] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(text)
  }, [text])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">Drafted Reply</h3>
        </div>
        <div className="mt-3 text-sm text-gray-400 animate-pulse">Drafting reply...</div>
      </div>
    )
  }

  if (!text && !loading) return null

  function handleApproveClick() {
    if (!recipient) return
    // Skip modal if [Your Name] isn't in draft or name already saved
    const savedName = localStorage.getItem('senderName')
    if (draft.includes('[Your Name]') && !savedName) {
      setShowModal(true)
    } else {
      const finalDraft = savedName ? draft.replace(/\[Your Name\]/g, savedName) : draft
      setDraft(finalDraft)
      sendEmail(finalDraft)
    }
  }

  function handleModalConfirm(name) {
    setShowModal(false)
    const finalDraft = draft.replace(/\[Your Name\]/g, name)
    setDraft(finalDraft)
    sendEmail(finalDraft)
  }

  async function sendEmail(finalDraft) {
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipient, subject: subject || 'Re: Your email', body: finalDraft }),
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
    <>
      {showModal && (
        <NameModal
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Drafted Reply</h3>
        <textarea
          className="w-full text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3 resize-y min-h-[260px] focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-500"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="mt-3 space-y-2">
          <input
            type="email"
            placeholder="Enter your email to receive the reply"
            className="w-full text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-500"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">Test it — enter your email and watch the AI-drafted reply land in your inbox</p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {sent ? (
            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Email sent successfully!</p>
          ) : (
            <button
              onClick={handleApproveClick}
              disabled={sending || !recipient}
              className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {sending ? 'Sending...' : 'Approve and Send'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
