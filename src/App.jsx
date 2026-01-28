import React, { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload.jsx'
import ToleranceControls from './components/ToleranceControls.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import { parseExcel } from './utils/excelParser.js'
import { groupColors } from './utils/colorGrouper.js'
import { DEFAULT_TOLERANCES } from './constants.js'
import './App.css'

const App = () => {
  const [parsedData, setParsedData] = useState([])
  const [groupedData, setGroupedData] = useState([])
  const [isFileLoaded, setIsFileLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGrouping, setIsGrouping] = useState(false)
  const [fileName, setFileName] = useState(null)

  const [tolerances, setTolerances] = useState(DEFAULT_TOLERANCES)

  const handleFileSelect = async ({ file, error: fileError }) => {
    if (fileError) {
      setError(fileError)
      setFileName(null)
      return
    }

    setError(null)
    setFileName(file.name)
    setIsLoading(true)

    try {
      const data = await parseExcel(file)
      setParsedData(data)
      setIsFileLoaded(true)
      
      if (data.length > 1000) {
        setError(`Processing large file (${data.length} rows), please wait...`)
        setTimeout(() => setError(null), 2000)
      }
    } catch (err) {
      setError('Failed to parse Excel file. Please check the file format.')
      setIsFileLoaded(false)
      setParsedData([])
      setGroupedData([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleToleranceChange = (updatedTolerances) => {
    setTolerances(updatedTolerances)
  }

  const handleClearFile = () => {
    setFileName(null)
    setError(null)
  }

  const handleClearData = () => {
    setParsedData([])
    setGroupedData([])
    setIsFileLoaded(false)
    setTolerances(DEFAULT_TOLERANCES)
    setFileName(null)
    setError(null)
  }

  const handleExport = async () => {
    try {
      const { exportToExcel } = await import('./utils/excelExporter.js')
      await exportToExcel(groupedData)
    } catch (err) {
      setError('Export failed. Please try again.')
      setTimeout(() => setError(null), 3000)
    }
  }

  useEffect(() => {
    const performGrouping = async () => {
      if (parsedData.length > 0) {
        setIsGrouping(true)
        try {
          const grouped = groupColors(parsedData, tolerances)
          setGroupedData(grouped)
        } catch (err) {
          setError('Error grouping colors. Please try again.')
          setTimeout(() => setError(null), 3000)
        } finally {
          setIsGrouping(false)
        }
      }
    }

    void performGrouping()
  }, [parsedData, tolerances])

  return (
    <div className="app">
      <h1>Color Grouping Tool</h1>

      {error && !isLoading && !isGrouping && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-message">
          Processing file...
        </div>
      )}

      {isGrouping && (
        <div className="loading-message">
          Grouping colors...
        </div>
      )}

      <FileUpload
        onFileSelect={handleFileSelect}
        onClear={handleClearFile}
        fileName={fileName}
        error={null}
      />

      {isFileLoaded && (
        <>
          <div style={{ marginTop: '20px' }}>
            <ToleranceControls
              tolerances={tolerances}
              onToleranceChange={handleToleranceChange}
            />
          </div>

          <button
            className="clear-data-button"
            onClick={handleClearData}
          >
            Clear Data
          </button>
        </>
      )}

      {groupedData.length > 0 && (
        <ResultsTable
          groupedData={groupedData}
          onExport={handleExport}
        />
      )}
    </div>
  )
}

export default App
