import { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import './PlaylistList.css';

const PlaylistList = ({ onPlaylistSelect }) => {
    const { playlists, songs } = useContext(PlayerContext);

    // Count songs per playlist
    const getPlaylistSongCount = (playlistName) => {
        return songs.filter(song => song.playlist === playlistName).length;
    };

    // Get first album art from playlist
    const getPlaylistCover = (playlistName) => {
        const playlistSongs = songs.filter(song => song.playlist === playlistName);
        return playlistSongs[0]?.albumArt || null;
    };

    if (playlists.length === 0) {
        return (
            <div className="playlist-list" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                    <div style={{ fontFamily: 'var(--font-header)', fontSize: '14px', letterSpacing: '2px' }}>
                        NO PLAYLISTS FOUND
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
                        Create folders in the songs directory to organize your music
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="playlist-list">
            {/* All Songs Card */}
            <div
                className="playlist-card"
                onClick={() => onPlaylistSelect('All Songs')}
            >
                <div className="playlist-cover">
                    <div className="playlist-icon">🎵</div>
                </div>
                <div className="playlist-info">
                    <div className="playlist-name">All Songs</div>
                    <div className="playlist-count">{songs.length} songs</div>
                </div>
            </div>

            {/* Playlist Cards */}
            {playlists.map(playlist => (
                <div
                    key={playlist}
                    className="playlist-card"
                    onClick={() => onPlaylistSelect(playlist)}
                >
                    <div className="playlist-cover">
                        {getPlaylistCover(playlist) ? (
                            <img src={getPlaylistCover(playlist)} alt={playlist} />
                        ) : (
                            <div className="playlist-icon">📁</div>
                        )}
                    </div>
                    <div className="playlist-info">
                        <div className="playlist-name">{playlist}</div>
                        <div className="playlist-count">{getPlaylistSongCount(playlist)} songs</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PlaylistList;
