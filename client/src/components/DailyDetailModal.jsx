import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Define the initial state for a new, empty form
const initialFormState = {
  dsa: { problems: [], notes: '' },
  cp: { contests: [], notes: '' },
  dev: { projects: [], notes: '' },
  college: { topics: [], notes: '' },
  other: { notes: '' },
};

const DailyDetailModal = ({ isOpen, onClose, selectedDate }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Get user for the auth token

  // --- 1. Fetch Data When Modal Opens ---
  useEffect(() => {
    if (isOpen && selectedDate) {
      const fetchEntry = async () => {
        setIsLoading(true);
        try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          const response = await axios.get(`/api/entries/by-date/${selectedDate}`, config);

          if (response.data) {
            setFormData({ ...initialFormState, ...response.data });
          } else {
            setFormData(initialFormState);
          }
        } catch (error) {
          toast.error('Failed to fetch entry');
        } finally {
          setIsLoading(false);
        }
      };
      fetchEntry();
    }
  }, [isOpen, selectedDate, user.token]);

  // --- 2. Handle Form Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [category, field] = name.split('-');

    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // --- 3. Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const dataToSave = {
        ...formData,
        date: selectedDate,
      };
      await axios.post('/api/entries', dataToSave, config);
      toast.success('Entry saved!');
      onClose();
    } catch (error) {
      toast.error('Failed to save entry');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    formCategory: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '0.25rem',
    },
    textarea: {
      width: '98%',
      minHeight: '80px',
      padding: '0.5rem',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Daily Log Entry"
      className="worktrackr-modal-content"
      overlayClassName="worktrackr-modal-overlay"
    >
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Daily Log: {selectedDate}</h2>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            &times;
          </button>
        </div>

        <hr />

        {/* Form Body */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 1rem' }}>
            <div style={styles.formCategory}>
              <label htmlFor="dsa-notes" style={styles.label}>🧮 DSA Notes</label>
              <textarea
                id="dsa-notes"
                name="dsa-notes"
                style={styles.textarea}
                value={formData.dsa.notes}
                onChange={handleChange}
                placeholder="Learned about DP, solved 2sum..."
              />
            </div>

            <div style={styles.formCategory}>
              <label htmlFor="cp-notes" style={styles.label}>⚔️ CP Notes</label>
              <textarea
                id="cp-notes"
                name="cp-notes"
                style={styles.textarea}
                value={formData.cp.notes}
                onChange={handleChange}
                placeholder="Codeforces Div. 2, rank 1050..."
              />
            </div>

            <div style={styles.formCategory}>
              <label htmlFor="dev-notes" style={styles.label}>💻 Development Notes</label>
              <textarea
                id="dev-notes"
                name="dev-notes"
                style={styles.textarea}
                value={formData.dev.notes}
                onChange={handleChange}
                placeholder="Fixed the login bug, deployed new feature..."
              />
            </div>

            <div style={styles.formCategory}>
              <label htmlFor="college-notes" style={styles.label}>🎓 College Notes</label>
              <textarea
                id="college-notes"
                name="college-notes"
                style={styles.textarea}
                value={formData.college.notes}
                onChange={handleChange}
                placeholder="Completed OS assignment 2..."
              />
            </div>

            <div style={styles.formCategory}>
              <label htmlFor="other-notes" style={styles.label}>🌐 Other Notes</label>
              <textarea
                id="other-notes"
                name="other-notes"
                style={styles.textarea}
                value={formData.other.notes}
                onChange={handleChange}
                placeholder="Updated resume, read tech article..."
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <hr />
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button type="button" onClick={onClose} style={{ marginRight: '0.5rem' }}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DailyDetailModal;
