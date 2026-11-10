const vocals_time = document.getElementById("vocals_time")
const vocals_seek = document.getElementById("vocals_seek")
const vocals_play_btn = document.getElementById("vocals_play_btn")
const vocalsAudio = document.getElementById("vocalsAudio")

const instru_time = document.getElementById("instru_time")
const instru_seek = document.getElementById("instru_seek")
const instru_play_btn = document.getElementById("instru_play_btn")
const instruAudio = document.getElementById("instruAudio")

const uploadbox = document.querySelector(".uploadbox")
const fileInput = document.getElementById("fileInput")
const source_audio = document.getElementById("source_audio")
const source_time = document.getElementById("source_time")
const source_seek = document.getElementById("source_seek")
const source_play_btn = document.getElementById("source_play_btn")

uploadbox.addEventListener("click", () => {
    fileInput.click()
})

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    source_audio.src = url
    source_seek.value = 0
    updateSeekFill(source_seek)

    uploadbox.style.display = "none"
    source_audio.closest(".source_player").hidden = false
})

function updateSeekFill(seekEl) {
    const pct = seekEl.max > 0 ? (seekEl.value / seekEl.max) * 100 : 0;
    seekEl.style.background =
        `linear-gradient(to right, var(--muted) ${pct}%, var(--border) ${pct}%)`;
}

function wireAudioPlayer(audioEl, btnEl, seekEl, timeEl) {
    const iconPlay = btnEl.querySelector('.icon-play');
    const iconPause = btnEl.querySelector('.icon-pause');

    function formatTime(sec) {
        if (!isFinite(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    btnEl.addEventListener('click', () => {
        if (audioEl.paused) {
            audioEl.play();
        } else {
            audioEl.pause();
        }
    });

    audioEl.addEventListener('play', () => {
        iconPlay.hidden = true;
        iconPause.hidden = false;
        btnEl.setAttribute('aria-label', 'Pause');
    });

    audioEl.addEventListener('pause', () => {
        iconPlay.hidden = false;
        iconPause.hidden = true;
        btnEl.setAttribute('aria-label', 'Play');
    });

    audioEl.addEventListener('loadedmetadata', () => {
        seekEl.max = audioEl.duration;
    });

    audioEl.addEventListener('timeupdate', () => {
        seekEl.value = audioEl.currentTime;
        timeEl.textContent = formatTime(audioEl.currentTime);
    });

    audioEl.addEventListener('timeupdate', () => {
        seekEl.value = audioEl.currentTime;
        timeEl.textContent = formatTime(audioEl.currentTime);
        updateSeekFill(seekEl);
    });

    audioEl.addEventListener('loadedmetadata', () => {
        seekEl.max = audioEl.duration;
        updateSeekFill(seekEl); // reset to 0% on load
    });

    seekEl.addEventListener('input', () => {
        audioEl.currentTime = seekEl.value;
        updateSeekFill(seekEl);
    });
}

wireAudioPlayer(vocalsAudio, vocals_play_btn, vocals_seek, vocals_time)
wireAudioPlayer(instruAudio, instru_play_btn, instru_seek, instru_time)
wireAudioPlayer(source_audio, source_play_btn, source_seek, source_time)

source_audio.addEventListener("loadedmetadata", () => {
    source_seek.max = source_audio.duration
    updateSeekFill(source_seek)
})