import { Calendar } from './components/Calendar';
import { DailyPlanner } from './components/DailyPlanner';
import PomodoroTimer from './components/PomodoroTimer';
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <Calendar />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <PomodoroTimer />
      </div>
      <DailyPlanner />
    </div>
  );
}

export default App;