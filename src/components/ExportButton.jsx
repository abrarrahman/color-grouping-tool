import React, { useState } from 'react'
import '../App.css'

const ExportButton = ({ groupedData, onExport }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const handleExport = async () => {
    if (!groupedData || groupedData.length === 0) {
      return
    }

    setIsExporting(true)
    setMessage(null)
    setMessageType(null)

    try {
      if (onExport) {
        await onExport()
      }
      setMessage('Excel file exported successfully!')
      setMessageType('success')
    } catch {
      setMessage('Export failed. Please try again.')
      setMessageType('error')
    } finally {
      setIsExporting(false)
    }
  }

  const isDisabled = !groupedData || groupedData.length === 0

  return (
    <div className="export-button">
      <button
        className={`export-btn ${isExporting ? 'loading' : ''}`}
        onClick={handleExport}
        disabled={isDisabled}
      >
        {isExporting ? (
          <>
            <span className="spinner"></span>
            Exporting...
          </>
        ) : 'Export to Excel'}
      </button>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default ExportButton
