import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CalendarHeatmap from 'react-calendar-heatmap';
import toast from 'react-hot-toast';
import DailyDetailModal from '../components/DailyDetailModal';

// Generates all days in the past year
const getDaysInLastYear = () => {
  const today = new Date();
  const days = [];
  // Start from 365 days ago
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 365);

  // Loop from one year ago up to today
  for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
    days.push({
      date: new Date(d).toISOString().split('T')[0],
      count: 0, // Default count
    });
  }
  return days;
};
// ----------------------------

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchEntries = async () => {
    if (!user?.token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // 1. Generate the base array of all days
      const allDays = getDaysInLastYear();

      // 2. Fetch the user's actual entries
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get('/api/entries', config);
      
      // 3. Create a Map for efficient lookup of the user's entries
      const entriesMap = new Map();
      if (Array.isArray(response.data)) {
        response.data.forEach(entry => {
          const entryDate = new Date(entry.date).toISOString().split('T')[0];
          entriesMap.set(entryDate, {
            date: entryDate,
            count: 1, // Give it a count of 1
          });
        });
      }

      // 4. Merge the two arrays
      const mergedData = allDays.map(day => 
        entriesMap.get(day.date) || day // Use the real entry if it exists, otherwise use the 'count: 0' day
      );
      
      setEntries(mergedData);

    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      toast.error(`Error fetching entries: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user?.token]); 

  // This helper is no longer needed in this file
  // const getFormattedDate = (date) => ...

  const handleDateClick = (value) => {
    // value will now *always* be an object,
    // (e.g., { date: '...', count: 0 } or { date: '...', count: 1 })
    // We just need to check if it's a future date.
    
    if (!value || new Date(value.date) > new Date()) {
      // Don't open modal for future dates
      return;
    }
    
    setSelectedDate(value.date); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    // After closing, re-fetch data in case anything changed
    fetchEntries(); 
  };

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 365); // More accurate 365 days

  if (isLoading) {
    return <div>Loading your progress...</div>;
  }

  return (
    <div>
      <h2>Your Progress Heatmap</h2>
      <div style={{ width: '90%' }}>
        <CalendarHeatmap
          startDate={oneYearAgo}
          endDate={today}
          values={entries}
          classForValue={(value) => {
            // --- UPDATED CLASS LOGIC ---
            if (!value || value.count === 0) {
              return 'color-empty';
            }
            return `color-scale-${value.count}`;
            // -----------------------------
          }}
          tooltipDataAttrs={value => {
            if (!value || !value.date) return null;
            return { 'data-tip': `Activity on ${value.date}` };
          }}
          showWeekdayLabels={true}
          onClick={handleDateClick} 
        />
      </div>

      <DailyDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Dashboard;