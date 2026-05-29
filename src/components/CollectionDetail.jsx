import { useState, useEffect, useCallback } from 'react'
import ItemCard from './ItemCard.jsx'
import AddItemMenu from './AddItemMenu.jsx'

export default function CollectionDetail({
  collection,
  onBack,
  onAddItem,
  onRemoveItem,
  pendingItem,
  onPendingItemHandled,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)
  const [ripple, setRipple] = useState(false)

  function closeMenu() {
    setMenuClosing(true)
  }

  const handleFabClick = useCallback(() => {
    if (menuOpen) {
      closeMenu()
      return
    }
    setRipple(false)
    requestAnimationFrame(() => {
      setRipple(true)
      setMenuOpen(true)
    })
  }, [menuOpen])

  // Auto-add pending item when this detail view is active
  useEffect(() => {
    if (pendingItem) {
      onAddItem(pendingItem)
      onPendingItemHandled()
    }
  }, [pendingItem]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="panel">
      <header className="panel-header">
        <div className="panel-header__left">
          <button className="icon-btn" title="Back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="collection-dot" style={{ background: collection.color }} />
          <h1 className="panel-title">{collection.name}</h1>
        </div>
        <span className="panel-header__count">{collection.items.length}</span>
      </header>

      <div className="item-list">
        {collection.items.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="empty-state__icon">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="empty-state__title">Collection is empty</p>
            <p className="empty-state__sub">Use the <strong>+</strong> button to add content.</p>
          </div>
        ) : (
          collection.items.map((item) => (
            <ItemCard key={item.id} item={item} onRemove={() => onRemoveItem(item.id)} />
          ))
        )}
      </div>

      <div className="fab-container">
        <button
          className={`fab${menuOpen && !menuClosing ? ' fab--open' : ''}`}
          title="Add item"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleFabClick}
        >
          {ripple && (
            <span
              className="fab-ripple"
              onAnimationEnd={() => setRipple(false)}
            />
          )}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {menuOpen && (
          <AddItemMenu
            closing={menuClosing}
            onAdd={(item) => { onAddItem(item); closeMenu() }}
            onClose={closeMenu}
            onClosed={() => { setMenuOpen(false); setMenuClosing(false) }}
          />
        )}
      </div>
    </div>
  )
}
