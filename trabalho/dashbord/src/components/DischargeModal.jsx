import React, { useContext } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../css/modal.css';

const DischargeModal = ({ patient, onClose }) => {
    const { dischargePatient } = useContext(HospitalContext);

    const handleDischarge = () => {
        dischargePatient(patient.id);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Liberação do Paciente: {patient.name}</h2>
                <p>Deseja realmente liberar o paciente do leito {patient.bedId}?</p>
                <div className="modal-actions">
                    <button className="btn btn-red" onClick={handleDischarge}>Confirmar</button>
                    <button className="btn btn-gray" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default DischargeModal;
