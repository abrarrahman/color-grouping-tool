import React, { useState } from 'react'

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
    } catch (error) {
      setMessage('Export failed. Please try again.')
      setMessageType('error')
    } finally {
      setIsExporting(false)
    }
  }

  const containerStyle = {
    marginBottom: '30px'
  }

  const buttonStyle = {
    backgroundColor: (!groupedData || groupedData.length === 0) ? '#cccccc' : '#4CAF50',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: (!groupedData || groupedData.length === 0) ? 'not-allowed' : 'pointer',
    opacity: isExporting ? 0.6 : 1
  }

  const messageStyle = {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
    color: messageType === 'success' ? '#155724' : '#721c24',
    border: messageType === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
  }

  const isDisabled = !groupedData || groupedData.length === 0

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onClick={handleExport}
        disabled={isDisabled}
      >
        {isExporting ? 'Exporting...' : 'Export to Excel'}
      </button>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}
    </div>
  )
}

export default ExportButton
