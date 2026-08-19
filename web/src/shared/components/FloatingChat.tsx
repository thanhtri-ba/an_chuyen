import { useState, useRef, useEffect } from'react';
import { motion, AnimatePresence } from'framer-motion';
import { MessageCircle, X, Send, Sparkles, User as UserIcon } from'lucide-react';

export function FloatingChat() {
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState<{ role:'ai' |'user'; content: string }[]>([]);
 const [input, setInput] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (isOpen) {
 messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
 }
 }, [messages, isOpen, isTyping]);

 const handleSend = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!input.trim()) return;

 const userMessage = input.trim();
 setMessages(prev => [...prev, { role:'user', content: userMessage }]);
 setInput('');
 setIsTyping(true);

 try {
 const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
 const response = await fetch(`${baseUrl}/api/ai/chat`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
 'X-App-Source': 'web'
 },
 body: JSON.stringify({ message: userMessage })
 });

 if (response.ok) {
 const data = await response.json();
 setMessages(prev => [...prev, { role:'ai', content: data.response || data.message || 'Xin lỗi, tôi không thể trả lời ngay bây giờ.' }]);
 } else {
 setMessages(prev => [...prev, { role:'ai', content:'Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.' }]);
 }
 } catch (error) {
 console.error('AI chat error:', error);
 setMessages(prev => [...prev, { role:'ai', content:'Kết nối AI không khả dụng. Vui lòng thử lại sau.' }]);
 } finally {
 setIsTyping(false);
 }
 };

 return (
 <div className="fixed bottom-6 right-6 z-50">
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, scale: 0.8, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.8, y: 20 }}
 transition={{ type:"spring", stiffness: 250, damping: 20 }}
 className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
 >
 {/* Header */}
 <div className="bg-gradient-to-r from-primary to-blue-600 p-4 text-white flex justify-between items-center shadow-md relative z-10">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
 <Sparkles className="w-5 h-5 text-white" />
 </div>
 <div>
 <h3 className="font-bold text-lg leading-tight">LunaTravel Business AI</h3>
 <p className="text-white/80 text-xs flex items-center gap-1">
 <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
 </p>
 </div>
 </div>
 <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
 <X className="w-5 h-5" />
 </button>
 </div>
 
 {/* Messages Area */}
 <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
 {messages.map((msg, idx) => (
 <div key={idx} className={`flex gap-3 ${msg.role ==='user' ?'flex-row-reverse' :''}`}>
 {/* Avatar */}
 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role ==='ai' ?'bg-primary text-primary-foreground' :'bg-gray-200 text-gray-500'}`}>
 {msg.role ==='ai' ? <Sparkles className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
 </div>
 
 {/* Bubble */}
 <div className={`max-w-[75%] px-4 py-2.5 text-sm ${msg.role ==='user' ?'bg-primary text-primary-foreground' :'bg-white text-gray-800 border border-gray-100 shadow-sm'} leading-relaxed`}>
 {msg.content}
 </div>
 </div>
 ))}
 
 {/* Typing Indicator */}
 {isTyping && (
 <div className="flex gap-3">
 <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
 <Sparkles className="w-4 h-4" />
 </div>
 <div className="bg-white px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-1">
 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay:'0ms' }}></span>
 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay:'150ms' }}></span>
 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay:'300ms' }}></span>
 </div>
 </div>
 )}
 <div ref={messagesEndRef} />
 </div>

 {/* Input Area */}
 <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
 <input
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Nhập câu hỏi của bạn..."
 className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
 />
 <button 
 type="submit" 
 disabled={!input.trim() || isTyping}
 className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
 >
 <Send className="w-4 h-4 -ml-0.5" />
 </button>
 </form>
 </motion.div>
 )}
 </AnimatePresence>

 <motion.button
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 onClick={() => setIsOpen(!isOpen)}
 className="relative group bg-white hover:bg-gray-100 text-gray-900 p-4 rounded-full shadow-lg shadow-white/20 transition-colors flex items-center justify-center"
 >
 <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
 {isOpen ? <X className="w-7 h-7 relative z-10" /> : <MessageCircle className="w-7 h-7 relative z-10" />}
 
 {/* Tooltip */}
 {!isOpen && (
 <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-bold py-2 px-4 shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
 Chat với AI
 {/* Arrow */}
 <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-[-45deg]"></div>
 </div>
 )}
 </motion.button>
 </div>
 );
}
