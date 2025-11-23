import { useState } from 'react';

// Icon Components
const SearchIcon = ({ size = 18, color = '#FFFFFF' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
    </svg>
);

const LibraryIcon = ({ size = 18, color = '#FFFFFF' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

const Header = ({ onSearch, showLibrary, onToggleLibrary }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <>
            <div className="header-fullscreen" style={{
                height: '70px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '32px',
                padding: '0 48px',
                background: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(255, 0, 0, 0.15)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                {/* Logo */}
                <div
                    className="header-logo"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.textShadow = '0 0 30px rgba(255, 0, 0, 0.7)';
                        e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.textShadow = '0 0 20px rgba(255, 0, 0, 0.4)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    style={{
                        fontFamily: 'var(--font-header)',
                        fontSize: '24px',
                        color: '#FF0000',
                        letterSpacing: '3px',
                        fontWeight: '900',
                        textShadow: '0 0 20px rgba(255, 0, 0, 0.4)',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                    }}
                >
                    NOTHING
                </div>

                {/* Search Input */}
                <div
                    className="header-search-wrapper"
                    style={{
                        flex: 1,
                        maxWidth: '500px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: searchValue ? '1px solid rgba(255, 0, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '18px',
                        padding: '8px 16px',
                        height: '38px',
                        transition: 'all 0.3s',
                        boxShadow: searchValue ? '0 0 16px rgba(255, 0, 0, 0.12)' : 'none'
                    }}
                >
                    <SearchIcon size={15} color={searchValue ? '#FF0000' : 'rgba(255, 255, 255, 0.35)'} />
                    <input
                        className="header-search-input"
                        type="text"
                        placeholder="SEARCH SONGS..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            padding: '0',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '13px',
                            outline: 'none',
                            letterSpacing: '0.3px'
                        }}
                    />
                </div>

                {/* Library Button */}
                <div
                    className="header-library-button"
                    onClick={onToggleLibrary}
                    onMouseEnter={(e) => {
                        if (!showLibrary) {
                            e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.3)';
                            e.currentTarget.style.background = 'rgba(255, 0, 0, 0.08)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!showLibrary) {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                        }
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 18px',
                        borderRadius: '10px',
                        border: showLibrary ? '1px solid rgba(255, 0, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                        background: showLibrary ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: showLibrary ? '0 0 16px rgba(255, 0, 0, 0.12)' : 'none'
                    }}
                >
                    <LibraryIcon size={16} color={showLibrary ? '#FF0000' : 'rgba(255, 255, 255, 0.5)'} />
                    <span
                        className="header-library-label"
                        style={{
                            fontFamily: 'var(--font-header)',
                            fontSize: '10px',
                            color: showLibrary ? '#FF0000' : 'rgba(255, 255, 255, 0.5)',
                            letterSpacing: '1.2px',
                            fontWeight: '500'
                        }}
                    >
                        LIBRARY
                    </span>
                </div>
            </div>
        </>
    );
};

export default Header;
