import { api } from '../../lib/api';

export interface DestinationDetail {
  id?: string;
  slug: string;
  country: string;
  location: string;
  desc: string;
  heroImg: string;
  rating: string;
  reviewCount: string;
  bestSeason: string;
  languages: string;
  about: string[];
  itinerary: { day: string; title: string; desc: string }[];
  gallery: string[];
  priceFrom: number;
  discount: string;
}

// Fallback used only if the API is unreachable, so the page never renders empty.
const FALLBACK: DestinationDetail[] = [
  {
    slug: 'da-lat',
    country: 'Lâm Đồng',
    location: 'Đà Lạt',
    desc: 'Thành phố ngàn hoa mộng mơ giữa cao nguyên se lạnh.',
    heroImg: 'https://images.unsplash.com/photo-1558523720-060e64182081?q=80&w=1600&auto=format&fit=crop',
    rating: '4.8',
    reviewCount: '2,150',
    bestSeason: 'Mùa đẹp nhất: T11 - T3',
    languages: 'Ngôn ngữ: Tiếng Việt',
    about: ['Đà Lạt, thành phố ngàn hoa nằm trên cao nguyên Lâm Viên, nổi tiếng với khí hậu mát mẻ quanh năm.'],
    itinerary: [],
    gallery: [],
    priceFrom: 1890000,
    discount: '-15%',
  },
];

export async function fetchDestinations(): Promise<DestinationDetail[]> {
  try {
    const { data } = await api.get<DestinationDetail[]>('/destinations');
    return data && data.length > 0 ? data : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export async function fetchDestinationBySlug(slug: string): Promise<DestinationDetail | undefined> {
  try {
    const { data } = await api.get<DestinationDetail>(`/destinations/${slug}`);
    return data;
  } catch {
    return FALLBACK.find(d => d.slug === slug);
  }
}
