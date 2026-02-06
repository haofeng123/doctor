import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { debounce } from "lodash";
import { Delay, DoctorScheduleGrouped } from "@/utils";
import ScheduleTimeSlots from "./time-slots";
import { submitBookData, getBookingsFromStorage } from "@/services/home";
import { showToast } from "@/components/dialog/toast";
import { showConfirm } from "@/components/dialog/confirm";
import logger from "@/utils/logger";
import dayjs from "dayjs";
const ScheduleDetail = () => {
  const {goBack} = useNavigation()
  const route = useRoute<any>();
  const { doctor } = route.params as { doctor: DoctorScheduleGrouped };

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookings, setBookings] = useState(() => getBookingsFromStorage());

  useEffect(() => {
    setBookings(getBookingsFromStorage());
  }, []);

  const bookedSlotKeys = useMemo(() => {
    const set = new Set<string>();
    bookings
      .filter((b) => b.doctorName === doctor.name)
      .forEach((b) => set.add(b.bookingTime.replace(" ", "-")));
    return set;
  }, [bookings, doctor.name]);

  const stateRef = useRef({ doctor, selectedSlotKey });
  stateRef.current = { doctor, selectedSlotKey };

  const handleSelectSlot = (key: string) => {
    setSelectedSlotKey(key);
  };

  const performBook = async() => {
    const { doctor: doc, selectedSlotKey: key } = stateRef.current;
    if (!key) return;
    setSubmitting(true);
    const parts = key.split("-");
    const dayOfWeek = parts[0];
    const timeRange = parts.length >= 3 ? `${parts[1]}-${parts[2]}` : key;
    const doctorName = doc.name;
    const bookingTime = `${dayOfWeek} ${timeRange}`;
    const payload = { doctorName, bookingTime };
    logger.l("Booking payload:", payload);
    submitBookData({
      id: dayjs().toISOString(),
      ...payload,
    });
    await Delay(2000);
    setSubmitting(false);
    showToast('Booking successful');
    goBack()
  };

  const handleBook = useMemo(
    () =>
      debounce(performBook, 300, { leading: true, trailing: false }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => () => handleBook.cancel(), [handleBook]);

  const handleBookPress = () => {
    if (!selectedSlotKey) return;
    const parts = selectedSlotKey.split("-");
    const dayOfWeek = parts[0];
    const timeRange = parts.length >= 3 ? `${parts[1]}-${parts[2]}` : selectedSlotKey;
    const bookingTimeDisplay = `${dayOfWeek} ${timeRange}`;
    showConfirm({
      title: "Confirm booking",
      content: `Confirm booking with ${doctor.name} at ${bookingTimeDisplay}?`,
      onConfirm: () => handleBook(),
    });
  };

  const isBookDisabled = !selectedSlotKey || submitting;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{doctor.name?.[0] ?? ""}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{doctor.name}</Text>
            <Text style={styles.subText}>{doctor.timezone}</Text>
          </View>
        </View>

        <ScheduleTimeSlots
          doctor={doctor}
          activeDayIndex={activeDayIndex}
          onChangeDay={setActiveDayIndex}
          selectedSlotKey={selectedSlotKey}
          onSelectSlot={handleSelectSlot}
          bookedSlotKeys={bookedSlotKeys}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.bookButton,
            isBookDisabled && styles.bookButtonDisabled,
          ]}
          onPress={handleBookPress}
          disabled={isBookDisabled}
        >
          {submitting ? (
            <View style={styles.bookButtonContent}>
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />
              <Text style={styles.bookButtonText}>Submitting...</Text>
            </View>
          ) : (
            <Text style={styles.bookButtonText}>Book</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default ScheduleDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#374151",
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: "#6B7280",
  },
  footer: {
    padding: 16,
    borderTopWidth: RNStyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  bookButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinner: {
    marginRight: 8,
  },
  bookButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});