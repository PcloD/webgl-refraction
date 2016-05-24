
class audioWave {

    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();

        this.source = null;
        this.analyser = null;
    }

    load() {
        // console.log('load audio file');
    }

    inputStream(stream, fftSize) {
        // this.source = this.context.createMediaStreamSource(stream);
        const audio = document.getElementById('audio');
        audio.src = stream;
        this.source = this.context.createMediaElementSource(audio);

        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = fftSize;
        this.analyser.minDecibels = -100;
        this.analyser.maxDecibels = -30;
        this.analyser.smoothingTimeConstant = 0.6;

        this.source.connect(this.analyser);

        this.source.connect(this.context.destination);

        audio.loop = true;
        audio.play();

        // this.source.connect(this.context.destination);
    }

    getWave() {
        // const dataArray = new Uint8Array(this.analyser.fftSize);
        // this.analyser.getByteTimeDomainData(dataArray);
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);

        return dataArray;
    }

    getAudioDevices(success, error) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            // console.log("enumerateDevices() not supported.");
            return;
        }

        // List cameras and microphones.

        navigator.mediaDevices.enumerateDevices()
        .then(success)
        .catch(error);
    }

    getUserMedia(success, error) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const p = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            p.then(success).catch(error);
        } else {
            navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
            navigator.getUserMedia({ audio: true, video: false }, success, error);
        }
    }
}

export default audioWave;
