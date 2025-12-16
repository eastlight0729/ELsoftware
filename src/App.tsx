import { Calendar } from './components/Calendar';
import { DailyPlanner } from './components/DailyPlanner';
import { PomodoroTimer } from './components/PomodoroTimer';

/* Root Application Component. This component serves as the main layout container. It orchestrates the rendering of core productivity features in a centralized, vertical layout. */
export default function App() {
  return (
    <main className="max-w-7xl mx-auto p-5 flex flex-col items-center gap-12">
      <Calendar />
      <PomodoroTimer />
      <DailyPlanner />
    </main>
  );
}