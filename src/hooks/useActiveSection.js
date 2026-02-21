import { useState, useEffect } from 'react';

/**
 * Custom hook to track which section of the page is currently active/visible.
 * Uses a scroll listener and offsetTop comparison for reliable highlighting.
 * @param {string[]} deps - Effect dependencies
 * @returns {string} - The ID of the currently active section
 */
export default function useActiveSection(deps = []) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            // Find all h2 tags with an id within the docs-content container
            const headings = Array.from(document.querySelectorAll('.docs-content h2[id]'));
            if (!headings.length) return;

            // Current scroll position + some padding for the top header
            const scrollPos = window.scrollY + 96;

            // Find the heading that is closest to but above the current scroll position
            let currentActive = headings[0].id;

            for (const heading of headings) {
                if (heading.offsetTop <= scrollPos) {
                    currentActive = heading.id;
                } else {
                    // Since headings are ordered by DOM position, once we pass the scroll height,
                    // we've found the current active one (the previous one in the loop)
                    break;
                }
            }

            setActiveId(currentActive);
        };

        // Initialize state on mount
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, deps);

    return activeId;
}
