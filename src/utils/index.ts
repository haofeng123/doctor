import { DoctorSchedule } from "@/services/home";

export interface DoctorDaySchedule {
  day_of_week: string;
  slots: {
    available_at: string;
    available_until: string;
  }[];
}

export interface DoctorScheduleGrouped {
  name: string;
  timezone: string;
  days: DoctorDaySchedule[];
}

export const formatDataList = (data: DoctorSchedule[]): DoctorScheduleGrouped[] => {
  if (!Array.isArray(data)) return [];

  const doctorMap = new Map<
    string,
    {
      name: string;
      timezone: string;
      daysMap: Map<string, DoctorDaySchedule>;
    }
  >();

  data.forEach((item) => {
    const { name, timezone, day_of_week, available_at, available_until } = item;

    if (!doctorMap.has(name)) {
      doctorMap.set(name, {
        name,
        timezone,
        daysMap: new Map(),
      });
    }

    const doctor = doctorMap.get(name)!;


    if (!doctor.daysMap.has(day_of_week)) {
      doctor.daysMap.set(day_of_week, {
        day_of_week,
        slots: [],
      });
    }

    const day = doctor.daysMap.get(day_of_week)!;
    day.slots.push({
      available_at,
      available_until,
    });
  });


  const result: DoctorScheduleGrouped[] = [];

  doctorMap.forEach((doctor) => {
    result.push({
      name: doctor.name,
      timezone: doctor.timezone,
      days: Array.from(doctor.daysMap.values()),
    });
  });

  return result;
};



export const Delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms));
};