import { useState } from 'react'
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
            setStages((s) => ({
              ...s,
              classifying: false,
              classification: content,
              extracting: true,
            }))
          } else if (stage === 'extract' && stageDone) {
            setStages((s) => ({
              ...s,
              extracting: false,
              extraction: content,
              drafting: true,
            }))
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">TriageAgent</h1>
        <p className="text-sm text-gray-500">AI-powered email triage and draft responder</p>
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
    </div>
  )
}
