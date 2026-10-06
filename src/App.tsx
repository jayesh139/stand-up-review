import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Review = {
  id: string
  name: string
  text: string
  createdAt: number
}

const STORAGE_KEY = 'stand-up-reviews'

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Review[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

function App() {
  const [reviews, setReviews] = useState<Review[]>(() => loadReviews())
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  }, [reviews])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedText = text.trim()
    if (!trimmedName || !trimmedText) return

    const next: Review = {
      id: crypto.randomUUID(),
      name: trimmedName,
      text: trimmedText,
      createdAt: Date.now(),
    }

    setReviews((current) => [next, ...current])
    setName('')
    setText('')
  }

  const canSubmit = name.trim().length > 0 && text.trim().length > 0

  return (
    <main className="dashboard">
      <header className="hero">
        <p className="hero__eyebrow">Stand-up feedback</p>
        <h1>Dashboard for stand-up review</h1>
        <p className="hero__desc">
          Share what you thought about the stand-up you just saw — leave your
          name and a short review, and it will show up here for the team.
        </p>
      </header>

      <section className="panel" aria-label="Reviews">
        <form className="compose" onSubmit={handleSubmit}>
          <h2>Add a review</h2>

          <div className="field">
            <label htmlFor="reviewer-name">Your name</label>
            <input
              id="reviewer-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Alex"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="review-text">Your review</label>
            <textarea
              id="review-text"
              name="review"
              placeholder="What stood out? What could be better?"
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={1000}
              required
            />
          </div>

          <button className="submit" type="submit" disabled={!canSubmit}>
            Post review
          </button>
        </form>

        <div className="feed">
          <h2>Team reviews</h2>
          <p className="feed__meta">
            {reviews.length === 0
              ? 'No reviews yet'
              : `${reviews.length} review${reviews.length === 1 ? '' : 's'}`}
          </p>

          {reviews.length === 0 ? (
            <p className="empty">
              Be the first to share feedback on today&apos;s stand-up.
            </p>
          ) : (
            <ul className="reviews">
              {reviews.map((review) => (
                <li key={review.id} className="review">
                  <div className="review__header">
                    <span className="review__name">{review.name}</span>
                    <time
                      className="review__time"
                      dateTime={new Date(review.createdAt).toISOString()}
                    >
                      {formatTime(review.createdAt)}
                    </time>
                  </div>
                  <p className="review__body">{review.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
