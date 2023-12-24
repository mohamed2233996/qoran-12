const API_URL = "https://mp3quran.net/api/v3";
const reciters = "/reciters";
const suwar = "/suwar";
const lang = "ar";

async function getReciters() {
    const chooseReciter = document.querySelector("#chooseReciter");

    let res = await fetch(`${API_URL}${reciters}?language=${lang}`);
    const data = await res.json();

    chooseReciter.innerHTML = `<option value ="">اختر اسم القارئ</option >`
    data.reciters.forEach(reciter => {
        chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`
    })

    chooseReciter.addEventListener('change', (e) => getRewayat(e.target.value));

}

getReciters();

async function getRewayat(reciter) {
    console.log(reciter)
    const chooseRewayat = document.querySelector("#chooseRewayat");

    let res = await fetch(`${API_URL}${reciters}?language=${lang}&reciter=${reciter}`);
    const data = await res.json();
    const moshafs = data.reciters[0].moshaf

    chooseRewayat.innerHTML = `<option value ="" data-server="" data-suwarlist="">اختر اسم المصحف</option >`
    moshafs.forEach(moshaf => {
        chooseRewayat.innerHTML += `<option value="${moshaf.id}" data-server="${moshaf.server}" data-suwarlist="${moshaf.surah_list}" >${moshaf.name}</option>`
    })

    chooseRewayat.addEventListener('change', (e) => {
        const selectedMoshaf = chooseRewayat.options[chooseRewayat.selectedIndex]
        const server = selectedMoshaf.dataset.server;
        const suwarlist = selectedMoshaf.dataset.suwarlist;

        getSurah(server, suwarlist)
    });

}

async function getSurah(server, suwarlist) {
    const chooseSurah = document.querySelector("#chooseSurah");

    let res = await fetch(`${API_URL}${suwar}?language=${lang}`);
    const data = await res.json();
    const suwarNames = data.suwar;

    suwarlist = suwarlist.split(',')

    chooseSurah.innerHTML = `<option value ="">اختر السورة</option >`
    suwarlist.forEach(suwar => {
        const badsuwar = suwar.padStart(3, '0')
        suwarNames.forEach(suwarName => {
            if (suwarName.id == suwar) {
                chooseSurah.innerHTML += `<option value="${server}${badsuwar}.mp3">${suwarName.name}</option>`
            }
        })
    })

    chooseSurah.addEventListener('change', (e) => {
        const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex]
        const server = selectedSurah.value;
        souraInfoFan()
        playSura(server)
    });
}

function souraInfoFan() {
    const souraInfo = document.querySelectorAll('.souraInfo')
    const chooseReciter = document.querySelector("#chooseReciter");
    const chooseRewayat = document.querySelector("#chooseRewayat");
    const chooseSurah = document.querySelector("#chooseSurah");

    const ReciterName = chooseReciter.options[chooseReciter.selectedIndex].text
    const rewayatName = chooseRewayat.options[chooseRewayat.selectedIndex].text
    const suraName = chooseSurah.options[chooseSurah.selectedIndex].text

    souraInfo[0].classList.add("d-flex")
    souraInfo[0].innerHTML = `<div class="souraInfo-right">
        <h2>${suraName} - ${ReciterName}</h2>
        <p>${rewayatName}</p>
    </div>
    <div class="souraInfo-left">
        <p style="color:var(--main-color);">ابد التشغيل من المشغل</p>
    </div>`
}

function playSura(server) {
    const audioElement = document.querySelectorAll('.audio-player-ele');
    const audiosourcElement = audioElement[0].getElementsByTagName('source')[0];
    console.log(audiosourcElement)
    audiosourcElement.src = server;
    audioElement[0].load()
    audioElement.play;
}


///live

function playLive(port) {
    if (Hls.isSupported()) {
        var video = document.getElementById('live-video');
        var hls = new Hls();
        hls.loadSource(`${port} `);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    }
}

///////

// async function getTadabor() {
//     let res = await fetch(`${API_URL}/tadabor`);
//     const data = await res.json();
//     console.log(data)

//     // data.forEach(reciter => {
        
//     // })

// }
// getTadabor()
