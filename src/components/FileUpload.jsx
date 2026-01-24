import React, { useState } from 'react'
import '../App.css'

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

  return (
    <div className="file-upload">
      <h2>Upload Excel File</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <p>
          Drag and drop your Excel file here, or click to browse
        </p>
        <p className="subtext">
          Supports .xlsx and .xls files (max 10MB)
        </p>
      </div>

      {fileName && (
        <div className="file-info">
          <span>
            <strong>Selected file:</strong> {fileName}
          </span>
          <button className="clear-button" onClick={handleClear}>
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload
