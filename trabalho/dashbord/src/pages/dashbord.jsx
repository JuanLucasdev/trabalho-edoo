import React, { useContext, useState } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import BedMap from '../components/BedMap';
import '../css/dashboard.css';

const Dashboard = () => {
  const { patients, beds, adicionarPaciente, internarPaciente } = useContext(HospitalContext);

  // Filtra pacientes internados e calcula leitos ocupados/livres
  const internedPatients = patients.filter(p => p.status === 'Internado');
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'Ocupado').length;
  const freeBeds = beds.filter(b => b.status === 'Livre').length;

  // Estado do formulário rápido de adicionar paciente
  const [form, setForm] = useState({ id: '', nome: '', data_nascimento: '', diagnostico: '' });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.id || !form.nome) return alert('Preencha ID e nome');
    await adicionarPaciente(form);
    setForm({ id: '', nome: '', data_nascimento: '', diagnostico: '' });
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Cards de resumo */}
      <div className="cards-container" style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div className="card card-green">Total de Leitos: {totalBeds}</div>
        <div className="card card-red">Leitos Ocupados: {occupiedBeds}</div>
        <div className="card card-blue">Leitos Livres: {freeBeds}</div>
        <div className="card card-yellow">Pacientes Internados: {internedPatients.length}</div>
      </div>

      {/* Mapa de leitos */}
      <h2>Mapa de Leitos</h2>
      <BedMap beds={beds} />

      {/* Lista de pacientes internados */}
      <h2>Pacientes Internados</h2>
      {internedPatients.length === 0 ? <p>Nenhum paciente internado.</p> : (
        <table className="patients-table">
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Leito</th><th>Status</th></tr>
          </thead>
          <tbody>
            {internedPatients.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.leito || '-'}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Formulário rápido para adicionar paciente */}
      <h2>Adicionar Paciente (rápido)</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input name="id" value={form.id} onChange={handleChange} placeholder="ID" type="number" required />
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" required />
        <input name="data_nascimento" value={form.data_nascimento} onChange={handleChange} type="date" />
        <input name="diagnostico" value={form.diagnostico} onChange={handleChange} placeholder="Diagnóstico" />
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

export default Dashboard;