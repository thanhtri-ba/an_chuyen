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
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-6 font-medium">Không tìm thấy bài viết.</p>
          <Link to="/blog" className="text-primary font-bold text-xs tracking-widest uppercase hover:text-primary-hover transition-colors">
            ← Quay lại Cẩm nang
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.content.trim().split('\n').filter((l) => l.trim() !== '');

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-32">

      {/* ─── HERO ─── */}
      <section className="relative h-[85vh] max-h-[800px] min-h-[500px] w-full overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.85] saturate-[1.1]"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/20 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-28 px-6 lg:px-12 flex justify-between items-start max-w-[1400px] mx-auto">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Cẩm nang
          </button>

          <button
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" /> Chia sẻ
          </button>
        </div>

        {/* Hero content — bottom */}
        <div className="absolute bottom-0 left-0 right-0 pb-20 px-6 lg:px-12 z-10 max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-4xl">

            {/* Category pill */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-px bg-[#d4af37]" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-medium text-5xl md:text-6xl lg:text-[5.5rem] text-[#1a1a1a] leading-[1.05] mb-10">
              {article.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center gap-6 text-[11px] font-bold tracking-widest uppercase text-gray-500">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {article.readTime}
              </span>
              <span className="w-px h-4 bg-gray-300" />
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {article.date}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Decorative large number */}
        <div className="absolute bottom-10 right-10 lg:right-24 z-0 font-display text-[16rem] font-bold text-gray-100 leading-none select-none pointer-events-none">
          {String(article.id).padStart(2, '0')}
        </div>
      </section>

      {/* ─── GOLD RULE ─── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent w-full opacity-50" />

      {/* ─── ARTICLE BODY ─── */}
      <main className="px-6 lg:px-12 py-24 max-w-[900px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}>

          {/* Lead / desc — serif large italic */}
          <p className="font-display font-medium text-2xl md:text-3xl leading-[1.6] text-gray-700 italic mb-16 pb-16 border-b border-gray-100">
            {article.desc}
          </p>

          {/* Body content */}
          <div className="prose prose-lg prose-gray max-w-none">
            {paragraphs.map((line, i) => {
              // H2 heading
              if (line.startsWith('## ')) {
                return (
                  <div key={i} className="mt-16 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-6 h-px bg-[#d4af37]" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">
                        {String(i).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="font-display font-medium text-3xl md:text-4xl text-[#1a1a1a] leading-tight m-0">
                      {line.replace('## ', '')}
                    </h2>
                  </div>
                );
              }

              // Horizontal rule
              if (line.startsWith('---')) {
                return (
                  <div key={i} className="flex items-center gap-4 my-16">
                    <div className="flex-1 h-px bg-gray-100" />
                    <div className="w-1.5 h-1.5 bg-[#d4af37] rotate-45" />
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                );
              }

              // Italic note (*text*)
              if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                return (
                  <div key={i} className="my-10 p-6 md:p-8 bg-gray-50 border-l-2 border-[#d4af37] rounded-r-2xl">
                    <p className="font-display font-medium text-xl italic text-gray-700 m-0 leading-[1.7]">
                      {line.replace(/\*/g, '')}
                    </p>
                  </div>
                );
              }

              // Bold label (**text**)
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={i} className="text-[11px] font-bold text-[#1a1a1a] tracking-widest uppercase mt-12 mb-4">
                    {line.replace(/\*\*/g, '')}
                  </p>
                );
              }

              // List item
              if (line.startsWith('- ')) {
                const text = line.replace('- ', '').replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#1a1a1a]">$1</strong>');
                return (
                  <div key={i} className="flex gap-4 my-4 items-start">
                    <span className="text-[#d4af37] text-[10px] mt-2 shrink-0">◆</span>
                    <p className="m-0 text-lg leading-[1.8] text-gray-600" dangerouslySetInnerHTML={{ __html: text }} />
                  </div>
                );
              }

              // Normal paragraph
              return (
                <p key={i} className="text-lg leading-[1.8] text-gray-600 mb-6">
                  {line}
                </p>
              );
            })}
          </div>

          {/* End note */}
          <div className="mt-24 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-primary mb-2">
                An Chuyến — Cẩm nang du lịch
              </p>
              <p className="text-xs text-gray-400 font-medium m-0">
                {article.date} · {article.readTime} đọc
              </p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors shadow-sm">
              <Share2 className="w-3.5 h-3.5 text-primary" /> Chia sẻ bài viết
            </button>
          </div>
        </motion.div>
      </main>

      {/* ─── RELATED ARTICLES ─── */}
      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto pt-10 border-t border-gray-100">
        {/* Section header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-[#d4af37]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">
              Bài viết liên quan
            </span>
          </div>
          <Link to="/blog" className="flex items-center gap-2 text-primary font-bold text-[10px] tracking-widest uppercase hover:text-primary-hover transition-colors">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map((a, idx) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="h-full"
            >
              <Link to={`/blog/${a.slug}`} className="group h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl mb-5 shadow-sm">
                  <img src={a.image} alt={a.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm">
                    {a.category}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3 px-1">
                  <Clock className="w-3 h-3" /> {a.readTime}
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  {a.date}
                </div>

                {/* Title */}
                <h3 className="font-display font-medium text-xl text-[#1a1a1a] leading-snug mb-4 group-hover:text-primary transition-colors px-1">
                  {a.title}
                </h3>

                <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-primary transition-colors group-hover:text-primary-hover px-1">
                  Đọc tiếp <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
