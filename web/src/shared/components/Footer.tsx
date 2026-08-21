import { Link } from 'react-router-dom';
import { memo } from 'react';
import { Globe, Mail, Phone, MessageCircle, Send, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Memoized link column component
const FooterLinkColumn = memo(({ title, links }: { title: string; links: { to: string; label: string }[] }) => (
  <div>
    <h4 className="font-bold text-white text-lg mb-6">{title}</h4>
    <ul className="space-y-4">
      {links.map((link, idx) => (
        <li key={idx}>
          <Link to={link.to} className="hover:text-primary transition-colors text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
));

// Memoized social links
const SocialLinks = memo(() => (
  <div className="flex gap-4">
    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
      <Globe className="w-5 h-5" />
    </a>
    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
      <MessageCircle className="w-5 h-5" />
    </a>
    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
      <Phone className="w-5 h-5" />
    </a>
  </div>
));

// Memoized contact section
const ContactSection = memo(({ t }: { t: any }) => (
  <div>
    <h4 className="font-bold text-white text-lg mb-6">{t('footer.contact.title')}</h4>
    <ul className="space-y-4 mb-6">
      <li className="flex items-start gap-3 text-sm">
        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <span>{t('footer.contact.address')}</span>
      </li>
      <li className="flex items-center gap-3 text-sm">
        <Phone className="w-5 h-5 text-primary shrink-0" />
        <span className="font-bold text-white">1900 1234</span>
      </li>
      <li className="flex items-center gap-3 text-sm">
        <Mail className="w-5 h-5 text-primary shrink-0" />
        <span>support@anchuyen.vn</span>
      </li>
    </ul>
    <div className="relative">
      <input type="email" placeholder={t('footer.contact.emailPlaceholder')} className="w-full h-12 bg-white/10 pl-4 pr-12 text-sm border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white" />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
        <Send className="w-4 h-4" />
      </button>
    </div>
  </div>
));

export const Footer = memo(() => {
  const { t } = useTranslation();

  const aboutLinks = [
    { to: '#', label: t('footer.about.aboutUs') },
    { to: '#', label: t('footer.about.careers') },
    { to: '#', label: t('footer.about.news') },
    { to: '/offers', label: t('footer.about.promotions') },
  ];

  const supportLinks = [
    { to: '#', label: t('footer.support.helpCenter') },
    { to: '#', label: t('footer.support.privacyPolicy') },
    { to: '#', label: t('footer.support.termsOfService') },
    { to: '#', label: t('footer.support.regulations') },
  ];

  return (
    <footer className="bg-[#0e1111] text-slate-300 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-0 w-full h-1 bg-premium-gradient"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div className="container pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl italic text-[#d4af37]" style={{ fontFamily: "'Instrument Serif', serif" }}>An Chuyến</span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              {t('footer.brandDesc')}
            </p>
            <SocialLinks />
          </div>

          {/* Links Columns */}
          <FooterLinkColumn title={t('footer.about.title')} links={aboutLinks} />
          <FooterLinkColumn title={t('footer.support.title')} links={supportLinks} />
          <ContactSection t={t} />
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-6">
            <img loading="lazy" src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=2" alt="DMCA" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <div className="h-6 px-2 bg-white/10 border border-white/10 flex items-center text-xs font-bold">{t('footer.registered')}</div>
          </div>
        </div>
      </div>
    </footer>
  );
});
