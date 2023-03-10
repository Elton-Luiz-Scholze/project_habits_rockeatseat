import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface iHabitsList {
  date: Date;
  onCompletedChanged: (completed: number) => void;
}

interface iHabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    createdAt: string;
  }[];
  completedHabits: string[];
}

export function HabitsList({ date, onCompletedChanged }: iHabitsList) {
  const [habitsInfo, setHabitsInfo] = useState<iHabitsInfo>();

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  useEffect(() => {
    api
      .get("/day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((res) => {
        setHabitsInfo(res.data);
      });
  }, []);

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted =
      habitsInfo!.completedHabits.includes(habitId);

    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId,
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }
    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    onCompletedChanged(completedHabits.length);
  }

  return (
    <div className="mt-6 flex flex-col gap-3 transition-colors">
      {habitsInfo?.possibleHabits.map((habit) => (
        <Checkbox.Root
          key={habit.id}
          onCheckedChange={() => handleToggleHabit(habit.id)}
          checked={habitsInfo.completedHabits.includes(habit.id)}
          disabled={isDateInPast}
          className="flex items-center gap-3 group"
        >
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center 
          bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 
          group-data-[state=checked]:border-green-500"
          >
            <Checkbox.Indicator>
              <Check size={20} className="text-white" />
            </Checkbox.Indicator>
          </div>

          <span
            className="font-semibold text-xl text-white leading-tight 
          group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400"
          >
            {habit.title}
          </span>
        </Checkbox.Root>
      ))}
    </div>
  );
}
