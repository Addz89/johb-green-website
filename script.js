/* =========================================================
   JOHB ASHAR WEBSITE JAVA SCRIPT PAGE - ELITE R2 CDN
   Designed by Moxi Corp Studio
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Circular Equalizer Logic (For About Page) ---
    const equalizerContainer = document.querySelector('.circular-equalizer');
    if (equalizerContainer) {
        const numberOfBars = 90; 
        const radius = 120; 
        for (let i = 0; i < numberOfBars; i++) {
            const bar = document.createElement('div');
            bar.classList.add('eq-bar');
            const angle = (360 / numberOfBars) * i;
            bar.style.transform = `translate(-50%, -100%) rotate(${angle}deg) translateY(-${radius}px)`;
            bar.style.animationDelay = `${Math.random() * -2}s`;
            bar.style.animationDuration = `${0.9 + (Math.random() * 0.6)}s`;
            equalizerContainer.appendChild(bar);
        }
    }

    // --- Hero Slider Logic ---
    const heroSection = document.querySelector('.hero');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (heroSection && leftArrow && rightArrow) {
        const images = ['images/hero.png', 'images/hero2.jpg', 'images/logo.png'];
        let currentIndex = 0;
        function updateBackgroundImage() {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('${images[currentIndex]}')`;
        }
        leftArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateBackgroundImage();
        });
        rightArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateBackgroundImage();
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({ top: targetElement.offsetTop - 100, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Elite Scroll Reveal Observer ---
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal, .album-section').forEach(section => observer.observe(section));

    // --- Initialize Music Players ---
    initBottomMusicBar();
    setupNativeAudioPlayers();
});

// --- YouTube API (Fallback/Index Logic) ---
let ytPlayers = {};
let currentlyPlayingElement = null;

function onYouTubeIframeAPIReady() {
    document.querySelectorAll(".yt-play-btn").forEach((btn, index) => {
        const videoId = btn.getAttribute("data-youtube-id");
        const playerDivId = `yt-player-${index + 1}`;
        ytPlayers[playerDivId] = new YT.Player(playerDivId, {
            height: "1", width: "1", videoId: videoId, playerVars: { playsinline: 1, controls: 0, disablekb: 1 }
        });
        btn.addEventListener("click", function () { handleYouTubePlayPause(this, playerDivId, "grid"); });
    });
}

function handleYouTubePlayPause(clickedElement, playerId, type) {
    const player = ytPlayers[playerId];
    if (typeof pauseNativeAudio === 'function') pauseNativeAudio(); 

    if (currentlyPlayingElement && currentlyPlayingElement.el !== clickedElement) {
        ytPlayers[currentlyPlayingElement.id].pauseVideo();
        currentlyPlayingElement.el.innerHTML = ICONS.play;
    }

    if (player.getPlayerState() !== 1) {
        player.playVideo();
        clickedElement.innerHTML = "&#10074;&#10074;";
        currentlyPlayingElement = { el: clickedElement, id: playerId, type: type };
    } else {
        player.pauseVideo();
        clickedElement.innerHTML = "&#9658;";
        currentlyPlayingElement = null;
    }
}

// --- Elite Native Audio Players Logic ---
let activeNativeAudio = null;
let activeNativePlayBtn = null;
let activeAlbumLayout = null;

let activeBottomController = null;
let bottomBarReady = false;

function initBottomMusicBar() {
    const bottomBar = document.getElementById("bottomMusicBar");
    if (!bottomBar || bottomBarReady) return;

    const playBtn = document.getElementById("bottomPlayBtn");
    const prevBtn = document.getElementById("bottomPrevBtn");
    const nextBtn = document.getElementById("bottomNextBtn");
    const seekSlider = document.getElementById("bottomSeekSlider");

    if (!playBtn || !prevBtn || !nextBtn || !seekSlider) return;

    playBtn.addEventListener("click", () => {
        if (!activeBottomController) return;

        const audio = activeBottomController.audio;

        if (audio && !audio.paused) {
            activeBottomController.pause();
        } else {
            activeBottomController.play();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (activeBottomController) activeBottomController.prev();
    });

    nextBtn.addEventListener("click", () => {
        if (activeBottomController) activeBottomController.next();
    });

    seekSlider.addEventListener("input", () => {
        if (!activeBottomController) return;

        const audio = activeBottomController.audio;
        if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) return;

        audio.currentTime = audio.duration * (seekSlider.value / 100);
    });

    bottomBarReady = true;
}

function formatBottomTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");

    return `${min}:${sec}`;
}

function updateBottomMusicBar(controller, isPlaying) {
    const bottomBar = document.getElementById("bottomMusicBar");
    const cover = document.getElementById("bottomCover");
    const songTitle = document.getElementById("bottomSongTitle");
    const albumTitle = document.getElementById("bottomAlbumTitle");
    const playBtn = document.getElementById("bottomPlayBtn");

    if (!bottomBar || !controller) return;

    const track = controller.getTrack();
    const albumName = controller.albumName || "Johb Ashar";

    if (songTitle) songTitle.textContent = track ? track.title : "No song playing";
    if (albumTitle) albumTitle.textContent = albumName;
    if (cover && controller.coverSrc) cover.src = controller.coverSrc;
    if (playBtn) playBtn.textContent = isPlaying ? "⏸" : "▶";

    bottomBar.classList.add("show");
    bottomBar.setAttribute("aria-hidden", "false");

    syncBottomProgress(controller.audio);
}

function setBottomPlaying(isPlaying) {
    const playBtn = document.getElementById("bottomPlayBtn");
    if (playBtn) playBtn.textContent = isPlaying ? "⏸" : "▶";
}

function syncBottomProgress(audio) {
    if (!audio || activeNativeAudio !== audio) return;

    const current = document.getElementById("bottomCurrentTime");
    const duration = document.getElementById("bottomDuration");
    const seek = document.getElementById("bottomSeekSlider");

    if (current) current.textContent = formatBottomTime(audio.currentTime || 0);

    if (duration) {
        duration.textContent = Number.isFinite(audio.duration)
            ? formatBottomTime(audio.duration)
            : "0:00";
    }

    if (seek && Number.isFinite(audio.duration) && audio.duration > 0) {
        seek.value = (audio.currentTime / audio.duration) * 100;
    }
}

const ICONS = {
    play: `
        <svg class="player-svg play-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z"></path>
        </svg>
    `,
    pause: `
        <svg class="player-svg pause-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 5h4v14H6z"></path>
            <path d="M14 5h4v14h-4z"></path>
        </svg>
    `,
    prev: `
        <svg class="player-svg small-player-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 5h2v14H6z"></path>
            <path d="M18 6v12l-9-6z"></path>
        </svg>
    `,
    next: `
        <svg class="player-svg small-player-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 5h2v14h-2z"></path>
            <path d="M6 6v12l9-6z"></path>
        </svg>
    `,
    playlistPlay: `
        <svg class="track-play-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z"></path>
        </svg>
    `
};

function pauseNativeAudio() {
    if (activeNativeAudio) {
        activeNativeAudio.pause();
        if (activeNativePlayBtn) {
            activeNativePlayBtn.innerHTML = ICONS.play;
            activeNativePlayBtn.setAttribute("aria-label", "Play");
        }
        const activePlayer = activeNativeAudio.closest ? activeNativeAudio.closest(".custom-audio-player") : null;
        if (activePlayer) activePlayer.classList.remove("is-playing");
        if (activeAlbumLayout) activeAlbumLayout.classList.remove("is-playing");
        setBottomPlaying(false);
    }
}

function setupNativeAudioPlayers() {
    const players = document.querySelectorAll(".custom-audio-player");
    if (!players.length) return;

    // EXACT CLOUDFLARE R2 DATABASE
    const albums = {
        "1623": [
            { title: "Sixteen Twenty Three", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/1623/01%20Sixteen%20Twenty%20Three.m4a", artist: "Johb Ashar" },
            { title: "Twenty Eight Thirty Four", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/1623/02%20Twenty%20Eight%20Thirty%20Four.m4a", artist: "Johb Ashar" },
            { title: "Four One Eleven", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/1623/03%20Four%20One%20Eleven.m4a", artist: "Johb Ashar" },
            { title: "Peace. Be Still.", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/1623/04%20Peace.%20Be%20Still.m4a", artist: "Johb Ashar" },
            { title: "Thirty Nine Forty Six", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/1623/05%20Thirty%20Nine%20Forty%20Six.m4a", artist: "Johb Ashar" },
            { title: "I AM", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/1623/06%20I%20AM.m4a", artist: "Johb Ashar" },
            { title: "Symphony 23 Complete", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/1623/07%20Symphony%2023%20Complete_%201623.m4a", artist: "Johb Ashar" }
        ],
        "another-victory": [
            { title: "The Victim", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Another%20Victory%20for%20the%20Worm/01%20The%20Victim.m4a", artist: "Johb Ashar" },
            { title: "Universal Justice", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Another%20Victory%20for%20the%20Worm/02%20Universal%20Justice.m4a", artist: "Johb Ashar" },
            { title: "The Worm", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Another%20Victory%20for%20the%20Worm/03%20The%20Worm.m4a", artist: "Johb Ashar" },
            { title: "The Prepetator", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Another%20Victory%20for%20the%20Worm/04%20The%20Prepetrator.m4a", artist: "Johb Ashar" },
            { title: "The Accomplice", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Another%20Victory%20for%20the%20Worm/05%20The%20Accomplice.m4a", artist: "Johb Ashar" },
            { title: "The Silent - The Weak", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Another%20Victory%20for%20the%20Worm/06%20The%20Silent%20-%20The%20Weak.m4a", artist: "Johb Ashar" },
            { title: "Another Victory for the Worm", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Another%20Victory%20for%20the%20Worm/07%20Another%20Victory%20for%20the%20Worm.m4a", artist: "Johb Ashar" }
        ],
        "cave-of-revelation": [
            { title: "CDOPST REVISIT", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Cave%20of%20Revelation/01%20CDOPST%20REVISIT.m4a", artist: "Johb Ashar" },
            { title: "WITH YOU I AM LOVE", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Cave%20of%20Revelation/02%20WITH%20YOU%20I%20AM%20LOVE.m4a", artist: "Johb Ashar" },
            { title: "PATMOS PART ONE", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Cave%20of%20Revelation/03%20PATMOS%20PART%20ONE.m4a", artist: "Johb Ashar" },
            { title: "PATMOS PART TWO", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Cave%20of%20Revelation/04%20PATMOS%20PART%20TWO.m4a", artist: "Johb Ashar" },
            { title: "SKULL OF SAINT THOMAS", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Cave%20of%20Revelation/05%20SKULL%20OF%20SAINT%20THOMAS.m4a", artist: "Johb Ashar" },
            { title: "CARETAKER MONK", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Cave%20of%20Revelation/06%20CARETAKER%20MONK.m4a", artist: "Johb Ashar" },
            { title: "CAVE OF REVELATION", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Cave%20of%20Revelation/07%20CAVE%20OF%20REVELATION.m4a", artist: "Johb Ashar" },
            { title: "CDOPST", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Cave%20of%20Revelation/08%20CDOPST.m4a", artist: "Johb Ashar" }
        ],
        "fire": [
            { title: "You Do It For Me", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/01%20You%20Do%20It%20For%20Me.m4a", artist: "Johb Ashar" },
            { title: "Mustard Seed", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/02%20Mustard%20Seed.m4a", artist: "Johb Ashar" },
            { title: "Oh Lord", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/03%20Oh%20Lord.m4a", artist: "Johb Ashar" },
            { title: "Cast the Net", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/04%20Cast%20the%20Net.m4a", artist: "Johb Ashar" },
            { title: "The Lantern", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/05%20The%20Lantern.m4a", artist: "Johb Ashar" },
            { title: "When the Night Accuses Me", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/06%20When%20the%20Night%20Accuses%20Me.m4a", artist: "Johb Ashar" },
            { title: "Dishonest Manager", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/07%20Dishonest%20Manager.m4a", artist: "Johb Ashar" },
            { title: "The Persistent Widow", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/08%20The%20Persistent%20Widow.m4a", artist: "Johb Ashar" },
            { title: "Hidden Treasure", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/09%20Hidden%20Treasure.m4a", artist: "Johb Ashar" },
            { title: "Father is Home", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/10%20Father%20is%20Home.m4a", artist: "Johb Ashar" },
            { title: "Fire", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/11%20Fire.m4a", artist: "Johb Ashar" },
            { title: "Let the Dead", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/12%20Let%20the%20Dead.m4a", artist: "Johb Ashar" },
            { title: "Tenants", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Fire/13%20Tenants.m4a", artist: "Johb Ashar" }
        ],
        "friday": [
            { title: "Before the Priests", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Friday/01%20Before%20the%20Priests.m4a", artist: "Johb Ashar" },
            { title: "Antipas and Pilate", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Friday/02%20Antipas%20and%20Pilate.m4a", artist: "Johb Ashar" },
            { title: "Sixth Hour", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Friday/03%20Sixth%20Hour.m4a", artist: "Johb Ashar" },
            { title: "Ninth Hour", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Friday/04%20Ninth%20Hour.m4a", artist: "Johb Ashar" },
            { title: "Symphony 25: Miserere Movement 1", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Friday/05%20Symphony%2025_%20Miserere%20Movement%201.m4a", artist: "Johb Ashar" },
            { title: "Symphony 25: Miserere Movement 2", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Friday/06%20Symphony%2025_%20Miserere%20Movement%202.m4a", artist: "Johb Ashar" },
            { title: "Symphony 25: Miserere Movement 3", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Friday/07%20Symphony%2025_%20Miserere%20Movement%203.m4a", artist: "Johb Ashar" },
            { title: "Symphony 25: Miserere Movement 4", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Friday/08%20Symphony%2025_%20Miserere%20Movement%204.m4a", artist: "Johb Ashar" }
        ],
        "ghost-on-a-righteous-track": [
            { title: "The Sower", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/01%20The%20Sower.m4a", artist: "Johb Ashar" },
            { title: "Unmerciful Servant", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/02%20Unmerciful%20Servant.m4a", artist: "Johb Ashar" },
            { title: "Ghost on a Righteous Track", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/03%20Ghost%20on%20a%20Righteous%20Track.m4a", artist: "Johb Ashar" },
            { title: "Rich Fool", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/04%20Rich%20Fool.m4a", artist: "Johb Ashar" },
            { title: "Lost Coin", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/05%20Lost%20Coin.m4a", artist: "Johb Ashar" },
            { title: "Divided Kingdom", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/06%20Divided%20Kingdom.m4a", artist: "Johb Ashar" },
            { title: "Two Sons", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/08%20Two%20Sons.m4a", artist: "Johb Ashar" },
            { title: "The Wedding Feast", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/09%20The%20Wedding%20Feast.m4a", artist: "Johb Ashar" },
            { title: "Prodigal Son Returns", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/10%20Prodigal%20Son%20Returns.m4a", artist: "Johb Ashar" },
            { title: "The Pharisee: The Tax Collector", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/11%20The%20Pharisee_%20The%20Tax%20Collector.m4a", artist: "Johb Ashar" },
            { title: "Lazarus", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/12%20Lazarus.m4a", artist: "Johb Ashar" },
            { title: "One Zero Nine", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/13%20One%20Zero%20Nine.m4a", artist: "Johb Ashar" },
            { title: "The Lost Sheep", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Ghost%20on%20a%20Righteous%20Track/14%20The%20Lost%20Sheep.m4a", artist: "Johb Ashar" }
        ],
        "healing-is-a-myth": [
            { title: "Forgotten", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Healing%20is%20a%20Myth/01%20Forgotten.m4a", artist: "Johb Ashar" },
            { title: "Healing is a Myth", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Healing%20is%20a%20Myth/02%20Healing%20is%20a%20Myth.m4a", artist: "Johb Ashar" },
            { title: "Broken", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Healing%20is%20a%20Myth/03%20Broken.m4a", artist: "Johb Ashar" },
            { title: "Jericho Call", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Healing%20is%20a%20Myth/04%20Jericho%20Call.m4a", artist: "Johb Ashar" },
            { title: "Where I Can Just Be", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Healing%20is%20a%20Myth/05%20Where%20I%20Can%20Just%20Be.m4a", artist: "Johb Ashar" },
            { title: "Axis", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Healing%20is%20a%20Myth/06%20Axis.m4a", artist: "Johb Ashar" },
            { title: "South Street Six", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Healing%20is%20a%20Myth/07%20South%20Street%20Six.m4a", artist: "Johb Ashar" },
            { title: "Ode to Mary Kathleen", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Healing%20is%20a%20Myth/08%20Ode%20to%20Mary%20Kathleen.m4a", artist: "Johb Ashar" }
        ],
        "it-is-finished": [
            { title: "Why Have You Forsaken Me", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/It%20is%20FINISHED/01%20Why%20Have%20You%20Forsaken%20Me.m4a", artist: "Johb Ashar" },
            { title: "They Know Not What They Do", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/It%20is%20FINISHED/02%20They%20Know%20Not%20What%20They%20Do.m4a", artist: "Johb Ashar" },
            { title: "I Thirst", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/It%20is%20FINISHED/03%20I%20Thirst.m4a", artist: "Johb Ashar" },
            { title: "Psalm 22", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/It%20is%20FINISHED/04%20Psalm%2022.m4a", artist: "Johb Ashar" },
            { title: "Mother, Behold Your Son", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/It%20is%20FINISHED/05%20Mother,%20Behold%20Your%20Son.m4a", artist: "Johb Ashar" },
            { title: "It is Finished", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/It%20is%20FINISHED/06%20It%20is%20Finished.m4a", artist: "Johb Ashar" },
            { title: "Into Your Hands", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/It%20is%20FINISHED/07%20Into%20Your%20Hands.m4a", artist: "Johb Ashar" },
            { title: "Symphony 6 Complete", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/It%20is%20FINISHED/08%20Symphony%206%20Complete.m4a", artist: "Johb Ashar" }
        ],
        "iter": [
            { title: "ITER UNA - PART 1 AND 2 - NEVER CRY", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/01%20ITER%20UNA%20-%20PART%201%20AND%202%20-%20NEVER%20CRY.m4a", artist: "Johb Ashar" },
            { title: "ITER UNA - PART 3 - PRAYER THAT FORGETS ITS GOD", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/02%20ITER%20UNA%20-%20PART%203%20-%20PRAYER%20THAT%20FORGETS%20ITS%20GOD.m4a", artist: "Johb Ashar" },
            { title: "ITER SOLA - PART 1 - NO SHADOW", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/03%20ITER%20SOLA%20-%20PART%201%20-%20NO%20SHADOW.m4a", artist: "Johb Ashar" },
            { title: "ITER SOLA - PART 2 - THE MIRROR BLACK", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/04%20ITER%20SOLA%20-%20PART%202%20-%20THE%20MIRROR%20BLACK.m4a", artist: "Johb Ashar" },
            { title: "ITER SOLA - PART 3 - THE REJECTION - THE REFLECTION", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/05%20ITER%20SOLA%20-%20PART%203%20-%20THE%20REJECTION%20-%20THE%20REFLECTION.m4a", artist: "Johb Ashar" },
            { title: "ITER DOLORUM - PART 1 AND 2 - PAIN IS MY COVENANT", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/06%20ITER%20DOLORUM%20-%20PART%201%20AND%202%20-%20PAIN%20IS%20MY%20COVENANT.m4a", artist: "Johb Ashar" },
            { title: "ITER DOLORUM - TRINITY (SHAME, BETRAYAL, FILL THE BLANK)", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/07%20%20ITER%20DOLORUM%20-%20TRINITY%20(SHAME,%20BETRAYAL,%20FILL%20THE%20BLANK).m4a", artist: "Johb Ashar" },
            { title: "ITER SOLITUDE - I DRANK MY FEAR AND IT BECAME A MIRROR", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/09%20ITER%20SOLITUDE%20-%20I%20DRANK%20MY%20FEAR%20AND%20IT%20BECAME%20A%20MIRROR.m4a", artist: "Johb Ashar" },
            { title: "INTER SOLITUDE - CODA", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/ITER/10%20INTER%20SOLITUDE%20-%20CODA.m4a", artist: "Johb Ashar" }
        ],
        "iter-solitudine-requiem": [
            { title: "iter solitudine requiem", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/iter%20solitudine%20requiem/01%20iter%20solitudine%20requiem.m4a", artist: "Johb Ashar" },
            { title: "iter una", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/iter%20solitudine%20requiem/02%20iter%20una.m4a", artist: "Johb Ashar" },
            { title: "iter sola", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/iter%20solitudine%20requiem/03%20iter%20sola.m4a", artist: "Johb Ashar" },
            { title: "iter dolorum", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/iter%20solitudine%20requiem/04%20iter%20dolorum.m4a", artist: "Johb Ashar" },
            { title: "inter solitudine", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/iter%20solitudine%20requiem/05%20inter%20solitudine.m4a", artist: "Johb Ashar" }
        ],
        "judas-kiss": [
            { title: "The Knife in the Cheek", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Judas%20kiss/01%20The%20Knife%20in%20the%20Cheek.m4a", artist: "Johb Ashar" },
            { title: "Healing is a Mess", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Judas%20kiss/02%20Healing%20is%20a%20Mess.m4a", artist: "Johb Ashar" },
            { title: "Vision of Judas", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Judas%20kiss/03%20Vision%20of%20Judas.m4a", artist: "Johb Ashar" },
            { title: "Betrayal Prelude", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Judas%20kiss/04%20Betrayal%20Prelude.m4a", artist: "Johb Ashar" },
            { title: "Symphony 20 The Judas Kiss", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Judas%20kiss/05%20Symphony%2020%20The%20Judas%20Kiss.m4a", artist: "Johb Ashar" }
        ],
        "kuroi-odori": [
            { title: "Black Sun Dance", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/KUROI%20ODORI/01%20Black%20Sun%20Dance.m4a", artist: "Johb Ashar" },
            { title: "Speciemen Log - Human Form", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/KUROI%20ODORI/02%20Speciemen%20Log%20-%20Human%20Form.m4a", artist: "Johb Ashar" },
            { title: "Afterimage Study One_Study Two", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/KUROI%20ODORI/03%20Afterimage%20Study%20One_Study%20Two.m4a", artist: "Johb Ashar" },
            { title: "Untitled - August Residue", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/KUROI%20ODORI/04%20Untitled%20-%20August%20Residue.m4a", artist: "Johb Ashar" },
            { title: "Confiscated Reel", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/KUROI%20ODORI/05%20Confiscated%20Reel.m4a", artist: "Johb Ashar" },
            { title: "Symphony 21 - Paupertas Butoh", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/KUROI%20ODORI/06%20Symphony%2021%20-%20Paupertas%20Butoh.m4a", artist: "Johb Ashar" }
        ],
        "lamentation": [
            { title: "Prelude", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/01%20Prelude.m4a", artist: "Johb Ashar" },
            { title: "Lamentation I", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/02%20Lamentation%20I.m4a", artist: "Johb Ashar" },
            { title: "Urbs Vidua", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/03%20Urbs%20Vidua.m4a", artist: "Johb Ashar" },
            { title: "Ira Velata", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/04%20Ira%20Velata.m4a", artist: "Johb Ashar" },
            { title: "Lamentation II", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/05%20Lamentation%20II.m4a", artist: "Johb Ashar" },
            { title: "Spes Cineris", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/06%20Spes%20Cineris.m4a", artist: "Johb Ashar" },
            { title: "Corona Lapsa", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/07%20Corona%20Lapsa.m4a", artist: "Johb Ashar" },
            { title: "Lamentation III", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/08%20Lamentation%20III.m4a", artist: "Johb Ashar" },
            { title: "Redde Nos", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/09%20Redde%20Nos.m4a", artist: "Johb Ashar" },
            { title: "Lamentation IV", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/10%20Lamentation%20IV.m4a", artist: "Johb Ashar" },
            { title: "Muri Fracti", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/11%20Muri%20Fracti.m4a", artist: "Johb Ashar" },
            { title: "Testis Silens", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/12%20Testis%20Silens.m4a", artist: "Johb Ashar" },
            { title: "Lamentation V", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/13%20Lamentation%20V.m4a", artist: "Johb Ashar" },
            { title: "Ultima Flamma", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Lamentation/14%20Ultima%20Flamma.m4a", artist: "Johb Ashar" }
        ],
        "markan-episodes": [
            { title: "Only Believe", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/01%20Only%20Believe.m4a", artist: "Johb Ashar" },
            { title: "Without Breath", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/02%20Without%20Breath.m4a", artist: "Johb Ashar" },
            { title: "Not Blind", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/03%20Not%20Blind.m4a", artist: "Johb Ashar" },
            { title: "Not Name", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/04%20Not%20Name.m4a", artist: "Johb Ashar" },
            { title: "No, No, No", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/05%20No,%20No,%20No.m4a", artist: "Johb Ashar" },
            { title: "Markan Episodes", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/06%20Markan%20Episodes.m4a", artist: "Johb Ashar" },
            { title: "The Juxtaposition of Death - Movement I", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/07%20The%20Juxtaposition%20of%20Death%20-%20Movement%20I.m4a", artist: "Johb Ashar" },
            { title: "The Juxtaposition of Death - Movement II", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/08%20The%20Juxtaposition%20of%20Death%20-%20Movement%20II.m4a", artist: "Johb Ashar" },
            { title: "The Juxtaposition of Death - Movement III", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/09%20The%20Juxtaposition%20of%20Death%20-%20Movement%20III.m4a", artist: "Johb Ashar" },
            { title: "The Juxtaposition of Death - Movement IV", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/MARKAN%20EPISODES/10%20The%20Juxtaposition%20of%20Death%20-%20Movement%20IV.m4a", artist: "Johb Ashar" }
        ],
        "meet-me-here": [
            { title: "Hammer on the War Machine", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/01%20Hammer%20on%20the%20War%20Machine.m4a", artist: "Johb Ashar" },
            { title: "One Hundred and Eighty", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/02%20One%20Hundred%20and%20Eighty.m4a", artist: "Johb Ashar" },
            { title: "Meet Me Here", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/03%20Meet%20Me%20Here.m4a", artist: "Johb Ashar" },
            { title: "Merton", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/04%20Merton.m4a", artist: "Johb Ashar" },
            { title: "Love Them Anyway", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/05%20Love%20Them%20Anyway.m4a", artist: "Johb Ashar" },
            { title: "The Trurth is Not Afraid of Death", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/06%20The%20Trurth%20is%20Not%20Afraid%20of%20Death.m4a", artist: "Johb Ashar" },
            { title: "Labre", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/07%20Labre.m4a", artist: "Johb Ashar" },
            { title: "Let Go of God for God To Be", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/08%20Let%20Go%20of%20God%20for%20God%20To%20Be.m4a", artist: "Johb Ashar" },
            { title: "Who Am I", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/09%20Who%20Am%20I.m4a", artist: "Johb Ashar" },
            { title: "MLK", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/10%20MLK.m4a", artist: "Johb Ashar" },
            { title: "Dorothy Day", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/11%20Dorothy%20Day.m4a", artist: "Johb Ashar" },
            { title: "One Hundred and Eighty (Instrumental)", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Meet%20Me%20Here/12%20One%20Hundred%20and%20Eighty%20(Instrumental).m4a", artist: "Johb Ashar" }
        ],
        "memoria": [
            { title: "Kronos - time has won", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/01%20Kronos%20-%20time%20has%20won.m4a", artist: "Johb Ashar" },
            { title: "The Gift - the death", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/02%20The%20Gift%20-%20the%20death.m4a", artist: "Johb Ashar" },
            { title: "Dorothy part 1", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/03%20Dorothy%20part%201.m4a", artist: "Johb Ashar" },
            { title: "I'm in Love - guitar mix", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/04%20I_m%20in%20Love%20-%20guitar%20mix.m4a", artist: "Johb Ashar" },
            { title: "Without U - by my side", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/05%20Without%20U%20-%20by%20my%20side.m4a", artist: "Johb Ashar" },
            { title: "Learning how to Fly", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/06%20Learning%20how%20to%20Fly.m4a", artist: "Johb Ashar" },
            { title: "Chant des Sirenes part 1", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/07%20Chant%20des%20Sirenes%20part%201.m4a", artist: "Johb Ashar" },
            { title: "Dorothy part 2", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/08%20Dorothy%20part%202.m4a", artist: "Johb Ashar" },
            { title: "Never Be - what should", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/09%20Never%20Be%20-%20what%20should.m4a", artist: "Johb Ashar" },
            { title: "Chant des Sirenes part 2", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/10%20Chant%20des%20Sirenes%20%20part%202.m4a", artist: "Johb Ashar" },
            { title: "INRI - reflection", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/11%20INRI%20-%20reflection.m4a", artist: "Johb Ashar" },
            { title: "Dorothy part 3", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/12%20Dorothy%20part%203.m4a", artist: "Johb Ashar" },
            { title: "Paraddisum - guitar mix", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/13%20Paraddisum%20-%20guitar%20mix.m4a", artist: "Johb Ashar" },
            { title: "Edith - shadow mix", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/14%20Edith%20-%20shadow%20mix.m4a", artist: "Johb Ashar" },
            { title: "Hit My Face - dirty max", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/16%20Hit%20My%20Face%20-%20dirty%20max.m4a", artist: "Johb Ashar" },
            { title: "Wait a Little - grunge blues mix", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/17%20Wait%20a%20Littrle%20-%20grunge%20blues%20mix.m4a", artist: "Johb Ashar" },
            { title: "Sea of Arabah - nakba mix", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/18%20Sea%20of%20Arabah%20-%20nakba%20mix.m4a", artist: "Johb Ashar" },
            { title: "Magico Man - instrumental", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/19%20Magico%20Man.-%20instrumental.m4a", artist: "Johb Ashar" },
            { title: "1988 - memoria mix", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Memoria/20%201988%20-%20memoria%20mix.m4a", artist: "Johb Ashar" }
        ],
        "opprimitur-affectibus": [
            { title: "SALVIFICI DOLORIS PART ONE", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Opprimitur%20Affectibus/01%20SALVIFICI%20DOLORIS%20PART%20ONE.m4a", artist: "Johb Ashar" },
            { title: "SALVIFICI DOLORIS PART TWO", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Opprimitur%20Affectibus/02%20SALVIFICI%20DOLORIS%20PART%20TWO.m4a", artist: "Johb Ashar" },
            { title: "SALVIFICI DOLORIS PART THREE", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Opprimitur%20Affectibus/03%20SALVIFICI%20DOLORIS%20PART%20THREE.m4a", artist: "Johb Ashar" },
            { title: "SALVIFICI DOLORIS PART FOUR", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Opprimitur%20Affectibus/04%20SALVIFICI%20DOLORIS%20PART%20FOUR.m4a", artist: "Johb Ashar" },
            { title: "SYMPHONY 12 - PART 1 SORROW", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Opprimitur%20Affectibus/05%20SYMPHONY%2012%20-%20PART%201_%20SORROW.m4a", artist: "Johb Ashar" },
            { title: "SYMPHONY 12 - PART 2 MY GOD", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Opprimitur%20Affectibus/06%20SYMPHONY%2012%20-%20PART%202_%20MY%20GOD.m4a", artist: "Johb Ashar" },
            { title: "SYMPHONY 12 - PART 3 PUSHING THE LIMITS", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Opprimitur%20Affectibus/07%20SYMPHONY%2012%20-%20PART%203_%20PUSHING%20THE%20LIMITS.m4a", artist: "Johb Ashar" },
            { title: "SYMPHONY 12 - PART 4 IF ONE SUFFERS WE ALL SUFFER", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Opprimitur%20Affectibus/08%20SYMPHONY%2012%20-%20PART%204_%20IF%20ONE%20SUFFERS%20WE%20ALL%20SUFFER.m4a", artist: "Johb Ashar" }
        ],
        "requiem-for-a-sinner": [
            { title: "Requiem Aeteram", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/01%20Requiem%20Aeteram.m4a", artist: "Johb Ashar" },
            { title: "Kyrie Eleison", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/02%20Kyrie%20Eleison.m4a", artist: "Johb Ashar" },
            { title: "Dies Irae", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/03%20Dies%20Irae.m4a", artist: "Johb Ashar" },
            { title: "Sanctus", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/04%20Sanctus.m4a", artist: "Johb Ashar" },
            { title: "Benedictus", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/05%20Benedictus.m4a", artist: "Johb Ashar" },
            { title: "Recordare", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/06%20Recordare.m4a", artist: "Johb Ashar" },
            { title: "Lacrimosa", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/07%20Lacrimosa.m4a", artist: "Johb Ashar" },
            { title: "Agnus Dei", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/08%20Agnus%20Dei.m4a", artist: "Johb Ashar" },
            { title: "Communio", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/09%20Communio.m4a", artist: "Johb Ashar" },
            { title: "Lux Aeterna", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/10%20Lux%20Aeterna.m4a", artist: "Johb Ashar" },
            { title: "Jerusalem", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Requiem%20for%20a%20Sinner/11%20Jerusalem.m4a", artist: "Johb Ashar" }
        ],
        "sanctified": [
            { title: "Toma", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/01%20Toma.m4a", artist: "Johb Ashar" },
            { title: "Yoldat Aloho", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/02%20Yoldat%20Aloho.m4a", artist: "Johb Ashar" },
            { title: "Mattai", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/03%20Mattai.m4a", artist: "Johb Ashar" },
            { title: "Yaqub Bar Qerlyot", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/04%20Yaqub%20Bar%20Qerlyot.m4a", artist: "Johb Ashar" },
            { title: "Yahuda Ish Qerlyot", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/05%20Yahuda%20Ish%20Qerlyot.m4a", artist: "Johb Ashar" },
            { title: "Shimeon Kepha", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/06%20Shimeon%20Kepha.m4a", artist: "Johb Ashar" },
            { title: "Bar - Tolmay", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/07%20Bar%20-%20Tolmay.m4a", artist: "Johb Ashar" },
            { title: "Maryam Magdlayta", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/08%20Maryam%20Magdlayta.m4a", artist: "Johb Ashar" },
            { title: "Martam, Marta, Lazar", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/09%20Martam,%20Marta,%20Lazar.m4a", artist: "Johb Ashar" },
            { title: "Andraos", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/10%20Andraos.m4a", artist: "Johb Ashar" },
            { title: "Philipos", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/11%20Philipos.m4a", artist: "Johb Ashar" },
            { title: "Yehuda Thadda", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/12%20Yehuda%20Thadda.m4a", artist: "Johb Ashar" },
            { title: "Simeon Qananayai", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/13%20Simeon%20Qananayai.m4a", artist: "Johb Ashar" },
            { title: "Yohanan Bar Zavdai", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/14%20Yohanan%20Bar%20Zavdai.m4a", artist: "Johb Ashar" },
            { title: "Yaqub bar Zadai", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/SANCTIFIED/15%20Yaqub%20Bar%20Zavdai.m4a", artist: "Johb Ashar" }
        ],
        "seven-seals-of-the-apocalypse": [
            { title: "Overture", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/01%20Overture.m4a", artist: "Johb Ashar" },
            { title: "Seal I", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/02%20Seal%20I.m4a", artist: "Johb Ashar" },
            { title: "Seal II", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/03%20Seal%20II.m4a", artist: "Johb Ashar" },
            { title: "Seal III", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/04%20Seal%20III.m4a", artist: "Johb Ashar" },
            { title: "Seal IV", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/05%20Seal%20iV.m4a", artist: "Johb Ashar" },
            { title: "Seal V", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/06%20Seal%20V.m4a", artist: "Johb Ashar" },
            { title: "Seal VI", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/07%20Seal%20VI.m4a", artist: "Johb Ashar" },
            { title: "Seal VII", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/08%20Seal%20VII.m4a", artist: "Johb Ashar" },
            { title: "Reprise", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Seven%20Seals%20of%20the%20Apocalypse/09%20Reprise.m4a", artist: "Johb Ashar" }
        ],
        "skin-for-skin-volume-one": [
            { title: "I Tell The Truth", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/01%20I%20Tell%20The%20Truth.m4a", artist: "Johb Ashar" },
            { title: "Take It Away", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/02%20Take%20It%20Away.m4a", artist: "Johb Ashar" },
            { title: "World Kept Breaking", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/03%20World%20Kept%20Breaking.m4a", artist: "Johb Ashar" },
            { title: "Not Yet Come", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/04%20Not%20Yet%20Come.m4a", artist: "Johb Ashar" },
            { title: "Hit The Flesh", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/05%20Hit%20The%20Flesh.m4a", artist: "Johb Ashar" },
            { title: "When Sorrow Filled Seven Days", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/06%20When%20Sorrow%20Filled%20Seven%20Days.m4a", artist: "Johb Ashar" },
            { title: "The Ashes Fall", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/07%20The%20Ashes%20Fall.m4a", artist: "Johb Ashar" },
            { title: "Just To Watch Me Die", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/08%20Just%20To%20Watch%20Me%20Die.m4a", artist: "Johb Ashar" },
            { title: "When Did The Innocent Ever Lose", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/09%20When%20Did%20The%20Innocent%20Ever%20Lose.m4a", artist: "Johb Ashar" },
            { title: "God Does Not Lie", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/10%20God%20Does%20Not%20Lie.m4a", artist: "Johb Ashar" },
            { title: "Sword That Remembers Every Name", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/11%20Sword%20That%20Remembers%20Every%20Name.m4a", artist: "Johb Ashar" },
            { title: "Can You Measure God", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/12%20Can%20You%20Measure%20God.m4a", artist: "Johb Ashar" },
            { title: "You've Been Faithful Long Enough", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/13%20You_ve%20Been%20Faithful%20Long%20Enough.m4a", artist: "Johb Ashar" },
            { title: "Answer Me", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20One/14%20Answer%20Me.m4a", artist: "Johb Ashar" }
        ],
        "skin-for-skin-volume-two": [
            { title: "Act Two", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/01%20Act%20Two.m4a", artist: "Johb Ashar" },
            { title: "Where Is Wisdom", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/02%20Where%20Is%20Wisdom.m4a", artist: "Johb Ashar" },
            { title: "I Remember", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/03%20I%20Remember.m4a", artist: "Johb Ashar" },
            { title: "Taste The Truth", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/04%20Taste%20The%20Truth.m4a", artist: "Johb Ashar" },
            { title: "Bring All My Love Back Home", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/05%20Bring%20All%20My%20Love%20Back%20Home.m4a", artist: "Johb Ashar" },
            { title: "I Am Innocent Still I_m Denied", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/06%20I%20Am%20Innocent_%20Still%20I_m%20Denied.m4a", artist: "Johb Ashar" },
            { title: "Where Were You", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/07%20Where%20Were%20You.m4a", artist: "Johb Ashar" },
            { title: "Dust And Ashes", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/08%20Dust%20And%20Ashes.m4a", artist: "Johb Ashar" },
            { title: "Hymnus De Sapientia Abscondita", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/09%20Hymnus%20De%20Sapientia%20Abscondita.m4a", artist: "Johb Ashar" },
            { title: "Skin For Skin", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Skin%20for%20Skin%20-%20Volume%20Two/10%20Skin%20For%20Skin.m4a", artist: "Johb Ashar" }
        ],
        "solace-in-my-wound": [
            { title: "Sipping Blood from a Cup", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/01%20Sipping%20Blood%20from%20a%20Cup.m4a", artist: "Johb Ashar" },
            { title: "This is All Life Is", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/02%20This%20is%20All%20Life%20Is.m4a", artist: "Johb Ashar" },
            { title: "Sehnsught", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/03%20Sehnsught.m4a", artist: "Johb Ashar" },
            { title: "Solace in My Wound Part 1_ Opening Theme", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/04%20Solace%20in%20My%20Wound%20Part%201_%20Opening%20Theme.m4a", artist: "Johb Ashar" },
            { title: "Solace in My Wound Part 2_ The Wound", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/05%20Solace%20in%20My%20Wound%20Part%202_%20The%20Wound.m4a", artist: "Johb Ashar" },
            { title: "Solace in My Wound Part 3_ Ashes Of My Being", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/06%20Solace%20in%20My%20Wound%20Part%203_%20Ashes%20Of%20My%20Being.m4a", artist: "Johb Ashar" },
            { title: "Solace in My Wound Part 4_ Solace", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/07%20Solace%20in%20My%20Wound%20Part%204_%20Solace.m4a", artist: "Johb Ashar" },
            { title: "Solace in My Wound Part 5_ Hold My Heart", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/08%20Solace%20in%20My%20Wound%20Part%205_%20Hold%20My%20Heart.m4a", artist: "Johb Ashar" },
            { title: "Solace in My Wound Part 6_ Finale", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/09%20Solace%20in%20My%20Wound%20Part%206_%20Finale.m4a", artist: "Johb Ashar" },
            { title: "Not Invited Ma a d-dam mix", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/10%20Not%20Invited_%20Ma_a%20d-dam%20mix.m4a", artist: "Johb Ashar" },
            { title: "Queen of the Noble Cause", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/11%20Queen%20of%20the%20Noble%20Cause.m4a", artist: "Johb Ashar" },
            { title: "Sipping Blood from a Cup (if it is geniune mix)", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/12%20Sipping%20Blood%20from%20a%20Cup%20(if%20it%20is%20geniune%20mix).m4a", artist: "Johb Ashar" },
            { title: "Not Invited", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Solace%20In%20My%20Wound/13%20Not%20Invited.m4a", artist: "Johb Ashar" }
        ],
        "string-sonata-1-and-2": [
            { title: "SONATA 1 - 1 Bellum Incipit", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/STRING%20SONATA%201%20AND%202/01%20SONATA%201%20%20-%201%20Bellum%20Incipit.m4a", artist: "Johb Ashar" },
            { title: "SONATA 1 - 2 Beit Hanoun", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/STRING%20SONATA%201%20AND%202/02%20SONATA%201%20%20-%202%20%20Beit%20Hanoun.m4a", artist: "Johb Ashar" },
            { title: "SONATA 1 - 3 Gaza City", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/STRING%20SONATA%201%20AND%202/03%20SONATA%201%20%20-%203%20%20Gaza%20City.m4a", artist: "Johb Ashar" },
            { title: "SONATA 2 - 1 Khan Younis", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/STRING%20SONATA%201%20AND%202/04%20SONATA%202%20%20-%201%20Khan%20Younis.m4a", artist: "Johb Ashar" },
            { title: "SONATA 2 - 2 Rafah", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/STRING%20SONATA%201%20AND%202/05%20SONATA%202%20%20-%202%20Rafah.m4a", artist: "Johb Ashar" },
            { title: "SONATA 2 - 3 Bellum Infinitum", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/STRING%20SONATA%201%20AND%202/06%20SONATA%202%20-%203%20Bellum%20Infinitum.m4a", artist: "Johb Ashar" }
        ],
        "symphony-4-portrait": [
            { title: "Symphony 4 Portrait Movement 1", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Symphony%204%20-%20PORTRAIT/01%20Symphony%204%20_%20Portrait%20_%20Movement%201.m4a", artist: "Johb Ashar" },
            { title: "Symphony 4 Portrait Movement 2", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Symphony%204%20-%20PORTRAIT/02%20Symphony%204%20_%20Portrait%20_%20Movement%202.m4a", artist: "Johb Ashar" },
            { title: "Symphony 4 Portrait Movement 3", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Symphony%204%20-%20PORTRAIT/03%20Symphony%204%20_%20Portrait%20_%20Movement%203.m4a", artist: "Johb Ashar" },
            { title: "Symphony 4 Portrait Movement 4", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Symphony%204%20-%20PORTRAIT/04%20Symphony%204%20_%20Portrait%20_%20Movement%204.m4a", artist: "Johb Ashar" },
            { title: "6484", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Symphony%204%20-%20PORTRAIT/05%206484.m4a", artist: "Johb Ashar" },
            { title: "The Coming of Darkness", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Symphony%204%20-%20PORTRAIT/06%20The%20Coming%20of%20Darkness.m4a", artist: "Johb Ashar" },
            { title: "Light to Feel God", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Symphony%204%20-%20PORTRAIT/07%20Light%20to%20Feel%20God.m4a", artist: "Johb Ashar" },
            { title: "Not Worthy Final", file: "https://pub-eec0eab5ef444e798f8d038912e2329d.r2.dev/Symphony%204%20-%20PORTRAIT/09%20Not%20Worthy%20Final.m4a", artist: "Johb Ashar" }
        ]
    };

    players.forEach(player => {
        const albumKey = player.dataset.album;
        const trackList = albums[albumKey];

        if (!trackList || !Array.isArray(trackList) || trackList.length === 0) {
            console.warn("Album not found or empty:", albumKey);
            return;
        }

        const albumLayout = player.closest(".album-layout");
        const audio = player.querySelector(".native-audio");
        const playlistContainer = player.querySelector(".playlist-container");
        const playPauseBtn = player.querySelector(".play-pause-btn");
        const prevBtn = player.querySelector(".prev-btn");
        const nextBtn = player.querySelector(".next-btn");
        const seekSlider = player.querySelector(".seek-slider");
        const currentTimeEl = player.querySelector(".current-time");
        const durationTimeEl = player.querySelector(".duration-time");
        const currentTitleEl = player.querySelector(".current-track-title");
        const albumName = player.querySelector(".album-heading")?.textContent.trim() || "Johb Ashar";
        const coverSrc = albumLayout?.querySelector(".album-cover-img")?.src || "images/logo.png";

        if (!albumLayout || !audio || !playlistContainer || !playPauseBtn || !prevBtn || !nextBtn || !seekSlider || !currentTimeEl || !durationTimeEl || !currentTitleEl) {
            console.warn("Missing player elements for album:", albumKey);
            return;
        }

        let currentTrackIndex = 0;
        let isPlaying = false;

        const bottomController = {
            audio,
            albumName,
            coverSrc,
            getTrack: () => trackList[currentTrackIndex],
            play: () => playTrack(),
            pause: () => pauseTrack(),
            next: () => nextTrack(),
            prev: () => prevTrack()
        };

        audio.preload = "metadata";
        audio.setAttribute("playsinline", "");
        audio.setAttribute("webkit-playsinline", "");

        playPauseBtn.innerHTML = ICONS.play;
        prevBtn.innerHTML = ICONS.prev;
        nextBtn.innerHTML = ICONS.next;
        playPauseBtn.setAttribute("aria-label", "Play");
        prevBtn.setAttribute("aria-label", "Previous track");
        nextBtn.setAttribute("aria-label", "Next track");

        function formatTime(seconds) {
            if (!Number.isFinite(seconds)) return "0:00";
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
            return `${min}:${sec}`;
        }

        function updatePlayButton() {
            playPauseBtn.innerHTML = isPlaying ? ICONS.pause : ICONS.play;
            playPauseBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
            setBottomPlaying(activeBottomController === bottomController && isPlaying);
        }

        function updatePlaylistActiveState() {
            const items = playlistContainer.querySelectorAll(".playlist-item");
            items.forEach((item, index) => {
                const active = index === currentTrackIndex;
                item.classList.toggle("active", active);
                const visualizer = item.querySelector(".playing-visualizer");
                if (visualizer) visualizer.classList.toggle("active", active && isPlaying);
                const indexText = item.querySelector(".track-index");
                if (indexText) indexText.style.display = active && isPlaying ? "none" : "";
            });
        }

        function loadPlaylist() {
            playlistContainer.innerHTML = "";

            trackList.forEach((track, index) => {
                const li = document.createElement("li");
                li.className = "playlist-item";
                li.innerHTML = `
                    <div class="track-number">
                        <span class="track-index">${index + 1}</span>
                        <div class="playing-visualizer" aria-hidden="true">
                            <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                        </div>
                    </div>
                    <div class="track-info">
                        <div class="title">${track.title}</div>
                        <div class="artist">${track.artist || "Johb Ashar"}</div>
                    </div>
                    <div class="track-duration"></div>
                `;

                li.addEventListener("click", () => {
                    if (currentTrackIndex === index && isPlaying) {
                        pauseTrack();
                        return;
                    }
                    loadTrack(index);
                    playTrack();
                });

                playlistContainer.appendChild(li);
            });

            updatePlaylistActiveState();
        }

        function loadTrack(index) {
            const track = trackList[index];
            if (!track) return;

            currentTrackIndex = index;
            currentTitleEl.textContent = track.title;
            currentTimeEl.textContent = "0:00";
            durationTimeEl.textContent = "0:00";
            seekSlider.value = 0;

            if (audio.src !== track.file) {
                audio.pause();
                audio.src = track.file;
                audio.load();
            }

            updatePlaylistActiveState();

            if (activeBottomController === bottomController) {
                updateBottomMusicBar(bottomController, isPlaying);
            }
        }

        function setPlaying(value) {
            isPlaying = value;
            player.classList.toggle("is-playing", value);
            albumLayout.classList.toggle("is-playing", value);
            updatePlayButton();
            updatePlaylistActiveState();
        }

        function playTrack() {
            const track = trackList[currentTrackIndex];
            if (!track) return;

            if (activeNativeAudio && activeNativeAudio !== audio) {
                pauseNativeAudio();
            }
            if (typeof pauseYouTubeAudio === "function") {
                pauseYouTubeAudio();
            }

            if (audio.src !== track.file) {
                audio.src = track.file;
            }
            audio.preload = "auto";

            const playPromise = audio.play();

            if (playPromise && typeof playPromise.then === "function") {
                playPromise
                    .then(() => {
                        activeNativeAudio = audio;
                        activeNativePlayBtn = playPauseBtn;
                        activeAlbumLayout = albumLayout;
                        activeBottomController = bottomController;
                        setPlaying(true);
                        updateBottomMusicBar(bottomController, true);
                    })
                    .catch(error => {
                        console.error("AUDIO ERROR: Could not play", audio.src, error);
                        setPlaying(false);
                    });
            } else {
                activeNativeAudio = audio;
                activeNativePlayBtn = playPauseBtn;
                activeAlbumLayout = albumLayout;
                activeBottomController = bottomController;
                setPlaying(true);
                updateBottomMusicBar(bottomController, true);
            }
        }

        function pauseTrack() {
            audio.pause();
            setPlaying(false);
            if (activeBottomController === bottomController) {
                updateBottomMusicBar(bottomController, false);
            }
        }

        function nextTrack() {
            const nextIndex = (currentTrackIndex + 1) % trackList.length;
            loadTrack(nextIndex);
            playTrack();
        }

        function prevTrack() {
            const prevIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
            loadTrack(prevIndex);
            playTrack();
        }

        playPauseBtn.addEventListener("click", () => {
            if (isPlaying && !audio.paused) pauseTrack();
            else playTrack();
        });

        nextBtn.addEventListener("click", nextTrack);
        prevBtn.addEventListener("click", prevTrack);

        audio.addEventListener("loadedmetadata", () => {
            durationTimeEl.textContent = formatTime(audio.duration);
            if (activeBottomController === bottomController) syncBottomProgress(audio);
        });

        audio.addEventListener("timeupdate", () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                seekSlider.value = (audio.currentTime / audio.duration) * 100;
                currentTimeEl.textContent = formatTime(audio.currentTime);
                durationTimeEl.textContent = formatTime(audio.duration);
            }
            if (activeBottomController === bottomController) syncBottomProgress(audio);
        });

        seekSlider.addEventListener("input", () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                audio.currentTime = audio.duration * (seekSlider.value / 100);
            }
        });

        audio.addEventListener("play", () => {
            activeNativeAudio = audio;
            activeNativePlayBtn = playPauseBtn;
            activeAlbumLayout = albumLayout;
            activeBottomController = bottomController;
            setPlaying(true);
            updateBottomMusicBar(bottomController, true);
        });

        audio.addEventListener("pause", () => {
            if (!audio.ended) {
                setPlaying(false);
                if (activeBottomController === bottomController) updateBottomMusicBar(bottomController, false);
            }
        });

        audio.addEventListener("ended", nextTrack);

        audio.addEventListener("error", () => {
            console.error("Audio failed to load:", audio.src, audio.error);
            setPlaying(false);
        });

        loadPlaylist();
        loadTrack(currentTrackIndex);
    });
}