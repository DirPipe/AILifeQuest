import { useState } from 'react';

export default function App() {
  const [xp, setXp] = useState<number>(0);

  const handleGanarXp = () => {
    setXp(prevXp => prevXp + 50);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>
        🎮 AI LifeQuest Frontend
      </h1>
      <p style={{ color: 'var(--text-muted)' }}>
        ¡Paleta Cyberpunk / Gaming aplicada correctamente!
      </p>

      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        display: 'inline-block',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Perfil del Jugador</h2>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          ⭐ XP Actual: <span style={{ color: 'var(--xp-color)' }}>{xp} PTS</span>
        </p>
        <button 
          onClick={handleGanarXp}
          style={{
            padding: '0.8rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          ¡Completar Reto de Prueba (+50 XP)!
        </button>
      </div>
    </div>
  );
}