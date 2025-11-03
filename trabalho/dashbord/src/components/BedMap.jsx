// BedMap.jsx
import React from 'react';
import '../css/bedmap.css'; // opcional: estilos simples

const BedMap = ({ beds = [] }) => {
  // beds: [{id, pacienteId, status}]
  return (
    <div className="bedmap-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
      gap: '8px',
      marginBottom: '16px'
    }}>
      {beds.length === 0 ? (
        <div>Nenhum leito</div>
      ) : beds.map(b => (
        <div key={b.id} style={{
          border: '1px solid #ccc',
          borderRadius: 6,
          padding: 8,
          textAlign: 'center',
          background: b.status === 'Ocupado' ? '#ffdede' : '#e8ffe8'
        }}>
          <div style={{ fontWeight: 'bold' }}>Leito {b.id}</div>
          <div style={{ fontSize: 12 }}>{b.status}</div>
          <div style={{ fontSize: 12 }}>{b.pacienteId ? `Paciente ${b.pacienteId}` : '-'}</div>
        </div>
      ))}
    </div>
  );
};

export default BedMap;
