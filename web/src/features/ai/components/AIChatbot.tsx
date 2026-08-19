import { useState, useRef, useEffect } from'react';
import { X, Send, Sparkles } from'lucide-react';
import { motion, AnimatePresence } from'framer-motion';
import { Button } from'../../../design-system/components/Button';
import { Input } from'../../../design-system/components/Input';
import api from'../../../lib/api';

export function AIChatbot() {
 const [isOpen, setIsOpen] = useState(false);
 const [messages, setMessages] = useState<{role:'user' |'ai', content: string}[]>([]);
 const [input, setInput] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
 }, [messages]);

 const handleSend = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!input.trim()) return;

 const userMessage = input.trim();
 setMessages(prev => [...prev, { role:'user', content: userMessage }]);
 setInput('');
 setIsTyping(true);

 try {
 const res = await api.post('/ai/chat', { message: userMessage });
 const aiReply = res.data.message ||'Xin lỗi, tôi chưa hiểu ý bạn.';
 setMessages(prev => [...prev, { role:'ai', content: aiReply }]);
 } catch (error) {
 setMessages(prev => [...prev, { role:'ai', content:'Hiện tại hệ thống AI đang quá tải, vui lòng thử lại sau.' }]);
 } finally {
 setIsTyping(false);
 }
 };

 return (
 <>
 <AnimatePresence>
 {!isOpen && (
 <motion.button
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 exit={{ scale: 0 }}
 onClick={() => setIsOpen(true)}
 className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 overflow-hidden group"
 >
 <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <Sparkles className="w-7 h-7 relative z-10" />
 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
 </motion.button>
 )}
 </AnimatePresence>

 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, y: 20, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.95 }}
 className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] z-50 flex flex-col overflow-hidden border border-slate-200"
 >
 {/* Header */}
 <div className="bg-gradient-to-r from-primary to-purple-600 p-4 text-white flex justify-between items-center shadow-md z-10 relative">
 <div className="flex items-center gap-2">
 <div className="bg-white/20 p-2 rounded-full">
 <Sparkles className="w-5 h-5 text-yellow-300" />
 </div>
 <div>
 <h3 className="font-extrabold text-sm leading-tight">LunaTravel Business AI Assistant</h3>
 <p className="text-[10px] text-white/80 font-medium">Trực tuyến</p>
 </div>
 </div>
 <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Chat Area */}
 <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3 relative">
 {messages.map((msg, idx) => (
 <div key={idx} className={`flex ${msg.role ==='user' ?'justify-end' :'justify-start'}`}>
 <div 
 className={`max-w-[85%] p-3 text-sm ${
 msg.role ==='user' 
 ?'bg-primary text-white shadow-sm' 
 :'bg-white border text-slate-800 shadow-sm font-medium'
 }`}
 >
 {msg.content}
 </div>
 </div>
 ))}
 {isTyping && (
 <div className="flex justify-start">
 <div className="bg-white border p-3 shadow-sm text-slate-500 flex items-center gap-1">
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay:'0.2s' }}></span>
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay:'0.4s' }}></span>
 </div>
 </div>
 )}
 <div ref={messagesEndRef} />
 </div>

 {/* Input Area */}
 <div className="p-3 bg-white border-t">
 <form onSubmit={handleSend} className="flex gap-2 relative">
 <Input 
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder="Hỏi tôi bất cứ điều gì..." 
 className="pr-10 rounded-full bg-slate-100 border-transparent focus:bg-white transition-all text-sm h-10"
 />
 <Button 
 type="submit" 
 size="icon" 
 disabled={!input.trim() || isTyping}
 className="rounded-full w-10 h-10 shrink-0 absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white hover:bg-primary/90"
 >
 <Send className="w-4 h-4" />
 </Button>
 </form>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </>
 );
}
