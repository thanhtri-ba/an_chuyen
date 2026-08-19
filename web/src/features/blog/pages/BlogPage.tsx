import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ARTICLES, FEATURED_ARTICLE } from '../data/articles';

const CATEGORY_TABS = ['Tất cả', 'Kinh nghiệm du lịch', 'Ẩm thực địa phương', 'Mẹo đặt vé', 'Điểm đến hot'];

export function BlogPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ARTICLES.filter((a) => {
    const matchCat = activeCategory === 'Tất cả' || a.category === activeCategory;
    const matchQ = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ─── HERO ─── overflow:visible so search bar can bleed below */}
      <section style={{ position: 'relative', height: '92vh' }}>
        {/* Image clipped separately */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1600&auto=format&fit=crop"
            alt="hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45) saturate(0.9)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0e1111 0%, rgba(14,17,17,0.3) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(14,17,17,0.7) 0%, transparent 60%)' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 8% 80px' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 28, height: 1, background: '#d4af37' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui' }}>
                {t('blog.featuredCategories')} — {FEATURED_ARTICLE.category}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)',
                fontWeight: 400,
                color: '#f0ede6',
                lineHeight: 1.15,
                maxWidth: 820,
                margin: '0 0 24px',
              }}
            >
              {FEATURED_ARTICLE.title}
            </h1>
            <p style={{ color: 'rgba(240,237,230,0.65)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 560, marginBottom: 36, fontFamily: 'system-ui' }}>
              {FEATURED_ARTICLE.desc}
            </p>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'rgba(240,237,230,0.45)', fontFamily: 'system-ui', marginBottom: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={12} /> {FEATURED_ARTICLE.readTime}
              </span>
              <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
              <span>{FEATURED_ARTICLE.date}</span>
            </div>

            {/* CTA + Search bar — same row with gap */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 1000, width: 'fit-content' }}>
              <Link
                to="#"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', height: 48,
                  background: '#d4af37', color: '#0e1111', padding: '0 28px',
                  fontSize: 11, fontWeight: 1000, letterSpacing: '0.15em', textTransform: 'uppercase',
                  textDecoration: 'none', fontFamily: 'system-ui',
                }}
              >
                Đọc bài viết <ArrowRight size={14} />
              </Link>
              <div
                style={{
                  width: 520, display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(20,24,24,0.88)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  padding: '0 12px', height: 48,
                }}
              >
                <Search size={13} style={{ color: '#d4af37', flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('blog.searchPlaceholder')}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: '#f0ede6', fontSize: 13, fontFamily: 'system-ui', minWidth: 0,
                  }}
                />
                <button
                  style={{
                    background: '#d4af37', color: '#0e1111', border: 'none',
                    padding: '6px 16px', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                    fontFamily: 'system-ui', flexShrink: 0, height: 32,
                  }}
                >
                  {t('blog.searchBtn')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORY TABS ─── */}
      <section style={{ padding: '56px 8% 48px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '10px 24px 14px',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontFamily: 'system-ui', whiteSpace: 'nowrap',
                  color: activeCategory === cat ? '#d4af37' : 'rgba(240,237,230,0.35)',
                  borderBottom: activeCategory === cat ? '2px solid #d4af37' : '2px solid transparent',
                  transition: 'all 0.25s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARTICLES GRID ─── */}
      <section style={{ padding: '64px 8% 120px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(240,237,230,0.35)', fontFamily: 'system-ui' }}>
              Không tìm thấy bài viết phù hợp.
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* First row: 1 large + 1 tall */}
                {filtered.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    {/* Large card */}
                    <ArticleCard article={filtered[0]} large />
                    {/* Right column: 2 stacked if available */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {filtered.slice(1, 3).map((a) => (
                        <ArticleCard key={a.id} article={a} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Second row: remaining articles in a 3-col grid */}
                {filtered.length > 3 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {filtered.slice(3).map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ─── NEWSLETTER BAND ─── */}
      <section
        style={{
          padding: '80px 8%',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 60%)',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', marginBottom: 16, fontFamily: 'system-ui' }}>
            Cẩm nang du lịch
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 400,
              color: '#f0ede6',
              margin: '0 0 16px',
              lineHeight: 1.2,
            }}
          >
            Nhận cảm hứng du lịch <em style={{ color: '#d4af37' }}>mỗi tuần</em>
          </h2>
          <p style={{ color: 'rgba(240,237,230,0.45)', fontSize: 14, lineHeight: 1.7, marginBottom: 32, fontFamily: 'system-ui' }}>
            Bài viết hay, kinh nghiệm đặt vé và điểm đến mới nhất gửi thẳng vào hộp thư của bạn.
          </p>
          <div style={{ display: 'flex', gap: 0, maxWidth: 480, margin: '0 auto' }}>
            <input
              type="email"
              placeholder="email@example.com"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)', borderRight: 'none',
                padding: '14px 20px', color: '#f0ede6', fontSize: 14,
                fontFamily: 'system-ui', outline: 'none',
              }}
            />
            <button
              style={{
                background: '#d4af37', color: '#0e1111', border: 'none',
                padding: '14px 28px', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: 'system-ui', flexShrink: 0,
              }}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ─── ARTICLE CARD COMPONENT ─── */
import type { Article } from '../data/articles';

function ArticleCard({ article, large }: { article: Article; large?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/blog/${article.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }} className="group">
        {/* Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: large ? '4/3' : '16/9',
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          <img
            src={article.image}
            alt={article.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.7s ease, filter 0.4s ease',
              filter: 'brightness(0.8)',
            }}
            className="group-hover:scale-105 group-hover:brightness-75"
          />
          {/* Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,17,0.6) 0%, transparent 60%)' }} />

          {/* Tag */}
          {article.tag && (
            <div
              style={{
                position: 'absolute', top: 16, left: 16,
                background: '#d4af37', color: '#0e1111',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '5px 12px',
                fontFamily: 'system-ui',
              }}
            >
              {article.tag}
            </div>
          )}

          {/* Category on image */}
          <div
            style={{
              position: 'absolute', bottom: 16, left: 16,
              fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui',
            }}
          >
            {article.category}
          </div>
        </div>

        {/* Text */}
        <div>
          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, fontSize: 11, color: 'rgba(240,237,230,0.35)', fontFamily: 'system-ui' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={10} /> {article.readTime}
            </span>
            <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
            <span>{article.date}</span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: large ? '1.8rem' : '1.25rem',
              fontWeight: 500,
              color: '#f0ede6',
              lineHeight: 1.25,
              margin: '0 0 10px',
              transition: 'color 0.2s',
            }}
            className="group-hover:text-[#d4af37]"
          >
            {article.title}
          </h3>

          {large && (
            <p style={{ color: 'rgba(240,237,230,0.5)', fontSize: 14, lineHeight: 1.7, margin: '0 0 16px', fontFamily: 'system-ui' }}>
              {article.desc}
            </p>
          )}

          {/* Read more link */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(240,237,230,0.4)',
              fontFamily: 'system-ui', transition: 'color 0.2s',
            }}
            className="group-hover:text-[#d4af37]"
          >
            Đọc tiếp <ChevronRight size={12} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
