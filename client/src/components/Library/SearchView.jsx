import { useContext, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import GlassCard from '../UI/GlassCard';

const SearchView = () => {
    const { songs, playSong, currentSong, addToQueue } = useContext(PlayerContext);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="search-view" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'var(--nothing-black)'
        }}>
            {/* Search Input */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid var(--nothing-border)'
            }}>
                <input
                    type="text"
                    placeholder="SEARCH SONGS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'var(--nothing-glass)',
                        border: '1px solid var(--nothing-border)',
                        borderRadius: 'var(--radius-xl)',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        fontFamily: 'var(--font-body)',
                        outline: 'none',
                        transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--nothing-red)';
                        e.target.style.boxShadow = '0 0 12px var(--nothing-red-glow)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--nothing-border)';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>

            {/* Results */}
            <div className="song-list" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {searchQuery === '' ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '16px',
                        color: 'rgba(255,255,255,0.3)'
                    }}>
                        <div style={{ fontSize: '48px', opacity: 0.5 }}>🔍</div>
                        <div style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '14px',
                            letterSpacing: '1px'
                        }}>
                            SEARCH YOUR MUSIC
                        </div>
                        <div style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.2)',
                            textAlign: 'center'
                        }}>
                            Find songs by title, artist, or album
                        </div>
                    </div>
                ) : filteredSongs.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '16px',
                        color: 'rgba(255,255,255,0.3)'
                    }}>
                        <div style={{ fontSize: '48px', opacity: 0.5 }}>❌</div>
                        <div style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '14px',
                            letterSpacing: '1px'
                        }}>
                            NO RESULTS FOUND
                        </div>
                        <div style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.2)'
                        }}>
                            Try a different search term
                        </div>
                    </div>
                ) : (
                    filteredSongs.map(song => (
                        <GlassCard
                            key={song.id}
                            data-playing={currentSong?.id === song.id}
                            className="song-card"
                        >
                            <div onClick={() => playSong(song)} style={{ width: '100%' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '10px',
                                    background: song.albumArt ? `url(${song.albumArt})` : 'var(--nothing-glass)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '1px solid var(--nothing-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    color: 'var(--text-secondary)'
                                }}>
                                    {!song.albumArt && '♪'}
                                </div>
                                <div>
                                    <div>{song.title}</div>
                                    <div>{song.artist}</div>
                                </div>
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToQueue(song);
                                }}
                                className="add-to-queue-btn"
                            >+</div>
                        </GlassCard>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchView;
