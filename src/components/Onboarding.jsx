import { useState } from 'react'

const STEPS = [
  {
    emoji: '📂',
    title: 'Welcome to Collections',
    body: 'Save links, quotes, images, and notes from any webpage — right inside your browser sidebar.',
  },
  {
    emoji: '➕',
    title: 'Create a collection',
    body: 'Tap the + button to create a named, colour-coded collection. Make as many as you need.',
  },
  {
    emoji: '🖱️',
    title: 'Save with a right-click',
    body: 'Right-click any link, image, or selected text on a page and choose "Save to Collections".',
  },
  {
    emoji: '🔒',
    title: 'Private by default',
    body: 'Everything stays in your browser. No accounts, no cloud, no tracking — ever.',
  },
]

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <div className="onboarding__emoji">{current.emoji}</div>
        <h2 className="onboarding__title">{current.title}</h2>
        <p className="onboarding__body">{current.body}</p>

        <div className="onboarding__dots">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`onboarding__dot${i === step ? ' onboarding__dot--active' : ''}`}
            />
          ))}
        </div>

        <button
          className="onboarding__btn"
          onClick={() => (isLast ? onDone() : setStep((s) => s + 1))}
        >
          {isLast ? 'Get started' : 'Next'}
        </button>

        {!isLast && (
          <button className="onboarding__skip" onClick={onDone}>
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
