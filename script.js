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
            
            const randomDelay = Math.random() * -2; 
            bar.style.animationDelay = `${randomDelay}s`;
            
            const randomDuration = 0.9 + (Math.random() * 0.6);
            bar.style.animationDuration = `${randomDuration}s`;
            
            equalizerContainer.appendChild(bar);
        }
    }

    // --- Hero Slider Logic ---
    const heroSection = document.querySelector('.hero');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (heroSection && leftArrow && rightArrow) {
        const images = [
            'images/hero.png',   
            'images/hero2.jpg',  
            'images/logo.png'   
        ];

        let currentIndex = 0;

        function updateBackgroundImage() {
            heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('${images[currentIndex]}')`;
        }

        leftArrow.addEventListener('click', () => {
            currentIndex--; 
            if (currentIndex < 0) { currentIndex = images.length - 1; }
            updateBackgroundImage();
        });

        rightArrow.addEventListener('click', () => {
            currentIndex++; 
            if (currentIndex >= images.length) { currentIndex = 0; }
            updateBackgroundImage();
        });
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('.main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Scroll Reveal Animation Logic ---
    function reveal() {
        const reveals = document.querySelectorAll(".reveal");
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100; // Triggers when element is 100px into the viewport

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }

    window.addEventListener("scroll", reveal);
    reveal(); // Trigger once on load

}); // <--- DOMContentLoaded ENDS HERE


// --- YouTube API Audio Player Logic ---
let ytPlayers = {};
let currentlyPlayingElement = null;

function onYouTubeIframeAPIReady() {
    const playButtons = document.querySelectorAll(".yt-play-btn");

    playButtons.forEach((btn, index) => {
        const videoId = btn.getAttribute("data-youtube-id");
        const playerDivId = `yt-player-${index + 1}`;

        ytPlayers[playerDivId] = new YT.Player(playerDivId, {
            height: "1",
            width: "1",
            videoId: videoId,
            playerVars: {
                playsinline: 1,
                controls: 0,
                disablekb: 1
            }
        });

        btn.addEventListener("click", function () {
            handleYouTubePlayPause(this, playerDivId, "grid");
        });
    });

    const featuredAlbum = document.getElementById("featured-album");

    if (featuredAlbum) {
        const featuredVideoId = featuredAlbum.getAttribute("data-youtube-id");
        const featuredPlayerId = "yt-player-featured";

        ytPlayers[featuredPlayerId] = new YT.Player(featuredPlayerId, {
            height: "1",
            width: "1",
            videoId: featuredVideoId,
            playerVars: {
                playsinline: 1,
                controls: 0,
                disablekb: 1
            }
        });

        featuredAlbum.addEventListener("click", function () {
            handleYouTubePlayPause(this, featuredPlayerId, "featured");
        });
    }
}

function handleYouTubePlayPause(clickedElement, playerId, type) {
    const player = ytPlayers[playerId];
    const playerState = player.getPlayerState();

    pauseNativeAudio();

    if (currentlyPlayingElement && currentlyPlayingElement.el !== clickedElement) {
        ytPlayers[currentlyPlayingElement.id].pauseVideo();

        if (currentlyPlayingElement.type === "grid") {
            currentlyPlayingElement.el.innerHTML = "&#9658;";
        } else if (currentlyPlayingElement.type === "featured") {
            currentlyPlayingElement.el.classList.remove("is-playing");
        }
    }

    if (playerState !== 1) {
        player.playVideo();

        if (type === "grid") {
            clickedElement.innerHTML = "&#10074;&#10074;";
        } else if (type === "featured") {
            clickedElement.classList.add("is-playing");
        }

        currentlyPlayingElement = {
            el: clickedElement,
            id: playerId,
            type: type
        };
    } else {
        player.pauseVideo();

        if (type === "grid") {
            clickedElement.innerHTML = "&#9658;";
        } else if (type === "featured") {
            clickedElement.classList.remove("is-playing");
        }

        currentlyPlayingElement = null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
  setupNativeAudioPlayers();
});

function setupNativeAudioPlayers() {
  const players = document.querySelectorAll(".custom-audio-player");
  if (!players.length) return;

  const albums = {
    "1623": [
      { title: "Sixteen Twenty Three", file: "albums/1623/01 Sixteen Twenty Three.m4a", artist: "Johb Ashar" },
      { title: "Twenty Eight Thirty Four", file: "albums/1623/02 Twenty Eight Thirty Four.m4a", artist: "Johb Ashar" },
      { title: "Four One Eleven", file: "albums/1623/03 Four One Eleven.m4a", artist: "Johb Ashar" },
      { title: "Peace. Be Still.", file: "albums/1623/04 Peace. Be Still.m4a", artist: "Johb Ashar" },
      { title: "Thirty Nine Forty Six", file: "albums/1623/05 Thirty Nine Forty Six.m4a", artist: "Johb Ashar" },
      { title: "I AM", file: "albums/1623/06 I AM.m4a", artist: "Johb Ashar" },
      { title: "Symphony 23 Complete", file: "albums/1623/07 Symphony 23 Complete_ 1623.m4a", artist: "Johb Ashar" }
    ],

    "another-victory": [
      { title: "The Victim", file: "albums/Another Victory for the Worm/01 The Victim.m4a", artist: "Johb Ashar" },
      { title: "Universal Justice", file: "albums/Another Victory for the Worm/02 Universal Justice.m4a", artist: "Johb Ashar" },
      { title: "The Worm", file: "albums/Another Victory for the Worm/03 The Worm.m4a", artist: "Johb Ashar" },
      { title: "The Prepetator", file: "albums/Another Victory for the Worm/04 The Prepetrator.m4a", artist: "Johb Ashar" },
      { title: "The Accomplice", file: "albums/Another Victory for the Worm/05 The Accomplice.m4a", artist: "Johb Ashar" },
      { title: "The Silent - The Weak", file: "albums/Another Victory for the Worm/06 The Silent - The Weak.m4a", artist: "Johb Ashar" },
      { title: "Another Victory for the Worm", file: "albums/Another Victory for the Worm/07 Another Victory for the Worm.m4a", artist: "Johb Ashar" }
    ]
  };

  let activeAudio = null;
  let activeButton = null;

  players.forEach(player => {
    const albumKey = player.dataset.album;
    const trackList = albums[albumKey];

    if (!trackList) return;

    const audio = player.querySelector(".native-audio");
    const playPauseBtn = player.querySelector(".play-pause-btn");
    const prevBtn = player.querySelector(".prev-btn");
    const nextBtn = player.querySelector(".next-btn");
    const seekSlider = player.querySelector(".seek-slider");
    const currentTimeEl = player.querySelector(".current-time");
    const durationTimeEl = player.querySelector(".duration-time");
    const currentTitleEl = player.querySelector(".current-track-title");
    const playlistContainer = player.querySelector(".playlist-container");

    let currentTrackIndex = 0;
    let isPlaying = false;

    function loadPlaylist() {
      playlistContainer.innerHTML = "";

      trackList.forEach((track, index) => {
        const li = document.createElement("li");
        li.className = "playlist-item";

        if (index === currentTrackIndex) li.classList.add("active");

        li.innerHTML = `
          <div class="track-number">${index === currentTrackIndex ? "▶" : index + 1}</div>
          <div class="track-info">
            <div class="title">${track.title}</div>
            <div class="artist">${track.artist}</div>
          </div>
          <div class="track-duration"></div>
        `;

        li.addEventListener("click", () => {
          currentTrackIndex = index;
          loadTrack(currentTrackIndex);
          playTrack();
        });

        playlistContainer.appendChild(li);
      });
    }

    function loadTrack(index) {
      audio.src = trackList[index].file;
      currentTitleEl.innerText = trackList[index].title;
      seekSlider.value = 0;
      currentTimeEl.innerText = "0:00";
      if (durationTimeEl) durationTimeEl.innerText = "0:00";
      loadPlaylist();
    }

    function playTrack() {
      if (typeof pauseYouTubeAudio === "function") pauseYouTubeAudio();

      if (activeAudio && activeAudio !== audio) {
        activeAudio.pause();
        if (activeButton) activeButton.innerHTML = "▶";
      }

      audio.play();
      isPlaying = true;
      playPauseBtn.innerHTML = "⏸";

      activeAudio = audio;
      activeButton = playPauseBtn;
    }

    function pauseTrack() {
      audio.pause();
      isPlaying = false;
      playPauseBtn.innerHTML = "▶";
    }

    playPauseBtn.addEventListener("click", () => {
      isPlaying ? pauseTrack() : playTrack();
    });

    nextBtn.addEventListener("click", () => {
      currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
      loadTrack(currentTrackIndex);
      playTrack();
    });

    prevBtn.addEventListener("click", () => {
      currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
      loadTrack(currentTrackIndex);
      playTrack();
    });

    audio.addEventListener("timeupdate", () => {
      if (!isNaN(audio.duration)) {
        seekSlider.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        if (durationTimeEl) durationTimeEl.innerText = formatTime(audio.duration);
      }
    });

    seekSlider.addEventListener("input", () => {
      if (isNaN(audio.duration)) return;
      audio.currentTime = audio.duration * (seekSlider.value / 100);
    });

    audio.addEventListener("ended", () => {
      nextBtn.click();
    });

    function formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      let sec = Math.floor(seconds % 60);
      if (sec < 10) sec = `0${sec}`;
      return `${min}:${sec}`;
    }

    loadTrack(currentTrackIndex);
  });
}
