import React, { useState, useMemo, useEffect } from 'react'
import '../App.css'

const ResultsTable = ({ groupedData }) => {
  const [expandedGroups, setExpandedGroups] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [groupedData])

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const totalPages = Math.ceil(groupedData.length / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, groupedData.length)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return groupedData.slice(startIndex, startIndex + pageSize)
  }, [groupedData, currentPage, pageSize])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value)
    setPageSize(newSize)
    setCurrentPage(1)
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
      </div>

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
            {paginatedData.map((group) => {
              const isExpanded = expandedGroups[group.groupId]

              return (
                <React.Fragment key={group.groupId}>
                  <tr>
                    <td>{group.groupId}</td>
                    <td>{group.colors.length}</td>
                    <td>
                      {group.summary.L.min.toFixed(2)} - {group.summary.L.max.toFixed(2)} ({group.summary.L.range.toFixed(2)})
                    </td>
                    <td>
                      {group.summary.a.min.toFixed(2)} - {group.summary.a.max.toFixed(2)} ({group.summary.a.range.toFixed(2)})
                    </td>
                    <td>
                      {group.summary.b.min.toFixed(2)} - {group.summary.b.max.toFixed(2)} ({group.summary.b.range.toFixed(2)})
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
                                  <td>{color.L.toFixed(2)}</td>
                                  <td>{color.a.toFixed(2)}</td>
                                  <td>{color.b.toFixed(2)}</td>
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

      <div className="pagination">
        <div className="pagination-info">
          <span className="pagination-text">
            {startItem} to {endItem} of {groupedData.length}
          </span>
        </div>

        <div className="pagination-controls">
          <div className="pagination-nav">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="page-number">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <div className="pagination-size">
            <label htmlFor="page-size">Rows per page:</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="page-size-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsTable
