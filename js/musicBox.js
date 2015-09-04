/**
 * [实现播放器宽高自适应屏幕大小]
 */
function SelfAdaption() {
	var htmlwidth = $("html").width();
	if(htmlwidth >= 640) {
		$("html").css({
			"font-size" : "24px"
		})
		$(".wrap").css({
			"width": "640px"
		})
	} else {
		if(htmlwidth <= 320) {
			$("html").css({
				"font-size" : "12px"
			})
			$(".wrap").css({
				"width": "320px"
			})
		} else {
			$("html").css({
				"font-size" : htmlwidth * 24 / 640 + "px"
			})
			$(".wrap").css({
				"width": htmlwidth
			})
		}
	} 	
}SelfAdaption();

$(window).resize(function(){
	SelfAdaption()
})

// 一共有4首歌曲
var musicArr = [
	["浮夸.mp3", "陈奕迅", "4:45",  "fukua.jpg", "浮夸.lrc.txt"],
	["虫儿飞.mp3", "儿童歌曲", "1:41", "chongerfei.jpg", "虫儿飞.lrc.txt"],
	["我的滑板鞋.mp3", "麦浚龙", "2:50", "huabanxie.jpg", "我的滑板鞋.lrc.txt"],
	["倩女幽魂.mp3", "张国荣", "3:35", "qiannvyouhun.jpg", "倩女幽魂.lrc.txt"]
]
var musicArrLen = musicArr.length;

// DOM二级阻止事件默认，针对谷歌，IE等不同浏览器兼容性处理
function defaultPrevent(e) {
	var ev = e || window.event;
	if(ev.preventDefault){
		ev.preventDefault();
	} else {
		ev.returnValue = false;
	}
}

var _this;
function musicBox() {
	this.loadingPage = $("#loadingPage");
	this.enterPage = $("#enterPage");
	this.enterTit = $("#enterTitle");
	this.enterCon = $("#enterContent");
	this.enterBtn = $("#enterBtn");
	this.list = $("#listPage");
	this.playing = $("#playingPage");
	this.getListLI = $("#musicList li");
	this.listLen = this.getListLI.length;
	this.getaudio = $("audio");
	this.audioEle = $("audio")[0];
	this.songName = $("#playTit h2");
	this.singerName  = $("#playTit h3");
	this.getImg = $("#imgBg");
	this.songImg = $("#imgBg img");
	this.getcurTime = $("#playingTime span").eq(0);
	this.songlong = $("#playingTime span").eq(1);
	this.getLyricPage = $("#playLyic");
	this.getLyric = $(".lyric");
	this.getPalyPause = $("#palyOrPauseicon");
	this.playingIcon = $("#playingIcon");
	this.backlisticon = $("#listIcon");
	this.playingmain = $("#playingmain"); 	//playing页面中间主体位置
	this.getArrow = $("#arrow");			//获取箭头按钮
	this.getPlayBtns = $("#BtnArea");
	this.modeBtn = $(".mode");
	this.lastBtn = $(".last");
	this.nextBtn = $(".next");
	this.fastBtn = $(".fast");
	this.rewindBtn = $(".rewind");
	this.setVolBtn = $("#volumeBtn");	//调节音量大小的按钮
	this.muteBtn = $("#muteBtn");		//设置静音的按钮
	this.getVolBar = $("#volBar");		//调节音量大小的控件
	this.getVolPro = $("#volPro");		//音量大小的进度条
	this.getVolBtn = $("#volbtn");		//音量大小可拖动的按钮
	this.musicBar = $("#musicBar");
	this.musicProgress = $("#musicProgress");
	this.musicScroll = $("#musicScroll");
	this.timeArr = [];	//歌词时间段数组
	this.lyricArr = [];	//歌词数组
	this.lyricTop = parseInt(this.getLyric.css("top"));		//获取歌词一开始显示的top位置
	this.lyricLineheight = parseInt(this.getLyric.css("line-height"));	//获取一行歌词所占的行高
	this.ls = window.localStorage;	//创建localStorage本地存储
	this.playIndex = null;			//用来存储当前播放歌曲的index值
	this.playflag = true; 			//用来判断是播放歌曲还是暂停歌曲
	this.randomFlag = false;		//判断选择随机模式还是顺序播放模式，如果是true，则是随机模式
	this.volflag = true;			//判断是否静音，如果是true，则表示静音
	_this = this;
}

// loading页面加载完数据后，进入enter页面的方法
musicBox.prototype.loadingPageToEnterPage = function() {
	this.loadingPage.animate({
		"left" : "-100%"
	}, 1000, function(){
		_this.loadingPage.css({
			"display": "none"
		})
		_this.enterPage.css({
			"display": "block"
		})
		_this.enterTit.animate({
			"opacity": "1"
		}, 1000)
		_this.enterCon.children("p").eq(0).animate({
			"left": "2.92rem"
		}, 1000)
		_this.enterCon.children("p").eq(1).animate({
			"right": "4.48rem"
		}, 1000)
	})
}

// 点击“立即体验”按钮，list页面显示出来
musicBox.prototype.enterBtnfn = function() {
	this.enterPage.animate({
		"left" : "-100%"
	}, 1000, function() {
		_this.enterPage.css({
			"display": "none"
		})
		_this.list.css({
			"display": "block"
		})
	})
}

// 给音乐列表设置颜色交替和透明样式
musicBox.prototype.setListcolor = function(){
	for(var i = 0; i < this.listLen; i++) {
		if (i % 2 == 0) {
			this.getListLI.eq(i).css({
				"background": "#000",
				"opacity": "0.5"
			})
		};
	}
}

/**
 * [获取当前播放音乐的索引信息（包括：歌名，歌手，歌长，歌词，歌曲照片）]
 * @param  {[数字型Number]} index [index为当前播放音乐的索引值, 给audio设置为索引值是index的歌曲]
 * @return {[type]}       [description]
 */
musicBox.prototype.palyingMusicInfo = function(index) {
	this.songName.html(musicArr[index][0].split(".")[0]);
	this.singerName.html(musicArr[index][1]);
	this.songlong.html(musicArr[index][2]);
	this.songImg.attr("src", "images/demoimg/" + musicArr[index][3]);
	this.audioEle.setAttribute("src", "music/" + musicArr[index][0]);
	this.getLyricByAJAX(index);	//请求并获取歌词
	this.getLyric.css({"top": this.lyricTop});	//将歌词位置重置
}

/**
 * [用AJAX获取当前播放音乐的歌词]
 * @param  {[数字型Number]} index [index为当前播放音乐的索引值]
 * @return {[type]}       [description]
 */
musicBox.prototype.getLyricByAJAX = function(index) {
	$.ajax({
		type: 'GET',
		url: "music/" + musicArr[index][4],
		success: function(msg){
			var temp = 0;
			_this.timeArr = [];
			_this.lyricArr = [];
			var arr = msg.split("[");
			for (var i = 0; i < arr.length; i++) {
				arr[i] = arr[i].split("]");
			};
			for (var i = 0; i < arr.length; i++) {
				_this.timeArr[i] = arr[i][0].split(":");
				_this.timeArr[i] = _this.timeArr[i][0] * 60 + _this.timeArr[i][1] * 1;
				_this.lyricArr[i] = arr[i][1];
			};
			for(var j = 0; j < arr.length; j++){
				if(isNaN(_this.timeArr[j])) {
					temp++;
				} 
			}
			for (var i = 0; i < temp; i++) {
				_this.timeArr.shift();
				_this.lyricArr.shift();
			};
			_this.getLyric[0].innerHTML = "";
			for(var i = 0; i < _this.lyricArr.length; i++) {
				_this.getLyric[0].innerHTML += "<p>" + _this.lyricArr[i] + "</p>";
			}
		}
	})
}

//点击list播放列表中的某支歌曲，list页面跳转到正在播放页面
musicBox.prototype.listToPlaying = function(){
	this.list.animate({
		"left": "-100%"
	}, 500, function(){
		_this.list.animate({
			"display": "none"
		})
		_this.playing.css({
			"display": "block"
		})
	})
}

/**
 * [点击播放或暂停, 能自动适配是播放还是暂停的方法]
 * @param  {[布尔值boolean]} bool [如果实参是true表示播放，如果是false表示暂停]
 * @return {[type]}      [description]
 */
musicBox.prototype.playOrPause = function(bool) {
	this.playflag = bool;
	if(this.playflag == true) {
		this.getPalyPause.removeClass("playicon").addClass("pauseicon");
		this.audioEle.play();
		this.playflag = false;
	} else {
		this.getPalyPause.removeClass("pauseicon").addClass("playicon");
		this.audioEle.pause();
		this.playflag = true;
	}
}

/**
 * [点击list播放列表中的某支歌曲并播放; 改变该歌曲在list中的样式; 创建本地存储index]
 * @param  {[对象类型object]} obj [list播放列表中被点击的li对象]
 * @return {[type]}     [description]
 */
musicBox.prototype.tapList = function(obj) {
	obj.children("span").addClass("sel").parent().siblings().children("span").removeClass("sel");
	this.playIndex = obj.index();	
	if(window.localStorage) {
		this.ls.setItem("index", this.playIndex);		//创建本地存储属性index,存储播放歌曲的index值
		this.ls.setItem("lsindexFlag", "true");		//判断是否已经创建本地存储属性index
	} 
	this.listToPlaying();
	this.palyingMusicInfo(this.playIndex);	
}

// 获取localStorage本地存储的数据
// 判断是否创建本地存储index, 如果没有，则默认播放第一首歌曲
musicBox.prototype.judgeStorage = function() {
	if(window.localStorage) {
		if(_this.ls.getItem("lsindexFlag") == "true") {
			_this.playIndex = parseInt(_this.ls.getItem("index"));
			_this.palyingMusicInfo(_this.playIndex); //利用本地存储，获取上一次播放器关闭时正在播放的歌曲
		} else {
			_this.palyingMusicInfo(0);	
		}
		// 判断是否创建本地存储用来存储调节音量大小, 如果没有创建，则音量默认为最大
		if(_this.ls.getItem("lsvolFlag") == "true") {
			_this.getVolBtn.css({
				"left": parseInt(_this.ls.getItem("volBtnLeft"))	//利用本地存储，获取上一次播放器关闭时“音量滚动条”的位置
			})
			_this.getVolPro.css({
				"width": parseInt(_this.ls.getItem("volProWidth"))	//利用本地存储，获取上一次播放器关闭时“音量进度条”的位置
			})
			_this.audioEle.volume = _this.ls.getItem("curVolume");	//利用本地存储，获取上一次播放器关闭时所设置的音量大小
		}
	} else {
		_this.palyingMusicInfo(0);
	}
}

//回到listPage页面按钮事件
musicBox.prototype.backTolistPage = function() {
	this.playing.css({
		"display": "none"
	})
	this.list.css({
		"display": "block"
	})
	this.list.animate({
		"left": "0"
	}, 500)
}

//选择"随机播放模式"还是"顺序播放模式"事件
musicBox.prototype.setMode = function() {
	if (!this.randomFlag) {
		this.modeBtn.removeClass("mode").addClass("mode-random");
		this.randomFlag = true;
	} else {
		this.modeBtn.removeClass("mode-random").addClass("mode");
		this.randomFlag = false;
	}
}

/* 
 *[在"功能按钮区域"手指向上或向下滑动事件]
 * @param  {布尔值[boolean]} bool [description]
 * 当bool为true,表示向上滑动，播放功能按钮全部显示出来，箭头切换为向下的样式
 * 当bool为false，表示向下滑动，播放功能按钮部分隐藏，箭头切换为向上的样式
 */
musicBox.prototype.swipeUpOrDown = function(bool) {
	if(bool) {
		this.getArrow.removeClass("slide-arrowUp").addClass("slide-arrowDown");
		this.getPlayBtns.animate({
			"height": "8.78rem"
		}, 250)
		this.getPalyPause.animate({
			"top": "1.46rem"
		}, 250)
	} else {
		this.getArrow.removeClass("slide-arrowDown").addClass("slide-arrowUp");
		this.getPlayBtns.animate({
			"height": "5.68rem"
		}, 250)
		this.getPalyPause.animate({
			"top": "0.17rem"
		}, 250)
	}
}

/**
 * [点击上一首或下一首按钮，请直接调用此事件]
 * [该事件还包括创建本地存储属性index,用来存储当前播放歌曲的index值]
 * [随机播放和顺序播放均可用]
 * @boolean [true或false] [如果是true,那表示下一首，如果false，为上一首]
 */
musicBox.prototype.playSwitch = function(bool){
	if(this.randomFlag) {
		var randomIndex = Math.floor(Math.random() * musicArrLen);
		if (randomIndex == this.playIndex) {
			this.playSwitch(bool);
		} else {
			this.playIndex = randomIndex;
		}
	} else {
		if(bool) {
			if(this.playIndex == musicArrLen - 1) {
				this.playIndex = 0;
			} else {
				this.playIndex++;	
			}
		} else {
			if(this.playIndex == 0) {
				this.playIndex = musicArrLen - 1;
			} else {
				this.playIndex--;	
			}
		}
	}
	if(window.localStorage) {
		_this.ls.setItem("index", _this.playIndex);		//创建本地存储属性index,存储播放歌曲的index值
		_this.ls.setItem("lsindexFlag", "true");		//用来判断是否已经创建本地存储属性index
	}
	this.getListLI.eq(this.playIndex).children("span").addClass("sel").parent().siblings().children("span").removeClass("sel");
	this.palyingMusicInfo(this.playIndex);
	this.playOrPause(true);
}

/**
 * [选择是快进还是快退]
 * @param  {[布尔值boolean]} bool [如果是true，表示快进; 如果是false,表示快退]
 * @return {[type]}      [description]
 */
musicBox.prototype.fastOrRewind = function(bool) {
	if(bool) {
		if (this.audioEle.currentTime >= this.audioEle.duration - 2) {
			this.audioEle.currentTime = this.audioEle.duration;
			this.playSwitch(true);
		} else {
			this.audioEle.currentTime = this.audioEle.currentTime + 2;
		}
	} else {
		if (this.audioEle.currentTime <= 2) {
			this.audioEle.currentTime = 0;
		} else {
			this.audioEle.currentTime = this.audioEle.currentTime - 2;
		}
	}
}

/**
 * [静音与非静音切换事件]
 * 默认第一次触发该事件设置是静音，第二次触发设置为非静音，再次触发又设置为静音，依此循环
 * 触发该事件的按钮对象，将改变其背景为"静音"和"非静音"图标切换
 */
musicBox.prototype.setMute = function() {
	if(this.volflag) {
		this.audioEle.muted = true;
		this.muteBtn.removeClass("mute").addClass("notmute");
		this.volflag = false;
	} else {
		this.audioEle.muted = false;
		this.muteBtn.removeClass("notmute").addClass("mute");
		this.volflag = true;
	}
}

/**
 * [“音量调节棒”显示或隐藏]
 * @param  {[boolean]} bool [如果是true，则显示“音量调节棒”，如果是false，则隐藏“音量调节棒”]
 * @return {[type]}      [description]
 */
musicBox.prototype.volBarShowOrHidden = function(bool) {
	if(bool) {
		this.getVolBar.css({
			"display": "block"
		})
	} else {
		this.getVolBar.css({
			"display": "none"
		})
	}
}

/**
 * [获取正在播放音乐的当前时间（格式为：4:21）]
 * @param  {[对象]} obj [对象的文本赋值为获取到的时间]
 */
musicBox.prototype.getCurrentTime = function(obj) {
	this.curTime = this.audioEle.currentTime;
	this.curMinute = Math.floor(this.curTime / 60);
	this.curSecond = Math.floor(this.curTime - this.curMinute * 60);
	obj.html((this.curMinute + ":" + this.curSecond).toString());
}

//随着当前播放时间，音乐进度条逐渐变宽
musicBox.prototype.changeMusicProgressWidth = function() {
	this.maxMusicProWidth = this.musicBar[0].offsetWidth - this.musicScroll[0].clientWidth
	this.curTimePercent = this.audioEle.currentTime / this.audioEle.duration;
	this.musicScroll.css({
		"left": this.curTimePercent * this.maxMusicProWidth
	})
	this.musicProgress.css({
		"width": this.curTimePercent * this.maxMusicProWidth + 5
	})
}

//改变当前时间被唱到的歌词的位置。让该句歌词向上移动一行，并改变该句歌词的颜色
musicBox.prototype.changeCurrentLyricStyle = function() {
	this.timeArrLen = this.timeArr.length;
	for (var i = 0; i < this.timeArrLen; i++) {
		if(Math.floor(this.audioEle.currentTime) == Math.floor(this.timeArr[i])) {
			this.getLyric.animate({
				"top": this.lyricTop - this.lyricLineheight * i
			}, 300)
			this.getLyric.children("p").eq(i).css({
				"color": "#0ec15a" 
			}).siblings().css({
				"color": "#fff" 
			})
		}
	};
}

/**
 * [向左或向右滑动页面，歌词显示或隐藏]
 * @param  {[布尔值boolean]} bool []
 * [true代表向左滑动播放页面，图片滑动到左上角，歌词从右向左滑出来]
 * [false代表向右滑动播放页面，图片从左上角滑到中间，歌词从左向右滑出去]
 * @return {[type]}      [description]
 */
musicBox.prototype.showOrHiddenLyric = function(bool) {
	if(bool) {
		this.getImg.animate({
			"top": "0.3rem",
			"left": "0.7rem",
			"width": "6.04rem",
			"height": "6.04rem"
		}, 300)
		this.getLyricPage.css({
			"display": "block"
		})
		this.getLyricPage.animate({
			"left": "0"
		}, 300)
	} else {
		this.getImg.animate({
			"top": "8.33rem",
			"left": "5.88rem",
			"width": "14.83rem",
			"height": "14.83rem"
		}, 300)
		this.getLyricPage.animate({
			"left": "100%"
		}, 300, function(){
			_this.getLyricPage.css({
				"display": "none"
			})
		})
	}
}

//实现滚动条滚动，改变"滚动条"、"进度条"和"滚动按钮"样式的对象和方法
function touchmoveObj(scrollBar, scrollPro, scrollBtn) {
	this.scrollBar = scrollBar;
	this.scrollPro = scrollPro;
	this.scrollBtn = scrollBtn;
	this.startLeft = null;
	this.endLeft = null;
	this.startClientX = null;
	this.moveClientX = null;
	this.maxLeft = null;
}
touchmoveObj.prototype.startTouch = function(e) {
	defaultPrevent(e);
	this.startLeft = parseFloat(this.scrollBtn.css("left"));
	this.startClientX = e.changedTouches[0].clientX;
}
touchmoveObj.prototype.moveTouch = function(e) {
	defaultPrevent(e);
	this.moveClientX = e.changedTouches[0].clientX;
	var disClientX = this.moveClientX - this.startClientX;
	this.endLeft = this.startLeft + disClientX;
	this.maxLeft = this.scrollBar[0].clientWidth - this.scrollBtn[0].offsetWidth;
	if(this.endLeft <= 0) {
		this.endLeft = 0;
	} else {
		if(this.endLeft >= this.maxLeft) {
			this.endLeft = this.maxLeft;
		}
	} 
	this.scrollBtn.css({
		"left": this.endLeft
	})
	this.scrollPro.css({
		"width": this.endLeft + 5
	})
}
touchmoveObj.prototype.endTouch = function(e) {
	defaultPrevent(e);
	this.scrollBtn.css({
		"left": this.endLeft
	})
	this.scrollPro.css({
		"width": this.endLeft + 5
	})
}


$(document).ready(function(){
	// 实现音乐列表滚动
	var myScroll = new IScroll('.music-list', {  
		bounceTime: 1000 
	});
	document.addEventListener('touchmove', function (e) {
		e.preventDefault(); 
	}, false);

	// 实例化一个musicBox对象，用来调用musicBox下的所有方法，实现播放器的所有功能
	var obj = new musicBox();

	//loading页面加载完数据后，进入enter页面
	obj.loadingPageToEnterPage();

	// 点击“立即体验”按钮，list页面显示出来
	obj.enterBtn.on("tap", function() {
		obj.enterBtnfn();
	})

	//判断是否创建本地存储index, 如果没有，则默认播放第一首歌曲
	obj.judgeStorage();

	//给音乐列表list设置颜色交替和透明样式
	obj.setListcolor();


	//点击list播放列表中的某支歌曲并播放该歌曲
	obj.getListLI.on("tap", function() {
		obj.tapList($(this));
		obj.playOrPause(true);
	})

	//点击"正在播放"按钮，跳转到播放页
	obj.playingIcon.on("tap", function() {
		obj.listToPlaying();
	})

	//点击"返回列表页按钮"
	obj.backlisticon.on("tap", function() {
		obj.backTolistPage();
	})

	//点击"播放模式"按钮
	obj.modeBtn.on("tap", function() {
		obj.setMode();
	})

	//点击"播放或暂停"按钮
	obj.getPalyPause.on("tap", function(){
		obj.playOrPause(obj.playflag);
	})	

	// 当前歌曲播放结束后触发
	obj.getaudio.on("ended", function(){
		obj.playSwitch(true);
	})

	// 点击播放下一首按钮
	obj.nextBtn.on("tap", function() {
		obj.playSwitch(true);
	})

	// 点击播放上一首
	obj.lastBtn.on("tap", function() {
		obj.playSwitch(false);
	})
	
	//"按钮区域"向上滑动
	obj.getPlayBtns.on("swipeUp", function() {
		obj.swipeUpOrDown(true);
	})

	//"按钮区域"向下滑动
	obj.getPlayBtns.on("swipeDown", function() {
		obj.swipeUpOrDown(false);
	})

	// 快进键
	obj.fastBtn.on("tap", function(){
		obj.fastOrRewind(true);
	})

	// 快退键
	obj.rewindBtn.on("tap", function(){
		obj.fastOrRewind(false);
	})

	// 点击静音按钮。选择静音还是非静音
	obj.muteBtn.on("tap", function(){
		obj.setMute();
	})

	//点击“音量按钮”，显示“音量调节棒”
	obj.setVolBtn.on("tap", function() {
		obj.volBarShowOrHidden(true);
	})

	//点击"playingPage"主体页面"playingmain"，隐藏“音量调节棒”
	obj.playingmain.on("tap", function() {
		obj.volBarShowOrHidden(false);
	})

	//正在播放歌曲是，timeupdate方法
	//实现获取音乐的当前播放时间; 改变播放进度条的宽度; 改变当前时间被唱到的歌词的位置和颜色
	obj.getaudio.on("timeupdate", function() {
		//实现获取音乐的当前播放时间
		obj.getCurrentTime(obj.getcurTime.eq(0));
		//改变播放进度条的宽度
		obj.changeMusicProgressWidth();
		//改变当前时间被唱到的歌词的位置和颜色
		obj.changeCurrentLyricStyle();
	})

	// 向左滑动播放页面，图片滑动到左上角，歌词从右向左滑出来
	obj.playingmain.on("swipeLeft", function() {
		obj.showOrHiddenLyric(true);
	})

	// 向右滑动播放页面，图片从左上角滑到中间，歌词从左向右滑出去
	obj.getLyricPage.on("swipeRight", function() {
		obj.showOrHiddenLyric(false);
	})


	//"音量滚动条"继承touchmoveObj, 实现拖动"音量滚动条"按钮，用来调节音量
	function volumeTouchmove(scrollBar, scrollPro, scrollBtn) {
		touchmoveObj.call(this, scrollBar, scrollPro, scrollBtn);
	}

	for(var i in touchmoveObj.prototype) {
		volumeTouchmove.prototype[i] = touchmoveObj.prototype[i];
	}

	//volumeTouchmove对象重写moveTouch方法
	volumeTouchmove.prototype.moveTouch = function(e) {
		defaultPrevent(e);
		this.moveClientX = e.changedTouches[0].clientX;
		var disClientX = this.moveClientX - this.startClientX;
		this.endLeft = this.startLeft + disClientX;
		this.maxLeft = this.scrollBar[0].clientWidth - this.scrollBtn[0].offsetWidth;
		if(this.endLeft <= 0) {
			this.endLeft = 0;
			obj.setVolBtn.removeClass("volume").addClass("notmute");
		} else {
			obj.setVolBtn.removeClass("notmute").addClass("volume");
			if(this.endLeft >= this.maxLeft) {
				this.endLeft = this.maxLeft;
			}
		} 
		this.scrollBtn.css({
			"left": this.endLeft
		})
		this.scrollPro.css({
			"width": this.endLeft + 5
		})
	}

	// 创建一个volumeTouchmove对象，并调用touchstart，touchmove，touchend方法，最终实现拖动"音量滚动条"按钮来控制音量大小
	var volobj = new volumeTouchmove($("#volBar"), $("#volPro"), $("#volbtn"));
	volobj.scrollBtn.on("touchstart", function(e){
		volobj.startTouch(e);
	})
	volobj.scrollBtn.on("touchmove", function(e) {
		volobj.moveTouch(e);
		obj.audioEle.volume = Number((volobj.endLeft / volobj.maxLeft).toFixed(1));
	})
	volobj.scrollBtn.on("touchend", function(e) {
		volobj.endTouch(e);
		if(window.localStorage) {
			obj.ls.setItem("volBtnLeft", volobj.endLeft);		//本地存储，存储"音量滚动条"的位置
			obj.ls.setItem("volProWidth", volobj.endLeft + 5);	//本地存储，存储"音量进度条"的位置
			obj.ls.setItem("curVolume", obj.audioEle.volume);	//本地存储，存储音量大小
			obj.ls.setItem("lsvolFlag", "true");				//判断是否已经创建本地存储属性curVolume
		}
	})

	//"音乐播放进度条"继承touchmoveObj，实现拖动"音乐播放进度滚动条"按钮，用来调节音乐播放进度
	function musicProgressTouchmove(scrollBar, scrollPro, scrollBtn) {
		touchmoveObj.call(this, scrollBar, scrollPro, scrollBtn);
		this.audioEle = $("audio")[0];
	}

	for(var i in touchmoveObj.prototype) {
		musicProgressTouchmove.prototype[i] = touchmoveObj.prototype[i];
	}

	//musicProgressTouchmove对象重写endTouch方法
	musicProgressTouchmove.prototype.endTouch = function(e) {
		defaultPrevent(e);
		this.audioEle.currentTime = this.audioEle.duration * (this.endLeft / this.maxLeft);
	}

	// 创建一个musicProgressTouchmove对象，并调用touchstart，touchmove，touchend方法，最终实现拖动"音乐播放进度滚动条"按钮来控制音乐播放进度
	var musicProObj = new musicProgressTouchmove(obj.musicBar, obj.musicProgress, obj.musicScroll);
	musicProObj.scrollBtn.on("touchstart", function(e){
		musicProObj.startTouch(e);
	})
	musicProObj.scrollBtn.on("touchmove", function(e) {
		// 先暂停播放，防止拖动"音乐进度条"发生抖动的效果
		obj.playOrPause(false);
		musicProObj.moveTouch(e);
	})
	musicProObj.scrollBtn.on("touchend", function(e) {
		musicProObj.endTouch(e);
		// 拖动结束后，重新播放音乐
		obj.playOrPause(true);
	})
})