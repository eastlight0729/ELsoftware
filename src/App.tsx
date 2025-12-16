import { Calendar } from './components/Calendar';
import { DailyPlanner } from './components/DailyPlanner';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  return (
    <div className="max-w-[1280px] mx-auto p-5 text-center">
      <div className="flex justify-center mb-[50px]">
        <Calendar />
      </div>
      <div className="flex justify-center mb-[50px]">
        <PomodoroTimer />
      </div>
      <DailyPlanner />
    </div>
  );
}

export default App;