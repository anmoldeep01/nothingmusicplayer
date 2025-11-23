import React, { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { 
    PlayIcon, 
    PauseIcon, 
    NextIcon, 
    PrevIcon, 
    ShuffleIcon, 
    RepeatIcon, 
    RepeatOneIcon,
    QueueIcon,
    CloseIcon
} from '../Icons';

const NowPlayingView = ({ isOpen, onClose }) => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        playNext,
        playPrev,
        progress,
        duration,
        handleSeek,
        shuffle,
        repeat,
        toggleShuffle,
        toggleRepeat,
        queue,
        toggleQueueSheet
    } = useContext(PlayerContext);

    if (!isOpen || !currentSong) return null;

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <div className="now-playing-view">
            {/* Header */}
            <div className="now-playing-header">
                <div className="swipe-indicator"></div>
                <button className="close-button" onClick={onClose}>
                    <CloseIcon size={24} />
                </button>
            </div>

            {/* Album Art */}
            <div className="now-playing-art-container">
                <div 
                    className="now-playing-art"
                    style={{
                        backgroundImage: currentSong.albumArt ? `url(${currentSong.albumArt})` : 'none'
                    }}
                >
                    {!currentSong.albumArt && '♪'}
                </div>
            </div>

            {/* Song Info */}
            <div className="now-playing-info">
                <div className="now-playing-title">{currentSong.title}</div>
                <div className="now-playing-artist">{currentSong.artist}</div>
                <div className="now-playing-album">{currentSong.album || 'Unknown Album'}</div>
            </div>

            {/* Progress Bar */}
            <div className="now-playing-progress-section">
                <div 
                    className="now-playing-progress-bar"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        handleSeek(percentage * duration);
                    }}
                >
                    <div 
                        className="now-playing-progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                    <div 
                        className="now-playing-progress-thumb"
                        style={{ left: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="now-playing-time-stamps">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="now-playing-controls">
                <button 
                    className={`control-button ${shuffle ? 'active' : ''}`}
                    onClick={toggleShuffle}
                >
                    <ShuffleIcon size={20} />
                </button>
                <button className="control-button" onClick={playPrev}>
                    <PrevIcon size={24} />
                </button>
                <button className="control-button play-button" onClick={togglePlay}>
                    {isPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
                </button>
                <button className="control-button" onClick={playNext}>
                    <NextIcon size={24} />
                </button>
                <button 
                    className={`control-button ${repeat !== 'off' ? 'active' : ''}`}
                    onClick={toggleRepeat}
                >
                    {repeat === 'one' ? <RepeatOneIcon size={20} /> : <RepeatIcon size={20} />}
                </button>
            </div>

            {/* Secondary Controls */}
            <div className="now-playing-secondary">
                <button className="secondary-button" onClick={toggleQueueSheet}>
                    <QueueIcon size={20} />
                    {queue.length > 0 && (
                        <span className="queue-badge">{queue.length}</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default NowPlayingView;
