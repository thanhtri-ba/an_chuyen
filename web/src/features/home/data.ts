import { api } from '../../lib/api';
import cloudsPeaksVideo from '../../assets/hero/videos/clouds-peaks.mp4';
import cloudsTimelapseVideo from '../../assets/hero/videos/clouds-timelapse.mp4';
import cloudsSceneryVideo from '../../assets/hero/videos/clouds-scenery.mp4';
import nightSkyMountainsVideo from '../../assets/hero/videos/night-sky-mountains.mp4';

export interface HeroSlide {
  id?: string;
  eyebrow: string;
  title: string;
  videoUrl: string;
  order?: number;
}

// Fallback used only if the API is unreachable or no admin-managed slides exist yet,
// so the hero never renders empty.
export const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  { eyebrow: 'Khám phá', title: 'Đừng đứng chờ ở bến xe nữa', videoUrl: cloudsPeaksVideo },
  { eyebrow: 'Khám phá', title: 'Đừng đứng chờ ở bến xe nữa', videoUrl: cloudsTimelapseVideo },
  { eyebrow: 'Khám phá', title: 'Đừng đứng chờ ở bến xe nữa', videoUrl: cloudsSceneryVideo },
  { eyebrow: 'Khám phá', title: 'Đừng đứng chờ ở bến xe nữa', videoUrl: nightSkyMountainsVideo },
];

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data } = await api.get<HeroSlide[]>('/hero-slides');
    return data && data.length > 0 ? data : FALLBACK_HERO_SLIDES;
  } catch {
    return FALLBACK_HERO_SLIDES;
  }
}
