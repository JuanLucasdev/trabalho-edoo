import React, { useContext, useState } from "react";
import { HospitalContext } from "../context/HospitalContext";
import "../css/patients.css";

const Patients = () => {
  const { patients, beds, adicionarPaciente, internarPaciente } = useContext(HospitalContext);

  const [newPatient, setNewPatient] = useState({ id: "", nome: "", data_nascimento: "", diagnostico: "" });

  // Atualiza campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  // Adiciona paciente
  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.id || !newPatient.nome) return alert("Preencha ID e nome!");
    await adicionarPaciente(newPatient);
    setNewPatient({ id: "", nome: "", data_nascimento: "", diagnostico: "" });
  };

  // Interna paciente em leito livre
  const handleInternar = async (patientId) => {
    const freeBed = beds.find(b => b.pacienteId === 0);
    if (!freeBed) return alert("Nenhum leito disponível!");
    await internarPaciente(patientId, freeBed.id);
  };

  return (
    <div className="page-container">
      <h1>Pacientes</h1>

      {/* Formulário adicionar paciente - estilizado */}
      <form className="add-patient-form eval-container" onSubmit={handleAddPatient}>
        <input type="number" name="id" placeholder="ID" value={newPatient.id} onChange={handleInputChange} required />
        <input type="text" name="nome" placeholder="Nome" value={newPatient.nome} onChange={handleInputChange} required />
        <input type="date" name="data_nascimento" placeholder="Nascimento" value={newPatient.data_nascimento} onChange={handleInputChange} />
        <input type="text" name="diagnostico" placeholder="Diagnóstico" value={newPatient.diagnostico} onChange={handleInputChange} />
        <button type="submit" className="btn-new">Adicionar Paciente</button>
      </form>

      {/* Tabela de pacientes */}
      {patients.length === 0 ? (
        <p>Nenhum paciente cadastrado.</p>
      ) : (
        <table className="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Leito</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.status}</td>
                <td>{p.leito || "-"}</td>
                <td>{p.status === "Livre" && <button onClick={() => handleInternar(p.id)}>Internar</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Patients;
