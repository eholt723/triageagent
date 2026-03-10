import { Link } from 'react-router-dom'

const PIPELINE = [
  {
    step: '1',
    name: 'Classify',
    desc: 'The AI reads the email and identifies what type it is — a support request, sales inquiry, job application, and more — along with how urgent it is.',
  },
  {
    step: '2',
    name: 'Extract',
    desc: "Key details are pulled out automatically: what the sender wants, the main question being asked, any action items, and the overall tone of the message.",
  },
  {
    step: '3',
    name: 'Draft',
    desc: 'A professional reply is written in real time, tailored to everything learned in the first two steps. You can edit it before sending.',
  },
]

const STACK = [
  { name: 'React + Vite', role: 'Frontend UI' },
  { name: 'Tailwind CSS', role: 'Styling' },
  { name: 'Python + FastAPI', role: 'Backend API' },
  { name: 'Groq (LLaMA 3.3 70B)', role: 'AI / LLM' },
  { name: 'Gmail API', role: 'Email delivery' },
  { name: 'Docker', role: 'Containerized deployment' },
  { name: 'Hugging Face Spaces', role: 'Cloud hosting' },
  { name: 'GitHub Actions', role: 'Continuous deployment' },
]

const HIGHLIGHTS = [
  'Streams AI output word-by-word in real time — no waiting for the full response',
  'Three-stage agentic pipeline: each stage informs the next',
  'Structured JSON extraction with automatic fallback parsing',
  'Retry logic on all AI calls to handle transient failures gracefully',
  'Editable draft with one-click email delivery via Gmail OAuth2',
  'Full test suite: unit tests (mocked) and integration tests (live API)',
  'Automated deployment — every push to main ships to production',
]

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 pb-20">

      {/* Hero */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">About TriageAgent</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          TriageAgent is a fully working AI application I built from scratch. It takes any email you paste in,
          runs it through a three-stage AI pipeline, and produces a professional draft reply — all streaming
          live to the screen. The draft can be edited and sent as a real email with one click.
        </p>
      </div>

      {/* Problem */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">The Problem It Solves</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Responding to emails takes time — especially when you need to figure out what someone actually wants,
          how urgent it is, and how to reply professionally. TriageAgent automates that entire process:
          read, understand, and draft — in seconds.
        </p>
      </section>

      {/* Pipeline */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5">How It Works</h3>
        <div className="flex flex-col gap-4">
          {PIPELINE.map((stage, i) => (
            <div key={stage.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {stage.step}
                </div>
                {i < PIPELINE.length - 1 && (
                  <div className="w-px flex-1 bg-cyan-200 dark:bg-cyan-900 mt-2" />
                )}
              </div>
              <div className="pb-6">
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{stage.name}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">What Was Built</h3>
        <ul className="space-y-2">
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-cyan-500 mt-0.5 flex-shrink-0">&#10003;</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Stack */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Tech Stack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STACK.map((item) => (
            <div
              key={item.name}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-center"
            >
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">{item.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="flex gap-4 flex-wrap">
        <Link
          to="/"
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Try the App
        </Link>
        <a
          href="https://github.com/eholt723/triageagent"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold rounded-xl transition-colors"
        >
          View on GitHub
        </a>
      </section>

    </main>
  )
}
