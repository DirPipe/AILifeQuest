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
          <span style={{ color: clampedValue === 100 ? 'var(--success)' : 'var(--text-main)' }}>
            {clampedValue}% {clampedValue === 100 && '🎉'}
          </span>
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};