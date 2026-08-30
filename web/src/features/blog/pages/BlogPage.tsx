import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ARTICLES, FEATURED_ARTICLE, type Article } from '../data/articles';

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
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-32">

      {/* ─── HERO ─── */}
      <section className="relative h-[92vh] max-h-[800px] min-h-[600px] w-full overflow-hidden">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
            alt="hero"
            className="w-full h-full object-cover brightness-[0.85] saturate-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 lg:px-12 max-w-[1400px] mx-auto pb-24">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#d4af37]" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37]">
                {t('blog.featuredCategories')} — {FEATURED_ARTICLE.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-medium text-5xl md:text-6xl lg:text-7xl text-[#1a1a1a] leading-[1.1] mb-6">
              {FEATURED_ARTICLE.title}
            </h1>
            <p className="text-gray-700 font-medium text-lg leading-relaxed mb-8 max-w-xl">
              {FEATURED_ARTICLE.desc}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-gray-500 mb-10">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {FEATURED_ARTICLE.readTime}
              </span>
              <span className="w-px h-4 bg-gray-300" />
              <span>{FEATURED_ARTICLE.date}</span>
            </div>

            {/* CTA + Search bar */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                to={`/blog/${FEATURED_ARTICLE.slug}`}
                className="flex items-center justify-center gap-3 h-14 bg-primary text-white px-8 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary-hover transition-colors shadow-md w-full sm:w-auto shrink-0"
              >
                Đọc bài viết <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="flex items-center gap-3 h-14 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full px-4 w-full max-w-md shadow-sm focus-within:bg-white focus-within:border-primary transition-colors">
                <Search className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('blog.searchPlaceholder')}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[#1a1a1a] placeholder:text-gray-400 min-w-0"
                />
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors shrink-0">
                  {t('blog.searchBtn')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORY TABS ─── */}
      <section className="border-b border-gray-100 bg-white sticky top-[72px] z-30">
        <div className="px-6 lg:px-12 max-w-[1400px] mx-auto">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-6 px-4 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeCategory === cat 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-400 hover:text-[#1a1a1a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARTICLES GRID ─── */}
      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto pt-16 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Large card */}
                  <ArticleCard article={filtered[0]} large />
                  {/* Right column: 2 stacked if available */}
                  <div className="flex flex-col gap-8">
                    {filtered.slice(1, 3).map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                  </div>
                </div>
              )}

              {/* Second row: remaining articles in a 3-col grid */}
              {filtered.length > 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.slice(3).map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* ─── NEWSLETTER BAND ─── */}
      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto mb-20">
        <div className="bg-gray-50 rounded-[3rem] border border-gray-100 p-16 md:p-24 text-center">
          <div className="max-w-xl mx-auto">
            <p className="text-[10px] font-bold tracking-widest uppercase text-primary mb-6">
              Cẩm nang du lịch
            </p>
            <h2 className="font-display font-medium text-4xl md:text-5xl text-[#1a1a1a] mb-6 leading-tight">
              Nhận cảm hứng du lịch <br/>
              <em className="text-[#d4af37] font-serif italic">mỗi tuần</em>
            </h2>
            <p className="text-gray-500 font-medium mb-12 text-lg">
              Bài viết hay, kinh nghiệm đặt vé và điểm đến mới nhất gửi thẳng vào hộp thư của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full sm:w-80 h-14 bg-white border border-gray-200 rounded-full px-6 text-sm font-medium outline-none focus:border-primary transition-colors shadow-sm"
              />
              <button className="h-14 bg-primary text-white px-10 rounded-full text-[11px] font-bold tracking-widest uppercase hover:bg-primary-hover transition-colors shadow-md shrink-0">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ─── ARTICLE CARD COMPONENT ─── */
function ArticleCard({ article, large }: { article: Article; large?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Link to={`/blog/${article.slug}`} className="group h-full flex flex-col">
        {/* Image */}
        <div
          className={`relative w-full overflow-hidden rounded-2xl mb-6 shadow-sm ${
            large ? 'aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[500px]' : 'aspect-[16/9]'
          }`}
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

          {/* Tags */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {article.tag && (
              <div className="bg-white/90 backdrop-blur-sm text-[#1a1a1a] text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm">
                {article.tag}
              </div>
            )}
            <div className="bg-primary/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm ml-auto">
              {article.category}
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col flex-1 px-2">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 text-[11px] font-bold tracking-widest uppercase text-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{article.date}</span>
          </div>

          {/* Title */}
          <h3 className={`font-display font-medium text-[#1a1a1a] leading-snug mb-3 group-hover:text-primary transition-colors ${large ? 'text-3xl' : 'text-xl'}`}>
            {article.title}
          </h3>

          {large && (
            <p className="text-gray-500 font-medium mb-6 line-clamp-3">
              {article.desc}
            </p>
          )}

          {/* Read more */}
          <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-primary transition-colors group-hover:text-primary-hover pt-4">
            Đọc tiếp <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
