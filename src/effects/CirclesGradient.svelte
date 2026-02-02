<script>
    import { onMount } from "svelte";

    let noiseLayer;
    let circle1;
    let circle2;
    let circle3;

    onMount(() => {
        // Cache circle elements
        circle1 = document.querySelector(".circle-1");
        circle2 = document.querySelector(".circle-2");
        circle3 = document.querySelector(".circle-3");

        let animationId;
        
        // Update mask positioning based on circle positions (viewport-relative)
        const updateMask = () => {
            if (noiseLayer && circle1 && circle2 && circle3) {
                const rect1 = circle1.getBoundingClientRect();
                const rect2 = circle2.getBoundingClientRect();
                const rect3 = circle3.getBoundingClientRect();

                // Use viewport coordinates directly since noise layer is position:fixed
                noiseLayer.style.maskImage = `
                    radial-gradient(circle at ${rect1.left + rect1.width / 2}px ${rect1.top + rect1.height / 2}px, black ${rect1.width * 0.3}px, transparent ${rect1.width * 0.5}px),
                    radial-gradient(circle at ${rect2.left + rect2.width / 2}px ${rect2.top + rect2.height / 2}px, black ${rect2.width * 0.3}px, transparent ${rect2.width * 0.5}px),
                    radial-gradient(circle at ${rect3.left + rect3.width / 2}px ${rect3.top + rect3.height / 2}px, black ${rect3.width * 0.3}px, transparent ${rect3.width * 0.5}px)
                `;
                noiseLayer.style.webkitMaskImage = noiseLayer.style.maskImage;
                noiseLayer.style.maskComposite = "add";
                noiseLayer.style.webkitMaskComposite = "source-over";
            }
            animationId = requestAnimationFrame(updateMask);
        };

        animationId = requestAnimationFrame(updateMask);

        // Cleanup on unmount
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    });
</script>

<div class="circles-gradient-wrapper">
    <div class="circle-1"></div>
    <div class="circle-2"></div>
    <div class="circle-3"></div>
    <div class="noise-layer" bind:this={noiseLayer}></div>
</div>

<style>
    @keyframes orbitCircle1 {
        0% {
            transform: rotate(0deg) translate(60vw, 30vh) rotate(0deg)
                scale(1.4);
            opacity: 0.6;
        }
        25% {
            transform: rotate(90deg) translate(45vw, -5vh) rotate(90deg)
                scale(1.3);
            opacity: 0.65;
        }
        50% {
            transform: rotate(360deg) translate(40vw, 15vh) rotate(360deg)
                scale(1.9);
            opacity: 0.7;
        }
        75% {
            transform: rotate(270deg) translate(45vw, -5vh) rotate(270deg)
                scale(1.6);
            opacity: 0.65;
        }
        100% {
            transform: rotate(0deg) translate(60vw, 30vh) rotate(0deg)
                scale(1.4);
            opacity: 0.6;
        }
    }

    @keyframes orbitCircle2 {
        0% {
            transform: rotate(0deg) translate(-50vw, -20vh) rotate(0deg)
                scale(1.4);
            opacity: 0.6;
        }
        25% {
            transform: rotate(-90deg) translate(-45vw, -5vh) rotate(-90deg)
                scale(1.3);
            opacity: 0.65;
        }
        50% {
            transform: rotate(-360deg) translate(-50vw, 15vh) rotate(-360deg)
                scale(1.8);
            opacity: 0.7;
        }
        75% {
            transform: rotate(-270deg) translate(-45vw, -5vh) rotate(-270deg)
                scale(1.7);
            opacity: 0.65;
        }
        100% {
            transform: rotate(0deg) translate(-50vw, -20vh) rotate(0deg)
                scale(1.4);
            opacity: 0.6;
        }
    }

    @keyframes orbitCircle3 {
        0% {
            transform: rotate(0deg) translate(-40vw, 20vh) rotate(0deg)
                scale(1.6);
            opacity: 0.5;
        }
        25% {
            transform: rotate(90deg) translate(-45vw, 15vh) rotate(90deg)
                scale(1.3);
            opacity: 0.55;
        }
        50% {
            transform: rotate(360deg) translate(-50vw, 15vh) rotate(360deg)
                scale(1.6);
            opacity: 0.6;
        }
        75% {
            transform: rotate(270deg) translate(-45vw, 15vh) rotate(270deg)
                scale(1.7);
            opacity: 0.55;
        }
        100% {
            transform: rotate(0deg) translate(-40vw, 20vh) rotate(0deg)
                scale(1.6);
            opacity: 0.5;
        }
    }

    .circles-gradient-wrapper {
        width: 100%;
        min-height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        pointer-events: none;
        isolation: isolate;
    }

    /* Start at top right */
    .circle-1 {
        width: 50vw;
        height: 50vw;
        top: calc(50% - 25vw);
        left: 25%;
        border-radius: 50%;
        position: absolute;
        background: radial-gradient(
            circle at 20% 70%,
            #60a5fa 0%,
            #e46bf7 50%,
            transparent 80%
        );
        margin: 0;
        filter: blur(50px);
        animation: orbitCircle1 41s ease-in-out infinite;
        overflow: hidden;
        z-index: 5;
    }

    /* Start at top left */
    .circle-2 {
        width: 40vw;
        height: 40vw;
        top: calc(50% - 20vw);
        left: 30%;
        border-radius: 50%;
        position: absolute;
        background: radial-gradient(
            circle at 40% 10%,
            #5eead4 0%,
            #60a5fa 40%,
            #e879f9 60%,
            transparent 80%
        );
        filter: blur(40px);
        animation: orbitCircle2 43s ease-in-out infinite;
        transform-origin: center;
        overflow: hidden;
        z-index: 5;
    }

    /* Start at bottom left */
    .circle-3 {
        width: 50vw;
        height: 50vw;
        top: calc(50% - 25vw);
        left: 25%;
        border-radius: 50%;
        position: absolute;
        background: radial-gradient(
            circle at 30% 75%,
            #e879f9 0%,
            #60a5fa 40%,
            #5eead4 60%,
            transparent 65%
        );
        filter: blur(40px);
        animation: orbitCircle3 59s ease-in-out infinite;
        transform-origin: center;
        overflow: hidden;
        z-index: 5;
    }

    .noise-layer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100vh;
        pointer-events: none;
        z-index: 10;
        background: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='black' opacity='1.0'/%3E%3C/svg%3E");
        background-size: 100px 100px;
        background-repeat: repeat;
        mix-blend-mode: hard-light;
        opacity: 0.6;
    }

    .circle-1,
    .circle-2,
    .circle-3 {
        mix-blend-mode: multiply;
    }
</style>
