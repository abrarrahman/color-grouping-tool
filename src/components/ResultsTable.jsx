import React, { useState } from 'react'
import '../App.css'

const ResultsTable = ({ groupedData, onExport }) => {
  const [expandedGroups, setExpandedGroups] = useState({})
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

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  if (!groupedData || groupedData.length === 0) {
    return (
      <div className="results-table">
        <div className="empty-state">
          No data loaded. Please upload an Excel file to begin.
        </div>
      </div>
    )
  }

  const totalGroups = groupedData.length
  const totalReels = groupedData.reduce((sum, group) => sum + group.colors.length, 0)

  return (
    <div className="results-table">
      <div className="results-header">
        <h2>Results</h2>
        <button
          className={`export-btn ${isExporting ? 'loading' : ''}`}
          onClick={handleExport}
          disabled={!groupedData || groupedData.length === 0}
        >
          {isExporting ? (
            <>
              <span className="spinner"></span>
              Exporting...
            </>
          ) : 'Export to Excel'}
        </button>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="summary-header">
        <strong>Total Groups:</strong> {totalGroups}, <strong>Total Reels:</strong> {totalReels}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Reel Count</th>
              <th>L* Range</th>
              <th>a* Range</th>
              <th>b* Range</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedData.map((group) => {
              const isExpanded = expandedGroups[group.groupId]

              return (
                <React.Fragment key={group.groupId}>
                  <tr>
                    <td>{group.groupId}</td>
                    <td>{group.colors.length}</td>
                    <td>
                      {group.summary.L.min} - {group.summary.L.max} ({group.summary.L.range.toFixed(2)})
                    </td>
                    <td>
                      {group.summary.a.min} - {group.summary.a.max} ({group.summary.a.range.toFixed(2)})
                    </td>
                    <td>
                      {group.summary.b.min} - {group.summary.b.max} ({group.summary.b.range.toFixed(2)})
                    </td>
                    <td>
                      <button
                        className="expand-button"
                        onClick={() => toggleGroup(group.groupId)}
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan="6" style={{ padding: 0, border: 'none' }}>
                        <div className="nested-table-container">
                          <table className="nested-table">
                            <thead>
                              <tr>
                                <th>Reel Number</th>
                                <th>L* Value</th>
                                <th>a* Value</th>
                                <th>b* Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.colors.map((color) => (
                                <tr key={color.id}>
                                  <td>{color.reelNumber}</td>
                                  <td>{color.L}</td>
                                  <td>{color.a}</td>
                                  <td>{color.b}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultsTable
