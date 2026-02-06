import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useFocusEffect } from "@react-navigation/native";
import { getBookingsFromStorage, cancelBookingById, BookingItem } from "@/services/home";
import { showConfirm } from "@/components/dialog/confirm";

const USER_NAME = "TEST USER 1";

const UserPage = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      setBookings(getBookingsFromStorage());
    }, [])
  );

  const handleCancel = (id: string) => {
    cancelBookingById(id);
    setBookings(getBookingsFromStorage());
  };

  const handleCancelPress = (item: BookingItem) => {
    showConfirm({
      title: "Cancel booking",
      content: `Are you sure you want to cancel the booking with ${item.doctorName} at ${item.bookingTime}?`,
      onConfirm: () => handleCancel(item.id),
    });
  };

  const listHeader = (
    <View style={styles.userCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{USER_NAME[0]}</Text>
      </View>
      <Text style={styles.userName}>{USER_NAME}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {listHeader}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bookings</Text>
        {bookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings yet</Text>
        ) : (
          bookings.map((item, index) => (
            <View key={`${item.doctorName}-${item.bookingTime}-${index}`} style={styles.bookingItem}>
              <View style={styles.bookingItemMain}>
                <View>
                  <Text style={styles.bookingDoctor}>{item.doctorName}</Text>
                  <Text style={styles.bookingTime}>{item.bookingTime}</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}
                  onPress={() => handleCancelPress(item)}
                >
                  <Text style={styles.cancelButtonText}>Cancel booking</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default UserPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#374151",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  bookingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  bookingItemMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  cancelButtonPressed: {
    backgroundColor: "#FECACA",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#DC2626",
  },
  bookingDoctor: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  bookingTime: {
    fontSize: 13,
    color: "#6B7280",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 24,
  },
});
