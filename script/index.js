/*LISTA DE CANCIONES*/
var music = [
    {
        "title":"Agachate",
        "singer":"Danny Romero",
        "path":"./bucket/Danny_Romero_Agachate.mp3",
        "cover":"./bucket/Portadas/agachate.png",
    },
    {
        "title":"Angeles Fuimos",
        "singer":"Adrian Barba",
        "path":"./bucket/angeles_fuimos.mp3",
        "cover":"./bucket/Portadas/angeles.png",
    },
    
    {
        "title":"Matalas",
        "singer":"Alejandro Fernández",
        "path":"./bucket/Matalas.mp3",
        "cover":"./bucket/Portadas/matalas.png",
    },
    {
        "title":"Havana",
        "singer":"Camila Cabello",
        "path":"./bucket/Camila_Cabello_Havana.mp3",
        "cover":"./bucket/Portadas/havana.png",
    },
    {
        "title":"Beauty and a Beat",
        "singer":"Justin Bieber ft. Nicki Minaj",
        "path":"./bucket/Beauty_and_a_beat.mp3",
        "cover":"./bucket/Portadas/beauty.png",
    },
    {
        "title":"Boss Bitch",
        "singer":"Doja Cat",
        "path":"./bucket/Boss_Bitch_Doja_Cat.mp3",
        "cover":"./bucket/Portadas/boss.png",
    },
    {
        "title":"Treat you better",
        "singer":"Shawn Mendes",
        "path":"./bucket/Treat_You_Better.mp3",
        "cover":"./bucket/Portadas/treat.png",
    },
    {
        "title":"Pasarela",
        "singer":"Daddy Yankee",
        "path":"./bucket/Daddy_Yankee_Pasarela.mp3",
        "cover":"./bucket/Portadas/pasarela.png",
    },
    {
        "title":"Colgando en tus manos",
        "singer":"Carlos Baute y Marta Sánchez",
        "path":"./bucket/Carlos_Baute_y_Marta_Sánchez_Colgando_en_tus_manos.mp3",
        "cover":"./bucket/Portadas/colgando.png",
    }
   
];

//ESTADOS PARA EL BOTON DE PLAYBACK
const PlaybackState = {
    REPEAT: 'repeat',
    RANDOM: 'random',
    REPEAT_LIST: 'repeat-list',
};

var currentPlaybackState = PlaybackState.REPEAT_LIST; // Estado inicial
var currentSongIndex = null; // Indice de la cancion actual
var player = document.getElementById("player"); // Reproductor

// CARGAR LA LISTA DE CANCIONES
function getList(){
    var output = "";
    var songsList = music;

    songsList.forEach((song, index) => {
        output += `
            <tr class="row">
                <td>
                    <img src="./bucket/icon/play_list.svg" id="btn-playPause${index}" onclick='playMusic(${index})'>
                </td>
                <td>
                    <b>${song.title}</b>
                    <br>
                    <span>${song.singer}</span>
                </td>
            </tr>
        `;
    });

    document.getElementById("tbody").innerHTML = output;
}

// INICIAR LA REPRODUCCION DE LA CANCION
function playMusic(index) {
    const song = music[index];

    if (player.getAttribute("src") !== song.path) {
        player.src = song.path;
        player.load();
    }

    if (player.paused) {
        player.play();
        updatePlayPauseButtons(index, true);
        document.getElementById("ti").innerHTML = song.title;
        document.getElementById("ar").innerHTML = song.singer;
        document.getElementById("cover").src = song.cover ? song.cover : "./bucket/Portadas/null.png";
        currentSongIndex = index;
    } else {
        player.pause();
        updatePlayPauseButtons(index, false);
    }
}

//CAMBIAR EL ESTADO DE BOTON DE PLAY/PAUSE
function toggleMainPlayPause() {
    if (player.paused) {
        player.play();
        updatePlayPauseButtons(currentSongIndex, true);
    } else {
        player.pause();
        updatePlayPauseButtons(currentSongIndex, false);
    }
}

//ACTUALIZAR LOS BOTONES DE PLAY/PAUSE
function updatePlayPauseButtons(index, isPlaying) {
    const buttons = document.querySelectorAll('img[id^="btn-playPause"]'); // Todos los botones de play/pause de la lista
    buttons.forEach(button => button.src = "./bucket/icon/play_list.svg");
    document.getElementById("main-playPause").src = isPlaying ? "./bucket/icon/pause.svg" : "./bucket/icon/play.svg";
    if (index !== null) {
        document.getElementById(`btn-playPause${index}`).src = isPlaying ? "./bucket/icon/pause_list.svg" : "./bucket/icon/play_list.svg";
    }
}

//PASAR DE SEGUNDOS A MINUTOS
function calculateTime(secs){
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${returnedSeconds}`;
}

//ACTUALIZAR EL TIEMPO DE LA CANCION
function updateTimes(){
    document.getElementById("current-time").innerHTML = calculateTime(player.currentTime);
    document.getElementById("duration").innerHTML = calculateTime(player.duration);
}

//REPRODUCIR LA CANCION ANTERIOR
function playPrevious() {
    if (currentSongIndex !== null) {
        currentSongIndex = (currentSongIndex - 1 + music.length) % music.length;
        playMusic(currentSongIndex);
    }
}

//REPRODUCIR LA CANCION SIGUIENTE
function playNext() {
    if ((currentSongIndex !== null)&&(currentPlaybackState === PlaybackState.RANDOM)) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * music.length);
        } while (newIndex === currentSongIndex);
        currentSongIndex = newIndex;
    }else{
        currentSongIndex = (currentSongIndex + 1) % music.length;
    }
    playMusic(currentSongIndex);
}

//CAMBIAR EL ESTADO DE REPRODUCCION
function changePlaybackState() {
    var playbackButton = document.getElementById('playback-button');
    switch (currentPlaybackState) {
        case PlaybackState.REPEAT:
            currentPlaybackState = PlaybackState.RANDOM;
            playbackButton.src = "./bucket/icon/shuffle.svg";
            player.loop = false;
        break;

        case PlaybackState.RANDOM:
            currentPlaybackState = PlaybackState.REPEAT_LIST;
            playbackButton.src = "./bucket/icon/list.svg";
            player.loop = false;
        break;

        case PlaybackState.REPEAT_LIST:
            currentPlaybackState = PlaybackState.REPEAT;
            playbackButton.src = "./bucket/icon/repeat.svg";
            player.loop = true;
        break;
    }
}

player.addEventListener("timeupdate", () => {
    player.readyState > 0 ? updateTimes() : null;
});


//EVENTOS
document.getElementById("player").addEventListener("ended", playNext);
document.getElementById("btn-previous").addEventListener("click", playPrevious);
document.getElementById("main-playPause").addEventListener("click", toggleMainPlayPause);
document.getElementById("btn-next").addEventListener("click", playNext);
document.getElementById("playback-button").addEventListener("click", changePlaybackState);