import React, { useContext, useState } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { CloseIcon } from '../Icons';

const Queue = ({ isOpen, onClose }) => {
    const { queue, removeFromQueue, clearQueue, playSong } = useContext(PlayerContext);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [clearHovered, setClearHovered] = useState(false);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            right: '32px',
            bottom: '120px',
            width: '360px',
            maxHeight: '500px',
            background: 'var(--desktop-glass-bg-overlay)',
            backdropFilter: 'var(--glass-blur-strong)',
            WebkitBackdropFilter: 'var(--glass-blur-strong)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            zIndex: 2000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fade-in 0.3s ease'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 0, 0, 0.2)'
            }}>
                <div style={{
                    fontFamily: 'var(--font-header)',
                    fontSize: '14px',
                    letterSpacing: '1.5px',
                    color: '#FFFFFF'
                }}>
                    QUEUE ({queue.length})
                </div>
                {queue.length > 0 && (
                    <button
                        onClick={clearQueue}
                        onMouseEnter={() => setClearHovered(true)}
                        onMouseLeave={() => setClearHovered(false)}
                        style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '11px',
                            color: clearHovered ? '#FF0000' : 'rgba(255, 0, 0, 0.7)',
                            background: clearHovered ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                            border: '1px solid rgba(255, 0, 0, 0.3)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                            boxShadow: clearHovered ? '0 0 12px rgba(255, 0, 0, 0.3)' : 'none'
                        }}
                    >
                        CLEAR
                    </button>
                )}
            </div>

            {/* Queue list */}
            <div className="custom-scrollbar" style={{
                flex: 1,
                overflowY: 'auto',
                marginRight: '-8px',
                paddingRight: '8px'
            }}>
                {queue.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 20px',
                        gap: '12px',
                        color: 'rgba(255, 255, 255, 0.3)'
                    }}>
                        <div style={{
                            fontSize: '40px',
                            opacity: 0.5
                        }}>♪</div>
                        <div style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '12px',
                            letterSpacing: '1px'
                        }}>
                            QUEUE IS EMPTY
                        </div>
                    </div>
                ) : (
                    queue.map((song, index) => {
                        const isHovered = hoveredItem === index;
                        return (
                            <div
                                key={`${song.id}-${index}`}
                                onMouseEnter={() => setHoveredItem(index)}
                                onMouseLeave={() => setHoveredItem(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    marginBottom: '8px',
                                    gap: '12px',
                                    background: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                                    border: isHovered ? '1px solid rgba(255, 0, 0, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'all var(--transition-fast)',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onClick={() => {
                                    playSong(song);
                                    removeFromQueue(index);
                                }}
                            >
                                {/* Album art */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    background: song.albumArt ? `url(${song.albumArt})` : 'rgba(255, 255, 255, 0.05)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    flexShrink: 0
                                }}>
                                    {!song.albumArt && '♪'}
                                </div>

                                {/* Song info */}
                                <div style={{
                                    flex: 1,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        color: '#FFFFFF',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        marginBottom: '4px',
                                        fontFamily: 'var(--font-body)'
                                    }}>
                                        {song.title}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontFamily: 'var(--font-body)'
                                    }}>
                                        {song.artist}
                                    </div>
                                </div>

                                {/* Remove button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromQueue(index);
                                    }}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(255, 0, 0, 0.3)',
                                        background: 'rgba(255, 0, 0, 0.1)',
                                        color: '#FF0000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                        opacity: isHovered ? 1 : 0,
                                        transition: 'all var(--transition-fast)',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = 'scale(0.9)';
                                        e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 0, 0, 0.5)';
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Queue;
