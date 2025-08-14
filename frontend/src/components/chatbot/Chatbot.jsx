import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { processChatbotMessage } from '../../api/index';


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentState, setCurrentState] = useState('INITIAL');
    const [options, setOptions] = useState([]);
    const [expectsInput, setExpectsInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const addMessage = (text, sender, newOptions = []) => {
        setMessages(prev => [...prev, { text, sender }]);
        setOptions(newOptions);
    };

      const handleSend = async (payload) => {
        setLoading(true);
        const currentUserInput = payload.userInput || payload.selectedOption;
        
        // **THE FIX IS HERE:** Immediately add user message/action to the state.
        if (currentUserInput) {
            addMessage(currentUserInput, 'user');
        }

        setInput('');
        setOptions([]);

        try {
            const { data } = await processChatbotMessage({ ...payload, currentState });
            addMessage(data.message, 'bot', data.options);
            setCurrentState(data.newState);
            setExpectsInput(data.expectsUserInput);
        } catch (error) {
            addMessage('Sorry, I seem to be having trouble connecting.', 'bot');
        } finally {
            setLoading(false);
        }
    };

    const handleInitialMessage = () => {
        setIsOpen(true);
        if (messages.length === 0) {
            handleSend({});
        }
        
        
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={isOpen? () =>setIsOpen(false) : handleInitialMessage }
                className="fixed bottom-6 right-6 bg-dark hover:bg-danger text-white p-4 rounded-full shadow-lg z-50"
            >
                <MessageSquare size={28} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.5 }}
                        className="fixed bottom-24 right-6 w-80 h-[28rem] bg-white rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden"
                    >
                        <header className="p-4 bg-black text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot />
                                <h3 className="font-bold">FitTrack Assistant</h3>
                            </div>
                            <button className="text-light hover:text-danger" onClick={() => setIsOpen(false)}><X  size={20}/></button>
                        </header>
                        
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'bot' ? 'bg-light text-dark ' : 'bg-gray  text-white'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="flex justify-start"><div className="p-3 rounded-lg bg-light">...</div></div>}
                        </div>

                        <footer className="p-2 border-t">
                            {options.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {options.map(opt => <button key={opt} onClick={() => handleSend({ selectedOption: opt })} className="bg-light hover:bg-gray/20 text-sm p-2 rounded-lg">{opt}</button>)}
                                </div>
                            )}
                            {expectsInput && (
                                <form onSubmit={(e) => { e.preventDefault(); handleSend({ userInput: input });}} className="flex gap-2">
                                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 p-2 border rounded-lg text-sm" />
                                    <button type="submit" className="bg-primary text-white p-2 rounded-lg"><Send size={18} /></button>
                                </form>
                            )}
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;