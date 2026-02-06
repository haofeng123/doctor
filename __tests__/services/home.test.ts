import {
  getHomeData,
  getBookingsFromStorage,
  submitBookData,
  cancelBookingById,
  BookingItem,
} from '@/services/home';
import axios from 'axios';
import { storage } from '@/storage';

jest.mock('axios');
jest.mock('@/storage', () => ({
  storage: {
    getString: jest.fn(),
    set: jest.fn(),
  },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('home service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHomeData', () => {
    it('fetches and returns doctor schedule data', async () => {
      const mockData = [
        {
          name: 'Dr. Test',
          timezone: 'UTC',
          day_of_week: 'Monday',
          available_at: '9:00AM',
          available_until: '10:00AM',
        },
      ];
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getHomeData();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/suyogshiftcare/jsontest/main/available.json'
      );
      expect(result).toEqual(mockData);
    });

    it('throws when axios get fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(getHomeData()).rejects.toThrow('Network error');
    });
  });

  describe('getBookingsFromStorage', () => {
    it('returns empty array when no data in storage', () => {
      mockedStorage.getString.mockReturnValue(undefined);

      const result = getBookingsFromStorage();

      expect(result).toEqual([]);
    });

    it('returns parsed bookings when data exists', () => {
      const bookings: BookingItem[] = [
        { id: '1', doctorName: 'Dr. A', bookingTime: '2025-02-01 9:00AM' },
      ];
      mockedStorage.getString.mockReturnValue(JSON.stringify(bookings));

      const result = getBookingsFromStorage();

      expect(result).toEqual(bookings);
    });

    it('returns empty array when stored data is invalid JSON', () => {
      mockedStorage.getString.mockReturnValue('invalid json');

      const result = getBookingsFromStorage();

      expect(result).toEqual([]);
    });
  });

  describe('submitBookData', () => {
    it('appends to existing bookings and saves', async () => {
      const existing: BookingItem[] = [
        { id: '1', doctorName: 'Dr. A', bookingTime: '9:00AM' },
      ];
      const newItem = {
        id: '2',
        doctorName: 'Dr. B',
        bookingTime: '10:00AM',
      };
      mockedStorage.getString.mockReturnValue(JSON.stringify(existing));

      const result = await submitBookData(newItem);

      expect(result).toBe(true);
      expect(mockedStorage.set).toHaveBeenCalledWith(
        'book-data',
        JSON.stringify([...existing, newItem])
      );
    });

    it('creates new array when no existing data and saves', async () => {
      mockedStorage.getString.mockReturnValue(undefined);
      const newItem = {
        id: '1',
        doctorName: 'Dr. A',
        bookingTime: '9:00AM',
      };

      const result = await submitBookData(newItem);

      expect(result).toBe(true);
      expect(mockedStorage.set).toHaveBeenCalledWith(
        'book-data',
        JSON.stringify([newItem])
      );
    });
  });

  describe('cancelBookingById', () => {
    it('removes booking by id and saves', () => {
      const bookings: BookingItem[] = [
        { id: '1', doctorName: 'Dr. A', bookingTime: '9:00AM' },
        { id: '2', doctorName: 'Dr. B', bookingTime: '10:00AM' },
      ];
      mockedStorage.getString.mockReturnValue(JSON.stringify(bookings));

      cancelBookingById('1');

      expect(mockedStorage.set).toHaveBeenCalledWith(
        'book-data',
        JSON.stringify([{ id: '2', doctorName: 'Dr. B', bookingTime: '10:00AM' }])
      );
    });

    it('does nothing when no data in storage', () => {
      mockedStorage.getString.mockReturnValue(undefined);

      cancelBookingById('1');

      expect(mockedStorage.set).not.toHaveBeenCalled();
    });

    it('saves empty array when last booking is removed', () => {
      const bookings: BookingItem[] = [
        { id: '1', doctorName: 'Dr. A', bookingTime: '9:00AM' },
      ];
      mockedStorage.getString.mockReturnValue(JSON.stringify(bookings));

      cancelBookingById('1');

      expect(mockedStorage.set).toHaveBeenCalledWith('book-data', '[]');
    });
  });
});
