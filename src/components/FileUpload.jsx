import React, { useState } from 'react'

const FileUpload = ({ onFileSelect, onClear, fileName, error }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    validateAndSelectFile(file)
  }

  const validateAndSelectFile = (file) => {
    if (!file) return

    const fileName = file.name.toLowerCase()
    const validExtensions = ['.xlsx', '.xls']
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext))

    if (!isValidExtension) {
      onFileSelect({ error: 'Please upload a valid Excel file (.xlsx or .xls)' })
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      onFileSelect({ error: 'File size exceeds 10MB limit' })
      return
    }

    onFileSelect({ file })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    validateAndSelectFile(file)
  }

  const handleClear = () => {
    onClear()
  }

  const containerStyle = {
    marginBottom: '30px'
  }

  const dropZoneStyle = {
    border: isDragging ? '2px solid #4CAF50' : '2px dashed #cccccc',
    padding: '40px',
    backgroundColor: isDragging ? '#c8e6c9' : '#fafafa',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '4px'
  }

  const errorStyle = {
    color: 'red',
    backgroundColor: '#fee',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #fcc'
  }

  const fileInfoStyle = {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const clearButtonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }

  const inputStyle = {
    display: 'none'
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px' }}>Upload Excel File</h2>
      
      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <div
        style={dropZoneStyle}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".xlsx, .xls"
          style={inputStyle}
          onChange={handleFileChange}
        />
        <p style={{ margin: 0, fontSize: '16px' }}>
          Drag and drop your Excel file here, or click to browse
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
          Supports .xlsx and .xls files (max 10MB)
        </p>
      </div>

      {fileName && (
        <div style={fileInfoStyle}>
          <span>
            <strong>Selected file:</strong> {fileName}
          </span>
          <button style={clearButtonStyle} onClick={handleClear}>
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload
