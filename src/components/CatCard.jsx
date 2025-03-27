import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const CatCard = ({ cat, createdAt, onVote, isFavorite, onToggleFavorite }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = cat.photos && cat.photos.length > 0 ? cat.photos.map((img) => img.medium) : [cat.primary_photo_cropped.medium];
    const totalImages = images.length;

    useEffect(() => {
        console.log('Rendering cat:', cat.name);
    }, [cat]);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % totalImages);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);

    const description = cat.description || '';
    const breed = cat.breeds?.primary || 'Unknown';
    const secondaryBreed = cat.breeds?.secondary ? ` / ${cat.breeds.secondary}` : '';
    const color = cat.colors?.primary || 'Not specified';
    const location =
        cat.contact?.address?.city && cat.contact?.address?.state ? `${cat.contact.address.city}, ${cat.contact.address.state}` : 'Location unknown';
    const listedDate = createdAt ? new Date(createdAt).toLocaleString() : 'Unknown';

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
            {/* Name and favorite toggle */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-cat-accent, #ff8c00)' }}>
                    {cat.name}
                </h2>
                <button onClick={() => onToggleFavorite(cat.id)} className="text-2xl">
                    {isFavorite ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-500" />}
                </button>
            </div>

            <div className="relative">
                <img src={images[currentIndex]} alt={cat.name} className="w-full h-auto rounded mb-2" />
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

            <div className="text-sm text-gray-600 mb-2 space-y-1">
                <p>
                    <strong>Age:</strong> {cat.age} &nbsp;&nbsp;
                    <strong>Gender:</strong> {cat.gender}
                </p>
                <p>
                    <strong>Breed:</strong> {breed}
                    {secondaryBreed}
                </p>
                <p>
                    <strong>Color:</strong> {color}
                </p>
                <p>
                    <strong>Size:</strong> {cat.size}
                </p>
                <p>
                    <strong>Location:</strong> {location}
                </p>
                <p>
                    <strong>Listed:</strong> {listedDate}
                </p>
                {cat.distance && (
                    <p>
                        <strong>Distance:</strong> {cat.distance}
                    </p>
                )}
                <p>
                    <strong>Spayed/Neutered:</strong> {cat.attributes.spayed_neutered ? 'Yes' : 'No'} &nbsp;&nbsp;
                    <strong>House Trained:</strong> {cat.attributes.house_trained ? 'Yes' : 'No'}
                </p>
            </div>
            <p className="text-gray-700 mb-4">{description.substring(0, 150)}...</p>
            <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                    <button onClick={() => onVote(cat.id, 1)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                        Upvote
                    </button>
                    <button onClick={() => onVote(cat.id, -1)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Downvote
                    </button>
                </div>
                <span className="font-bold text-xl text-black">{cat.votes}</span>
            </div>
        </div>
    );
};

export default CatCard;
