import React, { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { PlayIcon, PauseIcon } from '../Icons';

const MiniPlayer = ({ onExpand }) => {
    const { currentSong, isPlaying, togglePlay } = useContext(PlayerContext);

    if (!currentSong) return null;

    const handlePlayPause = (e) => {
        e.stopPropagation();
        togglePlay();
    };

    return (
        <div className="mini-player" onClick={onExpand}>
            <div 
                className="mini-player-art"
                style={{
                    backgroundImage: currentSong.albumArt ? `url(${currentSong.albumArt})` : 'none'
                }}
            >
                {!currentSong.albumArt && '♪'}
            </div>
            
            <div className="mini-player-info">
                <div className="mini-player-title">{currentSong.title}</div>
                <div className="mini-player-artist">{currentSong.artist}</div>
            </div>
            
            <button className="mini-player-button" onClick={handlePlayPause}>
                {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
            </button>
        </div>
    );
};

export default MiniPlayer;
