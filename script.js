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
 {title: "Sixteen Twenty Three",
    file: "https://github.com/Addz89/johb-green-website/raw/refs/heads/main/albums/1623/01%20Sixteen%20Twenty%20Three.m4a",
    artist: "Johb Ashar"
  },
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
    ],
    "cave-of-revelation": [
            { title: "CDOPST REVISIT", file: "albums/Cave of Revelation/01 CDOPST REVISIT.m4a", artist: "Johb Ashar" },
            { title: "WITH YOU I AM LOVE", file: "albums/Cave of Revelation/02 WITH YOU I AM LOVE.m4a", artist: "Johb Ashar" },
            { title: "PATMOS PART ONE", file: "albums/Cave of Revelation/03 PATMOS PART ONE.m4a", artist: "Johb Ashar" },
            { title: "PATMOS PART TWO", file: "albums/Cave of Revelation/04 PATMOS PART TWO.m4a", artist: "Johb Ashar" },
            { title: "SKULL OF SAINT THOMAS", file: "albums/Cave of Revelation/05 SKULL OF SAINT THOMAS.m4a", artist: "Johb Ashar" },
            { title: "CARETAKER MONK", file: "albums/Cave of Revelation/06 CARETAKER MONK.m4a", artist: "Johb Ashar" },
            { title: "CAVE OF REVELATION", file: "albums/Cave of Revelation/07 CAVE OF REVELATION.m4a", artist: "Johb Ashar" },
            { title: "CDOPST", file: "albums/Cave of Revelation/08 CDOPST.m4a", artist: "Johb Ashar" }
        ],
    "fire": [
            { title: "You Do It For Me", file: "albums/Fire/01 You Do It For Me.m4a", artist: "Johb Ashar" },
            { title: "Mustard Seed", file: "albums/Fire/02 Mustard Seed.m4a", artist: "Johb Ashar" },
            { title: "Oh Lord", file: "albums/Fire/03 Oh Lord.m4a", artist: "Johb Ashar" },
            { title: "Cast the Net", file: "albums/Fire/04 Cast the Net.m4a", artist: "Johb Ashar" },
            { title: "The Lantern", file: "albums/Fire/05 The Lantern.m4a", artist: "Johb Ashar" },
            { title: "When the Night Accuses Me", file: "albums/Fire/06 When the Night Accuses Me.m4a", artist: "Johb Ashar" },
            { title: "Dishonest Manager", file: "albums/Fire/07 Dishonest Manager.m4a", artist: "Johb Ashar" },
            { title: "The Persistent Widow", file: "albums/Fire/08 The Persistent Widow.m4a", artist: "Johb Ashar" },
            { title: "Hidden Treasure", file: "albums/Fire/09 Hidden Treasure.m4a", artist: "Johb Ashar" },
            { title: "Father is Home", file: "albums/Fire/10 Father is Home.m4a", artist: "Johb Ashar" },
            { title: "Fire", file: "albums/Fire/11 Fire.m4a", artist: "Johb Ashar" },
            { title: "Let the Dead", file: "albums/Fire/12 Let the Dead.m4a", artist: "Johb Ashar" },
            { title: "Tenants", file: "albums/Fire/13 Tenants.m4a", artist: "Johb Ashar" }
        ],
    "friday": [
            { title: "Before the Priests", file: "albums/Friday/01 Before the Priests.m4a", artist: "Johb Ashar" },
            { title: "Antipas and Pilate", file: "albums/Friday/02 Antipas and Pilate.m4a", artist: "Johb Ashar" },
            { title: "Sixth Hour", file: "albums/Friday/03 Sixth Hour.m4a", artist: "Johb Ashar" },
            { title: "Ninth Hour", file: "albums/Friday/04 Ninth Hour.m4a", artist: "Johb Ashar" },
            { title: "Symphony 25: Miserere Movement 1", file: "albums/Friday/05 Symphony 25_ Miserere Movement 1.m4a", artist: "Johb Ashar" },
            { title: "Symphony 25: Miserere Movement 2", file: "albums/Friday/06 Symphony 25_ Miserere Movement 2.m4a", artist: "Johb Ashar" },
            { title: "Symphony 25: Miserere Movement 3", file: "albums/Friday/07 Symphony 25_ Miserere Movement 3.m4a", artist: "Johb Ashar" },
            { title: "Symphony 25: Miserere Movement 4", file: "albums/Friday/08 Symphony 25_ Miserere Movement 4.m4a", artist: "Johb Ashar" }
        ],
    "ghost-on-a-righteous-track": [
            { title: "The Sower", file: "albums/Ghost on a Righteous Track/01 The Sower.m4a", artist: "Johb Ashar" },
            { title: "Unmerciful Servant", file: "albums/Ghost on a Righteous Track/02 Unmerciful Servant.m4a", artist: "Johb Ashar" },
            { title: "Ghost on a Righteous Track", file: "albums/Ghost on a Righteous Track/03 Ghost on a Righteous Track.m4a", artist: "Johb Ashar" },
            { title: "Rich Fool", file: "albums/Ghost on a Righteous Track/04 Rich Fool.m4a", artist: "Johb Ashar" },
            { title: "Lost Coin", file: "albums/Ghost on a Righteous Track/05 Lost Coin.m4a", artist: "Johb Ashar" },
            { title: "Divided Kingdom", file: "albums/Ghost on a Righteous Track/06 Divided Kingdom.m4a", artist: "Johb Ashar" },
            { title: "Two Sons", file: "albums/Ghost on a Righteous Track/08 Two Sons.m4a", artist: "Johb Ashar" },
            { title: "The Wedding Feast", file: "albums/Ghost on a Righteous Track/09 The Wedding Feast.m4a", artist: "Johb Ashar" },
            { title: "Prodigal Son Returns", file: "albums/Ghost on a Righteous Track/10 Prodigal Son Returns.m4a", artist: "Johb Ashar" },
            { title: "The Pharisee: The Tax Collector", file: "albums/Ghost on a Righteous Track/11 The Pharisee_ The Tax Collector.m4a", artist: "Johb Ashar" },
            { title: "Lazarus", file: "albums/Ghost on a Righteous Track/12 Lazarus.m4a", artist: "Johb Ashar" },
            { title: "One Zero Nine", file: "albums/Ghost on a Righteous Track/13 One Zero Nine.m4a", artist: "Johb Ashar" },
            { title: "The Lost Sheep", file: "albums/Ghost on a Righteous Track/14 The Lost Sheep.m4a", artist: "Johb Ashar" }
        ],
    "healing-is-a-myth": [
            { title: "Forgotten", file: "albums/Healing is a Myth/01 Forgotten.m4a", artist: "Johb Ashar" },
            { title: "Healing is a Myth", file: "albums/Healing is a Myth/02 Healing is a Myth.m4a", artist: "Johb Ashar" },
            { title: "Broken", file: "albums/Healing is a Myth/03 Broken.m4a", artist: "Johb Ashar" },
            { title: "Jericho Call", file: "albums/Healing is a Myth/04 Jericho Call.m4a", artist: "Johb Ashar" },
            { title: "Where I Can Just Be", file: "albums/Healing is a Myth/05 Where I Can Just Be.m4a", artist: "Johb Ashar" },
            { title: "Axis", file: "albums/Healing is a Myth/06 Axis.m4a", artist: "Johb Ashar" },
            { title: "South Street Six", file: "albums/Healing is a Myth/07 South Street Six.m4a", artist: "Johb Ashar" },
            { title: "Ode to Mary Kathleen", file: "albums/Healing is a Myth/08 Ode to Mary Kathleen.m4a", artist: "Johb Ashar" }
        ],
    "it-is-finished": [
            { title: "Why Have You Forsaken Me", file: "albums/It is FINISHED/01 Why Have You Forsaken Me.m4a", artist: "Johb Ashar" },
            { title: "They Know Not What They Do", file: "albums/It is FINISHED/02 They Know Not What They Do.m4a", artist: "Johb Ashar" },
            { title: "I Thirst", file: "albums/It is FINISHED/03 I Thirst.m4a", artist: "Johb Ashar" },
            { title: "Psalm 22", file: "albums/It is FINISHED/04 Psalm 22.m4a", artist: "Johb Ashar" },
            { title: "Mother, Behold Your Son", file: "albums/It is FINISHED/05 Mother, Behold Your Son.m4a", artist: "Johb Ashar" },
            { title: "It is Finished", file: "albums/It is FINISHED/06 It is Finished.m4a", artist: "Johb Ashar" },
            { title: "Into Your Hands", file: "albums/It is FINISHED/07 Into Your Hands.m4a", artist: "Johb Ashar" },
            { title: "Symphony 6 Complete", file: "albums/It is FINISHED/08 Symphony 6 Complete.m4a", artist: "Johb Ashar" }
        ],
    "iter": [
            { title: "ITER UNA - PART 1 AND 2 - NEVER CRY", file: "albums/ITER/01 ITER UNA - PART 1 AND 2 - NEVER CRY.m4a", artist: "Johb Ashar" },
            { title: "ITER UNA - PART 3 - PRAYER THAT FORGETS ITS GOD", file: "albums/ITER/02 ITER UNA - PART 3 - PRAYER THAT FORGETS ITS GOD.m4a", artist: "Johb Ashar" },
            { title: "ITER SOLA - PART 1 - NO SHADOW", file: "albums/ITER/03 ITER SOLA - PART 1 - NO SHADOW.m4a", artist: "Johb Ashar" },
            { title: "ITER SOLA - PART 2 - THE MIRROR BLACK", file: "albums/ITER/04 ITER SOLA - PART 2 - THE MIRROR BLACK.m4a", artist: "Johb Ashar" },
            { title: "ITER SOLA - PART 3 - THE REJECTION - THE REFLECTION", file: "albums/ITER/05 ITER SOLA - PART 3 - THE REJECTION - THE REFLECTION.m4a", artist: "Johb Ashar" },
            { title: "ITER DOLORUM - PART 1 AND 2 - PAIN IS MY COVENANT", file: "albums/ITER/06 ITER DOLORUM - PART 1 AND 2 - PAIN IS MY COVENANT.m4a", artist: "Johb Ashar" },
            { title: "ITER DOLORUM - TRINITY (SHAME, BETRAYAL, FILL THE BLANK)", file: "albums/ITER/07  ITER DOLORUM - TRINITY (SHAME, BETRAYAL, FILL THE BLANK).m4a", artist: "Johb Ashar" },
            { title: "ITER SOLITUDE - I DRANK MY FEAR AND IT BECAME A MIRROR", file: "albums/ITER/09 ITER SOLITUDE - I DRANK MY FEAR AND IT BECAME A MIRROR.m4a", artist: "Johb Ashar" },
            { title: "INTER SOLITUDE - CODA", file: "albums/ITER/10 INTER SOLITUDE - CODA.m4a", artist: "Johb Ashar" }
        ],
    "iter-solitudine-requiem": [
            { title: "iter solitudine requiem", file: "albums/iter solitudine requiem/01 iter solitudine requiem.m4a", artist: "Johb Ashar" },
            { title: "iter una", file: "albums/iter solitudine requiem/02 iter una.m4a", artist: "Johb Ashar" },
            { title: "iter sola", file: "albums/iter solitudine requiem/03 iter sola.m4a", artist: "Johb Ashar" },
            { title: "iter dolorum", file: "albums/iter solitudine requiem/04 iter dolorum.m4a", artist: "Johb Ashar" },
            { title: "inter solitudine", file: "albums/iter solitudine requiem/05 inter solitudine.m4a", artist: "Johb Ashar" }
        ],
    "judas-kiss": [
            { title: "The Knife in the Cheek", file: "albums/Judas kiss/01 The Knife in the Cheek.m4a", artist: "Johb Ashar" },
            { title: "Healing is a Mess", file: "albums/Judas kiss/02 Healing is a Mess.m4a", artist: "Johb Ashar" },
            { title: "Vision of Judas", file: "albums/Judas kiss/03 Vision of Judas.m4a", artist: "Johb Ashar" },
            { title: "Betrayal Prelude", file: "albums/Judas kiss/04 Betrayal Prelude.m4a", artist: "Johb Ashar" },
            { title: "Symphony 20 The Judas Kiss", file: "albums/Judas kiss/05 Symphony 20 The Judas Kiss.m4a", artist: "Johb Ashar" }
        ],
    "kuroi-odori": [
            { title: "Black Sun Dance", file: "albums/KUROI ODORI/01 Black Sun Dance.m4a", artist: "Johb Ashar" },
            { title: "Speciemen Log - Human Form", file: "albums/KUROI ODORI/02 Speciemen Log - Human Form.m4a", artist: "Johb Ashar" },
            { title: "Afterimage Study One_Study Two", file: "albums/KUROI ODORI/03 Afterimage Study One_Study Two.m4a", artist: "Johb Ashar" },
            { title: "Untitled - August Residue", file: "albums/KUROI ODORI/04 Untitled - August Residue.m4a", artist: "Johb Ashar" },
            { title: "Confiscated Reel", file: "albums/KUROI ODORI/05 Confiscated Reel.m4a", artist: "Johb Ashar" },
            { title: "Symphony 21 - Paupertas Butoh", file: "albums/KUROI ODORI/06 Symphony 21 - Paupertas Butoh.m4a", artist: "Johb Ashar" }
        ],

        "lamentation": [
            { title: "Prelude", file: "albums/Lamentation/01 Prelude.m4a", artist: "Johb Ashar" },
            { title: "Lamentation I", file: "albums/Lamentation/02 Lamentation I.m4a", artist: "Johb Ashar" },
            { title: "Urbs Vidua", file: "albums/Lamentation/03 Urbs Vidua.m4a", artist: "Johb Ashar" },
            { title: "Ira Velata", file: "albums/Lamentation/04 Ira Velata.m4a", artist: "Johb Ashar" },
            { title: "Lamentation II", file: "albums/Lamentation/05 Lamentation II.m4a", artist: "Johb Ashar" },
            { title: "Spes Cineris", file: "albums/Lamentation/06 Spes Cineris.m4a", artist: "Johb Ashar" },
            { title: "Corona Lapsa", file: "albums/Lamentation/07 Corona Lapsa.m4a", artist: "Johb Ashar" },
            { title: "Lamentation III", file: "albums/Lamentation/08 Lamentation III.m4a", artist: "Johb Ashar" },
            { title: "Redde Nos", file: "albums/Lamentation/09 Redde Nos.m4a", artist: "Johb Ashar" },
            { title: "Lamentation IV", file: "albums/Lamentation/10 Lamentation IV.m4a", artist: "Johb Ashar" },
            { title: "Muri Fracti", file: "albums/Lamentation/11 Muri Fracti.m4a", artist: "Johb Ashar" },
            { title: "Testis Silens", file: "albums/Lamentation/12 Testis Silens.m4a", artist: "Johb Ashar" },
            { title: "Lamentation V", file: "albums/Lamentation/13 Lamentation V.m4a", artist: "Johb Ashar" },
            { title: "Ultima Flamma", file: "albums/Lamentation/14 Ultima Flamma.m4a", artist: "Johb Ashar" }
        ],
        "markan-episodes": [
            { title: "Only Believe", file: "albums/MARKAN EPISODES/01 Only Believe.m4a", artist: "Johb Ashar" },
            { title: "Without Breath", file: "albums/MARKAN EPISODES/02 Without Breath.m4a", artist: "Johb Ashar" },
            { title: "Not Blind", file: "albums/MARKAN EPISODES/03 Not Blind.m4a", artist: "Johb Ashar" },
            { title: "Not Name", file: "albums/MARKAN EPISODES/04 Not Name.m4a", artist: "Johb Ashar" },
            { title: "No, No, No", file: "albums/MARKAN EPISODES/05 No, No, No.m4a", artist: "Johb Ashar" },
            { title: "Markan Episodes", file: "albums/MARKAN EPISODES/06 Markan Episodes.m4a", artist: "Johb Ashar" },
            { title: "The Juxtaposition of Death - Movement I", file: "albums/MARKAN EPISODES/07 The Juxtaposition of Death - Movement I.m4a", artist: "Johb Ashar" },
            { title: "The Juxtaposition of Death - Movement II", file: "albums/MARKAN EPISODES/08 The Juxtaposition of Death - Movement II.m4a", artist: "Johb Ashar" },
            { title: "The Juxtaposition of Death - Movement III", file: "albums/MARKAN EPISODES/09 The Juxtaposition of Death - Movement III.m4a", artist: "Johb Ashar" },
            { title: "The Juxtaposition of Death - Movement IV", file: "albums/MARKAN EPISODES/10 The Juxtaposition of Death - Movement IV.m4a", artist: "Johb Ashar" }
        ],
"meet-me-here": [
    { title: "Hammer on the War Machine", file: "albums/Meet Me Here/01 Hammer on the War Machine.m4a", artist: "Johb Ashar" },
    { title: "One Hundred and Eighty", file: "albums/Meet Me Here/02 One Hundred and Eighty.m4a", artist: "Johb Ashar" },
    { title: "Meet Me Here", file: "albums/Meet Me Here/03 Meet Me Here.m4a", artist: "Johb Ashar" },
    { title: "Merton", file: "albums/Meet Me Here/04 Merton.m4a", artist: "Johb Ashar" },
    { title: "Love Them Anyway", file: "albums/Meet Me Here/05 Love Them Anyway.m4a", artist: "Johb Ashar" },
    { title: "The Trurth is Not Afraid of Death", file: "albums/Meet Me Here/06 The Trurth is Not Afraid of Death.m4a", artist: "Johb Ashar" },
    { title: "Labre", file: "albums/Meet Me Here/07 Labre.m4a", artist: "Johb Ashar" },
    { title: "Let Go of God for God To Be", file: "albums/Meet Me Here/08 Let Go of God for God To Be.m4a", artist: "Johb Ashar" },
    { title: "Who Am I", file: "albums/Meet Me Here/09 Who Am I.m4a", artist: "Johb Ashar" },
    { title: "MLK", file: "albums/Meet Me Here/10 MLK.m4a", artist: "Johb Ashar" },
    { title: "Dorothy Day", file: "albums/Meet Me Here/11 Dorothy Day.m4a", artist: "Johb Ashar" },
    { title: "One Hundred and Eighty (Instrumental)", file: "albums/Meet Me Here/12 One Hundred and Eighty (Instrumental).m4a", artist: "Johb Ashar" }
],

"memoria": [
    { title: "Kronos - time has won", file: "albums/Memoria/01 Kronos - time has won.m4a", artist: "Johb Ashar" },
    { title: "The Gift - the death", file: "albums/Memoria/02 The Gift - the death.m4a", artist: "Johb Ashar" },
    { title: "Dorothy part 1", file: "albums/Memoria/03 Dorothy part 1.m4a", artist: "Johb Ashar" },
    { title: "I_m in Love - guitar mix", file: "albums/Memoria/04 I_m in Love - guitar mix.m4a", artist: "Johb Ashar" },
    { title: "Without U - by my side", file: "albums/Memoria/05 Without U - by my side.m4a", artist: "Johb Ashar" },
    { title: "Learning how to Fly", file: "albums/Memoria/06 Learning how to Fly.m4a", artist: "Johb Ashar" },
    { title: "Chant des Sirenes part 1", file: "albums/Memoria/07 Chant des Sirenes part 1.m4a", artist: "Johb Ashar" },
    { title: "Dorothy part 2", file: "albums/Memoria/08 Dorothy part 2.m4a", artist: "Johb Ashar" },
    { title: "Never Be - what should", file: "albums/Memoria/09 Never Be - what should.m4a", artist: "Johb Ashar" },
    { title: "Chant des Sirenes part 2", file: "albums/Memoria/10 Chant des Sirenes  part 2.m4a", artist: "Johb Ashar" },
    { title: "INRI - reflection", file: "albums/Memoria/11 INRI - reflection.m4a", artist: "Johb Ashar" },
    { title: "Dorothy part 3", file: "albums/Memoria/12 Dorothy part 3.m4a", artist: "Johb Ashar" },
    { title: "Paraddisum - guitar mix", file: "albums/Memoria/13 Paraddisum - guitar mix.m4a", artist: "Johb Ashar" },
    { title: "Edith - shadow mix", file: "albums/Memoria/14 Edith - shadow mix.m4a", artist: "Johb Ashar" },
    { title: "Hit My Face - dirty max", file: "albums/Memoria/16 Hit My Face - dirty max.m4a", artist: "Johb Ashar" },
    { title: "Wait a Little - grunge blues mix", file: "albums/Memoria/17 Wait a Littrle - grunge blues mix.m4a", artist: "Johb Ashar" },
    { title: "Sea of Arabah - nakba mix", file: "albums/Memoria/18 Sea of Arabah - nakba mix.m4a", artist: "Johb Ashar" },
    { title: "Magico Man - instrumental", file: "albums/Memoria/19 Magico Man.- instrumental.m4a", artist: "Johb Ashar" },
    { title: "1988 - memoria mix", file: "albums/Memoria/20 1988 - memoria mix.m4a", artist: "Johb Ashar" }
],
"opprimitur-affectibus": [
    { title: "SALVIFICI DOLORIS PART ONE", file: "albums/Opprimitur Affectibus/01 SALVIFICI DOLORIS PART ONE.m4a", artist: "Johb Ashar" },
    { title: "SALVIFICI DOLORIS PART TWO", file: "albums/Opprimitur Affectibus/02 SALVIFICI DOLORIS PART TWO.m4a", artist: "Johb Ashar" },
    { title: "SALVIFICI DOLORIS PART THREE", file: "albums/Opprimitur Affectibus/03 SALVIFICI DOLORIS PART THREE.m4a", artist: "Johb Ashar" },
    { title: "SALVIFICI DOLORIS PART FOUR", file: "albums/Opprimitur Affectibus/04 SALVIFICI DOLORIS PART FOUR.m4a", artist: "Johb Ashar" },
    { title: "SYMPHONY 12 - PART 1_ SORROW", file: "albums/Opprimitur Affectibus/05 SYMPHONY 12 - PART 1_ SORROW.m4a", artist: "Johb Ashar" },
    { title: "SYMPHONY 12 - PART 2_ MY GOD", file: "albums/Opprimitur Affectibus/06 SYMPHONY 12 - PART 2_ MY GOD.m4a", artist: "Johb Ashar" },
    { title: "SYMPHONY 12 - PART 3_ PUSHING THE LIMITS", file: "albums/Opprimitur Affectibus/07 SYMPHONY 12 - PART 3_ PUSHING THE LIMITS.m4a", artist: "Johb Ashar" },
    { title: "SYMPHONY 12 - PART 4_ IF ONE SUFFERS WE ALL SUFFER", file: "albums/Opprimitur Affectibus/08 SYMPHONY 12 - PART 4_ IF ONE SUFFERS WE ALL SUFFER.m4a", artist: "Johb Ashar" }
],
"requiem-for-a-sinner": [
    { title: "Requiem Aeteram", file: "albums/Requiem for a Sinner/01 Requiem Aeteram.m4a", artist: "Johb Ashar" },
    { title: "Kyrie Eleison", file: "albums/Requiem for a Sinner/02 Kyrie Eleison.m4a", artist: "Johb Ashar" },
    { title: "Dies Irae", file: "albums/Requiem for a Sinner/03 Dies Irae.m4a", artist: "Johb Ashar" },
    { title: "Sanctus", file: "albums/Requiem for a Sinner/04 Sanctus.m4a", artist: "Johb Ashar" },
    { title: "Benedictus", file: "albums/Requiem for a Sinner/05 Benedictus.m4a", artist: "Johb Ashar" },
    { title: "Recordare", file: "albums/Requiem for a Sinner/06 Recordare.m4a", artist: "Johb Ashar" },
    { title: "Lacrimosa", file: "albums/Requiem for a Sinner/07 Lacrimosa.m4a", artist: "Johb Ashar" },
    { title: "Agnus Dei", file: "albums/Requiem for a Sinner/08 Agnus Dei.m4a", artist: "Johb Ashar" },
    { title: "Communio", file: "albums/Requiem for a Sinner/09 Communio.m4a", artist: "Johb Ashar" },
    { title: "Lux Aeterna", file: "albums/Requiem for a Sinner/10 Lux Aeterna.m4a", artist: "Johb Ashar" },
    { title: "Jerusalem", file: "albums/Requiem for a Sinner/11 Jerusalem.m4a", artist: "Johb Ashar" }
],
"sanctified": [
    { title: "Toma", file: "albums/SANCTIFIED/01 Toma.m4a", artist: "Johb Ashar" },
    { title: "Yoldat Aloho", file: "albums/SANCTIFIED/02 Yoldat Aloho.m4a", artist: "Johb Ashar" },
    { title: "Mattai", file: "albums/SANCTIFIED/03 Mattai.m4a", artist: "Johb Ashar" },
    { title: "Yaqub Bar Qerlyot", file: "albums/SANCTIFIED/04 Yaqub Bar Qerlyot.m4a", artist: "Johb Ashar" },
    { title: "Yahuda Ish Qerlyot", file: "albums/SANCTIFIED/05 Yahuda Ish Qerlyot.m4a", artist: "Johb Ashar" },
    { title: "Yehuda Ish Qerlyot", file: "albums/SANCTIFIED/05 Yehuda Ish Qerlyot.m4a", artist: "Johb Ashar" },
    { title: "Shimeon Kepha", file: "albums/SANCTIFIED/06 Shimeon Kepha.m4a", artist: "Johb Ashar" },
    { title: "Bar - Tolmay", file: "albums/SANCTIFIED/07 Bar - Tolmay.m4a", artist: "Johb Ashar" },
    { title: "Bar-Tolmay", file: "albums/SANCTIFIED/07 Bar-Tolmay.m4a", artist: "Johb Ashar" },
    { title: "Maryam Magdlayta", file: "albums/SANCTIFIED/08 Maryam Magdlayta.m4a", artist: "Johb Ashar" },
    { title: "Maryam Magdleyta", file: "albums/SANCTIFIED/08 Maryam Magdleyta.m4a", artist: "Johb Ashar" },
    { title: "Martam, Marta, Lazar", file: "albums/SANCTIFIED/09 Martam, Marta, Lazar.m4a", artist: "Johb Ashar" },
    { title: "Maryam, Marta, Lazar", file: "albums/SANCTIFIED/09 Maryam, Marta, Lazar.m4a", artist: "Johb Ashar" },
    { title: "Andraos", file: "albums/SANCTIFIED/10 Andraos.m4a", artist: "Johb Ashar" },
    { title: "Philipos", file: "albums/SANCTIFIED/11 Philipos.m4a", artist: "Johb Ashar" },
    { title: "Yehuda Thadda", file: "albums/SANCTIFIED/12 Yehuda Thadda.m4a", artist: "Johb Ashar" },
    { title: "Simeon Qananayai", file: "albums/SANCTIFIED/13 Simeon Qananayai.m4a", artist: "Johb Ashar" },
    { title: "Yohanan Bar Zavdai", file: "albums/SANCTIFIED/14 Yohanan Bar Zavdai.m4a", artist: "Johb Ashar" },
    { title: "Yaqub bar Zadai", file: "albums/SANCTIFIED/15 Yaqub bar Zadai.m4a", artist: "Johb Ashar" },
    { title: "Yaqub Bar Zavdai", file: "albums/SANCTIFIED/15 Yaqub Bar Zavdai.m4a", artist: "Johb Ashar" }
],
"seven-seals-of-the-apocalypse": [
    { title: "Overture", file: "albums/Seven Seals of the Apocalypse/01 Overture.m4a", artist: "Johb Ashar" },
    { title: "Seal I", file: "albums/Seven Seals of the Apocalypse/02 Seal I.m4a", artist: "Johb Ashar" },
    { title: "Seal II", file: "albums/Seven Seals of the Apocalypse/03 Seal II.m4a", artist: "Johb Ashar" },
    { title: "Seal III", file: "albums/Seven Seals of the Apocalypse/04 Seal III.m4a", artist: "Johb Ashar" },
    { title: "Seal IV", file: "albums/Seven Seals of the Apocalypse/05 Seal IV.m4a", artist: "Johb Ashar" },
    { title: "Seal V", file: "albums/Seven Seals of the Apocalypse/06 Seal V.m4a", artist: "Johb Ashar" },
    { title: "Seal VI", file: "albums/Seven Seals of the Apocalypse/07 Seal VI.m4a", artist: "Johb Ashar" },
    { title: "Seal VII", file: "albums/Seven Seals of the Apocalypse/08 Seal VII.m4a", artist: "Johb Ashar" },
    { title: "Reprise", file: "albums/Seven Seals of the Apocalypse/09 Reprise.m4a", artist: "Johb Ashar" }
],

"skin-for-skin-volume-one": [
    { title: "I Tell The Truth", file: "albums/Skin for Skin - Volume One/01 I Tell The Truth.m4a", artist: "Johb Ashar" },
    { title: "Take It Away", file: "albums/Skin for Skin - Volume One/02 Take It Away.m4a", artist: "Johb Ashar" },
    { title: "World Kept Breaking", file: "albums/Skin for Skin - Volume One/03 World Kept Breaking.m4a", artist: "Johb Ashar" },
    { title: "Not Yet Come", file: "albums/Skin for Skin - Volume One/04 Not Yet Come.m4a", artist: "Johb Ashar" },
    { title: "Hit The Flesh", file: "albums/Skin for Skin - Volume One/05 Hit The Flesh.m4a", artist: "Johb Ashar" },
    { title: "When Sorrow Filled Seven Days", file: "albums/Skin for Skin - Volume One/06 When Sorrow Filled Seven Days.m4a", artist: "Johb Ashar" },
    { title: "The Ashes Fall", file: "albums/Skin for Skin - Volume One/07 The Ashes Fall.m4a", artist: "Johb Ashar" },
    { title: "Just To Watch Me Die", file: "albums/Skin for Skin - Volume One/08 Just To Watch Me Die.m4a", artist: "Johb Ashar" },
    { title: "When Did The Innocent Ever Lose", file: "albums/Skin for Skin - Volume One/09 When Did The Innocent Ever Lose.m4a", artist: "Johb Ashar" },
    { title: "God Does Not Lie", file: "albums/Skin for Skin - Volume One/10 God Does Not Lie.m4a", artist: "Johb Ashar" },
    { title: "Sword That Remembers Every Name", file: "albums/Skin for Skin - Volume One/11 Sword That Remembers Every Name.m4a", artist: "Johb Ashar" },
    { title: "Can You Measure God", file: "albums/Skin for Skin - Volume One/12 Can You Measure God.m4a", artist: "Johb Ashar" },
    { title: "You_ve Been Faithful Long Enough", file: "albums/Skin for Skin - Volume One/13 You_ve Been Faithful Long Enough.m4a", artist: "Johb Ashar" },
    { title: "Answer Me", file: "albums/Skin for Skin - Volume One/14 Answer Me.m4a", artist: "Johb Ashar" }
],

"skin-for-skin-volume-two": [
    { title: "Act Two", file: "albums/Skin for Skin - Volume Two/01 Act Two.m4a", artist: "Johb Ashar" },
    { title: "Where Is Wisdom", file: "albums/Skin for Skin - Volume Two/02 Where Is Wisdom.m4a", artist: "Johb Ashar" },
    { title: "I Remember", file: "albums/Skin for Skin - Volume Two/03 I Remember.m4a", artist: "Johb Ashar" },
    { title: "Taste The Truth", file: "albums/Skin for Skin - Volume Two/04 Taste The Truth.m4a", artist: "Johb Ashar" },
    { title: "Bring All My Love Back Home", file: "albums/Skin for Skin - Volume Two/05 Bring All My Love Back Home.m4a", artist: "Johb Ashar" },
    { title: "I Am Innocent_ Still I_m Denied", file: "albums/Skin for Skin - Volume Two/06 I Am Innocent_  Still I_m Denied.m4a", artist: "Johb Ashar" },
    { title: "Where Were You", file: "albums/Skin for Skin - Volume Two/07 Where Were You.m4a", artist: "Johb Ashar" },
    { title: "Dust And Ashes", file: "albums/Skin for Skin - Volume Two/08 Dust And Ashes.m4a", artist: "Johb Ashar" },
    { title: "Hymnus De Sapientia Abscondita", file: "albums/Skin for Skin - Volume Two/09 Hymnus De Sapientia Abscondita.m4a", artist: "Johb Ashar" },
    { title: "Skin For Skin", file: "albums/Skin for Skin - Volume Two/10 Skin For Skin.m4a", artist: "Johb Ashar" }
],
"solace-in-my-wound": [
    { title: "Sipping Blood from a Cup", file: "albums/Solace In My Wound/01 Sipping Blood from a Cup.m4a", artist: "Johb Ashar" },
    { title: "This is All Life Is", file: "albums/Solace In My Wound/02 This is All Life Is.m4a", artist: "Johb Ashar" },
    { title: "Sehnsught", file: "albums/Solace In My Wound/03 Sehnsught.m4a", artist: "Johb Ashar" },
    { title: "Solace in My Wound Part 1_ Opening Theme", file: "albums/Solace In My Wound/04 Solace in My Wound Part 1_ Opening Theme.m4a", artist: "Johb Ashar" },
    { title: "Solace in My Wound Part 2_ The Wound", file: "albums/Solace In My Wound/05 Solace in My Wound Part 2_ The Wound.m4a", artist: "Johb Ashar" },
    { title: "Solace in My Wound Part 3_ Ashes Of My Being", file: "albums/Solace In My Wound/06 Solace in My Wound Part 3_ Ashes Of My Being.m4a", artist: "Johb Ashar" },
    { title: "Solace in My Wound Part 4_ Solace", file: "albums/Solace In My Wound/07 Solace in My Wound Part 4_ Solace.m4a", artist: "Johb Ashar" },
    { title: "Solace in My Wound Part 5_ Hold My Heart", file: "albums/Solace In My Wound/08 Solace in My Wound Part 5_ Hold My Heart.m4a", artist: "Johb Ashar" },
    { title: "Solace in My Wound Part 6_ Finale", file: "albums/Solace In My Wound/09 Solace in My Wound Part 6_ Finale.m4a", artist: "Johb Ashar" },
    { title: "Not Invited_ Ma_a d-dam mix", file: "albums/Solace In My Wound/10 Not Invited_ Ma_a d-dam mix.m4a", artist: "Johb Ashar" },
    { title: "Queen of the Noble Cause", file: "albums/Solace In My Wound/11 Queen of the Noble Cause.m4a", artist: "Johb Ashar" },
    { title: "Sipping Blood from a Cup (if it is geniune mix)", file: "albums/Solace In My Wound/12 Sipping Blood from a Cup (if it is geniune mix).m4a", artist: "Johb Ashar" },
    { title: "Not Invited", file: "albums/Solace In My Wound/13 Not Invited.m4a", artist: "Johb Ashar" }
],

"string-sonata-1-and-2": [
    { title: "SONATA 1 - 1 Bellum Incipit", file: "albums/STRING SONATA 1 AND 2/01 SONATA 1  - 1 Bellum Incipit.m4a", artist: "Johb Ashar" },
    { title: "SONATA 1 - 2 Beit Hanoun", file: "albums/STRING SONATA 1 AND 2/02 SONATA 1  - 2  Beit Hanoun.m4a", artist: "Johb Ashar" },
    { title: "SONATA 1 - 3 Gaza City", file: "albums/STRING SONATA 1 AND 2/03 SONATA 1  - 3  Gaza City.m4a", artist: "Johb Ashar" },
    { title: "SONATA 2 - 1 Khan Younis", file: "albums/STRING SONATA 1 AND 2/04 SONATA 2  - 1 Khan Younis.m4a", artist: "Johb Ashar" },
    { title: "SONATA 2 - 2 Rafah", file: "albums/STRING SONATA 1 AND 2/05 SONATA 2  - 2 Rafah.m4a", artist: "Johb Ashar" },
    { title: "SONATA 2 - 3 Bellum Infinitum", file: "albums/STRING SONATA 1 AND 2/06 SONATA 2 - 3 Bellum Infinitum.m4a", artist: "Johb Ashar" }
],

"symphony-4-portrait": [
    { title: "Symphony 4 _Portrait_ Movement 1", file: "albums/Symphony 4 - PORTRAIT/01 Symphony 4 _ Portrait _ Movement 1.m4a", artist: "Johb Ashar" },
    { title: "Symphony 4 _Portrait_ Movement 2", file: "albums/Symphony 4 - PORTRAIT/02 Symphony 4 _ Portrait _ Movement 2.m4a", artist: "Johb Ashar" },
    { title: "Symphony 4 _Portrait_ Movement 3", file: "albums/Symphony 4 - PORTRAIT/03 Symphony 4 _ Portrait _ Movement 3.m4a", artist: "Johb Ashar" },
    { title: "Symphony 4 _Portrait_ Movement 4", file: "albums/Symphony 4 - PORTRAIT/04 Symphony 4 _ Portrait _ Movement 4.m4a", artist: "Johb Ashar" },
    { title: "6484", file: "albums/Symphony 4 - PORTRAIT/05 6484.m4a", artist: "Johb Ashar" },
    { title: "The Coming of Darkness", file: "albums/Symphony 4 - PORTRAIT/06 The Coming of Darkness.m4a", artist: "Johb Ashar" },
    { title: "Light to Feel God", file: "albums/Symphony 4 - PORTRAIT/07 Light to Feel God.m4a", artist: "Johb Ashar" },
    { title: "Not Worthy Final", file: "albums/Symphony 4 - PORTRAIT/09 Not Worthy Final.m4a", artist: "Johb Ashar" }
],


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
