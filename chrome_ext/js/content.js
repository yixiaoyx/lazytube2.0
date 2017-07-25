// Modified based on Smart Pause Youtube by James D'Greeze, copyright 2013, http://dgreeze.pw


const EXT_IMAGES = {
		"play":   "",
		"pause":  "",
		"enabled":   "",
    	"disabled":  "",
	};

const SPYT_STYLE = [
	'#youtube_lazytubeButton { position: relative; float: right; width: 50px; text-align: left; } ',
	'#youtube_lazytubeButton #youtube_lazytubeButtonSetting { width: 23px; height: 23px; opacity: 0; position: absolute; top: 0px; right: -5px; background: url("") center no-repeat;  z-index: 999; } ',
	'#youtube_lazytubeButton:hover #youtube_lazytubeButtonSetting { opacity: 0.5; } ',
	'#youtube_lazytubeButton:hover #youtube_lazytubeButtonSetting:hover { opacity: 1; } ',
 ];

//------------------------------------------

var canBePaused = true;
var inYoutube = true;
var lastFace = true;
var happyCounter = 0;
//var player;

//----------------------------

chrome.extension.onMessage.addListener(function(req){

    console.log(req);

    if(player) flag = true;

    var img = document.getElementById('image_lazytubeButton');
    if (img == null)		return;

    if ( ! flag || ! player )
    {
        img.setAttribute("src", EXT_IMAGES['disabled']);
        return;
    }


    player = document.getElementsByTagName('video');

    if(req.msg == "start")  // re-enter tab
    {
        inYoutube = true;
        if(lastFace){
            player[0].play();
        }
    }
    else if(req.msg == "stop")  // exit tab
    {
        inYoutube = false;
    }

    else if(req.msg == "Enabled")
    {
        img.setAttribute("src",EXT_IMAGES['enabled']);
    }
    else if(req.msg == "Disabled")
    {
        img.setAttribute("src",EXT_IMAGES['disabled']);
    }


    else if(req.msg.text == "faceOn") {
        console.log('fceon');
        lastFace = true;
        if(inYoutube)
            player[0].play();
    }
    else if (req.msg.text == "faceOff") {
        console.log('fceoff');
        lastFace = false;
        if(inYoutube)
            player[0].pause();
    }
    else if (req.msg.text == "happy") {
        happyCounter++;
        if(happyCounter == 3){
            window.location.replace("https://www.youtube.com/watch?v=DNR2AY7b6kI");
        }
    }

    console.log(req.msg);
});


// --------------------------------------------------------
function init() {

	insert_button();
	setInterval(function(){  insert_button()  }, 1000);

}

// -------------------------------------------------------
function insert_button ()  {

	var sp = document.getElementById('youtube_lazytubeButton');
	if (sp) return;

	cssBlock = document.getElementById("youtube_lazytubeStyle");
	if ( !cssBlock ) {
		cssBlock = document.createElement("style");
		cssBlock.setAttribute('id', 'youtube_lazytubeStyle');
		cssBlock.type = "text/css";

		(document.head || document.documentElement).insertBefore(cssBlock, null);

		function fill_css() {
			if (!cssBlock.sheet) {
				window.setTimeout(fill_css, 0);
				return;
			}
			for (var i = 0; i < SPYT_STYLE.length; i++) {
				var line = SPYT_STYLE[i];
				cssBlock.sheet.insertRule(line, 0);
			}
		}
		fill_css();
	}

	var div = document.getElementById('watch8-sentiment-actions');
	if ( div == null ) return;
	var div1 = div.parentNode;
	if ( div1 == null ) return;

	if( div1 != null)
	{
		var span1 = document.createElement("div");
		span1.setAttribute("id","youtube_lazytubeButton");
		span1.innerHTML = '<span><button type="button" id="lazytubeButton" class="yt-uix-button yt-uix-button-text yt-uix-tooltip yt-uix-button-empty" data-position="bottomright" data-orientation="vertical" data-force-position="true" data-button-toggle="true" role="button" data-tooltip-text="Lazytube"><span class="yt-uix-button-icon-wrapper"><img id="image_lazytubeButton" class="yt-uix-button-icon " src="'+EXT_IMAGES['enabled']+'" alt="Lazytube" title=""><span class="yt-uix-button-valign"></span></span></button></span><a id="youtube_lazytubeButtonSetting" target="_blank" href="chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/options.html"></a>';
		div1.appendChild( span1 );

		var btn = document.getElementById('lazytubeButton');
		btn.addEventListener("click", function( event ){
        chrome.extension.sendMessage('kuki', function(backMessage){

        if(backMessage)	{
                document.getElementById('image_lazytubeButton').setAttribute("src",EXT_IMAGES['enabled']);
        }
        else  {	document.getElementById('image_lazytubeButton').setAttribute("src",EXT_IMAGES['disabled']);
        }
    });
        }, true);
	}

}

// -------------------------------------------------------
window.addEventListener("load",function( e ) {

    init()

},false);
