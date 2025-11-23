import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for lazy loading with Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @returns {Object} - Observer ref and visible items set
 */
const useIntersectionObserver = (options = {}) => {
    const [visibleItems, setVisibleItems] = useState(new Set());
    const observerRef = useRef(null);
    const elementsRef = useRef(new Map());

    useEffect(() => {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, loading all items immediately');
            return;
        }

        const defaultOptions = {
            root: null,
            rootMargin: '200px', // Load images 200px before entering viewport
            threshold: 0.1,
            ...options
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const itemId = entry.target.dataset.itemId;
                    if (itemId) {
                        setVisibleItems(prev => new Set([...prev, itemId]));
                        // Optionally unobserve after becoming visible
                        // observerRef.current.unobserve(entry.target);
                    }
                }
            });
        }, defaultOptions);

        // Observe all currently registered elements
        elementsRef.current.forEach((element) => {
            if (element && observerRef.current) {
                observerRef.current.observe(element);
            }
        });

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [options.root, options.rootMargin, options.threshold]);

    /**
     * Register an element to be observed
     * @param {HTMLElement} element - DOM element to observe
     * @param {string} itemId - Unique identifier for the item
     */
    const observe = (element, itemId) => {
        if (!element || !itemId) return;

        // Mark as visible immediately to prevent blank screen
        setVisibleItems(prev => new Set([...prev, itemId]));

        elementsRef.current.set(itemId, element);
        
        if (observerRef.current) {
            observerRef.current.observe(element);
        }
    };

    /**
     * Unregister an element from observation
     * @param {string} itemId - Unique identifier for the item
     */
    const unobserve = (itemId) => {
        const element = elementsRef.current.get(itemId);
        if (element && observerRef.current) {
            observerRef.current.unobserve(element);
        }
        elementsRef.current.delete(itemId);
    };

    return {
        visibleItems,
        observe,
        unobserve
    };
};

export default useIntersectionObserver;
