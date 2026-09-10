export interface Partner {
  slug: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  stat: string;
  statLabel: string;
  bio: string;
  founded: string;
  fleetSize: string;
  coverage: string;
  highlights: string[];
}

export const PARTNERS: Partner[] = [
  {
    slug: 'phuong-trang',
    name: 'Phuong Trang',
    role: 'Strategic Partner',
    quote: '"Safety and passenger satisfaction are always the top priorities on every journey."',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
    stat: '20+ yrs',
    statLabel: 'Experience',
    bio: 'Phuong Trang là một trong những nhà xe lâu đời và uy tín nhất Việt Nam, đồng hành cùng An Chuyến trên các tuyến liên tỉnh trọng điểm. Với đội ngũ tài xế giàu kinh nghiệm và quy trình vận hành chuẩn hoá, Phuong Trang luôn đặt an toàn hành khách lên hàng đầu trong suốt hơn hai thập kỷ hoạt động.',
    founded: '2001',
    fleetSize: '500+ xe',
    coverage: 'Toàn quốc, tập trung tuyến Bắc – Nam',
    highlights: ['Tài xế được đào tạo và sát hạch định kỳ', 'Xe đời mới, bảo dưỡng theo lịch nghiêm ngặt', 'Hỗ trợ khách hàng 24/7'],
  },
  {
    slug: 'thanh-buoi',
    name: 'Thanh Buoi',
    role: 'Transport Partner',
    quote: '"Experienced drivers, ready to serve 24/7."',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop',
    stat: '500+',
    statLabel: 'Vehicles',
    bio: 'Thanh Buoi sở hữu đội xe quy mô lớn, chuyên các tuyến đường dài và dịch vụ đưa đón sân bay. Đối tác nổi bật với khả năng phục vụ liên tục 24/7, đảm bảo hành khách luôn có chuyến đi đúng giờ dù khởi hành vào bất kỳ thời điểm nào trong ngày.',
    founded: '1998',
    fleetSize: '500+ xe',
    coverage: 'TP.HCM và các tỉnh miền Tây, miền Đông Nam Bộ',
    highlights: ['Phục vụ liên tục 24/7', 'Đưa đón tận nơi tại các điểm trung chuyển', 'Đội xe đa dạng loại ghế và giường nằm'],
  },
  {
    slug: 'hai-van',
    name: 'Hai Van',
    role: 'Transport Partner',
    quote: '"5-star service, bringing a completely different experience."',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop',
    stat: '4.9★',
    statLabel: 'Rating',
    bio: 'Hai Van là đối tác vận tải được đánh giá cao nhất trên nền tảng An Chuyến, nổi bật với dịch vụ 5 sao mang lại trải nghiệm hoàn toàn khác biệt cho hành khách — từ nội thất xe cao cấp đến thái độ phục vụ chuyên nghiệp của đội ngũ tài xế và phụ xe.',
    founded: '2010',
    fleetSize: '150+ xe',
    coverage: 'Miền Trung và các tuyến du lịch trọng điểm',
    highlights: ['Đánh giá trung bình 4.9/5 từ hành khách', 'Nội thất xe cao cấp, wifi miễn phí', 'Chuyên các tuyến du lịch, nghỉ dưỡng'],
  },
];
