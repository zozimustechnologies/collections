import { useState, useEffect, useCallback, useRef } from 'react'
import { loadCollections, saveCollections, onCollectionsChanged } from '../utils/storage.js'

export function useCollections() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  // Keep a ref so persist can resolve updater functions synchronously
  const collectionsRef = useRef([])

  // Initial load
  useEffect(() => {
    loadCollections().then((data) => {
      collectionsRef.current = data
      setCollections(data)
      setLoading(false)
    })
    // Subscribe to changes from other tabs / context menus
    return onCollectionsChanged((data) => {
      collectionsRef.current = data
      setCollections(data)
    })
  }, [])

  // Silent re-sync when the user switches tabs (fired by App.jsx)
  useEffect(() => {
    function onTabActivated(e) {
      const data = e.detail
      if (!Array.isArray(data)) return
      collectionsRef.current = data
      setCollections(data)
    }
    window.addEventListener('cfe:tab-activated', onTabActivated)
    return () => window.removeEventListener('cfe:tab-activated', onTabActivated)
  }, [])

  // Resolve updater-function or plain value, update state AND storage
  const persist = useCallback((updaterOrValue) => {
    const next = typeof updaterOrValue === 'function'
      ? updaterOrValue(collectionsRef.current)
      : updaterOrValue
    collectionsRef.current = next
    setCollections(next)
    saveCollections(next)
  }, [])

  const addCollection = useCallback(({ name, color = '#0078d4' }) => {
    const collection = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      createdAt: Date.now(),
      items: [],
    }
    persist((prev) => [...prev, collection])
    return collection.id
  }, [persist])

  const removeCollection = useCallback((id) => {
    persist((prev) => prev.filter((c) => c.id !== id))
  }, [persist])

  const renameCollection = useCallback((id, name) => {
    persist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim() } : c))
    )
  }, [persist])

  const addItem = useCallback((collectionId, item) => {
    const newItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...item,
    }
    persist((prev) =>
      prev.map((c) =>
        c.id === collectionId ? { ...c, items: [newItem, ...c.items] } : c
      )
    )
    return newItem.id
  }, [persist])

  const removeItem = useCallback((collectionId, itemId) => {
    persist((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      )
    )
  }, [persist])

  return {
    collections,
    loading,
    addCollection,
    removeCollection,
    renameCollection,
    addItem,
    removeItem,
  }
}
