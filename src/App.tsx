import { Calendar } from './components/Calendar';
import { DailyPlanner } from './components/DailyPlanner';
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <Calendar />
      </div>
      <DailyPlanner />
    </div>
  );
}

export default App;