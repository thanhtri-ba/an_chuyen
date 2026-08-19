import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, ChevronRight, Share2 } from 'lucide-react';
import { ARTICLES } from '../data/articles';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = ARTICLES.find((a) => a.slug === slug);
  const related = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(240,237,230,0.4)', marginBottom: 24, fontFamily: 'system-ui' }}>Không tìm thấy bài viết.</p>
          <Link to="/blog" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 700, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
            ← Quay lại Cẩm nang
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.content.trim().split('\n').filter((l) => l.trim() !== '');

  return (
    <div style={{ background: '#0e1111', color: '#f0ede6', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', height: '88vh', overflow: 'hidden' }}>
        <img
          src={article.image}
          alt={article.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) saturate(0.8)' }}
        />
        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0e1111 0%, rgba(14,17,17,0.15) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(14,17,17,0.65) 0%, transparent 65%)' }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '100px 8% 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <button
            onClick={() => navigate('/blog')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(14,17,17,0.55)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(240,237,230,0.7)', padding: '10px 20px', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: 'system-ui', transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={12} /> Cẩm nang
          </button>

          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(14,17,17,0.55)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(240,237,230,0.7)', padding: '10px 20px', cursor: 'pointer',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              fontFamily: 'system-ui',
            }}
          >
            <Share2 size={12} /> Chia sẻ
          </button>
        </div>

        {/* Hero content — bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 8% 72px', zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>

            {/* Category pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 32, height: 1, background: '#d4af37' }} />
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase',
                color: '#d4af37', fontFamily: 'system-ui',
              }}>
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.4rem, 4.5vw, 5rem)',
              fontWeight: 400,
              color: '#f0ede6',
              lineHeight: 1.12,
              maxWidth: 860,
              margin: '0 0 32px',
              letterSpacing: '-0.01em',
            }}>
              {article.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                fontSize: 11, color: 'rgba(240,237,230,0.4)', fontFamily: 'system-ui',
                padding: '10px 20px 10px 0',
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={11} /> {article.readTime} đọc
                </span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 11, color: 'rgba(240,237,230,0.4)', fontFamily: 'system-ui',
                padding: '10px 0 10px 20px',
              }}>
                <Calendar size={11} /> {article.date}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative large number */}
        <div style={{
          position: 'absolute', bottom: 40, right: '8%', zIndex: 5,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '22rem', fontWeight: 700,
          color: 'rgba(212,175,55,0.04)', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          {String(article.id).padStart(2, '0')}
        </div>
      </section>

      {/* ─── GOLD RULE ─── */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #d4af37, transparent)' }} />

      {/* ─── ARTICLE BODY ─── */}
      <main>
        <div style={{ maxWidth: '100%', margin: '0 auto', padding: '80px 8% 100px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>

            {/* Lead / desc — serif large italic */}
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(1.25rem, 2vw, 1.55rem)',
              lineHeight: 1.75,
              color: 'rgba(240,237,230,0.75)',
              fontStyle: 'italic',
              margin: '0 0 56px',
              paddingBottom: 56,
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              {article.desc}
            </p>

            {/* Body content */}
            <div>
              {paragraphs.map((line, i) => {
                // H2 heading
                if (line.startsWith('## ')) {
                  return (
                    <div key={i} style={{ margin: '60px 0 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                        <div style={{ width: 20, height: 1, background: '#d4af37', flexShrink: 0 }} />
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui' }}>
                          {String(i).padStart(2, '0')}
                        </span>
                      </div>
                      <h2 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                        fontWeight: 500,
                        color: '#f0ede6',
                        lineHeight: 1.25,
                        margin: 0,
                      }}>
                        {line.replace('## ', '')}
                      </h2>
                    </div>
                  );
                }

                // Horizontal rule
                if (line.startsWith('---')) {
                  return (
                    <div key={i} style={{ margin: '56px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                      <div style={{ width: 6, height: 6, background: '#d4af37', transform: 'rotate(45deg)', flexShrink: 0 }} />
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    </div>
                  );
                }

                // Italic note (*text*)
                if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                  return (
                    <div key={i} style={{
                      margin: '16px 0 28px',
                      padding: '14px 20px',
                      borderLeft: '2px solid #d4af37',
                      background: 'rgba(212,175,55,0.04)',
                    }}>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '1.05rem',
                        fontStyle: 'italic',
                        color: '#d4af37',
                        margin: 0,
                        lineHeight: 1.7,
                      }}>
                        {line.replace(/\*/g, '')}
                      </p>
                    </div>
                  );
                }

                // Bold label (**text**)
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p key={i} style={{
                      fontSize: '0.85rem', fontWeight: 700, color: '#f0ede6',
                      letterSpacing: '0.05em', margin: '36px 0 12px',
                      fontFamily: 'system-ui', textTransform: 'uppercase',
                    }}>
                      {line.replace(/\*\*/g, '')}
                    </p>
                  );
                }

                // List item
                if (line.startsWith('- ')) {
                  const text = line.replace('- ', '').replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f0ede6;font-weight:700">$1</strong>');
                  return (
                    <div key={i} style={{ display: 'flex', gap: 14, margin: '12px 0', alignItems: 'flex-start' }}>
                      <span style={{ color: '#d4af37', flexShrink: 0, fontSize: 8, marginTop: 7 }}>◆</span>
                      <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.8, color: 'rgba(240,237,230,0.65)', fontFamily: 'system-ui' }}
                        dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                  );
                }

                // Normal paragraph
                return (
                  <p key={i} style={{
                    fontSize: '1.05rem',
                    lineHeight: 1.9,
                    color: 'rgba(240,237,230,0.65)',
                    margin: '0 0 24px',
                    fontFamily: 'system-ui',
                  }}>
                    {line}
                  </p>
                );
              })}
            </div>

            {/* End note */}
            <div style={{ marginTop: 72, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4af37', marginBottom: 8, fontFamily: 'system-ui' }}>
                  An Chuyến — Cẩm nang du lịch
                </p>
                <p style={{ fontSize: 12, color: 'rgba(240,237,230,0.35)', fontFamily: 'system-ui', margin: 0 }}>
                  {article.date} · {article.readTime} đọc
                </p>
              </div>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', border: '1px solid rgba(212,175,55,0.3)',
                color: '#d4af37', padding: '10px 22px', cursor: 'pointer',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                fontFamily: 'system-ui', transition: 'all 0.2s',
              }}>
                <Share2 size={12} /> Chia sẻ bài viết
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ─── RELATED ARTICLES ─── */}
      <section style={{ padding: '0 8% 100px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '100%', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ padding: '56px 0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 24, height: 1, background: '#d4af37' }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui' }}>
                Bài viết liên quan
              </span>
            </div>
            <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(240,237,230,0.4)', textDecoration: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'system-ui', transition: 'color 0.2s' }}
              className="hover:text-[#d4af37]">
              Xem tất cả <ChevronRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {related.map((a, idx) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/blog/${a.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }} className="group">
                  {/* Image */}
                  <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden', marginBottom: 20 }}>
                    <img src={a.image} alt={a.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72)', transition: 'transform 0.7s ease, filter 0.4s' }}
                      className="group-hover:scale-105 group-hover:brightness-60"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,17,17,0.5) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 14, left: 14, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', fontFamily: 'system-ui' }}>
                      {a.category}
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', marginBottom: 10 }}>
                    <Clock size={10} /> {a.readTime}
                    <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.12)', display: 'inline-block' }} />
                    {a.date}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    color: '#f0ede6',
                    lineHeight: 1.35,
                    margin: '0 0 12px',
                    transition: 'color 0.2s',
                  }} className="group-hover:text-[#d4af37]">
                    {a.title}
                  </h3>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.3)', fontFamily: 'system-ui', transition: 'color 0.2s' }}
                    className="group-hover:text-[#d4af37]">
                    Đọc tiếp <ChevronRight size={10} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
