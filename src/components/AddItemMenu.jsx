import { useState, useEffect, useRef } from 'react'

/**
 * Floating action menu displayed above the FAB in CollectionDetail.
 * Handles all five content-addition flows.
 */
export default function AddItemMenu({ onAdd, onClose, onClosed, closing }) {
  const [view, setView] = useState('menu') // 'menu' | 'text' | 'image' | 'note'
  const [value, setValue] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentTabUrl, setCurrentTabUrl] = useState('')
  const containerRef = useRef(null)

  const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i
  const isImageTab = IMAGE_EXTS.test(currentTabUrl)

  // Fetch current tab URL on mount — query directly instead of going through
  // the background so the sidepanel focus doesn't confuse lastFocusedWindow.
  useEffect(() => {
    chrome.tabs.query({ active: true }, (tabs) => {
      // Pick the first non-extension, non-devtools tab
      const tab = tabs.find(
        (t) => t.url && !t.url.startsWith('chrome') && !t.url.startsWith('edge') && !t.url.startsWith('about')
      )
      if (tab?.url) setCurrentTabUrl(tab.url)
    })
  }, [])

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  async function handleAddCurrentPage() {
    setLoading(true)
    setError('')
    try {
      const tab = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' })
      if (!tab || !tab.url) throw new Error('Could not get current tab.')
      onAdd({ type: 'link', title: tab.title, url: tab.url, favicon: tab.favicon })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleUseCurrentImage() {
    setLoading(true)
    setError('')
    try {
      const tab = await chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' })
      if (!tab || !tab.url) throw new Error('Could not get current tab.')
      setImageUrl(tab.url)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSaveText() {
    if (!value.trim()) return
    onAdd({ type: 'text', content: value.trim() })
  }

  async function openTextView() {
    setValue('')
    try {
      const tabs = await chrome.tabs.query({ active: true })
      const tab = tabs.find(
        (t) => t.url && !t.url.startsWith('chrome') && !t.url.startsWith('edge') && !t.url.startsWith('about')
      )
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, { type: 'ENTER_SELECTION_MODE' })
        setView('selection')
        return
      }
    } catch { /* content script not ready, fall through */ }
    setView('text')
  }

  async function handleCancelSelection() {
    try {
      const tabs = await chrome.tabs.query({ active: true })
      const tab = tabs.find(
        (t) => t.url && !t.url.startsWith('chrome') && !t.url.startsWith('edge') && !t.url.startsWith('about')
      )
      if (tab) chrome.tabs.sendMessage(tab.id, { type: 'EXIT_SELECTION_MODE' }).catch(() => {})
    } catch { /* ignore */ }
    setView('menu')
  }

  // Listen for capture/cancel events from the content script
  useEffect(() => {
    if (view !== 'selection') return
    const listener = (message) => {
      if (message.type === 'SELECTION_CAPTURED') {
        setValue(message.text)
        setView('text')
      }
      if (message.type === 'SELECTION_CANCELLED') {
        setView('menu')
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [view])

  function handleSaveImage() {
    if (!imageUrl.trim()) return
    try {
      new URL(imageUrl.trim())
    } catch {
      setError('Please enter a valid URL.')
      return
    }
    onAdd({ type: 'image', url: imageUrl.trim() })
  }

  function handleSaveNote() {
    if (!value.trim()) return
    onAdd({ type: 'note', content: value.trim() })
  }

  const backArrow = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  if (view === 'text') {
    return (
      <div className="input-modal-overlay" onClick={() => setView('menu')}>
        <div className="input-modal" onClick={(e) => e.stopPropagation()}>
          <div className="add-menu__header">
            <button className="icon-btn icon-btn--sm" onClick={() => setView('menu')}>{backArrow}</button>
            <span className="add-menu__title">Add quote</span>
          </div>
          <textarea
            className="add-menu__textarea"
            placeholder="Paste or type selected text…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            rows={5}
          />
          <div className="input-modal__actions">
            <button className="btn btn--ghost" onClick={() => setView('menu')}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSaveText} disabled={!value.trim()}>Save</button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'image') {
    return (
      <div className="input-modal-overlay" onClick={() => setView('menu')}>
        <div className="input-modal" onClick={(e) => e.stopPropagation()}>
          <div className="add-menu__header">
            <button className="icon-btn icon-btn--sm" onClick={() => setView('menu')}>{backArrow}</button>
            <span className="add-menu__title">Add image</span>
          </div>
          <input
            className="add-menu__input"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => { setImageUrl(e.target.value); setError('') }}
            autoFocus
          />
          {error && <span className="add-menu__error">{error}</span>}
          <div className="input-modal__actions">
            <button
              className={`btn btn--ghost btn--sm${!isImageTab ? ' btn--faded' : ''}`}
              onClick={handleUseCurrentImage}
              disabled={loading || !isImageTab}
              title={!isImageTab ? 'Navigate to an image file first' : ''}
            >
              Use this image
            </button>
            <div className="input-modal__actions-right">
              <button className="btn btn--ghost" onClick={() => setView('menu')}>Cancel</button>
              <button className="btn btn--primary" onClick={handleSaveImage} disabled={!imageUrl.trim()}>Save</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'note') {
    return (
      <div className="input-modal-overlay" onClick={() => setView('menu')}>
        <div className="input-modal" onClick={(e) => e.stopPropagation()}>
          <div className="add-menu__header">
            <button className="icon-btn icon-btn--sm" onClick={() => setView('menu')}>{backArrow}</button>
            <span className="add-menu__title">Add note</span>
          </div>
          <textarea
            className="add-menu__textarea"
            placeholder="Write a note…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            rows={5}
          />
          <div className="input-modal__actions">
            <button className="btn btn--ghost" onClick={() => setView('menu')}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSaveNote} disabled={!value.trim()}>Save</button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'selection') {
    return (
      <div
        className={`selection-waiting-panel${closing ? ' add-menu--closing' : ''}`}
        onAnimationEnd={closing ? onClosed : undefined}
      >
        <div className="selection-pulse" />
        <p className="selection-waiting__title">Select text on the page</p>
        <p className="selection-waiting__hint">Highlight any text, then release to capture it</p>
        <button className="btn btn--ghost" onClick={handleCancelSelection}>Cancel</button>
      </div>
    )
  }

  // Default 'menu' view
  return (
    <div
      className={`add-menu${closing ? ' add-menu--closing' : ''}`}
      ref={containerRef}
      onAnimationEnd={closing ? onClosed : undefined}
    >
      {error && <span className="add-menu__error">{error}</span>}
      <button className="add-menu__item" onClick={handleAddCurrentPage} disabled={loading}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
        </svg>
        Add current page
      </button>
      <button className="add-menu__item" onClick={openTextView}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 7h18M3 12h12M3 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Add selected text
      </button>
      <button className="add-menu__item" onClick={() => { setView('image'); setImageUrl(''); setError('') }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Add image by URL
      </button>
      <button className="add-menu__item" onClick={() => { setView('note'); setValue('') }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Add note
      </button>
    </div>
  )
}
