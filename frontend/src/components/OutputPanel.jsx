import ClassificationCard from './ClassificationCard'
import ExtractedDetailsCard from './ExtractedDetailsCard'
import DraftedReplyCard from './DraftedReplyCard'

export default function OutputPanel({ stages }) {
  const { classifying, classification, extracting, extraction, drafting, draftText } = stages

  const idle = !classifying && !classification && !extracting && !extraction && !drafting && !draftText

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-800">Pipeline Output</h2>

      {idle && (
        <div className="text-sm text-gray-400 mt-8 text-center">
          Results will appear here once you analyze an email.
        </div>
      )}

      {(classifying || classification) && (
        <ClassificationCard data={classification} loading={classifying} />
      )}

      {(extracting || extraction) && (
        <ExtractedDetailsCard data={extraction} loading={extracting} />
      )}

      {(drafting || draftText) && (
        <DraftedReplyCard
          text={draftText}
          loading={drafting && !draftText}
          subject={classification?.suggested_subject}
        />
      )}
    </div>
  )
}
