export class Player {
    player: HTMLMediaElement;

    constructor() {}

    init(onCurrentTimeChange) {
        if (this.player) {
            this.player.removeEventListener('timeupdate', onCurrentTimeChange);
        }

        this.player = document.querySelector('video.html5-main-video');

        this.player.addEventListener('timeupdate', onCurrentTimeChange);
    }

    get currentTime() {
        return this.player ? this.player.currentTime : 0;
    }

    set currentTime(time) {
        if (this.player && time >= 0 && time <= this.player.duration) {
            this.player.currentTime = time;
        }
    }

    get duration(): number {
        return this.player ? this.player.duration : 0;
    }
}
