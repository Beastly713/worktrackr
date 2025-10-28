import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CalendarHeatmap from 'react-calendar-heatmap';
import toast from 'react-hot-toast';
import DailyDetailModal from '../components/DailyDetailModal';
import { Tooltip } from 'react-tooltip'; // +++ IMPORT TOOLTIP
import 'react-tooltip/dist/react-tooltip.css'; // +++ IMPORT TOOLTIP CSS

// Generates all days in the past year
// ... (rest of the function, no changes)
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

// +++ NEW HELPER FUNCTION +++
// Helper function to format the date for the tooltip
const getFormattedDate = (dateString) => {
  if (!dateString) return '';
  // Add T00:00 to ensure it's parsed as local time, not UTC
  const date = new Date(dateString + 'T00:00');
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};
// +++++++++++++++++++++++++++


const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchEntries = async () => {
    // ... (rest of the function, no changes in here)
    if (!user?.token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const allDays = getDaysInLastYear();
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get('/api/entries', config);
      
      const entriesMap = new Map();
      if (Array.isArray(response.data)) {
        response.data.forEach(entry => {
          const entryDate = new Date(entry.date).toISOString().split('T')[0];
          
          let count = 0;
          if (entry.dsa?.notes?.trim()) count++;
          if (entry.cp?.notes?.trim()) count++;
          if (entry.dev?.notes?.trim()) count++;
          if (entry.college?.notes?.trim()) count++;
          if (entry.other?.notes?.trim()) count++;

          entriesMap.set(entryDate, {
            date: entryDate,
            count: count, 
          });
        });
      }

      const mergedData = allDays.map(day => 
        entriesMap.get(day.date) || day
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

  // ... (handleDateClick and handleCloseModal, no changes)
  const handleDateClick = (value) => {
    if (!value || new Date(value.date) > new Date()) {
      return;
    }
    
    setSelectedDate(value.date); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    fetchEntries(); 
  };


  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 365); 

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
            if (!value || value.count === 0) {
              return 'color-empty';
            }
            const level = Math.min(value.count, 4);
            return `color-scale-${level}`;
          }}
          tooltipDataAttrs={value => {
            // --- UPDATED TOOLTIP LOGIC ---
            if (!value || !value.date) return null;
            
            const count = value.count;
            const formattedDate = getFormattedDate(value.date);
            
            // This is what react-tooltip (v5) will look for
            return {
              'data-tooltip-id': 'heatmap-tooltip',
              'data-tooltip-content': `${count} ${count === 1 ? 'log' : 'logs'} on ${formattedDate}`,
            };
            // --- END UPDATED TOOLTIP LOGIC ---
          }}
          showWeekdayLabels={true}
          onClick={handleDateClick} 
        />
      </div>

      {/* +++ ADD TOOLTIP COMPONENT +++ */}
      {/* This component reads the 'data-tooltip-id' attribute and displays the content */}
      <Tooltip id="heatmap-tooltip" />
      {/* ++++++++++++++++++++++++++++++ */}

      <DailyDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Dashboard;