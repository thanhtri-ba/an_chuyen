import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { DestinationDetail } from '../../features/destinations/data';

interface Props {
  destinations: DestinationDetail[];
}

// Figma node 29:299 ("Second"): black ground, huge serif title, tall portrait photos.
// Extended into a pinned horizontal-scroll gallery: the section holds extra vertical
// scroll height, and that vertical progress drives the card row's horizontal position —
// classic "scroll down, cards run sideways" effect, so it also scales to any card count.
//
// Driven by a plain scroll listener + rAF (not framer-motion's useScroll) — the
// hooked version silently never updates when the page is scrolled programmatically
// or via synthetic wheel events, so a manual listener is the reliable path.
export function TopDestinations({ destinations }: Props) {
  const items = destinations;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  // Measured from the real rendered track (not a hardcoded card-width formula) — card
  // width, gap, and padding all change across breakpoints, so anything computed by hand
  // silently drifts out of sync and the drag stops short of the last card.
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    let raf = 0;
    let last = -1;
    const update = () => {
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
        if (Math.abs(p - last) > 0.001) {
          last = p;
          setProgress(p);
        }
        if (window.innerWidth !== viewportWidth) setViewportWidth(window.innerWidth);
        const measured = trackRef.current?.scrollWidth;
        if (measured && measured !== trackWidth) setTrackWidth(measured);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [items.length, viewportWidth, trackWidth]);

  // Track starts at its natural resting position (first card already in view, as many
  // cards as fit showing right away — no empty/off-screen wait at the top of the
  // section) and drags further left as you scroll, revealing the remaining cards from
  // the right edge — "kéo từ phải sang trái" describes that reveal direction, not an
  // empty starting frame.
  //
  // The horizontal drag only consumes the first DRAG_FRACTION of the section's scroll
  // range; the remainder holds the last card in place (a settle pause) before the
  // section naturally unpins and normal vertical scroll continues — so reaching the
  // last card stops cleanly instead of sliding straight into the next section.
  const DRAG_FRACTION = 0.7;
  const dragProgress = Math.min(1, progress / DRAG_FRACTION);
  const xStart = 0;
  // End position: the LAST card's right edge should land flush against the section's
  // own right padding (matching the track's own pl-6/lg:pl-12), not the whole track
  // pushed an extra viewport-width further left than that.
  const EDGE_PADDING = viewportWidth >= 1024 ? 48 : 24; // matches lg:px-12 / px-6
  const xEnd = Math.min(0, viewportWidth - trackWidth - EDGE_PADDING);
  const x = xStart + dragProgress * (xEnd - xStart);

  if (items.length === 0) return null;

  // Single card: no scroll room needed, just center it in a normal-height section.
  if (items.length <= 1) {
    return (
      <section className="bg-[#0d1710] px-6 lg:px-12 py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center">
          <Heading />
          <div className="flex justify-center w-full mb-14">
            <Card d={items[0]} i={0} />
          </div>
          <Blurb />
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative bg-[#0d1710]" style={{ height: `${100 + items.length * 60}vh` }}>
      {/* No overflow-* on this h-screen sticky box at all — per the CSS overflow
          spec, clipping only one axis (e.g. overflow-x-hidden) silently forces
          the OTHER axis to compute as "auto" even if you explicitly write
          "overflow-y-visible", turning this box into its own scroll container
          with a visible scrollbar the moment content (the Blurb, on shorter
          viewports) exceeds h-screen. The horizontal clip the draggable card
          row needs belongs on that row itself instead, where it can't affect Y. */}
      <div className="sticky top-0 h-screen flex flex-col justify-center">
        <Heading />
        <motion.div ref={trackRef} className="flex gap-6 pl-6 lg:pl-12 w-max overflow-x-hidden" style={{ x }}>
          {items.map((d, i) => <Card key={d.slug} d={d} i={i} />)}
        </motion.div>
        <div className="px-6 lg:px-12 mt-8 lg:mt-10">
          <Blurb />
        </div>
      </div>
    </section>
  );
}

function Heading() {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="font-sans font-medium text-white text-5xl md:text-7xl text-center mb-16 px-6"
    >
      Điểm đến hàng đầu
    </motion.h2>
  );
}

function Blurb() {
  return (
    <p className="font-sans text-white/85 text-3xl md:text-5xl text-center leading-[1.6] tracking-wide max-w-4xl mx-auto">
      Từ cao nguyên sương mù đến bãi biển nắng vàng — mỗi tuyến đường An Chuyến đưa bạn đến đều được chọn lọc kỹ, xe tốt, tài xế quen thuộc cung đường, đúng giờ khởi hành như đã hẹn.
    </p>
  );
}

function Card({ d, i }: { d: DestinationDetail; i: number }) {
  return (
    <motion.div
      // No initial/whileInView fade-in here (unlike other cards on the page) —
      // this card sits inside the sticky, horizontally-dragged row, and
      // Framer Motion's viewport intersection check for whileInView doesn't
      // reliably fire once an element is revealed by a CSS transform (the
      // `x` drag) rather than real page scroll. It was getting stuck at its
      // initial opacity: 0 forever — the card never became visible. The
      // drag/reveal itself is already the section's "entrance", so cards
      // just render visible immediately.
      whileHover={{ y: -6 }}
      className="group relative shrink-0 w-[300px] sm:w-[340px] h-[460px] rounded-lg overflow-hidden bg-white/5 border border-white/10"
    >
      <Link to={`/destinations/${d.slug}`} className="absolute inset-0">
        <img
          src={d.heroImg}
          alt={d.location}
          className="w-full h-full object-cover opacity-0 transition-[opacity,transform] duration-700 group-hover:scale-110 [&.loaded]:opacity-100"
          loading="lazy"
          onLoad={e => e.currentTarget.classList.add('loaded')}
          // A dead image URL (404, expired Unsplash/Pexels link...) never fires
          // onLoad, so the card would stay invisible forever on a permanently
          // dark tile with no indication anything went wrong — reveal it anyway
          // so at least the title/gradient/card frame show instead of a blank box.
          onError={e => e.currentTarget.classList.add('loaded')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="font-sans text-2xl">{d.location}</h3>
        </div>
      </Link>
    </motion.div>
  );
}
