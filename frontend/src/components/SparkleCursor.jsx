import { useEffect } from 'react';

// A "custom hook" that contains all the logic for our fun sparkle effect.
const useSparkle = () => {
    useEffect(() => {
        // An array of vibrant, glittery colors that match our "Cosmic Lavender" theme.
        const sparkleColors = [
            '#D8B4FE', // Light Lavender
            '#FBCFE8', // Soft Pink
            '#A5B4FC', // Indigo
            '#FDE68A'  // Pale Gold
        ];

        const createSparkleBurst = (e) => {
            // Create a burst of multiple sparkles for a much bigger effect
            for (let i = 0; i < 5; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                document.body.appendChild(sparkle);

                // Start the sparkle at the exact location of the cursor
                const startX = e.clientX;
                const startY = e.clientY;
                sparkle.style.left = `${startX}px`;
                sparkle.style.top = `${startY}px`;

                // --- This is where we make it FUN and RANDOM ---

                // Pick a random color from our array
                const randomColor = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
                sparkle.style.backgroundColor = randomColor;
                sparkle.style.boxShadow = `0 0 8px ${randomColor}, 0 0 12px #fff`;

                // Randomize the sparkle's movement, size, and animation duration
                const randomX = (Math.random() - 0.5) * 250; // Fly out between -125px and +125px
                const randomY = (Math.random() - 0.5) * 250;
                const randomSize = Math.random() * 12 + 6; // Size between 6px and 18px
                const duration = Math.random() * 600 + 400; // Animation lasts 0.4s to 1.0s

                sparkle.style.width = `${randomSize}px`;
                sparkle.style.height = `${randomSize}px`;

                // Use the Web Animations API for smooth, high-performance animation
                sparkle.animate([
                    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                    { transform: `translate(${randomX}px, ${randomY}px) scale(0)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' // A fun "bouncy" easing function
                });

                // Remove the sparkle from the page after its animation is finished to keep things clean
                setTimeout(() => {
                    sparkle.remove();
                }, duration);
            }
        };

        // Add the event listener to the entire window for the 'mousemove' event
        window.addEventListener('mousemove', createSparkleBurst);

        // This is a crucial cleanup function that React runs when the component is removed.
        // It prevents memory leaks by removing the event listener.
        return () => {
            window.removeEventListener('mousemove', createSparkleBurst);
        };
    }, []); // The empty array `[]` ensures this effect runs only once when the component is first created.
};


// This is the component you will add to your main App.jsx file
function SparkleCursor() {
    useSparkle(); // This line activates all the logic we wrote above.
    return null; // This component doesn't render any visible HTML itself.
}

export default SparkleCursor;