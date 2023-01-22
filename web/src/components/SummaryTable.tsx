import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

interface iSummary {
  id: string;
  date: string;
  amount: number;
  completed: number;
}

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7;
const amountOffDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function Summarytable() {
  const [summary, setSummary] = useState<iSummary[]>([]);

  useEffect(() => {
    api.get("/summary").then((res) => setSummary(res.data));
  }, []);
  return (
    <section className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekday, index) => {
          return (
            <div
              key={index}
              className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center"
            >
              {weekday}
            </div>
          );
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summaryDates.map((date) => {
          const dayInSummary = summary.find((day) => {
            return dayjs(date).isSame(day.date, "day");
          });

          return (
            <HabitDay
              key={date.toString()}
              date={date}
              amount={dayInSummary?.amount}
              completed={dayInSummary?.completed}
            />
          );
        })}

        {amountOffDaysToFill > 0 &&
          Array.from({ length: amountOffDaysToFill }).map((e, i) => {
            return (
              <div
                key={i}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              ></div>
            );
          })}
      </div>
    </section>
  );
}
