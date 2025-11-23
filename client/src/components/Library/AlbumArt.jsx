import { useState } from 'react';

/**
 * AlbumArt Component
 * Displays album art with loading states, fallbacks, and play indicator
 * 
 * @param {Object} props
 * @param {Object} props.song - Song object with albumArt, title properties
 * @param {boolean} props.isVisible - Whether the card is visible in viewport (for lazy loading)
 * @param {boolean} props.isActive - Whether this song is currently playing
 */
const AlbumArt = ({ song, isVisible, isActive }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleImageError = () => {
        setHasError(true);
        console.warn(`Failed to load album art for: ${song.title}`);
    };

    return (
        <div className="album-art-container">
            {/* Loading State - Shimmer Animation */}
            {!isLoaded && !hasError && song.albumArt && isVisible && (
                <div className="album-art-loading">
                    <div className="loading-shimmer" />
                </div>
            )}

            {/* Album Art Image - Only load if visible */}
            {song.albumArt && isVisible && !hasError && (
                <img
                    src={song.albumArt}
                    alt={`${song.title} by ${song.artist} album art`}
                    className={`album-art-image ${isLoaded ? 'loaded' : ''}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />
            )}

            {/* Fallback Icon - Show when no album art or error */}
            {(!song.albumArt || hasError || !isVisible) && (
                <div className="album-art-fallback">
                    <span className="fallback-icon" aria-hidden="true">♪</span>
                </div>
            )}

            {/* Play Indicator Overlay - Show when song is active */}
            {isActive && (
                <div className="play-indicator-overlay" role="status" aria-label="Now playing">
                    <span className="play-icon" aria-hidden="true">▶</span>
                </div>
            )}
        </div>
    );
};

export default AlbumArt;
