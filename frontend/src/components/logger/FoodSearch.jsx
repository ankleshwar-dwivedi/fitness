import { useState, useCallback } from 'react';
import { searchFoods } from '../../api';
import Input from '../ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

// Debounce helper to prevent API calls on every keystroke
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

const FoodSearch = ({ onFoodSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const performSearch = async (searchQuery) => {
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const { data } = await searchFoods(searchQuery);
            setResults(data);
        } catch (error) {
            console.error("Food search failed", error);
        } finally {
            setLoading(false);
        }
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(debounce(performSearch, 300), []);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleSelect = (food) => {
        onFoodSelect(food);
        setQuery('');
        setResults([]);
    };

    return (
        <div className="relative">
            <Input 
                placeholder="Search for a food..."
                value={query}
                onChange={handleChange}
            />
            <AnimatePresence>
            {results.length > 0 && (
                <motion.ul 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg border z-10 max-h-60 overflow-y-auto"
                >
                    {results.map(food => (
                        <li 
                            key={food._id}
                            className="p-3 hover:bg-light cursor-pointer border-b"
                            onClick={() => handleSelect(food)}
                        >
                            <p className="font-semibold">{food.name}</p>
                            <p className="text-sm text-muted">{food.calories} kcal per 100g</p>
                        </li>
                    ))}
                </motion.ul>
            )}
            </AnimatePresence>
        </div>
    );
};

export default FoodSearch;