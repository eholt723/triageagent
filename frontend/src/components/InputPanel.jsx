const SAMPLE_EMAILS = [
  {
    label: 'Support Request',
    text: `Hi there,

I've been trying to log into my account for the past two days and keep getting an "invalid credentials" error even though I just reset my password. I have an important project deadline tomorrow and really need access urgently.

Can someone please help me resolve this as soon as possible?

Thanks,
Sarah`,
  },
  {
    label: 'Sales Inquiry',
    text: `Hello,

I came across your product at a conference last week and I'm very interested in learning more about your enterprise pricing. We're a 200-person company looking to onboard our entire sales team.

Could you send me a quote and schedule a demo call?

Best,
Mark Johnson
VP of Sales, Acme Corp`,
  },
  {
    label: 'Job Application',
    text: `Dear Hiring Manager,

I'm writing to express my strong interest in the Senior Software Engineer position posted on your careers page. I have 6 years of experience in backend development with Python and Go, and I've led teams of up to 8 engineers.

I've attached my resume and portfolio. Looking forward to discussing how I can contribute to your team.

Best regards,
Alex Chen`,
  },
]

export default function InputPanel({ emailText, setEmailText, onAnalyze, loading }) {
  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Paste an email</h2>
        <p className="text-sm text-gray-500">The AI pipeline will classify, extract, and draft a reply in real time.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {SAMPLE_EMAILS.map((s) => (
          <button
            key={s.label}
            onClick={() => setEmailText(s.text)}
            className="text-xs px-3 py-1.5 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      <textarea
        className="flex-1 w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[300px]"
        placeholder="Paste the email you want to triage here..."
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
      />

      <button
        onClick={onAnalyze}
        disabled={loading || !emailText.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? 'Analyzing...' : 'Analyze & Draft Reply'}
      </button>
    </div>
  )
}
