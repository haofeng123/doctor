import React from "react";
import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useNavigation } from "@react-navigation/native";
import { DoctorScheduleGrouped } from "@/utils";

const ScheduleCard = ({ name, timezone, days }: DoctorScheduleGrouped) => {
  const initial = name?.[0] ?? "";
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate("ScheduleDetail", {
      doctor: {
        name,
        timezone,
        days,
      },
    });
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subText}>{timezone}</Text>
        </View>
      </View>

      <View style={styles.scheduleList}>
        {days.map((day) => (
          <View key={day.day_of_week} style={styles.dayRow}>
            <Text style={styles.dayText}>{day.day_of_week}</Text>
            <View style={styles.slots}>
              {day.slots.map((slot, index) => (
                <Text key={index} style={styles.slotText}>
                  {slot.available_at.trim()} - {slot.available_until.trim()}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: "#6B7280",
  },
  scheduleList: {
    marginTop: 8,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
  },
  dayText: {
    width: 90,
    fontSize: 13,
    fontWeight: "500",
    color: "#4B5563",
  },
  slots: {
    flex: 1,
  },
  slotText: {
    fontSize: 13,
    color: "#10B981",
  },
});

export default ScheduleCard;