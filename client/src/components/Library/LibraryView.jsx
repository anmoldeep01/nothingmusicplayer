import { useContext, useMemo } from 'react';
import { PlayerContext } from '../../context/PlayerContext';

const LibraryView = () => {
    const { songs, playSong } = useContext(PlayerContext);

    // Generate automatic playlists based on songs
    const autoPlaylists = useMemo(() => {
        const playlists = [];

        // All Songs
        playlists.push({
            id: 'all-songs',
            name: 'All Songs',
            icon: '🎵',
            count: songs.length,
            songs: songs
        });

        // Group by Artist
        const artistMap = {};
        songs.forEach(song => {
            const artist = song.artist || 'Unknown Artist';
            if (!artistMap[artist]) {
                artistMap[artist] = [];
            }
            artistMap[artist].push(song);
        });

        // Add top artists (with more than 1 song)
        Object.entries(artistMap)
            .filter(([_, songs]) => songs.length > 1)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 10)
            .forEach(([artist, artistSongs]) => {
                playlists.push({
                    id: `artist-${artist}`,
                    name: artist,
                    icon: '👤',
                    count: artistSongs.length,
                    songs: artistSongs
                });
            });

        // Group by Album
        const albumMap = {};
        songs.forEach(song => {
            const album = song.album || 'Unknown Album';
            if (album !== 'Unknown Album') {
                if (!albumMap[album]) {
                    albumMap[album] = [];
                }
                albumMap[album].push(song);
            }
        });

        // Add albums
        Object.entries(albumMap)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 10)
            .forEach(([album, albumSongs]) => {
                playlists.push({
                    id: `album-${album}`,
                    name: album,
                    icon: '💿',
                    count: albumSongs.length,
                    songs: albumSongs
                });
            });

        return playlists;
    }, [songs]);

    const handlePlaylistClick = (playlist) => {
        // Play first song from playlist
        if (playlist.songs && playlist.songs.length > 0) {
            playSong(playlist.songs[0]);
        }
    };

    return (
        <div className="library-view" style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 70px - 100px)',
            background: '#0A0A0A',
            padding: '32px',
            overflowY: 'auto'
        }}>
            {/* Header */}
            <div style={{
                marginBottom: '32px'
            }}>
                <div style={{
                    fontFamily: 'var(--font-header)',
                    fontSize: '20px',
                    letterSpacing: '3px',
                    color: '#FF0000',
                    marginBottom: '8px'
                }}>
                    YOUR LIBRARY
                </div>
                <div style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '1px'
                }}>
                    {autoPlaylists.length} collections
                </div>
            </div>

            {/* Auto-generated Playlists */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
            }}>
                {autoPlaylists.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '16px',
                        color: 'rgba(255,255,255,0.3)'
                    }}>
                        <div style={{ fontSize: '48px', opacity: 0.5 }}>📚</div>
                        <div style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '14px',
                            letterSpacing: '1px'
                        }}>
                            NO MUSIC FOUND
                        </div>
                        <div style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.2)',
                            textAlign: 'center'
                        }}>
                            Add songs to your library
                        </div>
                    </div>
                ) : (
                    autoPlaylists.map(playlist => (
                        <div
                            key={playlist.id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '20px',
                                borderRadius: '16px',
                                border: playlist.id === 'all-songs' ? '1px solid rgba(255, 0, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                                background: playlist.id === 'all-songs' ? 'rgba(255, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                gap: '16px'
                            }}
                            onClick={() => handlePlaylistClick(playlist)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.3)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = playlist.id === 'all-songs' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Playlist Icon */}
                            <div style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                borderRadius: '12px',
                                background: playlist.id === 'all-songs' 
                                    ? 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(255, 0, 0, 0.05) 100%)'
                                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '48px',
                                boxShadow: playlist.id === 'all-songs' 
                                    ? '0 0 20px rgba(255, 0, 0, 0.2)' 
                                    : 'none'
                            }}>
                                {playlist.icon}
                            </div>

                            {/* Playlist Info */}
                            <div>
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#FFFFFF',
                                    marginBottom: '6px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontFamily: 'var(--font-body)'
                                }}>
                                    {playlist.name}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontFamily: 'var(--font-header)',
                                    letterSpacing: '1px'
                                }}>
                                    {playlist.count} SONGS
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LibraryView;
