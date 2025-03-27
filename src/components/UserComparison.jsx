import React, { useState, useEffect } from 'react';
import CatCard from './CatCard';

const UserComparison = ({ favorites, initialUser }) => {
    // Initialize cat data from favorites JSON.
    const [cats, setCats] = useState(
        favorites.map((fav) => ({
            ...fav._embedded.animal,
            votes: 0,
            createdAt: fav.created_at
        }))
    );

    // Manage user favorites using localStorage if available.
    const [userFavorites, setUserFavorites] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('userFavorites');
            return stored ? JSON.parse(stored) : initialUser.favoriteIds || [];
        }
        return initialUser.favoriteIds || [];
    });

    // Persist userFavorites to localStorage on change.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
        }
    }, [userFavorites]);

    // New sort mode state. Options: "default", "votes", "name", "listedDate"
    const [sortMode, setSortMode] = useState('default');

    const handleVote = (id, delta) => {
        setCats((prevCats) => prevCats.map((cat) => (cat.id === id ? { ...cat, votes: cat.votes + delta } : cat)));
    };

    const toggleFavorite = (catId) => {
        setUserFavorites((prev) => (prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]));
    };

    // Create a sorted copy based on the selected sort mode.
    let sortedCats = [...cats];
    if (sortMode === 'votes') {
        sortedCats.sort((a, b) => b.votes - a.votes);
    } else if (sortMode === 'name') {
        sortedCats.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'listedDate') {
        sortedCats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    // In "default" mode, preserve the original order.

    // Split the cats into favorites and others.
    const favoriteCats = sortedCats.filter((cat) => userFavorites.includes(cat.id));
    const otherCats = sortedCats.filter((cat) => !userFavorites.includes(cat.id));

    return (
        <div>
            {/* Sorting dropdown */}
            <div className="mb-4 flex items-center">
                <label className="mr-2 font-semibold">Sort By:</label>
                <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} className="border p-1 rounded">
                    <option value="default">Default Order</option>
                    <option value="votes">Votes</option>
                    <option value="name">Name</option>
                    <option value="listedDate">Listed Date</option>
                </select>
            </div>

            {/* Favorites Section (compact, horizontal scroll) */}
            {favoriteCats.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-2">Your Favorites</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {favoriteCats.map((cat) => (
                            <div key={cat.id} className="flex-none w-64">
                                <CatCard cat={cat} createdAt={cat.createdAt} onVote={handleVote} isFavorite={true} onToggleFavorite={toggleFavorite} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Cat List Section (no extra title) */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherCats.map((cat) => (
                        <CatCard key={cat.id} cat={cat} createdAt={cat.createdAt} onVote={handleVote} isFavorite={false} onToggleFavorite={toggleFavorite} />
                    ))}
                </div>
            </div>

            {sortedCats.length === 0 && <p className="text-gray-600">No cats available.</p>}
        </div>
    );
};

export default UserComparison;
