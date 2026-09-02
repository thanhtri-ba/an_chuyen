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
  {
    slug: 'sa-pa',
    country: 'Lào Cai',
    location: 'Sa Pa',
    desc: 'Ruộng bậc thang trải dài giữa núi rừng Tây Bắc.',
    heroImg: 'https://images.pexels.com/photos/1462892/pexels-photo-1462892.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: '4.7',
    reviewCount: '1,840',
    bestSeason: 'Mùa đẹp nhất: T9 - T11',
    languages: 'Ngôn ngữ: Tiếng Việt',
    about: ['Sa Pa nổi tiếng với ruộng bậc thang, mây phủ quanh năm và bản làng dân tộc thiểu số.'],
    itinerary: [],
    gallery: [],
    priceFrom: 2190000,
    discount: '-10%',
  },
  {
    slug: 'ha-long',
    country: 'Quảng Ninh',
    location: 'Hạ Long',
    desc: 'Vịnh biển kỳ quan với hàng nghìn đảo đá vôi.',
    heroImg: 'https://images.pexels.com/photos/6871173/pexels-photo-6871173.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: '4.9',
    reviewCount: '3,420',
    bestSeason: 'Mùa đẹp nhất: T3 - T5',
    languages: 'Ngôn ngữ: Tiếng Việt',
    about: ['Vịnh Hạ Long là di sản thiên nhiên thế giới với hệ thống đảo đá vôi và hang động kỳ vĩ.'],
    itinerary: [],
    gallery: [],
    priceFrom: 2490000,
    discount: '-20%',
  },
  {
    slug: 'hoi-an',
    country: 'Quảng Nam',
    location: 'Hội An',
    desc: 'Phố cổ đèn lồng lung linh bên dòng sông Hoài.',
    heroImg: 'https://images.pexels.com/photos/33224215/pexels-photo-33224215.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: '4.8',
    reviewCount: '2,760',
    bestSeason: 'Mùa đẹp nhất: T2 - T7',
    languages: 'Ngôn ngữ: Tiếng Việt',
    about: ['Phố cổ Hội An nổi tiếng với kiến trúc cổ kính, đèn lồng rực rỡ và ẩm thực đường phố đặc sắc.'],
    itinerary: [],
    gallery: [],
    priceFrom: 1690000,
    discount: '-12%',
  },
  {
    slug: 'nha-trang',
    country: 'Khánh Hòa',
    location: 'Nha Trang',
    desc: 'Bãi biển cát trắng và vịnh biển xanh ngọc bên phố biển sôi động.',
    heroImg: 'https://images.pexels.com/photos/20316070/pexels-photo-20316070.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: '4.7',
    reviewCount: '2,980',
    bestSeason: 'Mùa đẹp nhất: T1 - T8',
    languages: 'Ngôn ngữ: Tiếng Việt',
    about: ['Nha Trang nổi tiếng với bãi biển dài, vịnh biển xanh ngọc và các hòn đảo lặn ngắm san hô.'],
    itinerary: [],
    gallery: [],
    priceFrom: 1990000,
    discount: '-18%',
  },
  {
    slug: 'hue',
    country: 'Thừa Thiên Huế',
    location: 'Huế',
    desc: 'Kinh thành cổ kính bên dòng sông Hương thơ mộng.',
    heroImg: 'https://images.pexels.com/photos/36847479/pexels-photo-36847479.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: '4.6',
    reviewCount: '1,520',
    bestSeason: 'Mùa đẹp nhất: T1 - T4',
    languages: 'Ngôn ngữ: Tiếng Việt',
    about: ['Huế là cố đô triều Nguyễn, nổi tiếng với Đại Nội, lăng tẩm cổ kính và sông Hương êm đềm.'],
    itinerary: [],
    gallery: [],
    priceFrom: 1590000,
    discount: '-10%',
  },
  {
    slug: 'phu-quoc',
    country: 'Kiên Giang',
    location: 'Phú Quốc',
    desc: 'Đảo ngọc với bãi biển cát trắng và nước biển trong xanh.',
    heroImg: 'https://images.pexels.com/photos/14259595/pexels-photo-14259595.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: '4.9',
    reviewCount: '3,150',
    bestSeason: 'Mùa đẹp nhất: T11 - T4',
    languages: 'Ngôn ngữ: Tiếng Việt',
    about: ['Phú Quốc là đảo ngọc lớn nhất Việt Nam, nổi tiếng với bãi biển hoang sơ và hải sản tươi ngon.'],
    itinerary: [],
    gallery: [],
    priceFrom: 2790000,
    discount: '-22%',
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
