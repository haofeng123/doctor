import { formatDataList, Delay } from '@/utils';
import { DoctorSchedule } from '@/services/home';

describe('formatDataList', () => {
  it('returns empty array when data is not an array', () => {
    expect(formatDataList(null as unknown as DoctorSchedule[])).toEqual([]);
    expect(formatDataList(undefined as unknown as DoctorSchedule[])).toEqual([]);
    expect(formatDataList({} as unknown as DoctorSchedule[])).toEqual([]);
  });

  it('returns empty array when data is empty', () => {
    expect(formatDataList([])).toEqual([]);
  });

  it('groups single doctor single day single slot', () => {
    const data: DoctorSchedule[] = [
      {
        name: 'Dr. A',
        timezone: 'America/New_York',
        day_of_week: 'Monday',
        available_at: '9:00AM',
        available_until: '10:00AM',
      },
    ];
    const result = formatDataList(data);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'Dr. A',
      timezone: 'America/New_York',
      days: [
        {
          day_of_week: 'Monday',
          slots: [{ available_at: '9:00AM', available_until: '10:00AM' }],
        },
      ],
    });
  });

  it('groups same doctor multiple days', () => {
    const data: DoctorSchedule[] = [
      {
        name: 'Dr. B',
        timezone: 'UTC',
        day_of_week: 'Monday',
        available_at: '9:00AM',
        available_until: '10:00AM',
      },
      {
        name: 'Dr. B',
        timezone: 'UTC',
        day_of_week: 'Tuesday',
        available_at: '2:00PM',
        available_until: '3:00PM',
      },
    ];
    const result = formatDataList(data);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dr. B');
    expect(result[0].days).toHaveLength(2);
    const monday = result[0].days.find((d) => d.day_of_week === 'Monday');
    const tuesday = result[0].days.find((d) => d.day_of_week === 'Tuesday');
    expect(monday?.slots).toEqual([{ available_at: '9:00AM', available_until: '10:00AM' }]);
    expect(tuesday?.slots).toEqual([{ available_at: '2:00PM', available_until: '3:00PM' }]);
  });

  it('groups same doctor same day multiple slots', () => {
    const data: DoctorSchedule[] = [
      {
        name: 'Dr. C',
        timezone: 'Asia/Shanghai',
        day_of_week: 'Friday',
        available_at: '9:00AM',
        available_until: '10:00AM',
      },
      {
        name: 'Dr. C',
        timezone: 'Asia/Shanghai',
        day_of_week: 'Friday',
        available_at: '2:00PM',
        available_until: '3:00PM',
      },
    ];
    const result = formatDataList(data);
    expect(result).toHaveLength(1);
    expect(result[0].days).toHaveLength(1);
    expect(result[0].days[0].slots).toHaveLength(2);
    expect(result[0].days[0].slots).toEqual([
      { available_at: '9:00AM', available_until: '10:00AM' },
      { available_at: '2:00PM', available_until: '3:00PM' },
    ]);
  });

  it('groups multiple doctors', () => {
    const data: DoctorSchedule[] = [
      {
        name: 'Dr. X',
        timezone: 'Europe/London',
        day_of_week: 'Monday',
        available_at: '9:00AM',
        available_until: '10:00AM',
      },
      {
        name: 'Dr. Y',
        timezone: 'Europe/Paris',
        day_of_week: 'Tuesday',
        available_at: '10:00AM',
        available_until: '11:00AM',
      },
    ];
    const result = formatDataList(data);
    expect(result).toHaveLength(2);
    const names = result.map((r) => r.name).sort();
    expect(names).toEqual(['Dr. X', 'Dr. Y']);
    expect(result.find((r) => r.name === 'Dr. X')?.timezone).toBe('Europe/London');
    expect(result.find((r) => r.name === 'Dr. Y')?.timezone).toBe('Europe/Paris');
  });
});

describe('Delay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves with true after given ms', async () => {
    const promise = Delay(100);
    jest.advanceTimersByTime(100);
    await expect(promise).resolves.toBe(true);
  });

  it('resolves after the specified delay', async () => {
    const promise = Delay(50);
    jest.advanceTimersByTime(50);
    await expect(promise).resolves.toBe(true);
  });
});
