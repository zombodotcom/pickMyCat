// CatList.jsx
import React, { useState } from 'react';
import CatCard from './CatCard';

const CatList = ({ favorites }) => {
    // Initialize state: add a 'votes' field and store createdAt.
    const [cats, setCats] = useState(
        favorites.map((fav) => ({
            ...fav._embedded.animal,
            votes: 0,
            createdAt: fav.created_at
        }))
    );

    // Async handler to call Netlify Function on vote change.
    const handleVote = async (id, delta) => {
        try {
            const response = await fetch('/.netlify/functions/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, delta })
            });
            const data = await response.json();
            // Update the cat's vote count based on the API response.
            setCats((prevCats) => prevCats.map((cat) => (cat.id === id ? { ...cat, votes: data.votes } : cat)));
        } catch (error) {
            console.error('Vote error:', error);
        }
    };

    // Sort cats by votes descending.
    const sortedCats = [...cats].sort((a, b) => b.votes - a.votes);

    return (
        <div>
            {/* Optional: Debug Export Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => {
                        const dataStr = JSON.stringify(cats, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'debug_cats.json';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                    Export Debug Data
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCats.map((cat) => (
                    <CatCard key={cat.id} cat={cat} createdAt={cat.createdAt} onVote={handleVote} />
                ))}
            </div>
        </div>
    );
};

export default CatList;
