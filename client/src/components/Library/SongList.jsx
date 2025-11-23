import { useContext, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import AlbumArt from './AlbumArt';

const SongList = ({ searchQuery, selectedPlaylist, onBack }) => {
    const { songs, playSong, currentSong, addToQueue } = useContext(PlayerContext);
    const [hoveredSong, setHoveredSong] = useState(null);

    // Filter by playlist if selected
    let displaySongs = songs;
    if (selectedPlaylist && selectedPlaylist !== 'All Songs') {
        displaySongs = songs.filter(song => song.playlist === selectedPlaylist);
    }

    // Then filter by search query
    const filteredSongs = displaySongs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Debug: Log songs count
    console.log('SongList - Total songs:', songs.length, 'Display:', displaySongs.length, 'Filtered:', filteredSongs.length);

    // Show loading or empty state
    if (songs.length === 0) {
        return (
            <div className="song-list" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎵</div>
                    <div style={{ fontFamily: 'var(--font-header)', fontSize: '14px', letterSpacing: '2px' }}>
                        LOADING SONGS...
                    </div>
                </div>
            </div>
        );
    }

    if (filteredSongs.length === 0) {
        return (
            <div className="song-list" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                    <div style={{ fontFamily: 'var(--font-header)', fontSize: '14px', letterSpacing: '2px' }}>
                        NO SONGS FOUND
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="song-list">
            {filteredSongs.map((song, index) => {
                const isActive = currentSong?.id === song.id;
                const isHovered = hoveredSong === song.id;

                return (
                    <div
                        key={song.id}
                        data-index={index}
                        className={`song-card ${isActive ? 'active' : ''}`}
                        onMouseEnter={() => setHoveredSong(song.id)}
                        onMouseLeave={() => setHoveredSong(null)}
                    >
                        <div
                            onClick={() => playSong(song)}
                            style={{ width: '100%' }}
                        >
                            {/* Album Art - always visible */}
                            <AlbumArt
                                song={song}
                                isVisible={true}
                                isActive={isActive}
                            />

                            {/* Song Info */}
                            <div className="song-info">
                                <div className="song-title">{song.title}</div>
                                <div className="song-artist">{song.artist}</div>
                            </div>
                        </div>

                        {/* Add to Queue Button */}
                        <button
                            className="add-to-queue-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToQueue(song);
                            }}
                            aria-label={`Add ${song.title} to queue`}
                        >
                            +
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default SongList;
