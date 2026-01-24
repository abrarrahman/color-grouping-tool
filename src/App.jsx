import React, { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload.jsx'
import ToleranceControls from './components/ToleranceControls.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import ExportButton from './components/ExportButton.jsx'
import { parseExcel } from './utils/excelParser.js'
import { groupColors } from './utils/colorGrouper.js'

const App = () => {
  const [parsedData, setParsedData] = useState([])
  const [groupedData, setGroupedData] = useState([])
  const [isFileLoaded, setIsFileLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGrouping, setIsGrouping] = useState(false)
  const [fileName, setFileName] = useState(null)

  const [tolerances, setTolerances] = useState({
    deltaL: 0.15,
    deltaA: 0.08,
    deltaB: 0.10
  })

  const defaultTolerances = {
    deltaL: 0.15,
    deltaA: 0.08,
    deltaB: 0.10
  }

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
    setTolerances(defaultTolerances)
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

    performGrouping()
  }, [parsedData, tolerances])

  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const headerStyle = {
    marginBottom: '30px',
    fontSize: '28px'
  }

  const errorStyle = {
    color: 'red',
    backgroundColor: '#fee',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #fcc'
  }

  const clearButtonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '30px'
  }

  const loadingStyle = {
    padding: '10px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    marginBottom: '20px',
    borderRadius: '4px',
    textAlign: 'center'
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Color Grouping Tool</h1>

      {error && !isLoading && !isGrouping && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {isLoading && (
        <div style={loadingStyle}>
          Processing file...
        </div>
      )}

      {isGrouping && (
        <div style={loadingStyle}>
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
          <ToleranceControls
            tolerances={tolerances}
            onToleranceChange={handleToleranceChange}
          />

          <button
            style={clearButtonStyle}
            onClick={handleClearData}
          >
            Clear Data
          </button>
        </>
      )}

      {groupedData.length > 0 && (
        <>
          <ResultsTable
            groupedData={groupedData}
          />

          <ExportButton
            groupedData={groupedData}
            onExport={handleExport}
          />
        </>
      )}
    </div>
  )
}

export default App
