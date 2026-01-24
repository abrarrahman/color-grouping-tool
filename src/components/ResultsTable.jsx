import React, { useState } from 'react'

const ResultsTable = ({ groupedData }) => {
  const [expandedGroups, setExpandedGroups] = useState({})

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const containerStyle = {
    marginBottom: '30px'
  }

  const headerStyle = {
    marginBottom: '20px'
  }

  const tableContainerStyle = {
    overflowX: 'auto'
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px'
  }

  const thStyle = {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: '12px',
    textAlign: 'left',
    border: '1px solid #ddd'
  }

  const tdStyle = {
    padding: '10px',
    border: '1px solid #ddd'
  }

  const trEvenStyle = {
    backgroundColor: '#ffffff'
  }

  const trOddStyle = {
    backgroundColor: '#f9f9f9'
  }

  const expandButtonStyle = {
    padding: '6px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }

  const nestedTableContainerStyle = {
    padding: '20px',
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #ddd'
  }

  const nestedTableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  }

  const nestedTdStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    fontSize: '14px'
  }

  const emptyStateStyle = {
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    color: '#666',
    fontSize: '16px'
  }

  if (!groupedData || groupedData.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={emptyStateStyle}>
          No data loaded. Please upload an Excel file to begin.
        </div>
      </div>
    )
  }

  const totalGroups = groupedData.length
  const totalReels = groupedData.reduce((sum, group) => sum + group.colors.length, 0)

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Results</h2>
      
      <div style={{ marginBottom: '20px', fontSize: '16px' }}>
        <strong>Total Groups:</strong> {totalGroups}, <strong>Total Reels:</strong> {totalReels}
      </div>

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Group ID</th>
              <th style={thStyle}>Reel Count</th>
              <th style={thStyle}>L* Range</th>
              <th style={thStyle}>a* Range</th>
              <th style={thStyle}>b* Range</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedData.map((group, index) => {
              const isExpanded = expandedGroups[group.groupId]
              const rowStyle = index % 2 === 0 ? trEvenStyle : trOddStyle

              return (
                <React.Fragment key={group.groupId}>
                  <tr style={rowStyle}>
                    <td style={tdStyle}>{group.groupId}</td>
                    <td style={tdStyle}>{group.colors.length}</td>
                    <td style={tdStyle}>
                      {group.summary.L.min} - {group.summary.L.max} ({group.summary.L.range.toFixed(2)})
                    </td>
                    <td style={tdStyle}>
                      {group.summary.a.min} - {group.summary.a.max} ({group.summary.a.range.toFixed(2)})
                    </td>
                    <td style={tdStyle}>
                      {group.summary.b.min} - {group.summary.b.max} ({group.summary.b.range.toFixed(2)})
                    </td>
                    <td style={tdStyle}>
                      <button 
                        style={expandButtonStyle}
                        onClick={() => toggleGroup(group.groupId)}
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan="6" style={{ padding: 0, border: 'none' }}>
                        <div style={nestedTableContainerStyle}>
                          <table style={nestedTableStyle}>
                            <thead>
                              <tr>
                                <th style={{ ...thStyle, padding: '8px', fontSize: '14px' }}>Reel Number</th>
                                <th style={{ ...thStyle, padding: '8px', fontSize: '14px' }}>L* Value</th>
                                <th style={{ ...thStyle, padding: '8px', fontSize: '14px' }}>a* Value</th>
                                <th style={{ ...thStyle, padding: '8px', fontSize: '14px' }}>b* Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.colors.map((color) => (
                                <tr key={color.id} style={index % 2 === 0 ? trEvenStyle : trOddStyle}>
                                  <td style={nestedTdStyle}>{color.reelNumber}</td>
                                  <td style={nestedTdStyle}>{color.L}</td>
                                  <td style={nestedTdStyle}>{color.a}</td>
                                  <td style={nestedTdStyle}>{color.b}</td>
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
