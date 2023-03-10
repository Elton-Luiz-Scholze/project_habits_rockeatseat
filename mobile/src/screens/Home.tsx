import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { daySize, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";
import dayjs from "dayjs";

interface iSummary {
  id: string;
  date: Date;
  completed: number;
  amount: number;
}

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<iSummary[] | null>(null);

  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("/summary");
      setSummary(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Ops!", "Não foi possível carregar o sumário de hábitos");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  if (loading) return <Loading />;

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2 ">
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: daySize }}
          >
            {weekDay}
          </Text>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });

              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  amount={dayWithHabits?.amount}
                  completed={dayWithHabits?.completed}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                />
              );
            })}
            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: daySize, height: daySize }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
