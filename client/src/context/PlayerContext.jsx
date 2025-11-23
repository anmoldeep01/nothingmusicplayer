import React, { createContext, useState, useRef, useEffect } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playlists, setPlaylists] = useState([]);

    // Queue, Shuffle, Repeat
    const [queue, setQueue] = useState([]);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState('off'); // 'off', 'one', 'all'

    // Mobile UI State
    const [showNowPlaying, setShowNowPlaying] = useState(false);
    const [showQueueSheet, setShowQueueSheet] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('home');

    const audioRef = useRef(new Audio());

    useEffect(() => {
        fetchSongs();
        fetchPlaylists();
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const onEnded = () => {
            handleSongEnd();
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', onEnded);
        };
    }, [currentSong, repeat, queue]);

    const fetchSongs = async () => {
        try {
            console.log('Fetching songs from API...');
            const res = await fetch('http://localhost:5000/api/songs');
            console.log('API Response status:', res.status);
            const data = await res.json();
            console.log('Songs received:', data.length);
            console.log('Sample song with playlist:', data[0]);
            setSongs(data);

            // Derive playlists from songs
            const playlistValues = data.map(song => song.playlist);
            console.log('All playlist values:', playlistValues);

            const uniquePlaylists = [...new Set(playlistValues.filter(p => p && p !== 'All Songs'))];
            console.log('Unique playlists:', uniquePlaylists);
            setPlaylists(uniquePlaylists);
        } catch (err) {
            console.error("Failed to fetch songs", err);
        }
    };

    // fetchPlaylists is no longer needed as we derive it from songs
    const fetchPlaylists = () => { };

    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
            return;
        }

        setCurrentSong(song);
        audioRef.current.src = song.url;
        audioRef.current.play();
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSongEnd = () => {
        if (repeat === 'one') {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (queue.length > 0) {
            const nextSong = queue[0];
            setQueue(queue.slice(1));
            playSong(nextSong);
        } else {
            playNext();
        }
    };

    const playNext = () => {
        if (!currentSong) return;

        if (queue.length > 0) {
            const nextSong = queue[0];
            setQueue(queue.slice(1));
            playSong(nextSong);
            return;
        }

        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        let nextIndex;

        if (shuffle) {
            nextIndex = Math.floor(Math.random() * songs.length);
        } else {
            nextIndex = (currentIndex + 1) % songs.length;
        }

        if (repeat === 'all' || nextIndex !== 0) {
            playSong(songs[nextIndex]);
        } else {
            setIsPlaying(false);
        }
    };

    const playPrev = () => {
        if (!currentSong) return;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        playSong(songs[prevIndex]);
    };

    const handleVolumeChange = (val) => {
        setVolume(val);
        audioRef.current.volume = val;
    };

    const handleSeek = (val) => {
        audioRef.current.currentTime = val;
        setProgress(val);
    };

    const toggleShuffle = () => {
        setShuffle(!shuffle);
    };

    const toggleRepeat = () => {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(repeat);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeat(modes[nextIndex]);
    };

    const addToQueue = (song) => {
        setQueue([...queue, song]);
    };

    const removeFromQueue = (index) => {
        setQueue(queue.filter((_, i) => i !== index));
    };

    const clearQueue = () => {
        setQueue([]);
    };

    // Mobile UI Methods
    const openNowPlaying = () => {
        setShowNowPlaying(true);
    };

    const closeNowPlaying = () => {
        setShowNowPlaying(false);
    };

    const toggleQueueSheet = () => {
        setShowQueueSheet(!showQueueSheet);
    };

    return (
        <PlayerContext.Provider value={{
            songs,
            currentSong,
            isPlaying,
            volume,
            progress,
            duration,
            playlists,
            queue,
            shuffle,
            repeat,
            playSong,
            togglePlay,
            playNext,
            playPrev,
            handleVolumeChange,
            handleSeek,
            toggleShuffle,
            toggleRepeat,
            addToQueue,
            removeFromQueue,
            clearQueue,
            fetchPlaylists,
            // Mobile UI State
            showNowPlaying,
            showQueueSheet,
            activeNavItem,
            openNowPlaying,
            closeNowPlaying,
            toggleQueueSheet,
            setActiveNavItem
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
