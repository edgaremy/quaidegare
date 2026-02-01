<div class="grain-overlay"></div>

<style>
    .grain-overlay {
        content: "";
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='25' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        opacity: 0.7;
        mix-blend-mode: overlay;
        background-size: 200px 200px;
        background-position: fixed;
        pointer-events: none;
        z-index: 1;
    }
</style>
