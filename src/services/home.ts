import { storage } from '@/storage';
import axios from 'axios';


export interface DoctorSchedule {
  name: string;
  timezone: string;
  day_of_week: string;
  available_at: string;
  available_until: string;
}

export interface BookingItem {
  id: string;
  doctorName: string;
  bookingTime: string;
}



export const getHomeData = async () => {
  const response = await axios.get('https://raw.githubusercontent.com/suyogshiftcare/jsontest/main/available.json');
  return response.data as DoctorSchedule[];
}



export const getBookingsFromStorage = (): BookingItem[] => {
  const bookData = storage.getString('book-data');
  if (!bookData) return [];
  try {
    return JSON.parse(bookData) as BookingItem[];
  } catch {
    return [];
  }
};

export const submitBookData = async (payload: { id: string } & BookingItem) => {
  const bookData = storage.getString('book-data');
  if (bookData) {
    const parsedData = JSON.parse(bookData) as BookingItem[];
    parsedData.push(payload);
    storage.set('book-data', JSON.stringify(parsedData));
    return true;
  } else {
    storage.set('book-data', JSON.stringify([payload]));
    return true;
  }
};

export const cancelBookingById = (id: string): void => {
  const bookData = storage.getString('book-data');
  if (!bookData) return;
  const list = JSON.parse(bookData) as BookingItem[];
  const newList = list.filter(item => item.id !== id);
  storage.set('book-data', JSON.stringify(newList));
};