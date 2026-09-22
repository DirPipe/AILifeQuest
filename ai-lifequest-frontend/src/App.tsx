import { useState } from 'react';

export default function App() {
  const [xp, setXp] = useState<number>(0);

  const handleGanarXp = () => {
    setXp(prevXp => prevXp + 50);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>🎮 AI LifeQuest Frontend</h1>
      <p>¡Tu entorno de React + Vite + TypeScript está listo y funcionando!</p>
      
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'inline-block'
      }}>
        <h2>Perfil del Jugador</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          ⭐ XP Actual: <span style={{ color: '#e67e22' }}>{xp} PTS</span>
        </p>
        <button 
          onClick={handleGanarXp}
          style={{
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ¡Completar Reto de Prueba (+50 XP)!
        </button>
      </div>
    </div>
  );
}