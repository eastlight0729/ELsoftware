import { Calendar } from "./feature/Calendar/Calendar";
import { DailyPlanner } from "./feature/DailyPlanner/DailyPlanner";
import { PomodoroTimer } from "./feature/PomodoroTimer/PomodoroTimer";

/* Root Application Component. This component serves as the main layout container. It orchestrates the rendering of core productivity features in a centralized, vertical layout. */
export default function App() {
  return (
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 transition-colors duration-200">
      <main className="max-w-7xl mx-auto p-5 flex flex-col items-center gap-12">
        <Calendar />
        <PomodoroTimer />
        <DailyPlanner />
      </main>
    </div>
  );
}
