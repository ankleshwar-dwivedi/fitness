import { useState, useCallback } from 'react';
import Input from '../ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from '../../utils/debounce'; // <-- IMPORT THE UTILITY

const SearchableSelect = ({ onSearch, value, onChange, placeholder }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(debounce(async (searchQuery) => {
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const data = await onSearch(searchQuery);
            setResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    }, 300), [onSearch]);

    const handleChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        onChange(null); // Clear selection when user types
        debouncedSearch(newQuery);
    };

    const handleSelect = (item) => {
        onChange(item);
        setQuery(item.label);
        setResults([]);
    };

    return (
        <div className="relative">
            <Input 
                placeholder={placeholder}
                value={value ? value.label : query}
                onChange={handleChange}
                autoComplete="off"
            />
            <AnimatePresence>
            {results.length > 0 && (
                <motion.ul 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg border z-10 max-h-60 overflow-y-auto"
                >
                    {results.map(item => (
                        <li 
                            key={item.value}
                            className="p-3 hover:bg-light cursor-pointer border-b"
                            onClick={() => handleSelect(item)}
                        >
                            {item.label}
                        </li>
                    ))}
                </motion.ul>
            )}
            </AnimatePresence>
        </div>
    );
};

export default SearchableSelect;