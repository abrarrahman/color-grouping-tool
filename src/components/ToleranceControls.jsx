import React from 'react'

const ToleranceControls = ({ tolerances, onToleranceChange }) => {
  const defaultTolerances = {
    deltaL: 0.15,
    deltaA: 0.08,
    deltaB: 0.10
  }

  const handleChange = (dimension, value) => {
    const numValue = parseFloat(value)
    
    if (isNaN(numValue)) return
    if (numValue < 0.01 || numValue > 1.0) return

    onToleranceChange({
      ...tolerances,
      [dimension]: numValue
    })
  }

  const handleReset = (dimension) => {
    onToleranceChange({
      ...tolerances,
      [dimension]: defaultTolerances[dimension]
    })
  }

  const containerStyle = {
    marginBottom: '30px'
  }

  const headingStyle = {
    marginBottom: '20px'
  }

  const controlsContainerStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  }

  const controlStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  }

  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '14px'
  }

  const inputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }

  const resetButtonStyle = {
    padding: '4px 8px',
    fontSize: '12px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '5px'
  }

  const inputStyle = {
    width: '100px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px'
  }

  const valueDisplayStyle = {
    fontSize: '14px',
    color: '#666'
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Tolerance Controls</h2>
      
      <div style={controlsContainerStyle}>
        <div style={controlStyle}>
          <label style={labelStyle}>ΔL* Tolerance</label>
          <div style={inputContainerStyle}>
            <input
              type="number"
              min="0.01"
              max="1.0"
              step="0.01"
              value={tolerances.deltaL}
              onChange={(e) => handleChange('deltaL', e.target.value)}
              style={inputStyle}
            />
            <span style={valueDisplayStyle}>
              Current: {tolerances.deltaL.toFixed(2)}
            </span>
            <button 
              style={resetButtonStyle} 
              onClick={() => handleReset('deltaL')}
            >
              Reset
            </button>
          </div>
        </div>

        <div style={controlStyle}>
          <label style={labelStyle}>Δa* Tolerance</label>
          <div style={inputContainerStyle}>
            <input
              type="number"
              min="0.01"
              max="1.0"
              step="0.01"
              value={tolerances.deltaA}
              onChange={(e) => handleChange('deltaA', e.target.value)}
              style={inputStyle}
            />
            <span style={valueDisplayStyle}>
              Current: {tolerances.deltaA.toFixed(2)}
            </span>
            <button 
              style={resetButtonStyle} 
              onClick={() => handleReset('deltaA')}
            >
              Reset
            </button>
          </div>
        </div>

        <div style={controlStyle}>
          <label style={labelStyle}>Δb* Tolerance</label>
          <div style={inputContainerStyle}>
            <input
              type="number"
              min="0.01"
              max="1.0"
              step="0.01"
              value={tolerances.deltaB}
              onChange={(e) => handleChange('deltaB', e.target.value)}
              style={inputStyle}
            />
            <span style={valueDisplayStyle}>
              Current: {tolerances.deltaB.toFixed(2)}
            </span>
            <button 
              style={resetButtonStyle} 
              onClick={() => handleReset('deltaB')}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToleranceControls
