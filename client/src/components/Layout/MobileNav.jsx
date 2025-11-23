import { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import './MobileNav.css';

const MobileNav = ({ currentView, onViewChange }) => {
    const { currentSong } = useContext(PlayerContext);

    const navItems = [
        { id: 'songs', icon: '🎵', label: 'Songs' },
        { id: 'playlists', icon: '📁', label: 'Playlists' },
        { id: 'search', icon: '🔍', label: 'Search' }
    ];

    return (
        <nav className="mobile-nav">
            {navItems.map(item => (
                <button
                    key={item.id}
                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => onViewChange(item.id)}
                    aria-label={item.label}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.id === currentView && <span className="nav-indicator" />}
                </button>
            ))}
        </nav>
    );
};

export default MobileNav;
