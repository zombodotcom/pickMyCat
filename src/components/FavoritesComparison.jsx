import React, { useState } from 'react';

const FavoritesComparison = ({ favorites, user }) => {
    // Initialize state by mapping each favorite to its embedded animal data.
    const [cats, setCats] = useState(
        favorites.map((fav) => ({
            ...fav._embedded.animal,
            votes: 0,
            createdAt: fav.created_at
        }))
    );

    // Filter out only the user's favorite cats.
    const userFavorites = cats.filter((cat) => user.favoriteIds.includes(cat.id));

    // Simple local vote handler.
    const handleVote = (id, delta) => {
        setCats((prevCats) => prevCats.map((cat) => (cat.id === id ? { ...cat, votes: cat.votes + delta } : cat)));
    };

    return (
        <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Compare Your Favorites</h2>
            {userFavorites.length === 0 ? (
                <p className="text-gray-600">You have not favorited any cats yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userFavorites.map((cat) => (
                        <div key={cat.id} className="border p-4 rounded shadow flex flex-col">
                            <img
                                src={cat.photos && cat.photos.length > 0 ? cat.photos[0].medium : cat.primary_photo_cropped.medium}
                                alt={cat.name}
                                className="w-full h-auto rounded mb-2"
                            />
                            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-cat-accent, #ff8c00)' }}>
                                {cat.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                <strong>Breed:</strong> {cat.breeds?.primary}
                                {cat.breeds?.secondary ? ` / ${cat.breeds.secondary}` : ''}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Age:</strong> {cat.age}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Votes:</strong> {cat.votes}
                            </p>
                            <div className="mt-auto flex space-x-2">
                                <button onClick={() => handleVote(cat.id, 1)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                                    Upvote
                                </button>
                                <button onClick={() => handleVote(cat.id, -1)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                    Downvote
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesComparison;
