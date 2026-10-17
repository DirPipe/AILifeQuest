import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, showLabel = true }) => {
  // Aseguramos que el valor esté acotado entre 0 y 100
  const clampedValue = Math.min(100, Math.max(0, percentage));

  return (
    <div className="progress-container">
      {showLabel && (
        <div className="progress-header">
          <span>Progreso de la Meta</span>
          <span className={`progress-percentage ${clampedValue === 100 ? 'complete' : ''}`}>
            {clampedValue}%
          </span>
        </div>
      )}
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Progreso de la meta"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
      >
        <div
          className="progress-fill"
          style={{ width: `${clampedValue}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
