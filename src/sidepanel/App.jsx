import { useState, useEffect } from 'react'
import { useCollections } from '../hooks/useCollections.js'
import { loadCollections } from '../utils/storage.js'
import CollectionList from '../components/CollectionList.jsx'
import CollectionDetail from '../components/CollectionDetail.jsx'

export default function App() {
  const {
    collections,
    loading,
    addCollection,
    removeCollection,
    renameCollection,
    addItem,
    removeItem,
  } = useCollections()

  const [selectedId, setSelectedId] = useState(null)
  // Item queued by context menu / external action to be added
  const [pendingItem, setPendingItem] = useState(null)

  const selectedCollection = collections.find((c) => c.id === selectedId) ?? null

  // Auto-deselect if the collection was deleted
  useEffect(() => {
    if (selectedId && !collections.find((c) => c.id === selectedId)) {
      setSelectedId(null)
    }
  }, [collections, selectedId])

  // Silent refresh on tab switch — keeps current view, re-syncs storage
  useEffect(() => {
    function onTabActivated() {
      loadCollections().then((data) => {
        // Only update the ref + state; the hook's persist keeps them in sync
        // We fire a storage read so the hook's onCollectionsChanged can pick it up
        // via a direct state push to avoid any stale closure issues.
        // Using a custom event to notify the hook without prop-drilling.
        window.dispatchEvent(new CustomEvent('cfe:tab-activated', { detail: data }))
      })
    }
    chrome.tabs.onActivated.addListener(onTabActivated)
    return () => chrome.tabs.onActivated.removeListener(onTabActivated)
  }, [])

  // Listen for items pushed in from the background service worker
  useEffect(() => {
    const listener = (message) => {
      if (message.type === 'ADD_ITEM_FROM_CONTEXT') {
        setPendingItem(message.payload)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (selectedCollection) {
    return (
      <CollectionDetail
        collection={selectedCollection}
        onBack={() => setSelectedId(null)}
        onAddItem={(item) => addItem(selectedId, item)}
        onRemoveItem={(itemId) => removeItem(selectedId, itemId)}
        pendingItem={pendingItem}
        onPendingItemHandled={() => setPendingItem(null)}
      />
    )
  }

  return (
    <CollectionList
      collections={collections}
      onSelect={setSelectedId}
      onAdd={addCollection}
      onRemove={removeCollection}
      onRename={renameCollection}
      pendingItem={pendingItem}
      onPendingItemHandled={(collectionId, item) => {
        addItem(collectionId, item)
        setPendingItem(null)
        setSelectedId(collectionId)
      }}
    />
  )
}
