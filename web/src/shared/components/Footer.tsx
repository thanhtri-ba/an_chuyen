import { Link } from 'react-router-dom';
import { memo } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Memoized link column component
const FooterLinkColumn = memo(({ title, links }: { title: string; links: { to: string; label: string }[] }) => (
  <div>
    <h4 className="font-bold text-[#1a1a1a] text-sm mb-4">{title}</h4>
    <ul className="space-y-3">
      {links.map((link, idx) => (
        <li key={idx}>
          <Link to={link.to} className="hover:text-primary transition-colors text-sm text-gray-500 font-medium">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
));

// Memoized social links
const SocialLinks = memo(() => (
  <div className="flex gap-4 mt-6">
    {['f', 'ig', 'yt', 'tw'].map(s => (
      <a key={s} href="#" className="text-gray-400 hover:text-[#1a1a1a] transition-colors">
        <div className="w-5 h-5 flex items-center justify-center font-bold text-xs uppercase">{s}</div>
      </a>
    ))}
  </div>
));

export const Footer = memo(() => {
  const { t } = useTranslation();

  const quickLinks = [
    { to: '#', label: t('roamora.nav.destinations') },
    { to: '#', label: t('roamora.nav.experiences') },
    { to: '#', label: t('roamora.nav.hotels') },
    { to: '#', label: t('roamora.nav.tours') },
    { to: '#', label: t('roamora.nav.deals') },
    { to: '#', label: t('roamora.nav.aboutUs') },
  ];

  const supportLinks = [
    { to: '#', label: t('roamora.nav.faqs') },
    { to: '#', label: t('roamora.nav.privacy') },
    { to: '#', label: t('roamora.nav.terms') },
    { to: '#', label: t('roamora.nav.contactUs') },
  ];

  return (
    <footer className="bg-[#fcfcfc] text-gray-500 relative border-t border-gray-100 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <span className="text-xl font-bold tracking-tight text-[#1a1a1a] flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.5l-1.3 2.6c-.2.4-.1.9.3 1.1l7.3 3.8-2 2-3.4-.6c-.5-.1-.9.2-1.1.5l-1.1 2.3c-.2.4 0 .9.4 1.1L8 21l8.5-4.7c.4.2.9.4 1.3.4z"/></svg>
                An Chuyến
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              {t('roamora.footer.desc')}
            </p>
            <SocialLinks />
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <FooterLinkColumn title={t('roamora.footer.quickLinks')} links={quickLinks} />
          </div>
          <div className="lg:col-span-2">
            <FooterLinkColumn title={t('roamora.footer.support')} links={supportLinks} />
          </div>
          
          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="font-bold text-[#1a1a1a] text-sm mb-4">{t('roamora.footer.newsletter')}</h4>
            <p className="text-sm mb-4 max-w-xs">{t('roamora.footer.newsletterDesc')}</p>
            <div className="relative mt-2 max-w-sm">
              <input type="email" placeholder={t('roamora.footer.emailPlaceholder')} className="w-full h-12 bg-white pl-4 pr-12 text-sm border border-gray-200 focus:border-primary outline-none transition-all text-[#1a1a1a] rounded-full shadow-sm" />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1a332a] rounded-full flex items-center justify-center text-white hover:bg-[#0d1f19] transition-colors shadow-sm">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex justify-center items-center text-xs text-gray-400 font-medium">
          <p>{t('roamora.footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
});
