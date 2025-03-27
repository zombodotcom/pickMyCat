import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const CatCard = ({ cat, createdAt, onVote, isFavorite, onToggleFavorite }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMore, setShowMore] = useState(false);

    // Destructure common values for clarity.
    const { name, age, gender, size, votes } = cat;
    const breed = cat.breeds?.primary || 'Unknown';
    const secondaryBreed = cat.breeds?.secondary ? ` / ${cat.breeds.secondary}` : '';
    const color = cat.colors?.primary || 'Not specified';
    const location =
        cat.contact?.address?.city && cat.contact?.address?.state ? `${cat.contact.address.city}, ${cat.contact.address.state}` : 'Location unknown';
    const listedDate = createdAt ? new Date(createdAt).toLocaleString() : 'Unknown';
    const { spayed_neutered, house_trained, special_needs, shots_current } = cat.attributes;

    // Create a details array for DRY rendering in a table.
    const details = [
        { label: 'Breed', value: `${breed}${secondaryBreed}` },
        { label: 'Color', value: color },
        { label: 'Size', value: size },
        { label: 'Listed', value: listedDate },
        { label: 'Spayed/Neutered', value: spayed_neutered ? 'Yes' : 'No' },
        { label: 'House Trained', value: house_trained ? 'Yes' : 'No' },
        { label: 'Special Needs', value: special_needs ? 'Yes' : 'No' },
        { label: 'Shots Current', value: shots_current ? 'Yes' : 'No' }
    ];

    // Image carousel: Use photos array if available; fallback to primary cropped.
    const images = cat.photos && cat.photos.length > 0 ? cat.photos.map((img) => img.medium) : [cat.primary_photo_cropped.medium];
    const totalImages = images.length;

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % totalImages);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            {/* Header: Name and Favorite Toggle */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-cat-accent, #ff8c00)' }}>
                    {name}
                </h2>
                <button onClick={() => onToggleFavorite(cat.id)} className="text-2xl">
                    {isFavorite ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-500" />}
                </button>
            </div>

            {/* Image Carousel */}
            <div className="relative mt-2">
                <img src={images[currentIndex]} alt={name} className="w-full h-auto rounded mb-2" />
                {totalImages > 1 && (
                    <>
                        <button onClick={handlePrev} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-l">
                            &lt;
                        </button>
                        <button onClick={handleNext} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded-r">
                            &gt;
                        </button>
                    </>
                )}
                <div className="text-xs text-gray-500 text-right mt-1">{totalImages > 1 ? `Image ${currentIndex + 1} of ${totalImages}` : '1 image'}</div>
            </div>

            {/* Basic Info Section */}
            <div className="text-sm text-gray-600 space-y-1">
                <p>
                    <strong>Age:</strong> {age} &nbsp;&nbsp;
                    <strong>Gender:</strong> {gender}
                </p>
                <p>
                    <strong>Location:</strong> {location}
                </p>
                {cat.distance && (
                    <p>
                        <strong>Distance:</strong> {cat.distance}
                    </p>
                )}
            </div>

            {/* Vote and Favorite Group */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                    <button onClick={() => onVote(cat.id, 1)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                        Upvote
                    </button>
                    <button onClick={() => onVote(cat.id, -1)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Downvote
                    </button>
                </div>
                <span className="font-bold text-xl text-black">{votes}</span>
            </div>

            {/* More Details Toggle */}
            <div className="mt-4">
                <button onClick={() => setShowMore(!showMore)} className="w-full text-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                    {showMore ? 'Hide Details' : 'More Details'}
                </button>
            </div>

            {/* Collapsible More Details Table */}
            {showMore && (
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-700 border">
                        <tbody>
                            {details.map((detail, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="px-4 py-2 font-semibold">{detail.label}</td>
                                    <td className="px-4 py-2">{detail.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Site Button */}
            <div className="mt-4">
                <a
                    href={cat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    View Site
                </a>
            </div>
        </div>
    );
};

export default CatCard;
