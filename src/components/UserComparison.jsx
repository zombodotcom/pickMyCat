import React, { useState, useEffect } from 'react';
import CatCard from './CatCard';

const UserComparison = ({ favorites, initialUser }) => {
    // Initialize cat data from JSON.
    const [cats, setCats] = useState(
        favorites.map((fav) => ({
            ...fav._embedded.animal,
            votes: 0,
            createdAt: fav.created_at
        }))
    );

    // Manage user favorites from localStorage or use initialUser.favoriteIds.
    const [userFavorites, setUserFavorites] = useState(() => {
        const stored = localStorage.getItem('userFavorites');
        return stored ? JSON.parse(stored) : initialUser.favoriteIds || [];
    });

    // Persist userFavorites to localStorage on change.
    useEffect(() => {
        localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
    }, [userFavorites]);

    const handleVote = (id, delta) => {
        setCats((prevCats) => prevCats.map((cat) => (cat.id === id ? { ...cat, votes: cat.votes + delta } : cat)));
    };

    const toggleFavorite = (catId) => {
        setUserFavorites((prev) => (prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]));
    };

    // Sort cats by votes descending.
    const sortedCats = [...cats].sort((a, b) => b.votes - a.votes);
    const favoriteCats = sortedCats.filter((cat) => userFavorites.includes(cat.id));
    const otherCats = sortedCats.filter((cat) => !userFavorites.includes(cat.id));

    return (
        <div>
            {favoriteCats.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-4">Your Favorites</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteCats.map((cat) => (
                            <CatCard key={cat.id} cat={cat} createdAt={cat.createdAt} onVote={handleVote} isFavorite={true} onToggleFavorite={toggleFavorite} />
                        ))}
                    </div>
                </div>
            )}
            {otherCats.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold mb-4">Other Cats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherCats.map((cat) => (
                            <CatCard
                                key={cat.id}
                                cat={cat}
                                createdAt={cat.createdAt}
                                onVote={handleVote}
                                isFavorite={false}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                </div>
            )}
            {sortedCats.length === 0 && <p className="text-gray-600">No cats available.</p>}
        </div>
    );
};

export default UserComparison;
