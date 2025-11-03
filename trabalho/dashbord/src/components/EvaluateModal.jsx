import React, { useContext, useState } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../css/modal.css';

const EvaluateModal = ({ patient, onClose }) => {
    const { doctors, addPatientEvaluation } = useContext(HospitalContext);
    const [notes, setNotes] = useState('');
    const [doctorId, setDoctorId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!doctorId) return alert('Selecione um médico');
        addPatientEvaluation(patient.id, doctorId, notes);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Avaliar Paciente: {patient.name}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Médico Responsável</label>
                    <select value={doctorId} onChange={e => setDoctorId(e.target.value)}>
                        <option value="">Selecione</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.name} ({d.specialty})
                            </option>
                        ))}
                    </select>

                    <label>Notas da Avaliação</label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Digite observações..."
                    />

                    <div className="modal-actions">
                        <button type="submit" className="btn btn-green">Salvar</button>
                        <button type="button" className="btn btn-gray" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EvaluateModal;
