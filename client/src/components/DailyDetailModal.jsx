import Modal from 'react-modal';

const DailyDetailModal = ({ isOpen, onClose, selectedDate }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Daily Log Entry"
      
      className="worktrackr-modal-content"
      overlayClassName="worktrackr-modal-overlay"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Daily Log: {selectedDate}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
          &times;
        </button>
      </div>
      
      <hr />

      {/* Form will go here */}
      <div>
        <p>Form to add/edit log for this day will go here.</p>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <button onClick={onClose} style={{ marginRight: '0.5rem' }}>
          Cancel
        </button>
        <button style={{ background: '#007bff', color: 'white' }}>
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default DailyDetailModal;