import React, { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { HomeIcon, SearchIcon, LibraryIcon } from '../Icons';

const BottomNav = () => {
    const { activeNavItem, setActiveNavItem } = useContext(PlayerContext);

    const navItems = [
        { id: 'home', label: 'Home', icon: HomeIcon },
        { id: 'search', label: 'Search', icon: SearchIcon },
        { id: 'library', label: 'Library', icon: LibraryIcon }
    ];

    return (
        <div className="bottom-nav">
            {navItems.map(item => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.id}
                        className={`bottom-nav-item ${activeNavItem === item.id ? 'active' : ''}`}
                        onClick={() => setActiveNavItem(item.id)}
                    >
                        <Icon size={20} />
                        <span>{item.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default BottomNav;
