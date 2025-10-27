import CalendarHeatmap from 'react-calendar-heatmap';

const Dashboard = () => {
  // Placeholder data for the heatmap
  const today = new Date();
  const exampleData = [
    { date: '2025-01-01', count: 1 },
    { date: '2025-01-02', count: 3 },
    { date: '2025-01-03', count: 0 },
    { date: '2025-01-04', count: 2 },
    // ...
  ];

  return (
    <div>
      <h2>Your Progress Heatmap</h2>
      <div style={{ width: '90%' }}>
        <CalendarHeatmap
          startDate={new Date(today.getFullYear(), 0, 1)} // Start of the year
          endDate={today}
          values={exampleData}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${value.count}`;
          }}
          tooltipDataAttrs={value => {
            return {
              'data-tip': `${value.date} has count: ${value.count}`,
            };
          }}
          showWeekdayLabels={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;