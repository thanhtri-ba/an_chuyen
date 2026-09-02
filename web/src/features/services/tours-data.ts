import axios from 'axios';

export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  tags?: string;
}

export type TourCategory = 'beach' | 'mountain' | 'cultural' | 'adventure';

export interface Tour {
  id: string;
  title: string;
  description: string | null;
  duration: string;
  price: number;
  imageUrl: string | null;
  gallery: string[];
  itinerary: TourItineraryDay[];
  category: TourCategory;
}

const FALLBACK: Tour[] = [
  {
    id: 'fallback-1',
    title: 'Khám phá Vịnh Hạ Long 3N2Đ',
    description: 'Trải nghiệm du thuyền 5 sao, chèo kayak và ngắm hoàng hôn trên vịnh Hạ Long.',
    duration: '3 ngày 2 đêm',
    price: 3590000,
    imageUrl: 'https://images.pexels.com/photos/6871173/pexels-photo-6871173.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: [],
    itinerary: [
      { day: 1, title: 'Hà Nội - Hạ Long', description: 'Xe đón tại Hà Nội đi Hạ Long, nhận phòng du thuyền.', tags: 'Du thuyền, Bữa tối' },
      { day: 2, title: 'Hang Sửng Sốt - Đảo Ti Tốp', description: 'Thăm quan hang động đẹp nhất và tắm biển.', tags: 'Khám phá, Bơi lội' },
    ],
    category: 'beach',
  },
];

function baseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
}

export async function fetchTours(): Promise<Tour[]> {
  try {
    const res = await axios.get(`${baseUrl()}/api/tours`);
    return res.data && res.data.length > 0 ? res.data : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export async function fetchTourById(id: string): Promise<Tour | undefined> {
  try {
    const res = await axios.get(`${baseUrl()}/api/tours/${id}`);
    return res.data;
  } catch {
    return FALLBACK.find(t => t.id === id);
  }
}
