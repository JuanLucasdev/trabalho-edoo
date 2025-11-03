import React, { useContext, useState } from "react";
import { HospitalContext } from "../context/HospitalContext";
import "../css/doctors.css";

const Doctors = () => {
  const { doctors = [], adicionarMedico, avaliarPaciente, patients } = useContext(HospitalContext);
  const [newDoctor, setNewDoctor] = useState({ id: "", nome: "", especialidade: "" });

  // Adiciona novo médico
  const handleAddDoctor = async () => {
    if (!newDoctor.id || !newDoctor.nome || !newDoctor.especialidade) return alert("Preencha todos os campos!");
    const sucesso = await adicionarMedico({ 
      id: parseInt(newDoctor.id), 
      nome: newDoctor.nome, 
      especialidade: newDoctor.especialidade 
    });
    if (sucesso) setNewDoctor({ id: "", nome: "", especialidade: "" });
    else alert("Erro ao adicionar médico!");
  };

  // Avalia paciente
  const handleEvaluatePatient = async (doctorId, patientId) => {
    if (!patientId) return alert("Paciente inválido");
    const result = await avaliarPaciente(doctorId, patientId);
    alert(result && result.msg ? result.msg : "Avaliação concluída.");
  };

  return (
    <div className="page-container">
      <h1>Médicos</h1>

      {/* Formulário de adicionar médico */}
      <div className="add-doctor-form">
        <input 
          type="text" 
          placeholder="ID" 
          value={newDoctor.id} 
          onChange={(e) => setNewDoctor({ ...newDoctor, id: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Nome" 
          value={newDoctor.nome} 
          onChange={(e) => setNewDoctor({ ...newDoctor, nome: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Especialidade" 
          value={newDoctor.especialidade} 
          onChange={(e) => setNewDoctor({ ...newDoctor, especialidade: e.target.value })} 
        />
        <button onClick={handleAddDoctor}>Adicionar Médico</button>
      </div>

      {/* Lista de médicos */}
      {doctors.length === 0 ? (
        <p>Nenhum médico cadastrado.</p>
      ) : (
        <div>
          <table className="doctors-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Especialidade</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.nome}</td>
                  <td>{d.especialidade}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Avaliar pacientes (por médico)</h3>
          {doctors.map(d => (
            <div key={`eval-${d.id}`} className="eval-container">
              <div><strong>{d.nome} (ID {d.id})</strong></div>
              <div className="eval-patients">
                {patients.length === 0 ? (
                  <div className="no-patients">Nenhum paciente</div>
                ) : patients.map(p => (
                  <div key={`${d.id}-${p.id}`} className="eval-patient-item">
                    <div style={{ minWidth: 140 }}>{p.id} — {p.nome} ({p.status})</div>
                    <button onClick={() => handleEvaluatePatient(d.id, p.id)}>
                      Avaliar {p.nome}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
