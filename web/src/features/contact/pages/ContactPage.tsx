import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans pb-32">
      
      {/* ─── INTRO HERO ─── */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Top Divider */}
          <div className="h-px bg-gradient-to-r from-[#d4af37] to-transparent mb-12 max-w-2xl" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#d4af37] mb-6">
                Support & Contact
              </p>
              <h1 className="font-display font-medium text-6xl md:text-7xl lg:text-[7.5rem] leading-[0.9] text-[#1a1a1a]">
                We'd love to <br />
                <em className="text-[#d4af37] font-serif italic">hear from you</em>
              </h1>
            </div>
            <p className="max-w-xs text-gray-500 leading-relaxed md:text-right pb-3 font-medium text-lg">
              Have a question or need assistance? Our team is here to help you navigate your journey.
            </p>
          </div>

          {/* Bottom Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-16 max-w-4xl ml-auto" />
        </motion.div>
      </section>

      {/* ─── CONTACT INFO CARDS ─── */}
      <section className="px-6 lg:px-12 max-w-[1400px] mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-6"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-2xl text-[#1a1a1a] mb-2">Email Us</h3>
              <p className="text-gray-500 font-medium mb-4">Our friendly team is here to help.</p>
              <a href="mailto:support@roamora.com" className="text-primary font-bold hover:text-primary-hover transition-colors">
                support@roamora.com
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-6"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-2xl text-[#1a1a1a] mb-2">Call Us</h3>
              <p className="text-gray-500 font-medium mb-4">Mon-Fri from 8am to 5pm.</p>
              <a href="tel:+84900123456" className="text-primary font-bold hover:text-primary-hover transition-colors">
                +84 (900) 123-456
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-6"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-medium text-2xl text-[#1a1a1a] mb-2">Office</h3>
              <p className="text-gray-500 font-medium mb-4">Come say hello at our HQ.</p>
              <div className="text-primary font-bold">
                123 Điện Biên Phủ,<br/>
                Quận Bình Thạnh, TP.HCM
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── CONTACT FORM SECTION ─── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="px-6 lg:px-12 max-w-[1400px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <img 
              src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2000&auto=format&fit=crop" 
              alt="Contact Support" 
              className="w-full h-[600px] object-cover rounded-[3rem] shadow-sm"
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-16 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="mb-12">
              <h2 className="font-display font-medium text-4xl md:text-5xl text-[#1a1a1a] leading-none mb-4">
                Send us a message
              </h2>
              <p className="text-gray-500 font-medium text-lg">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form className="flex flex-col gap-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-2.5 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium text-[#1a1a1a] outline-none transition-colors focus:border-primary focus:bg-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block mb-2.5 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium text-[#1a1a1a] outline-none transition-colors focus:border-primary focus:bg-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2.5 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium text-[#1a1a1a] outline-none transition-colors focus:border-primary focus:bg-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block mb-2.5 text-[11px] font-bold tracking-widest uppercase text-gray-500">
                  Message
                </label>
                <textarea
                  placeholder="How can we help?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm font-medium text-[#1a1a1a] outline-none transition-colors focus:border-primary focus:bg-white placeholder:text-gray-400 resize-none h-32"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white font-bold tracking-widest uppercase px-12 py-5 rounded-full text-xs transition-all duration-200 shadow-md hover:shadow-lg mt-4"
              >
                Send Message <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </motion.section>
    </div>
  );
}
