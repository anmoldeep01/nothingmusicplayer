import { useState, useContext, useEffect } from 'react';
import { PlayerContext } from './context/PlayerContext';
import Header from './components/Layout/Header';
import SongList from './components/Library/SongList';
import PlaylistList from './components/Library/PlaylistList';
import LibraryView from './components/Library/LibraryView';
import Player from './components/Layout/Player';
import MiniPlayer from './components/Layout/MiniPlayer';
import NowPlayingView from './components/Layout/NowPlayingView';
import Queue from './components/Library/Queue';
import NothingLoader from './components/UI/NothingLoader';
import './styles/global.css';
import './styles/responsive.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [viewMode, setViewMode] = useState('songs'); // 'songs' or 'playlists'
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [mobileView, setMobileView] = useState('songs'); // 'songs' or 'playlists'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const {
    showNowPlaying,
    showQueueSheet,
    openNowPlaying,
    closeNowPlaying,
    toggleQueueSheet
  } = useContext(PlayerContext);

  const handleViewModeChange = (mode) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setSelectedPlaylist(null);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

  const handlePlaylistSelect = (playlistName) => {
    setSelectedPlaylist(playlistName);
    setViewMode('songs');
  };

  const handleBackToPlaylists = () => {
    setSelectedPlaylist(null);
    setViewMode('playlists');
  };

  const handleMobileViewChange = (view) => {
    setMobileView(view);
    if (view === 'songs') {
      setViewMode('songs');
      setSelectedPlaylist(null);
    } else if (view === 'playlists') {
      setViewMode('playlists');
      setSelectedPlaylist(null);
    }
  };

  // Determine what to render based on mobile view
  const renderMobileContent = () => {
    // Mobile Playlists tab shows playlist grid when none selected
    if (mobileView === 'playlists' && !selectedPlaylist) {
      return <PlaylistList onPlaylistSelect={handlePlaylistSelect} />;
    }

    // Default: show song list (optionally filtered by playlist and searchQuery)
    return (
      <SongList
        searchQuery={searchQuery}
        selectedPlaylist={selectedPlaylist}
        onBack={selectedPlaylist ? handleBackToPlaylists : null}
      />
    );
  };

  return (
    <div className="app-fullscreen" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      background: 'var(--desktop-bg)',
      overflow: 'hidden'
    }}>
      <Header
        onSearch={setSearchQuery}
        showLibrary={showLibrary}
        onToggleLibrary={() => setShowLibrary(!showLibrary)}
      />

      {/* View Toggle Bar - Only on desktop and tablet */}
      <div className="view-toggle-bar" style={{
        display: 'flex',
        gap: '48px',
        padding: '16px 48px 0',
        borderBottom: 'none'
      }}>
        <button
          onClick={() => handleViewModeChange('songs')}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            color: viewMode === 'songs' && !selectedPlaylist ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
            padding: '0 0 14px 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-header)',
            fontSize: '14px',
            letterSpacing: '1.5px',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            if (viewMode !== 'songs' || selectedPlaylist) {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'songs' || selectedPlaylist) {
              e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
            }
          }}
        >
          SONGS
          {viewMode === 'songs' && !selectedPlaylist && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: '#FF0000',
              boxShadow: '0 0 8px rgba(255, 0, 0, 0.4)'
            }} />
          )}
        </button>
        <button
          onClick={() => handleViewModeChange('playlists')}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            color: viewMode === 'playlists' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
            padding: '0 0 14px 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-header)',
            fontSize: '14px',
            letterSpacing: '1.5px',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            if (viewMode !== 'playlists') {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'playlists') {
              e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
            }
          }}
        >
          PLAYLISTS
          {viewMode === 'playlists' && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: '#FF0000',
              boxShadow: '0 0 8px rgba(255, 0, 0, 0.4)'
            }} />
          )}
        </button>
      </div>

      <div className="content-fullscreen" style={{
        flex: 1,
        overflowY: 'auto',
        height: 'calc(100vh - 80px - 100px - 56px)'
      }}>
        {/* Desktop/Tablet View */}
        <div className="desktop-view" style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}>
          {isTransitioning ? (
            <NothingLoader />
          ) : showLibrary ? (
            <LibraryView />
          ) : viewMode === 'playlists' && !selectedPlaylist ? (
            <PlaylistList onPlaylistSelect={handlePlaylistSelect} />
          ) : (
            <SongList
              searchQuery={searchQuery}
              selectedPlaylist={selectedPlaylist}
              onBack={selectedPlaylist ? handleBackToPlaylists : null}
            />
          )}
        </div>

        {/* Mobile View */}
        <div className="mobile-view">
          {/* Top tab bar for mobile navigation (replaces bottom nav) */}
          <div className="mobile-tabs-bar">
            <button
              className={`mobile-tab-button ${mobileView === 'songs' ? 'active' : ''}`}
              onClick={() => handleMobileViewChange('songs')}
            >
              Songs
            </button>
            <button
              className={`mobile-tab-button ${mobileView === 'playlists' ? 'active' : ''}`}
              onClick={() => handleMobileViewChange('playlists')}
            >
              Playlists
            </button>
          </div>

          <div className="mobile-content">
            {renderMobileContent()}
          </div>
        </div>
      </div>

      <Player />

      {/* Mobile Components */}
      <MiniPlayer onExpand={openNowPlaying} />
      <NowPlayingView isOpen={showNowPlaying} onClose={closeNowPlaying} />
      <Queue isOpen={showQueueSheet} onClose={toggleQueueSheet} />
    </div>
  );
}

export default App;
