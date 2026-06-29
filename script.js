/* =========================================================
   JOHB ASHAR WEBSITE - ELITE SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Circular Equalizer Logic ---
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

const ICONS = {
    play: `<svg class="player-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>`,
    pause: `<svg class="player-icon" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"></path></svg>`,
    prev: `<svg class="player-icon" viewBox="0 0 24 24"><path d="M6 5h2v14H6zM9 12l9 7V5z"></path></svg>`,
    next: `<svg class="player-icon" viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM15 12L6 19V5z"></path></svg>`,
    playlistPlay: `<svg class="track-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>`
};

function pauseNativeAudio() {
    if (activeNativeAudio) {
        activeNativeAudio.pause();
        if (activeNativePlayBtn) activeNativePlayBtn.innerHTML = ICONS.play;
        if (activeAlbumLayout) activeAlbumLayout.classList.remove('is-playing');
    }
}

// FIX: Convert raw GitHub to CDN so browser plays it.
function cleanAudioUrl(url) {
    if (!url) return "";

    // Allows you to paste normal GitHub file-page links like:
    // https://github.com/Addz89/johb-green-website/blob/main/albums/1623/01%20Sixteen%20Twenty%20Three.m4a
    // The audio player converts them to the real media URL that browsers can try to play.
    const githubBlobPrefix = "https://github.com/Addz89/johb-green-website/blob/main/";
    const githubRawRefsPrefix = "https://github.com/Addz89/johb-green-website/raw/refs/heads/main/";
    const githubRawMainPrefix = "https://github.com/Addz89/johb-green-website/raw/main/";
    const rawGithubPrefix = "https://raw.githubusercontent.com/Addz89/johb-green-website/main/";
    const mediaGithubPrefix = "https://media.githubusercontent.com/media/Addz89/johb-green-website/main/";
    const jsDelivrPrefix = "https://cdn.jsdelivr.net/gh/Addz89/johb-green-website@main/";

    if (url.startsWith(githubBlobPrefix)) {
        return url.replace(githubBlobPrefix, mediaGithubPrefix);
    }

    if (url.startsWith(githubRawRefsPrefix)) {
        return url.replace(githubRawRefsPrefix, mediaGithubPrefix);
    }

    if (url.startsWith(githubRawMainPrefix)) {
        return url.replace(githubRawMainPrefix, mediaGithubPrefix);
    }

    if (url.startsWith(rawGithubPrefix)) {
        return url.replace(rawGithubPrefix, mediaGithubPrefix);
    }

    if (url.startsWith(jsDelivrPrefix)) {
        return url.replace(jsDelivrPrefix, mediaGithubPrefix);
    }

    return url;
}

function setupNativeAudioPlayers() {
    const players = document.querySelectorAll(".custom-audio-player");
    if (!players.length) return;

    // EXACT ALBUM DATABASE (HTTPS)
    const albums = {
"1623": [
    {
        title: "Sixteen Twenty Three",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-v1/01.Sixteen.Twenty.Three.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Twenty Eight Thirty Four",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-v1/02.Twenty.Eight.Thirty.Four.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Four One Eleven",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-v1/03.Four.One.Eleven.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Peace. Be Still.",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-v1/04.Peace.Be.Still.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Thirty Nine Forty Six",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-v1/05.Thirty.Nine.Forty.Six.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "I AM",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-v1/06.I.AM.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 23 Complete",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-v1/07.Symphony.23.Complete_.1623.m4a",
        artist: "Johb Ashar"
    }
],
"another-victory": [
    {
        title: "The Victim",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-another-victory/01.The.Victim.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Universal Justice",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-another-victory/02.Universal.Justice.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Worm",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-another-victory/03.The.Worm.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Prepetrator",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-another-victory/04.The.Prepetrator.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Accomplice",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-another-victory/05.The.Accomplice.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Silent - The Weak",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-another-victory/06.The.Silent.-.The.Weak.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Another Victory for the Worm",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-another-victory/07.Another.Victory.for.the.Worm.m4a",
        artist: "Johb Ashar"
    }
],
"cave-of-revelation": [
    {
        title: "CDOPST REVISIT",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-cave-of-revelation/01.CDOPST.REVISIT.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "WITH YOU I AM LOVE",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-cave-of-revelation/02.WITH.YOU.I.AM.LOVE.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "PATMOS PART ONE",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-cave-of-revelation/03.PATMOS.PART.ONE.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "PATMOS PART TWO",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-cave-of-revelation/04.PATMOS.PART.TWO.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SKULL OF SAINT THOMAS",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-cave-of-revelation/05.SKULL.OF.SAINT.THOMAS.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "CARETAKER MONK",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-cave-of-revelation/06.CARETAKER.MONK.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "CAVE OF REVELATION",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-cave-of-revelation/07.CAVE.OF.REVELATION.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "CDOPST",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-cave-of-revelation/08.CDOPST.m4a",
        artist: "Johb Ashar"
    }
],
"fire": [
    {
        title: "You Do It For Me",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/01.You.Do.It.For.Me.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Mustard Seed",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/02.Mustard.Seed.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Oh Lord",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/03.Oh.Lord.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Cast the Net",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/04.Cast.the.Net.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Lantern",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/05.The.Lantern.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "When the Night Accuses Me",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/06.When.the.Night.Accuses.Me.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Dishonest Manager",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/07.Dishonest.Manager.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Persistent Widow",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/08.The.Persistent.Widow.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Hidden Treasure",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/09.Hidden.Treasure.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Father is Home",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/10.Father.is.Home.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Fire",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/11.Fire.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Let the Dead",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/12.Let.the.Dead.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Tenants",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-fire/13.Tenants.m4a",
        artist: "Johb Ashar"
    }
],
"friday": [
    {
        title: "Before the Priests",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-friday/01.Before.the.Priests.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Antipas and Pilate",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-friday/02.Antipas.and.Pilate.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Sixth Hour",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-friday/03.Sixth.Hour.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Ninth Hour",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-friday/04.Ninth.Hour.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 25: Miserere Movement 1",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-friday/05.Symphony.25_.Miserere.Movement.1.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 25: Miserere Movement 2",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-friday/06.Symphony.25_.Miserere.Movement.2.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 25: Miserere Movement 3",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-friday/07.Symphony.25_.Miserere.Movement.3.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 25: Miserere Movement 4",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-friday/08.Symphony.25_.Miserere.Movement.4.m4a",
        artist: "Johb Ashar"
    }
],
"ghost-on-a-righteous-track": [
    {
        title: "The Sower",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/01.The.Sower.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Unmerciful Servant",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/02.Unmerciful.Servant.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Ghost on a Righteous Track",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/03.Ghost.on.a.Righteous.Track.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Rich Fool",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/04.Rich.Fool.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lost Coin",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/05.Lost.Coin.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Divided Kingdom",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/06.Divided.Kingdom.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Two Sons",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/08.Two.Sons.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Wedding Feast",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/09.The.Wedding.Feast.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Prodigal Son Returns",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/10.Prodigal.Son.Returns.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Pharisee: The Tax Collector",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/11.The.Pharisee_.The.Tax.Collector.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lazarus",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/12.Lazarus.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "One Zero Nine",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/13.One.Zero.Nine.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Lost Sheep",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-ghost-on-a-righteous-track/14.The.Lost.Sheep.m4a",
        artist: "Johb Ashar"
    }
],
"healing-is-a-myth": [
    {
        title: "Forgotten",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-healing-is-a-myth/01.Forgotten.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Healing is a Myth",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-healing-is-a-myth/02.Healing.is.a.Myth.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Broken",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-healing-is-a-myth/03.Broken.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Jericho Call",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-healing-is-a-myth/04.Jericho.Call.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Where I Can Just Be",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-healing-is-a-myth/05.Where.I.Can.Just.Be.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Axis",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-healing-is-a-myth/06.Axis.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "South Street Six",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-healing-is-a-myth/07.South.Street.Six.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Ode to Mary Kathleen",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-healing-is-a-myth/08.Ode.to.Mary.Kathleen.m4a",
        artist: "Johb Ashar"
    }
],
"it-is-finished": [
    {
        title: "Why Have You Forsaken Me",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-it-is-finished/01.Why.Have.You.Forsaken.Me.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "They Know Not What They Do",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-it-is-finished/02.They.Know.Not.What.They.Do.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "I Thirst",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-it-is-finished/03.I.Thirst.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Psalm 22",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-it-is-finished/04.Psalm.22.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Mother, Behold Your Son",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-it-is-finished/05.Mother,.Behold.Your.Son.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "It is Finished",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-it-is-finished/06.It.is.Finished.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Into Your Hands",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-it-is-finished/07.Into.Your.Hands.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 6 Complete",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-it-is-finished/08.Symphony.6.Complete.m4a",
        artist: "Johb Ashar"
    }
],
"iter": [
    {
        title: "ITER UNA - PART 1 AND 2 - NEVER CRY",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/01.ITER.UNA.-.PART.1.AND.2.-.NEVER.CRY.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "ITER UNA - PART 3 - PRAYER THAT FORGETS ITS GOD",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/02.ITER.UNA.-.PART.3.-.PRAYER.THAT.FORGETS.ITS.GOD.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "ITER SOLA - PART 1 - NO SHADOW",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/03.ITER.SOLA.-.PART.1.-.NO.SHADOW.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "ITER SOLA - PART 2 - THE MIRROR BLACK",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/04.ITER.SOLA.-.PART.2.-.THE.MIRROR.BLACK.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "ITER SOLA - PART 3 - THE REJECTION - THE REFLECTION",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/05.ITER.SOLA.-.PART.3.-.THE.REJECTION.-.THE.REFLECTION.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "ITER DOLORUM - PART 1 AND 2 - PAIN IS MY COVENANT",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/06.ITER.DOLORUM.-.PART.1.AND.2.-.PAIN.IS.MY.COVENANT.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "ITER DOLORUM - TRINITY (SHAME, BETRAYAL, FILL THE BLANK)",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/07.ITER.DOLORUM.-.TRINITY.SHAME.BETRAYAL.FILL.THE.BLANK.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "ITER SOLITUDE - I DRANK MY FEAR AND IT BECAME A MIRROR",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/09.ITER.SOLITUDE.-.I.DRANK.MY.FEAR.AND.IT.BECAME.A.MIRROR.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "INTER SOLITUDE - CODA",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter/10.INTER.SOLITUDE.-.CODA.m4a",
        artist: "Johb Ashar"
    }
],
"iter-solitudine-requiem": [
    {
        title: "iter solitudine requiem",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter-solitudine-requiem/01.iter.solitudine.requiem.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "iter una",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter-solitudine-requiem/02.iter.una.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "iter sola",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter-solitudine-requiem/03.iter.sola.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "iter dolorum",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter-solitudine-requiem/04.iter.dolorum.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "inter solitudine",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-iter-solitudine-requiem/05.inter.solitudine.m4a",
        artist: "Johb Ashar"
    }
],
"judas-kiss": [
    {
        title: "The Knife in the Cheek",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-judas-kiss/01.The.Knife.in.the.Cheek.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Healing is a Mess",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-judas-kiss/02.Healing.is.a.Mess.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Vision of Judas",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-judas-kiss/03.Vision.of.Judas.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Betrayal Prelude",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-judas-kiss/04.Betrayal.Prelude.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 20 The Judas Kiss",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-judas-kiss/05.Symphony.20.The.Judas.Kiss.m4a",
        artist: "Johb Ashar"
    }
],
"kuroi-odori": [
    {
        title: "Black Sun Dance",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-kuroi-odori/01.Black.Sun.Dance.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Speciemen Log - Human Form",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-kuroi-odori/02.Speciemen.Log.-.Human.Form.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Afterimage Study One_Study Two",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-kuroi-odori/03.Afterimage.Study.One_Study.Two.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Untitled - August Residue",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-kuroi-odori/04.Untitled.-.August.Residue.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Confiscated Reel",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-kuroi-odori/05.Confiscated.Reel.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 21 - Paupertas Butoh",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-kuroi-odori/06.Symphony.21.-.Paupertas.Butoh.m4a",
        artist: "Johb Ashar"
    }
],
"lamentation": [
    {
        title: "Prelude",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/01.Prelude.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lamentation I",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/02.Lamentation.I.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Urbs Vidua",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/03.Urbs.Vidua.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Ira Velata",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/04.Ira.Velata.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lamentation II",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/05.Lamentation.II.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Spes Cineris",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/06.Spes.Cineris.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Corona Lapsa",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/07.Corona.Lapsa.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lamentation III",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/08.Lamentation.III.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Redde Nos",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/09.Redde.Nos.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lamentation IV",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/10.Lamentation.IV.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Muri Fracti",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/11.Muri.Fracti.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Testis Silens",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/12.Testis.Silens.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lamentation V",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/13.Lamentation.V.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Ultima Flamma",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-lamentation/14.Ultima.Flamma.m4a",
        artist: "Johb Ashar"
    }
],
"markan-episodes": [
    {
        title: "Only Believe",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/01.Only.Believe.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Without Breath",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/02.Without.Breath.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Not Blind",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/03.Not.Blind.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Not Name",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/04.Not.Name.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "No, No, No",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/05.No.No.No.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Markan Episodes",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/06.Markan.Episodes.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Juxtaposition of Death - Movement I",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/07.The.Juxtaposition.of.Death.-.Movement.I.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Juxtaposition of Death - Movement II",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/08.The.Juxtaposition.of.Death.-.Movement.II.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Juxtaposition of Death - Movement III",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/09.The.Juxtaposition.of.Death.-.Movement.III.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Juxtaposition of Death - Movement IV",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-markan-episodes/10.The.Juxtaposition.of.Death.-.Movement.IV.m4a",
        artist: "Johb Ashar"
    }
],
"meet-me-here": [
    {
        title: "Hammer on the War Machine",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/01.Hammer.on.the.War.Machine.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "One Hundred and Eighty",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/02.One.Hundred.and.Eighty.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Meet Me Here",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/03.Meet.Me.Here.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Merton",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/04.Merton.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Love Them Anyway",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/05.Love.Them.Anyway.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Truth is Not Afraid of Death",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/06.The.Trurth.is.Not.Afraid.of.Death.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Labre",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/07.Labre.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Let Go of God for God To Be",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/08.Let.Go.of.God.for.God.To.Be.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Who Am I",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/09.Who.Am.I.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "MLK",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/10.MLK.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Dorothy Day",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/11.Dorothy.Day.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "One Hundred and Eighty (Instrumental)",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-meet-me-here/12.One.Hundred.and.Eighty.Instrumental.m4a",
        artist: "Johb Ashar"
    }
],
"memoria": [
    {
        title: "Kronos - time has won",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/01.Kronos.-.time.has.won.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Gift - the death",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/02.The.Gift.-.the.death.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Dorothy part 1",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/03.Dorothy.part.1.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "I_m in Love - guitar mix",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/04.I_m.in.Love.-.guitar.mix.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Without U - by my side",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/05.Without.U.-.by.my.side.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Learning how to Fly",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/06.Learning.how.to.Fly.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Chant des Sirenes part 1",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/07.Chant.des.Sirenes.part.1.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Dorothy part 2",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/08.Dorothy.part.2.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Never Be - what should",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/09.Never.Be.-.what.should.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Chant des Sirenes part 2",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/10.Chant.des.Sirenes.part.2.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "INRI - reflection",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/11.INRI.-.reflection.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Dorothy part 3",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/12.Dorothy.part.3.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Paradisum - guitar mix",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/13.Paraddisum.-.guitar.mix.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Edith - shadow mix",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/14.Edith.-.shadow.mix.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Hit My Face - dirty max",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/16.Hit.My.Face.-.dirty.max.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Wait a Littrle - grunge blues mix",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/17.Wait.a.Littrle.-.grunge.blues.mix.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Sea of Arabah - nakba mix",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/18.Sea.of.Arabah.-.nakba.mix.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Magico Man.- instrumental",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/19.Magico.Man.-.instrumental.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "1988 - memoria mix",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-memoria/20.1988.-.memoria.mix.m4a",
        artist: "Johb Ashar"
    }
],
"opprimitur-affectibus": [
    {
        title: "SALVIFICI DOLORIS PART ONE",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-opprimitur-affectibus/01.SALVIFICI.DOLORIS.PART.ONE.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SALVIFICI DOLORIS PART TWO",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-opprimitur-affectibus/02.SALVIFICI.DOLORIS.PART.TWO.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SALVIFICI DOLORIS PART THREE",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-opprimitur-affectibus/03.SALVIFICI.DOLORIS.PART.THREE.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SALVIFICI DOLORIS PART FOUR",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-opprimitur-affectibus/04.SALVIFICI.DOLORIS.PART.FOUR.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SYMPHONY 12 - PART 1_ SORROW",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-opprimitur-affectibus/05.SYMPHONY.12.-.PART.1_.SORROW.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SYMPHONY 12 - PART 2_ MY GOD",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-opprimitur-affectibus/06.SYMPHONY.12.-.PART.2_.MY.GOD.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SYMPHONY 12 - PART 3_ PUSHING THE LIMITS",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-opprimitur-affectibus/07.SYMPHONY.12.-.PART.3_.PUSHING.THE.LIMITS.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SYMPHONY 12 - PART 4_ IF ONE SUFFERS WE ALL SUFFER",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-opprimitur-affectibus/08.SYMPHONY.12.-.PART.4_.IF.ONE.SUFFERS.WE.ALL.SUFFER.m4a",
        artist: "Johb Ashar"
    }
],
"requiem-for-a-sinner": [
    {
        title: "Requiem Aeteram",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/01.Requiem.Aeteram.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Kyrie Eleison",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/02.Kyrie.Eleison.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Dies Irae",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/03.Dies.Irae.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Sanctus",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/04.Sanctus.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Benedictus",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/05.Benedictus.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Recordare",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/06.Recordare.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lacrimosa",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/07.Lacrimosa.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Agnus Dei",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/08.Agnus.Dei.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Communio",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/09.Communio.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Lux Aeterna",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/10.Lux.Aeterna.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Jerusalem",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-requiem-for-a-sinner/11.Jerusalem.m4a",
        artist: "Johb Ashar"
    }
],
"sanctified": [
    {
        title: "Toma",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/01.Toma.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Yoldat Aloho",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/02.Yoldat.Aloho.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Mattai",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/03.Mattai.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Yaqub Bar Qerlyot",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/04.Yaqub.Bar.Qerlyot.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Yahuda Ish Qerlyot",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/05.Yahuda.Ish.Qerlyot.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Yehuda Ish Qerlyot",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/05.Yehuda.Ish.Qerlyot.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Shimeon Kepha",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/06.Shimeon.Kepha.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Bar - Tolmay",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/07.Bar.-.Tolmay.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Bar-Tolmay",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/07.Bar-Tolmay.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Maryam Magdlayta",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/08.Maryam.Magdlayta.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Maryam Magdleyta",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/08.Maryam.Magdleyta.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Martam, Marta, Lazar",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/09.Martam.Marta.Lazar.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Maryam, Marta, Lazar",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/09.Maryam.Marta.Lazar.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Andraos",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/10.Andraos.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Philippos",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/11.Philipos.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Yehuda Thaddai",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/12.Yehuda.Thadda.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Simeon Qananayai",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/13.Simeon.Qananayai.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Yohanan Bar Zavdai",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/14.Yohanan.Bar.Zavdai.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Yaqub bar Zadai",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/15.Yaqub.bar.Zadai.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Yaqub Bar Zavdai",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-sanctified/15.Yaqub.Bar.Zavdai.m4a",
        artist: "Johb Ashar"
    }
],
"seven-seals-of-the-apocalypse": [
    {
        title: "Overture",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/01.Overture.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Seal I",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/02.Seal.I.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Seal II",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/03.Seal.II.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Seal III",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/04.Seal.III.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Seal iV",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/05.Seal.iV.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Seal V",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/06.Seal.V.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Seal VI",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/07.Seal.VI.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Seal VII",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/08.Seal.VII.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Reprise",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-seven-seals-of-the-apocalypse/09.Reprise.m4a",
        artist: "Johb Ashar"
    }
],
"skin-for-skin-volume-one": [
    {
        title: "I Tell The Truth",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/01.I.Tell.The.Truth.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Take It Away",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/02.Take.It.Away.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "World Kept Breaking",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/03.World.Kept.Breaking.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Not Yet Come",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/04.Not.Yet.Come.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Hit The Flesh",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/05.Hit.The.Flesh.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "When Sorrow Filled Seven Days",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/06.When.Sorrow.Filled.Seven.Days.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Ashes Fall",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/07.The.Ashes.Fall.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Just To Watch Me Die",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/08.Just.To.Watch.Me.Die.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "When Did The Innocent Ever Lose",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/09.When.Did.The.Innocent.Ever.Lose.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "God Does Not Lie",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/10.God.Does.Not.Lie.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Sword That Remembers Every Name",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/11.Sword.That.Remembers.Every.Name.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Can You Measure God",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/12.Can.You.Measure.God.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "You_ve Been Faithful Long Enough",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/13.You_ve.Been.Faithful.Long.Enough.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Answer Me",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-one/14.Answer.Me.m4a",
        artist: "Johb Ashar"
    }
],
"skin-for-skin-volume-two": [
    {
        title: "Act Two",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/01.Act.Two.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Where Is Wisdom",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/02.Where.Is.Wisdom.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "I Remember",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/03.I.Remember.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Taste The Truth",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/04.Taste.The.Truth.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Bring All My Love Back Home",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/05.Bring.All.My.Love.Back.Home.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "I Am Innocent_ Still I_m Denied",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/06.I.Am.Innocent_.Still.I_m.Denied.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Where Were You",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/07.Where.Were.You.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Dust And Ashes",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/08.Dust.And.Ashes.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Hymnus De Sapientia Abscondita",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/09.Hymnus.De.Sapientia.Abscondita.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Skin For Skin",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-skin-for-skin-volume-two/10.Skin.For.Skin.m4a",
        artist: "Johb Ashar"
    }
],
"solace-in-my-wound": [
    {
        title: "Sipping Blood from a Cup",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/01.Sipping.Blood.from.a.Cup.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "This is All Life Is",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/02.This.is.All.Life.Is.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Sehnsught",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/03.Sehnsught.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Solace in My Wound Part 1_ Opening Theme",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/04.Solace.in.My.Wound.Part.1_.Opening.Theme.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Solace in My Wound Part 2_ The Wound",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/05.Solace.in.My.Wound.Part.2_.The.Wound.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Solace in My Wound Part 3_ Ashes Of My Being",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/06.Solace.in.My.Wound.Part.3_.Ashes.Of.My.Being.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Solace in My Wound Part 4_ Solace",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/07.Solace.in.My.Wound.Part.4_.Solace.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Solace in My Wound Part 5_ Hold My Heart",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/08.Solace.in.My.Wound.Part.5_.Hold.My.Heart.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Solace in My Wound Part 6_ Finale",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/09.Solace.in.My.Wound.Part.6_.Finale.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Not Invited_ Ma_a d-dam mix",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/10.Not.Invited_.Ma_a.d-dam.mix.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Queen of the Noble Cause",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/11.Queen.of.the.Noble.Cause.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Sipping Blood from a Cup (if it is geniune mix)",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/12.Sipping.Blood.from.a.Cup.if.it.is.geniune.mix.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Not Invited",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-solace-in-my-wound/13.Not.Invited.m4a",
        artist: "Johb Ashar"
    }
],
"string-sonata-1-and-2": [
    {
        title: "SONATA 1 - 1 Bellum Incipit",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-string-sonata-1-and-2/01.SONATA.1.-.1.Bellum.Incipit.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SONATA 1 - 2 Beit Hanoun",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-string-sonata-1-and-2/02.SONATA.1.-.2.Beit.Hanoun.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SONATA 1 - 3 Gaza City",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-string-sonata-1-and-2/03.SONATA.1.-.3.Gaza.City.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SONATA 2 - 1 Khan Younis",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-string-sonata-1-and-2/04.SONATA.2.-.1.Khan.Younis.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SONATA 2 - 2 Rafah",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-string-sonata-1-and-2/05.SONATA.2.-.2.Rafah.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "SONATA 2 - 3 Bellum Infinitum",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-string-sonata-1-and-2/06.SONATA.2.-.3.Bellum.Infinitum.m4a",
        artist: "Johb Ashar"
    }
],
"symphony-4-portrait": [
    {
        title: "Symphony 4 _ Portrait _ Movement 1",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-symphony-4-portrait/01.Symphony.4._.Portrait._.Movement.1.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 4 _ Portrait _ Movement 2",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-symphony-4-portrait/02.Symphony.4._.Portrait._.Movement.2.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 4 _ Portrait _ Movement 3",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-symphony-4-portrait/03.Symphony.4._.Portrait._.Movement.3.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Symphony 4 _ Portrait _ Movement 4",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-symphony-4-portrait/04.Symphony.4._.Portrait._.Movement.4.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "6484",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-symphony-4-portrait/05.6484.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "The Coming of Darkness",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-symphony-4-portrait/06.The.Coming.of.Darkness.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Light to Feel God",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-symphony-4-portrait/07.Light.to.Feel.God.m4a",
        artist: "Johb Ashar"
    },
    {
        title: "Not Worthy Final",
        file: "https://github.com/Addz89/johb-green-website/releases/download/audio-symphony-4-portrait/09.Not.Worthy.Final.m4a",
        artist: "Johb Ashar"
    }
]
    };

players.forEach(player => {
    const albumKey = player.dataset.album;
    const trackList = albums[albumKey];

    if (!trackList || !Array.isArray(trackList) || trackList.length === 0) {
        console.warn("No track list found for album:", albumKey);
        return;
    }

    const audio = player.querySelector(".native-audio");
    const playPauseBtn = player.querySelector(".play-pause-btn");
    const prevBtn = player.querySelector(".prev-btn");
    const nextBtn = player.querySelector(".next-btn");
    const seekSlider = player.querySelector(".seek-slider");
    const currentTimeEl = player.querySelector(".current-time");
    const durationTimeEl = player.querySelector(".duration-time");
    const currentTitleEl = player.querySelector(".current-track-title");
    const playlistContainer = player.querySelector(".playlist-container");
    const albumLayout = player.closest(".album-layout");

    if (!audio || !playPauseBtn || !prevBtn || !nextBtn || !seekSlider || !currentTimeEl || !durationTimeEl || !currentTitleEl || !playlistContainer) {
        console.warn("Missing player elements for album:", albumKey);
        return;
    }

    let currentTrackIndex = 0;
    let isPlaying = false;

    audio.preload = "metadata";
    audio.setAttribute("playsinline", "");
    audio.setAttribute("webkit-playsinline", "");

    playPauseBtn.innerHTML = ICONS.play;
    prevBtn.innerHTML = ICONS.prev;
    nextBtn.innerHTML = ICONS.next;

    const fallback = document.createElement("div");
    fallback.className = "audio-fallback";
    fallback.innerHTML = `
        <p>This track could not start in the mobile browser.</p>
        <a href="#" target="_blank" rel="noopener">Open audio file</a>
    `;
    player.appendChild(fallback);
    const fallbackLink = fallback.querySelector("a");

    function getTrackUrl(index) {
        const track = trackList[index];
        if (!track || !track.file) return "";
        return cleanAudioUrl(track.file);
    }

    function showFallback(url) {
        if (!url) return;
        fallbackLink.href = url;
        fallback.classList.add("show");
        audio.controls = true;
        audio.classList.add("show-native-audio");
    }
    function getPlayableAudioUrl(url) {
    return url
        .replace(
            "https://github.com/Addz89/johb-green-website/blob/main/",
            "https://media.githubusercontent.com/media/Addz89/johb-green-website/main/"
        )
        .replace(
            "https://github.com/Addz89/johb-green-website/raw/refs/heads/main/",
            "https://media.githubusercontent.com/media/Addz89/johb-green-website/main/"
        );
}

    function hideFallback() {
        fallback.classList.remove("show");
        audio.controls = false;
        audio.classList.remove("show-native-audio");
    }

    function setPlaying(value) {
        isPlaying = value;
        playPauseBtn.innerHTML = value ? ICONS.pause : ICONS.play;

        player.classList.toggle("is-playing", value);
        if (albumLayout) {
            albumLayout.classList.toggle("is-playing", value);
        }

        updatePlaylistActiveState();
    }

    function setTrackDisplay(index) {
        const track = trackList[index];
        if (!track) return;

        currentTitleEl.textContent = track.title;
        currentTimeEl.textContent = "0:00";
        durationTimeEl.textContent = "0:00";
        seekSlider.value = 0;

        updatePlaylistActiveState();
    }

    function loadPlaylist() {
        playlistContainer.innerHTML = "";

        trackList.forEach((track, index) => {
            const li = document.createElement("li");
            li.className = "playlist-item";
            li.classList.toggle("active", index === currentTrackIndex);

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

                currentTrackIndex = index;
                setTrackDisplay(currentTrackIndex);
                playTrack();
            });

            playlistContainer.appendChild(li);
        });

        updatePlaylistActiveState();
    }

    function updatePlaylistActiveState() {
        const items = playlistContainer.querySelectorAll(".playlist-item");

        items.forEach((item, index) => {
            const active = index === currentTrackIndex;
            const visualizer = item.querySelector(".playing-visualizer");
            const indexText = item.querySelector(".track-index");

            item.classList.toggle("active", active);

            if (visualizer) {
                visualizer.classList.toggle("active", active && isPlaying);
            }

            if (indexText) {
                indexText.style.display = active && isPlaying ? "none" : "";
            }
        });
    }

    function prepareTrackForPlayback() {
        const url = getTrackUrl(currentTrackIndex);

        if (!url) {
            console.warn("No audio URL found for:", albumKey, currentTrackIndex);
            return "";
        }

        hideFallback();

        // On mobile Safari, set the audio source only when the user taps play.
        // This keeps the play() call inside the user's gesture and avoids 0:00 metadata issues.
        if (audio.src !== url) {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
            audio.src = url;
        }

        audio.preload = "auto";
        return url;
    }

function playTrack() {
    if (activeNativeAudio && activeNativeAudio !== audio) {
        pauseNativeAudio();
    }

    audio.src = getPlayableAudioUrl(trackList[currentTrackIndex].file);

    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                isPlaying = true;
                playPauseBtn.innerHTML = ICONS.pause;
                player.classList.add("is-playing");
                if (albumLayout) albumLayout.classList.add("is-playing");

                activeNativeAudio = audio;
                activeNativePlayBtn = playPauseBtn;
                activeAlbumLayout = albumLayout;
            })
            .catch(error => {
                console.warn("Mobile audio failed:", audio.src, error);
            });
    }
}

    function pauseTrack() {
        audio.pause();
        setPlaying(false);
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
        setTrackDisplay(currentTrackIndex);
        playTrack();
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
        setTrackDisplay(currentTrackIndex);
        playTrack();
    }

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) return "0:00";

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60).toString().padStart(2, "0");

        return `${min}:${sec}`;
    }

    playPauseBtn.addEventListener("click", () => {
        isPlaying ? pauseTrack() : playTrack();
    });

    nextBtn.addEventListener("click", nextTrack);
    prevBtn.addEventListener("click", prevTrack);

    audio.addEventListener("loadedmetadata", () => {
        durationTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("canplay", () => {
        if (Number.isFinite(audio.duration)) {
            durationTimeEl.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener("timeupdate", () => {
        if (!Number.isFinite(audio.duration) || audio.duration === 0) return;

        seekSlider.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("pause", () => {
        if (!audio.ended) {
            setPlaying(false);
        }
    });

    audio.addEventListener("play", () => {
        setPlaying(true);
    });

    audio.addEventListener("ended", nextTrack);

    audio.addEventListener("error", () => {
        const url = getTrackUrl(currentTrackIndex);
        console.warn("Audio file could not load:", url, audio.error);
        setPlaying(false);
        showFallback(url);
    });

    seekSlider.addEventListener("input", () => {
        if (!Number.isFinite(audio.duration) || audio.duration === 0) return;
        audio.currentTime = audio.duration * (seekSlider.value / 100);
    });

    loadPlaylist();
    setTrackDisplay(currentTrackIndex);
});
}
