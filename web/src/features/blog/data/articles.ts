export interface Article {
  id: number;
  slug: string;
  title: string;
  desc: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  tag?: string;
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    slug: 'top-7-cung-duong-deo',
    title: 'Top 7 cung đường đèo đẹp nhất Việt Nam nhìn từ cửa sổ xe khách',
    desc: 'Đèo Hải Vân, đèo Ngoạn Mục, đèo Khau Phạ — mỗi khúc cua là một bức tranh thiên nhiên hùng vĩ.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&auto=format&fit=crop',
    category: 'Kinh nghiệm du lịch',
    readTime: '7 phút',
    date: '12 Tháng 11, 2026',
    tag: 'Nổi bật',
    content: `
Việt Nam được thiên nhiên ưu đãi với địa hình đa dạng — từ những đỉnh núi phủ mây ở Tây Bắc đến các triền đồi bạt ngàn ở Tây Nguyên. Và không có cách nào thưởng ngoạn vẻ đẹp đó tốt hơn là ngồi trên xe khách, để từng khung cửa sổ trở thành một bức tranh.

## 1. Đèo Hải Vân — Ranh giới của trời và biển

Nằm giữa Đà Nẵng và Thừa Thiên Huế, đèo Hải Vân dài 21km là một trong những cung đường hiểm trở và đẹp bậc nhất Đông Nam Á. Từ đỉnh đèo ở độ cao 496m, bạn sẽ thấy vịnh Đà Nẵng xanh biếc một bên và dãy núi Trường Sơn hùng vĩ một bên.

*Thời điểm đẹp nhất:* Tháng 3 đến tháng 8, khi trời quang mây tạnh và ánh nắng vàng chiếu rọi mặt biển.

## 2. Đèo Ngoạn Mục — Cổng trời Tây Nguyên

Đèo Ngoạn Mục (hay còn gọi là đèo Sông Pha) nối Ninh Thuận với Lâm Đồng, nổi tiếng với những con đường ziczac uốn lượn giữa rừng thông xanh. Trên tuyến xe Sài Gòn – Đà Lạt, đây là đoạn đường khiến hành khách ngỡ ngàng nhất.

## 3. Đèo Khau Phạ — Tứ đại đỉnh đèo

Thuộc tỉnh Yên Bái, đèo Khau Phạ là một trong "tứ đại đỉnh đèo" của miền Bắc. Vào mùa lúa chín tháng 9–10, những thửa ruộng bậc thang vàng óng trải dài khiến cung đường này trở nên huyền ảo như tranh vẽ.

## 4. Đèo Mã Pì Lèng — Vua của các đỉnh đèo

Được mệnh danh là "vua đèo" của Việt Nam, Mã Pì Lèng ở Hà Giang cao 1.200m với vực thẳm sâu hun hút và sông Nho Quế màu ngọc bích ở dưới chân. Đây là đoạn đường không thể bỏ qua nếu bạn có dịp lên Hà Giang.

## 5. Đèo Ô Quy Hồ — Đỉnh đèo trong mây

Nối Sa Pa với Lai Châu, đèo Ô Quy Hồ dài 50km là con đèo dài nhất trong tứ đại đỉnh đèo. Buổi sáng sớm, mây mù bao phủ tạo ra khung cảnh huyền bí như chốn tiên cảnh.

## 6. Đèo Bảo Lộc — Cổng vào xứ trà

Trên đường từ TP.HCM lên Đà Lạt, đèo Bảo Lộc chào đón du khách bằng những đồi chè xanh mướt trải dài đến tận chân trời. Hương chè thoang thoảng theo gió núi là điều khiến hành trình trở nên đáng nhớ.

## 7. Đèo Tam Điệp — Cửa ngõ vào Nam

Nằm giữa Ninh Bình và Thanh Hóa, đèo Tam Điệp mang trong mình chiều sâu lịch sử của đất nước. Nhìn từ xe khách, bạn sẽ thấy vùng đồng bằng Bắc Bộ rộng lớn hiện ra sau những đỉnh núi xanh.

---

**Mẹo khi đặt vé:** Hãy chọn ghế bên cửa sổ phải (chiều từ Nam ra Bắc) hoặc cửa sổ trái (chiều ngược lại) để có tầm nhìn đẹp nhất khi qua đèo Hải Vân.
    `,
  },
  {
    id: 2,
    slug: 'bun-bo-hue-am-thuc',
    title: 'Bún bò Huế và hành trình ẩm thực xứ Thần Kinh',
    desc: 'Từ Sài Gòn ra Huế không chỉ để thăm Đại Nội, mà còn để thưởng thức tô bún bò chính gốc.',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=1200&auto=format&fit=crop',
    category: 'Ẩm thực địa phương',
    readTime: '4 phút',
    date: '8 Tháng 11, 2026',
    content: `
Huế — cố đô của triều Nguyễn — không chỉ nổi tiếng với những lăng tẩm cổ kính và Đại Nội hùng vĩ. Đây còn là kinh đô ẩm thực của Việt Nam, nơi mỗi món ăn đều mang trong mình câu chuyện về lịch sử và văn hóa.

## Tô bún bò chính gốc

Khác với bún bò Huế ở Sài Gòn hay Hà Nội, tô bún bò chính gốc tại Huế có nước dùng đậm đà hơn, thơm mùi sả và mắm ruốc đặc trưng. Thịt bò mềm, chả cua giòn tan — mỗi thìa nước dùng là một bản giao hưởng của hương vị.

*Địa chỉ không thể bỏ qua:* Quán Bún Bò Mụ Rớt (37 Nguyễn Bỉnh Khiêm), mở từ 6h sáng và thường hết trước 9h.

## Bánh bèo, bánh nậm, bánh lọc

Ba loại bánh này tạo thành "thánh đường ẩm thực" của người Huế. Nhỏ xinh, tinh tế, được bày trên những chiếc đĩa nhỏ như tác phẩm nghệ thuật. Ăn một lần là nhớ mãi.

## Cơm hến

Món ăn bình dân nhưng phức tạp về hương vị — hến nhỏ xào thơm, trộn với cơm nguội và hàng chục loại rau thơm. Cay, chua, mặn, ngọt hòa quyện trong từng muỗng.

---

**Gợi ý hành trình:** Đặt vé xe Sài Gòn – Huế qua đêm, đến Huế lúc sáng sớm, thưởng thức bún bò và khám phá Đại Nội khi ánh nắng ban mai còn dịu mát.
    `,
  },
  {
    id: 3,
    slug: 've-xe-khach-gia-re',
    title: 'Mua vé xe khách giá rẻ: 5 bí quyết ít người biết',
    desc: 'Đặt trước 7 ngày, chọn khung giờ thấp điểm và dùng điểm tích lũy — tiết kiệm đến 40%.',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop',
    category: 'Mẹo đặt vé',
    readTime: '3 phút',
    date: '5 Tháng 11, 2026',
    content: `
Đặt vé xe khách không cần phải tốn nhiều tiền nếu bạn biết những bí quyết này. Sau đây là 5 mẹo đã được kiểm chứng giúp bạn tiết kiệm đến 40% chi phí di chuyển.

## 1. Đặt trước ít nhất 7 ngày

Các nhà xe thường có chính sách giá sớm (early bird) dành cho những ai đặt vé trước. Với An Chuyến, đặt trước 7 ngày có thể tiết kiệm 15–25% so với mua vào ngày khởi hành.

## 2. Chọn khung giờ thấp điểm

Chuyến xe lúc 1h–4h sáng thường rẻ hơn 20–30% so với các chuyến ban ngày hoặc chiều tối. Nếu bạn có thể ngủ trên xe, đây là lựa chọn cực kỳ tiết kiệm.

## 3. Dùng điểm tích lũy

Mỗi chuyến đi với An Chuyến bạn tích được điểm thưởng. Đủ điểm có thể đổi lấy vé miễn phí hoặc giảm giá đáng kể cho chuyến tiếp theo.

## 4. Theo dõi các đợt flash sale

An Chuyến thường tổ chức flash sale vào các ngày lễ như 9/9, 11/11, 12/12. Đăng ký thông báo để không bỏ lỡ những deal 0đ hay giảm 50%.

## 5. Đi nhóm để được giá đoàn

Từ 5 người trở lên, bạn có thể liên hệ trực tiếp để được báo giá đoàn, thường tiết kiệm 15–20% so với đặt lẻ.

---

**Bonus:** Tránh đặt vé vào các dịp lễ Tết, 30/4, 2/9 — giá cao và vé thường đã cháy từ trước 2–3 tuần.
    `,
  },
  {
    id: 4,
    slug: 'hoi-an-ve-dem',
    title: 'Hội An về đêm — Ánh đèn lồng soi bóng phố cổ',
    desc: 'Khi màn đêm buông xuống, Hội An khoác lên mình chiếc áo lung linh của hàng nghìn chiếc đèn lồng.',
    image: 'https://images.unsplash.com/photo-1552554746-0fb9f33b5c65?q=80&w=1200&auto=format&fit=crop',
    category: 'Điểm đến hot',
    readTime: '6 phút',
    date: '1 Tháng 11, 2026',
    content: `
Có một phiên bản Hội An chỉ xuất hiện sau 6 giờ tối — khi những chiếc đèn lồng đủ màu sắc được thắp sáng, những con phố hẹp ngập tràn ánh nến, và tiếng nhạc dân ca xứ Quảng vẳng đâu đó từ cuối ngõ.

## Phố cổ dưới ánh đèn lồng

Đêm rằm hàng tháng (14 âm lịch), Hội An tổ chức "đêm phố cổ" — tắt điện, chỉ thắp đèn lồng và nến. Không gian trở nên huyền ảo và lãng mạn đến mức khó tả.

*Lưu ý:* Đêm rằm thường rất đông khách, hãy đến sớm trước 7h tối để có chỗ đẹp chụp ảnh.

## Thả hoa đăng trên sông Hoài

Mua một chiếc thuyền hoa giấy nhỏ (khoảng 10.000đ), đặt nến vào trong, thắp lên rồi thả xuống sông Hoài với một điều ước. Khung cảnh hàng trăm ngọn nến lung linh trôi trên mặt sông đêm là điều bạn sẽ không bao giờ quên.

## Ẩm thực đêm Hội An

Cơm gà Bà Buội (22 Trần Phú), bánh mì Phượng (2B Phan Châu Trinh), và cao lầu — ba món không thể thiếu trong hành trình ẩm thực đêm Hội An.

---

**Cách đến:** Xe khách Đà Nẵng – Hội An chạy liên tục, giá chỉ từ 50.000đ. Hoặc đặt xe từ Sài Gòn/Hà Nội đến thẳng Hội An qua tuyến limousine cao cấp.
    `,
  },
  {
    id: 5,
    slug: 'sapa-trong-suong',
    title: 'Sapa trong sương — Hành trình lên núi của người lữ hành',
    desc: 'Những thửa ruộng bậc thang trải dài trong sương mù, bản làng mộc mạc và bầu trời đêm đầy sao.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop',
    category: 'Kinh nghiệm du lịch',
    readTime: '8 phút',
    date: '28 Tháng 10, 2026',
    content: `
Sapa không phải điểm đến — đó là một trạng thái tâm hồn. Khi xe chầm chậm leo qua những khúc cua tay áo của đèo Ô Quy Hồ và màn sương dày đặc bắt đầu bao phủ xung quanh, bạn biết rằng mình đã đến nơi khác với mọi nơi trên đất nước này.

## Thời điểm vàng để lên Sapa

**Tháng 9–10** là mùa lúa chín — những thửa ruộng bậc thang chuyển từ xanh sang vàng óng, tạo ra khung cảnh đẹp như tranh. Đây cũng là lúc Sapa đông du khách nhất, nên hãy đặt xe và chỗ ở trước ít nhất 2 tuần.

**Tháng 12–1** là mùa tuyết rơi (hiếm nhưng có) — nếu may mắn, bạn sẽ thấy Sapa phủ trắng một màu huyền ảo.

## Bản Cát Cát và người H'Mông

Cách trung tâm Sapa 3km, bản Cát Cát là nơi cộng đồng người H'Mông sinh sống qua nhiều thế hệ. Những ngôi nhà mái lá, khung cửi thủ công và tiếng cười trẻ thơ vang vọng giữa núi rừng — đây là Sapa thực sự, không phải những khu resort bóng bẩy.

## Đỉnh Fansipan từ Sapa

Cáp treo lên Fansipan — nóc nhà Đông Dương ở độ cao 3.143m — chỉ mất 15 phút. Nhưng nếu muốn cảm giác chinh phục thực sự, hãy đi bộ leo núi 2 ngày 1 đêm. Từ đỉnh Fansipan nhìn xuống, cả dãy Hoàng Liên Sơn trải dài trước mắt như tấm bản đồ khổng lồ.

## Ăn gì ở Sapa?

- **Thịt trâu gác bếp** — hun khói mềm tan trong miệng
- **Cá hồi nướng Sa Pa** — nướng mỡ hành thơm lừng
- **Rượu ngô Men Lá** — thứ rượu đặc trưng của người dân tộc

---

**Đi từ Hà Nội:** Xe giường nằm cao cấp Hà Nội – Sapa khởi hành lúc 9–10 giờ tối, đến Sapa lúc 5–6 giờ sáng. Đúng giờ bình minh lên — hoàn hảo để bắt đầu ngày đầu tiên.
    `,
  },
];

export const FEATURED_ARTICLE = {
  title: 'Đà Lạt mùa dã quỳ — Khi cao nguyên khoác tấm áo vàng rực',
  desc: 'Tháng 11, những bông dã quỳ nở rộ trên khắp triền đồi Đà Lạt, biến thành phố ngàn hoa thành một bức tranh vàng óng tuyệt đẹp.',
  image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop',
  category: 'Kinh nghiệm',
  readTime: '5 phút đọc',
  date: 'Tháng 11, 2026',
};
