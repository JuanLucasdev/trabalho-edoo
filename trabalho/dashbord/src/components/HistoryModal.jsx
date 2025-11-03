import React, { useContext } from 'react';
import { HospitalContext } from '../context/HospitalContext';
import '../css/modal.css';

const HistoryModal = ({ patient, onClose }) => {
    const { doctors } = useContext(HospitalContext);

    return (
        <div className="modal-overlay">
            <div className="modal-container history-modal">
                <h2>Histórico de {patient.name}</h2>
                {patient.history.length === 0 ? (
                    <p>Nenhum registro encontrado.</p>
                ) : (
                    <div className="history-entries">
                        {patient.history
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((entry, index) => {
                                const doctor = doctors.find(d => d.id === entry.doctorId);
                                return (
                                    <div key={index} className={`history-entry ${entry.type.toLowerCase()}`}>
                                        <p className="entry-type">{entry.type}{entry.bedId ? ` (Leito ${entry.bedId})` : ''}</p>
                                        <p className="entry-date">{entry.date}{doctor ? ` - ${doctor.name}` : ''}</p>
                                        <p className="entry-notes">{entry.notes}</p>
                                    </div>
                                );
                            })}
                    </div>
                )}
                <div className="modal-actions">
                    <button className="btn btn-gray" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
