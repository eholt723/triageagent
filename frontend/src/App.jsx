import { useState, useEffect } from 'react'
import InputPanel from './components/InputPanel'
import OutputPanel from './components/OutputPanel'

const INITIAL_STAGES = {
  classifying: false,
  classification: null,
  extracting: false,
  extraction: null,
  drafting: false,
  draftText: '',
}

export default function App() {
  const [emailText, setEmailText] = useState('')
  const [stages, setStages] = useState(INITIAL_STAGES)
  const [loading, setLoading] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  async function handleAnalyze() {
    setLoading(true)
    setStages({ ...INITIAL_STAGES, classifying: true })

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_text: emailText }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let draftAccum = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = JSON.parse(line.slice(6))

          if (payload.error) {
            console.error('Pipeline error:', payload.error)
            break
          }

          const { stage, content, done: stageDone } = payload

          if (stage === 'classify' && stageDone) {
            setStages((s) => ({ ...s, classifying: false, classification: content, extracting: true }))
          } else if (stage === 'extract' && stageDone) {
            setStages((s) => ({ ...s, extracting: false, extraction: content, drafting: true }))
          } else if (stage === 'draft') {
            if (!stageDone) {
              draftAccum += content
              const snap = draftAccum
              setStages((s) => ({ ...s, drafting: true, draftText: snap }))
            } else {
              setStages((s) => ({ ...s, drafting: false }))
            }
          }
        }
      }
    } catch (e) {
      console.error('Stream error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">TriageAgent</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Paste an email. Get a ready-to-edit reply in seconds.</p>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
          className="absolute right-6 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {dark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-5a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zM3 12H2a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-6.07.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 1 1-1.41-1.41zM6.34 17.66l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 1 1 1.41 1.41zm11.32 0a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0zM5.05 6.34a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0z"/>
            </svg>
          )}
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputPanel
            emailText={emailText}
            setEmailText={setEmailText}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
          <OutputPanel stages={stages} />
        </div>
      </main>

      <footer className="fixed bottom-4 right-5 text-xs text-gray-400 dark:text-gray-600 text-right leading-tight">
        Created by<br />Eric Holt
      </footer>
    </div>
  )
}
