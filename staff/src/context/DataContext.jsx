import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

const STORAGE_KEY = 'staff_marks_portal_data'

export function DataProvider({ children }) {
  const [marksData, setMarksData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setMarksData(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored data:', e)
      }
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(marksData))
    }
  }, [marksData, isLoading])

  const addRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    setMarksData(prev => [...prev, newRecord])
    return newRecord
  }

  const deleteRecord = (id) => {
    setMarksData(prev => prev.filter(r => r.id !== id))
  }

  const updateRecord = (id, updates) => {
    setMarksData(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  return (
    <DataContext.Provider value={{ 
      marksData, 
      isLoading, 
      addRecord, 
      deleteRecord, 
      updateRecord 
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
