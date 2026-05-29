import { useState, useRef, useEffect } from 'react'

export default function NewCollectionModal({ presetColors, onConfirm, onCancel }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(presetColors[0])
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onConfirm({ name: name.trim(), color })
  }

  function handleKey(e) {
    if (e.key === 'Escape') onCancel()
  }

  return (
    <div className="modal-overlay" onClick={onCancel} onKeyDown={handleKey}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">New Collection</h2>
        <form onSubmit={handleSubmit} className="modal__form">
          <input
            ref={inputRef}
            className="modal__input"
            type="text"
            placeholder="Collection name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
          />
          <div className="modal__color-row">
            <span className="modal__color-label">Color</span>
            <div className="color-swatches">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch${color === c ? ' color-swatch--selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  title={c}
                />
              ))}
            </div>
          </div>
          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
