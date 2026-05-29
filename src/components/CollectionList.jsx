import { useState, useRef, useEffect } from 'react'
import NewCollectionModal from './NewCollectionModal.jsx'

const PRESET_COLORS = [
  '#0078d4', '#107c10', '#d73535', '#f7630c',
  '#8764b8', '#038387', '#c19c00', '#69797e',
]

export default function CollectionList({
  collections,
  onSelect,
  onAdd,
  onRemove,
  onRename,
  pendingItem,
  onPendingItemHandled,
}) {
  const [showModal, setShowModal] = useState(false)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [menuOpenId, setMenuOpenId] = useState(null)
  // When a pending item arrives and there are collections, prompt the user to pick one
  const [pendingPickVisible, setPendingPickVisible] = useState(false)
  const renameInputRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpenId) return
    function handler(e) {
      setMenuOpenId(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpenId])

  useEffect(() => {
    if (pendingItem) setPendingPickVisible(true)
  }, [pendingItem])

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [renamingId])

  function startRename(collection) {
    setMenuOpenId(null)
    setRenamingId(collection.id)
    setRenameValue(collection.name)
  }

  function commitRename(id) {
    if (renameValue.trim()) onRename(id, renameValue)
    setRenamingId(null)
  }

  function handleRenameKey(e, id) {
    if (e.key === 'Enter') commitRename(id)
    else if (e.key === 'Escape') setRenamingId(null)
  }

  function handleAdd(opts) {
    setShowModal(false)
    onAdd(opts)
  }

  return (
    <div className="panel">
      <header className="panel-header">
        <div className="panel-header__left">
          <span className="panel-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 10h16M4 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <rect x="14" y="12" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </span>
          <h1 className="panel-title">Collections</h1>
        </div>
        {collections.length > 0 && (
          <span className="panel-header__count">{collections.length}</span>
        )}
      </header>

      <div className="collection-list">
        {collections.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="empty-state__icon">
              <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <p className="empty-state__title">No collections yet</p>
            <p className="empty-state__sub">Click <strong>+</strong> to create your first collection.</p>
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col.id}
              className={`collection-item${menuOpenId === col.id ? ' collection-item--menu-open' : ''}`}
              onClick={() => {
                if (renamingId === col.id) return
                if (pendingPickVisible && pendingItem) {
                  onPendingItemHandled(col.id, pendingItem)
                  setPendingPickVisible(false)
                } else {
                  onSelect(col.id)
                }
              }}
            >
              <span
                className="collection-item__dot"
                style={{ background: col.color }}
              />
              <div className="collection-item__info">
                {renamingId === col.id ? (
                  <input
                    ref={renameInputRef}
                    className="rename-input"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => commitRename(col.id)}
                    onKeyDown={(e) => handleRenameKey(e, col.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="collection-item__name">{col.name}</span>
                )}
                <span className="collection-item__count">
                  {col.items.length} {col.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="collection-item__actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="icon-btn icon-btn--md"
                  title="Options"
                  onClick={() => setMenuOpenId(menuOpenId === col.id ? null : col.id)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                  </svg>
                </button>
                {menuOpenId === col.id && (
                  <div className="dropdown-menu" onMouseDown={(e) => e.stopPropagation()}>
                    <button className="dropdown-item" onClick={() => startRename(col)}>Rename</button>
                    <button
                      className="dropdown-item dropdown-item--danger"
                      onClick={() => { setMenuOpenId(null); onRemove(col.id) }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {pendingPickVisible && pendingItem && collections.length > 0 && (
        <div className="pending-banner">
          <span>Select a collection to save this item</span>
          <button className="icon-btn icon-btn--sm" onClick={() => setPendingPickVisible(false)}>✕</button>
        </div>
      )}

      <div className="list-fab-container">
        <button
          className="fab"
          title="New collection"
          onClick={() => setShowModal(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {showModal && (
        <NewCollectionModal
          presetColors={PRESET_COLORS}
          onConfirm={handleAdd}
          onCancel={() => setShowModal(false)}
        />
      )}

      <footer className="brand-footer">
        <div className="brand-footer__row">
          <a
            className="btn--donate"
            href="https://wise.com/pay/business/sandeepchadda?utm_source=open_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            ♥ Donate
          </a>
        </div>
        <p className="brand-footer__copy">
          &copy; <a href="https://zozimustechnologies.github.io/" target="_blank" rel="noopener noreferrer">Zozimus Technologies</a>. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
