import React, { useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DoctorScheduleGrouped } from "@/utils";

dayjs.extend(customParseFormat);

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface Props {
  doctor: DoctorScheduleGrouped;
  activeDayIndex: number;
  onChangeDay: (index: number) => void;
  selectedSlotKey: string | null;
  onSelectSlot: (key: string) => void;
  bookedSlotKeys?: Set<string>;
}

const parseTime = (time: string) => dayjs(time.trim(), "h:mmA");

const DAY_OF_WEEK_MAP: Record<string, number> = {
  Sunday: 0,
  Sun: 0,
  Monday: 1,
  Mon: 1,
  Tuesday: 2,
  Tue: 2,
  Wednesday: 3,
  Wed: 3,
  Thursday: 4,
  Thu: 4,
  Friday: 5,
  Fri: 5,
  Saturday: 6,
  Sat: 6,
};

const dayOfWeekToNumber = (dayOfWeek: string): number => {
  const key = dayOfWeek.trim();
  const normalized = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
  if (normalized in DAY_OF_WEEK_MAP) return DAY_OF_WEEK_MAP[normalized];
  if (key in DAY_OF_WEEK_MAP) return DAY_OF_WEEK_MAP[key];
  return 0;
};

const isSlotInPast = (dayOfWeek: string, slotEnd: string, now: dayjs.Dayjs): boolean => {
  const dayNum = dayOfWeekToNumber(dayOfWeek);
  let slotDate = now.startOf("week").add(dayNum, "day");
  if (dayNum === 0 && slotDate.isBefore(now, "day")) {
    slotDate = slotDate.add(7, "day");
  }
  const [h, m] = slotEnd.split(":").map(Number);
  const slotEndDt = slotDate.hour(h).minute(m).second(0).millisecond(0);
  return slotEndDt.isBefore(now);
};

const buildDayTimeSlots = (slots: { available_at: string; available_until: string }[]): TimeSlot[] => {
  if (!slots.length) return [];

  const start = slots
    .map((s) => parseTime(s.available_at))
    .reduce((min, cur) => (cur.isBefore(min) ? cur : min));

  const end = slots
    .map((s) => parseTime(s.available_until))
    .reduce((max, cur) => (cur.isAfter(max) ? cur : max));

  const slotRanges = slots.map((s) => ({
    start: parseTime(s.available_at),
    end: parseTime(s.available_until),
  }));

  const result: TimeSlot[] = [];
  let current = start;

  while (current.add(30, "minute").diff(end) <= 0) {
    const segmentStart = current;
    const segmentEnd = current.add(30, "minute");

    const available = slotRanges.some(
      (range) =>
        !segmentStart.isBefore(range.start) && !segmentEnd.isAfter(range.end)
    );

    result.push({
      start: segmentStart.format("HH:mm"),
      end: segmentEnd.format("HH:mm"),
      available,
    });

    current = current.add(30, "minute");
  }

  return result;
};

const NUM_COLUMNS = 3;
const CONTAINER_PADDING = 16;
const GAP = 8;

const ScheduleTimeSlots: React.FC<Props> = ({
  doctor,
  activeDayIndex,
  onChangeDay,
  selectedSlotKey,
  onSelectSlot,
  bookedSlotKeys = new Set(),
}) => {
  const { width } = useWindowDimensions();
  const now = dayjs();
  const slotButtonWidth =
    (width - CONTAINER_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const daySlots = useMemo(() => {
    return doctor.days.map((day) => buildDayTimeSlots(day.slots));
  }, [doctor.days]);

  const activeDay = doctor.days[activeDayIndex];
  const currentDaySlots = daySlots[activeDayIndex] ?? [];

  const isSlotDisabled = (slot: TimeSlot, slotKey: string) =>
    !slot.available ||
    isSlotInPast(activeDay.day_of_week, slot.end, now) ||
    bookedSlotKeys.has(slotKey);

  return (
    <>
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {doctor.days.map((day, index) => {
            const isActive = index === activeDayIndex;
            return (
              <Pressable
                key={day.day_of_week}
                style={[
                  styles.tabItem,
                  isActive && styles.tabItemActive,
                ]}
                onPress={() => onChangeDay(index)}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.tabTextActive,
                  ]}
                >
                  {day.day_of_week}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available time slots</Text>
        <View style={[styles.slotContainer, styles.slotContainerGap]}>
          {currentDaySlots.map((slot) => {
            const key = `${activeDay.day_of_week}-${slot.start}-${slot.end}`;
            const isSelected = selectedSlotKey === key;
            const isDisabled = isSlotDisabled(slot, key);

            return (
              <Pressable
                key={key}
                style={[
                  styles.slotButton,
                  { width: slotButtonWidth },
                  isDisabled && styles.slotButtonDisabled,
                  isSelected && !isDisabled && styles.slotButtonSelected,
                ]}
                onPress={() => !isDisabled && onSelectSlot(key)}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.slotButtonText,
                    isDisabled && styles.slotButtonTextDisabled,
                    isSelected && !isDisabled && styles.slotButtonTextSelected,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {slot.start} - {slot.end}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default ScheduleTimeSlots;

const baseSlotButton = {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 18,
  borderWidth: 1,
  marginRight: 8,
  marginBottom: 8,
} as const;

const styles = StyleSheet.create({
  tabsWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  tabs: {
    paddingVertical: 4,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },
  tabItemActive: {
    backgroundColor: "#10B981",
  },
  tabText: {
    fontSize: 13,
    color: "#374151",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  slotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  slotContainerGap: {
    marginRight: -GAP,
  },
  slotButton: {
    ...baseSlotButton,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  slotButtonSelected: {
    borderColor: "#10B981",
    backgroundColor: "#D1FAE5",
  },
  slotButtonDisabled: {
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  slotButtonText: {
    fontSize: 12,
    color: "#111827",
    textAlign: "center",
  },
  slotButtonTextSelected: {
    color: "#047857",
    fontWeight: "600",
  },
  slotButtonTextDisabled: {
    color: "#9CA3AF",
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
  },
});

