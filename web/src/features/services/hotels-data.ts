import { api } from '../../lib/api';

export interface Hotel {
  slug: string;
  name: string;
  location: string;
  country: string;
  desc: string;
  about: string[];
  imageUrl: string;
  gallery: string[];
  rating: string;
  reviewCount: string;
  priceFrom: number;
  discount: string;
  amenities: string[];
}

// Fallback used only if the API is unreachable, so the page never renders empty.
const FALLBACK: Hotel[] = [
  {
    slug: 'dalat-mountain-lodge',
    name: 'Dalat Mountain Lodge',
    location: 'Đà Lạt',
    country: 'Lâm Đồng',
    desc: 'Ẩn mình giữa rừng thông, view toàn cảnh thung lũng sương mù mỗi sáng.',
    about: [
      'Dalat Mountain Lodge nằm trên một sườn đồi thông, cách trung tâm Đà Lạt 15 phút di chuyển — đủ gần để dạo phố, đủ xa để tận hưởng không khí trong lành của cao nguyên.',
    ],
    imageUrl: 'https://images.pexels.com/photos/2417726/pexels-photo-2417726.jpeg?auto=compress&cs=tinysrgb&w=1200',
    gallery: ['https://images.pexels.com/photos/2417726/pexels-photo-2417726.jpeg?auto=compress&cs=tinysrgb&w=800'],
    rating: '4.8',
    reviewCount: '1,240',
    priceFrom: 1250000,
    discount: '-10%',
    amenities: ['wifi', 'restaurant', 'gym'],
  },
];

export async function fetchHotels(): Promise<Hotel[]> {
  try {
    const { data } = await api.get<Hotel[]>('/hotels');
    return data && data.length > 0 ? data : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export async function fetchHotelBySlug(slug: string): Promise<Hotel | undefined> {
  try {
    const { data } = await api.get<Hotel>(`/hotels/${slug}`);
    return data;
  } catch {
    return FALLBACK.find(h => h.slug === slug);
  }
}
