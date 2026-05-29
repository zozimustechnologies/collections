import { useState } from 'react'

function RelativeTime({ ts }) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const label =
    mins < 1 ? 'Just now'
    : mins < 60 ? `${mins}m ago`
    : hrs < 24 ? `${hrs}h ago`
    : `${days}d ago`
  return <span className="item-card__time">{label}</span>
}

function LinkCard({ item, onRemove }) {
  const domain = (() => { try { return new URL(item.url).hostname } catch { return '' } })()
  return (
    <div className="item-card item-card--link">
      <div className="item-card__header">
        {item.favicon ? (
          <img className="item-card__favicon" src={item.favicon} alt="" width={14} height={14} />
        ) : (
          <svg className="item-card__favicon-placeholder" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
        <a className="item-card__title" href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title || item.url}
        </a>
        <button className="icon-btn icon-btn--sm item-card__remove" onClick={onRemove} title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="item-card__meta">
        <span className="item-card__domain">{domain}</span>
        <RelativeTime ts={item.createdAt} />
      </div>
    </div>
  )
}

function TextCard({ item, onRemove }) {
  return (
    <div className="item-card item-card--text">
      <div className="item-card__header">
        <svg className="item-card__type-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 7h18M3 12h12M3 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="item-card__label">Quote</span>
        <button className="icon-btn icon-btn--sm item-card__remove" onClick={onRemove} title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <blockquote className="item-card__quote">{item.content}</blockquote>
      {item.sourceUrl && (
        <a className="item-card__source" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
          {item.sourceTitle || item.sourceUrl}
        </a>
      )}
      <RelativeTime ts={item.createdAt} />
    </div>
  )
}

function ImageCard({ item, onRemove }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="item-card item-card--image">
      <div className="item-card__header">
        <svg className="item-card__type-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="item-card__label">Image</span>
        <button className="icon-btn icon-btn--sm item-card__remove" onClick={onRemove} title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {!imgError ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          <img
            className="item-card__img"
            src={item.url}
            alt={item.title || 'Saved image'}
            onError={() => setImgError(true)}
          />
        </a>
      ) : (
        <span className="item-card__img-error">Image could not be loaded</span>
      )}
      <RelativeTime ts={item.createdAt} />
    </div>
  )
}

function NoteCard({ item, onRemove }) {
  return (
    <div className="item-card item-card--note">
      <div className="item-card__header">
        <svg className="item-card__type-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="item-card__label">Note</span>
        <button className="icon-btn icon-btn--sm item-card__remove" onClick={onRemove} title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <p className="item-card__note-body">{item.content}</p>
      <RelativeTime ts={item.createdAt} />
    </div>
  )
}

export default function ItemCard({ item, onRemove }) {
  switch (item.type) {
    case 'link':       return <LinkCard item={item} onRemove={onRemove} />
    case 'text':       return <TextCard item={item} onRemove={onRemove} />
    case 'image':      return <ImageCard item={item} onRemove={onRemove} />
    case 'note':       return <NoteCard item={item} onRemove={onRemove} />
    default:           return null
  }
}
