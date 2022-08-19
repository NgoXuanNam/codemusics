const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'NamIT_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const Playbtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
// const progressMaxValue = progress.max;
const timer = $('.time-remain');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setconfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Duyên Duyên Số Số',
            singer: 'Du Uyên x Nguyễn Phương x Đại Mèo',
            path: './Assets/ListMusic/DuyenDuyenSoSoRemix_DuUyenxNguy.mp3',
            image: './Assets/image/duyeduyensoso.jpg'
        },
        {
            name: 'Anh yêu vội thế',
            singer: 'Lala Trần',
            path: './Assets/ListMusic/AnhYeuVoiTheDaiMeoRemix_LaLaTran.mp3',
            image: './Assets/image/anhyeuvoithe.jpg'
        },
        {
            name: 'Em ngốc quá',
            singer: 'Gia Huy',
            path: './Assets/ListMusic/EmNgocQuaQinnRemix_Gia Huy_ Qinn.mp3',
            image: './Assets/image/emngocqua.jpg'
        },
        {
            name: 'Cảm ơn vì tất cả',
            singer: 'Anh Quân Idol',
            path: './Assets/ListMusic/CamOnViTatCa_NguyenAnh.mp3',
            image: './Assets/image/camonvitatca.jpg'
        },
        {
            name: 'Hoa tàn tình tan',
            singer: 'Giang Joole',
            path: './Assets/ListMusic/HoaTanTinhTan_GiangJolee.mp3',
            image: './Assets/image/hoatantinhtan.jpg'
        },
        {
            name: 'Lỡ yêu người đậm sâu',
            singer: 'Linh Hương Luz',
            path: './Assets/ListMusic/LoYeuNguoiDamSau_LinhHuongLuz.mp3',
            image: './Assets/image/loyeunguoidamsau.jpg'
        },
        {
            name: 'Nụ cười em là nắng',
            singer: 'Green',
            path: './Assets/ListMusic/NuCuoiEmLaNang_Green.mp3',
            image: './Assets/image/nucuoiemlanang.jpg'
        },
        {
            name: 'Ơi anh gì ơi',
            singer: 'Hana Cẩm Tiên',
            path: './Assets/ListMusic/OiAnhGiOi_HanaCamTien.mp3',
            image: './Assets/image/oianhgioi.jpg'
        },
        {
            name: 'Thuyền Quyên',
            singer: 'Diệu Kiên',
            path: './Assets/ListMusic/ThuyenQuyen_DieuKien.mp3',
            image: './Assets/image/thuyenquyen.jpg'
        },
        {
            name: 'Xin má rước dâu',
            singer: 'Diệu Kiên',
            path: './Assets/ListMusic/XinMaRuocDau_DieuKien.mp3',
            image: './Assets/image/xinmaruocdau.jpg'
        }
    ],
    
    // Fill Data 
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>

            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 giây
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px': 0;
            cd.style.opacity = newcdWidth / cdWidth;
        }
        
        // Xử lý khi click Play
        Playbtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause();
            }else{
                
                audio.play();
            }
        }
        // Khi song được play
        audio.onplay = function(){
            cdThumbAnimate.play();
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        // Khi song được pause
        audio.onpause = function(){
            cdThumbAnimate.pause();
            _this.isPlaying = false;
            player.classList.remove('playing');
        }
        // Khi tiến độ bài hát thay đổi 
        // audio.ontimeupdate = function(){
        //     if(audio.duration){
        //         const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        //         progress.value = progressPercent;
        //     }
        // }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                // console.log((audio.duration - (audio.duration % 60)) / 60 + ':' + Math.floor(audio.duration % 60))
                const timeRemain = audio.duration - audio.currentTime
                let timeRemainAsMinute
                if (Math.floor(timeRemain % 60) < 10) {
                    timeRemainAsMinute = (timeRemain - (timeRemain % 60)) /60 + ':0' + Math.floor(timeRemain % 60)
                    timer.textContent = timeRemainAsMinute
                } else {
                    timeRemainAsMinute = (timeRemain - (timeRemain % 60)) /60 + ':' + Math.floor(timeRemain % 60)
                    timer.textContent = timeRemainAsMinute
                    
                }
                
                progress.value = progressPercent
            }
        }
        // Xử lý khi tua song
        progress.oninput  = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else{

                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveView();
        }
        // Khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else{

                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveView();
        }
        // Khi random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setconfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Xử lý khi kết thúc bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{

                nextBtn.click();
            }
            _this.render();
        }


        // Xử lý repeat song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // Lắng nghe hành vi click vào Playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            
            if(songNode || e.target.closest('.option')){
                // Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = parseInt(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // Xử lý khi click vào option
                if(e.target.closest('.option')){

                }
            }
        }
    },

    scrollToActiveView: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            })
        }, 10)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    }, 
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },

    randomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    repeatSong: function(){
        this.loadCurrentSong();
    }, 

    start: function(){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()
        
        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()
        
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        
        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start();
