import React from 'react'
import { DEFAULT_TOLERANCES } from '../constants.js'
import '../App.css'

const ToleranceControls = ({ tolerances, onToleranceChange }) => {

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
      [dimension]: DEFAULT_TOLERANCES[dimension]
    })
  }

  return (
    <div className="tolerance-controls">
      <h2>Tolerance Controls</h2>

      <div className="controls-container">
        <div className="control-group">
          <label htmlFor="deltaL">ΔL* Tolerance</label>
          <div className="input-container">
            <input
              id="deltaL"
              type="number"
              min="0.01"
              max="1.0"
              step="0.01"
              value={tolerances.deltaL}
              onChange={(e) => handleChange('deltaL', e.target.value)}
            />
            <span className="current-value">
              Current: {tolerances.deltaL.toFixed(2)}
            </span>
            <button
              className="reset-button"
              onClick={() => handleReset('deltaL')}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="deltaA">Δa* Tolerance</label>
          <div className="input-container">
            <input
              id="deltaA"
              type="number"
              min="0.01"
              max="1.0"
              step="0.01"
              value={tolerances.deltaA}
              onChange={(e) => handleChange('deltaA', e.target.value)}
            />
            <span className="current-value">
              Current: {tolerances.deltaA.toFixed(2)}
            </span>
            <button
              className="reset-button"
              onClick={() => handleReset('deltaA')}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="deltaB">Δb* Tolerance</label>
          <div className="input-container">
            <input
              id="deltaB"
              type="number"
              min="0.01"
              max="1.0"
              step="0.01"
              value={tolerances.deltaB}
              onChange={(e) => handleChange('deltaB', e.target.value)}
            />
            <span className="current-value">
              Current: {tolerances.deltaB.toFixed(2)}
            </span>
            <button
              className="reset-button"
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
