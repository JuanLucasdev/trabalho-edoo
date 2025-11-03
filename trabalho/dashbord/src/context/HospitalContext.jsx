import React, { createContext, useState, useEffect } from 'react';

export const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8080";

  //  Utilitário 
  const handleResponse = async (res) => {
    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
  };

  // Carregar dados
  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resPacientes, resLeitos, resMedicos] = await Promise.all([
        fetch(`${API_BASE}/pacientes`),
        fetch(`${API_BASE}/leitos`),
        fetch(`${API_BASE}/medicos`)
      ]);
      const dataPacientes = await handleResponse(resPacientes);
      const dataLeitos = await handleResponse(resLeitos);
      const dataMedicos = await handleResponse(resMedicos);

      // Pacientes
      if (Array.isArray(dataPacientes)) {
        const leitosMap = {};
        if (Array.isArray(dataLeitos)) dataLeitos.forEach(l => leitosMap[l.id_paciente] = l);

        const pacientesAtualizados = dataPacientes.map(p => {
          const leito = leitosMap[p.id] || null;
          return {
            ...p,
            status: leito && leito.ocupado ? "Internado" : "Livre",
            leito: leito && leito.ocupado ? leito.numero : null,
          };
        });
        setPatients(pacientesAtualizados);
      } else setPatients([]);

      // Leitos
      if (Array.isArray(dataLeitos)) {
        setBeds(dataLeitos.map(l => ({
          id: l.numero,
          pacienteId: l.id_paciente || 0,
          status: l.ocupado ? "Ocupado" : "Livre"
        })));
      } else setBeds([]);

      // Médicos
      if (Array.isArray(dataMedicos)) setDoctors(dataMedicos);
      else setDoctors([]);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // ---------------- Pacientes ----------------
  const adicionarPaciente = async (paciente) => {
    try {
      const payload = {
        id: parseInt(paciente.id),
        nome: paciente.nome,
        idade: paciente.idade || 30,
        diagnostico: paciente.diagnostico
      };
      const res = await fetch(`${API_BASE}/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await handleResponse(res);
      await carregarDados();
      return result.status === "ok";
    } catch (err) {
      console.error("Erro ao adicionar paciente:", err);
      return false;
    }
  };

  const internarPaciente = async (id, leito) => {
    try {
      const res = await fetch(`${API_BASE}/internar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, leito }),
      });
      await handleResponse(res);
      await carregarDados();
      return true;
    } catch (err) {
      console.error("Erro ao internar paciente:", err);
      return false;
    }
  };

  const avaliarPaciente = async (doctorId, patientId) => {
    try {
      const res = await fetch(`${API_BASE}/avaliar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: patientId }),
      });
      const result = await handleResponse(res);
      await carregarDados();
      return result;
    } catch (err) {
      console.error("Erro ao avaliar paciente:", err);
      return { status: "erro", msg: "Erro ao avaliar paciente" };
    }
  };

  const resetarHospital = async () => {
    try {
      const res = await fetch(`${API_BASE}/resetar`, { method: "DELETE" });
      await handleResponse(res);
      await carregarDados();
      return true;
    } catch (err) {
      console.error("Erro ao resetar hospital:", err);
      return false;
    }
  };

  //  Médicos 
  const adicionarMedico = async (med) => {
    try {
      const payload = {
        id: parseInt(med.id),
        nome: med.nome,
        especialidade: med.especialidade,
        crm: med.crm || "0000"
      };
      const res = await fetch(`${API_BASE}/medicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await handleResponse(res);
      await carregarDados();
      return result.status === "ok";
    } catch (err) {
      console.error("Erro ao adicionar médico:", err);
      return false;
    }
  };

  const removerMedico = async (id) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  return (
    <HospitalContext.Provider value={{
      patients,
      beds,
      doctors,
      loading,
      carregarDados,
      adicionarPaciente,
      internarPaciente,
      avaliarPaciente,
      resetarHospital,
      adicionarMedico,
      removerMedico
    }}>
      {children}
    </HospitalContext.Provider>
  );
};
