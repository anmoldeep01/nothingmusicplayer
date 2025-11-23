import { useContext, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, ShuffleIcon, RepeatIcon, RepeatOneIcon, QueueIcon, VolumeIcon } from '../Icons';
import Queue from '../Library/Queue';

const Player = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        playNext,
        playPrev,
        progress,
        duration,
        handleSeek,
        volume,
        handleVolumeChange,
        shuffle,
        repeat,
        toggleShuffle,
        toggleRepeat,
        queue
    } = useContext(PlayerContext);

    const [showQueue, setShowQueue] = useState(false);
    const [hoveredControl, setHoveredControl] = useState(null);
    const [progressHovered, setProgressHovered] = useState(false);

    if (!currentSong) return null;

    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    const getControlButtonStyle = (controlName, isActive = false) => {
        const isHovered = hoveredControl === controlName;
        return {
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            color: isActive ? '#FF0000' : isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            filter: isActive ? 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.5))' : 'none'
        };
    };

    const getPlayPauseStyle = () => {
        const isHovered = hoveredControl === 'play';
        return {
            width: '48px',
            height: '48px',
            border: isHovered ? '2px solid #FF0000' : '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            background: isHovered ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            boxShadow: isHovered ? '0 0 20px rgba(255, 0, 0, 0.3)' : 'none'
        };
    };

    return (
        <>
            <div className="player" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '90px',
                background: 'rgba(0, 0, 0, 0.96)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 32px',
                justifyContent: 'space-between',
                zIndex: 1000,
                boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.85)'
            }}>
                {/* Song Info (no album art thumbnail) */}
                <div className="player-info" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '280px',
                    gap: '4px'
                }}>
                    <div style={{
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: 'var(--font-header)',
                        fontSize: '15px',
                        letterSpacing: '1px',
                        color: '#FFFFFF',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                    }}>
                        {currentSong.title}
                    </div>
                    <div style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                        fontFamily: 'var(--font-body)'
                    }}>
                        {currentSong.artist}
                    </div>
                </div>

                {/* Controls */}
                <div className="player-controls" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    maxWidth: '700px',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button
                            onClick={toggleShuffle}
                            onMouseEnter={() => setHoveredControl('shuffle')}
                            onMouseLeave={() => setHoveredControl(null)}
                            style={getControlButtonStyle('shuffle', shuffle)}
                        >
                            <ShuffleIcon size={20} />
                        </button>
                        <button
                            onClick={playPrev}
                            onMouseEnter={() => setHoveredControl('prev')}
                            onMouseLeave={() => setHoveredControl(null)}
                            style={getControlButtonStyle('prev')}
                        >
                            <PrevIcon size={22} />
                        </button>
                        <button
                            onClick={togglePlay}
                            onMouseEnter={() => setHoveredControl('play')}
                            onMouseLeave={() => setHoveredControl(null)}
                            style={getPlayPauseStyle()}
                        >
                            {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                        </button>
                        <button
                            onClick={playNext}
                            onMouseEnter={() => setHoveredControl('next')}
                            onMouseLeave={() => setHoveredControl(null)}
                            style={getControlButtonStyle('next')}
                        >
                            <NextIcon size={22} />
                        </button>
                        <button
                            onClick={toggleRepeat}
                            onMouseEnter={() => setHoveredControl('repeat')}
                            onMouseLeave={() => setHoveredControl(null)}
                            style={getControlButtonStyle('repeat', repeat !== 'off')}
                        >
                            {repeat === 'one' ? <RepeatOneIcon size={20} /> : <RepeatIcon size={20} />}
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        gap: '10px'
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            letterSpacing: '0.5px',
                            minWidth: '40px'
                        }}>{formatTime(progress)}</span>
                        <div
                            style={{
                                flex: 1,
                                height: '3px',
                                background: 'rgba(255, 255, 255, 0.18)',
                                borderRadius: '999px',
                                position: 'relative',
                                cursor: 'pointer',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={() => setProgressHovered(true)}
                            onMouseLeave={() => setProgressHovered(false)}
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const percentage = x / rect.width;
                                handleSeek(percentage * duration);
                            }}
                        >
                            <div style={{
                                width: `${(progress / duration) * 100}%`,
                                height: '100%',
                                background: '#FF0000',
                                borderRadius: '999px',
                                transition: 'width 0.1s linear'
                            }}></div>
                            <div style={{
                                position: 'absolute',
                                left: `${(progress / duration) * 100}%`,
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '8px',
                                height: '8px',
                                background: '#FF0000',
                                borderRadius: '50%',
                                opacity: progressHovered ? 1 : 0,
                                transition: 'opacity var(--transition-fast)'
                            }}></div>
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            letterSpacing: '0.5px',
                            minWidth: '40px',
                            textAlign: 'right'
                        }}>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Volume & Queue */}
                <div className="player-volume" style={{
                    width: '250px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <button
                        onClick={() => setShowQueue(!showQueue)}
                        onMouseEnter={() => setHoveredControl('queue')}
                        onMouseLeave={() => setHoveredControl(null)}
                        style={{
                            ...getControlButtonStyle('queue', queue.length > 0),
                            position: 'relative'
                        }}
                    >
                        <QueueIcon size={20} />
                        {queue.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                background: '#FF0000',
                                color: '#000000',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '10px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: 'var(--font-header)',
                                border: '2px solid rgba(10, 10, 10, 0.8)',
                                boxShadow: '0 0 12px rgba(255, 0, 0, 0.5)'
                            }}>{queue.length}</div>
                        )}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <VolumeIcon size={20} color="rgba(255, 255, 255, 0.7)" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => handleVolumeChange(Number(e.target.value))}
                            style={{
                                width: '100px',
                                accentColor: '#FF0000',
                                height: '4px',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Queue Panel Component */}
            <Queue isOpen={showQueue} onClose={() => setShowQueue(false)} />
        </>
    );
};

export default Player;
