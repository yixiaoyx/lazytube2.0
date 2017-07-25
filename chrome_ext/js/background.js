// Modified based on Smart Pause Youtube by James D'Greeze, copyright 2013, http://dgreeze.pw


const current = null;


chrome.runtime.onInstalled.addListener(function () {
    var TABID = new Array();

    chrome.windows.getAll({populate: true}, function (window_list) {
        var tab_list = [];
        for (var i = 0; i < window_list.length; i++) {
            tab_list = tab_list.concat(window_list[i].tabs);
        }

        for (var key in tab_list) {
            var tab = tab_list[key];
            if (/youtube/gi.test(tab.url)) {
                TABID[key] = tab.id;
                chrome.tabs.reload(tab.id);
            }

        }

    });
});

var rightTab = '';
var CONST = 0;

// ------------------------------------------------------------------
function setRight(tabs) {

    var cookies = _b(Lazytube.Prefs.get("yt.enable_lazytube"));

    if (CONST == 0) {
        CONST = 1;
        if (cookies) {
            rightTab = chrome.contextMenus.create({"title": "Lazytube Disabled", "onclick": OnClick});
        }
        else {
            rightTab = chrome.contextMenus.create({"title": "Lazytube Enabled", "onclick": OnClick});
        }
    }

}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {msg: ""}, function(response) {
    console.log(response);
  });
});

// ------------------------------------------------------------------
chrome.tabs.onCreated.addListener(function (tabs) {
//	console.log("chrome.tabs.onCreated");
    setRight(tabs);

});

// ------------------------------------------------------------------
chrome.tabs.onUpdated.addListener(function (tabs, changedInfo, tab) {

//    console.log(arguments);

    var cookies = _b(Lazytube.Prefs.get("yt.enable_lazytube"));
    //console.log("chrome.tabs.onUpdated", cookies, changedInfo, tab);
    if (!cookies) {
        chrome.tabs.sendMessage(tabs, {msg: "Disabled"});
        if (CONST == 0) {
            CONST = 1;
            rightTab = chrome.contextMenus.create({"title": "Lazytube Enabled", "onclick": OnClick});
        }
    }
    else {
        chrome.tabs.sendMessage(tabs, {msg: "Enabled"});
        if (CONST == 0) {
            CONST = 1;
            rightTab = chrome.contextMenus.create({"title": "Lazytube Disabled", "onclick": OnClick});
        }
    }


    var enable_tab_pause = _b(Lazytube.Prefs.get("yt.enable_tab_pause"));
    if (enable_tab_pause) {
        console.log('tab', tab);
        chrome.tabs.query({active: true}, function (active_tabs) {
            console.log('active_tabs', active_tabs);
            var active_tab = active_tabs[0];
            if (active_tab.id != tab.id && /youtube/gi.test(tab.url)) {
                chrome.tabs.sendMessage(tab.id, {msg: "stop"});
            }
        });
    }

});
// ------------------------------------------------------------------

var date = new Date();
date = date.getTime() + (365 * 24 * 60 * 60 * 1000);

// ------------------------------------------------------------------
function OnClick() {

    chrome.windows.getAll({populate: true}, function (window_list) {
        var tab_list = [];
        for (var i = 0; i < window_list.length; i++) {
            tab_list = tab_list.concat(window_list[i].tabs);
        }

        for (var key in tab_list) {
            var tab = tab_list[key];
            if (/youtube/gi.test(tab.url)) {
                TABID[key] = tab.id;
            }
        }
    });

    var cookies = _b(Lazytube.Prefs.get("yt.enable_lazytube"));

    if (!cookies) {
        Lazytube.Prefs.set("yt.enable_lazytube", true)

        chrome.contextMenus.update(rightTab, {"title": "Lazytube Disabled"});

        for (var i in TABID) {
            chrome.tabs.sendMessage(TABID[i], {msg: "Enabled"});
        }
    }
    else {
        Lazytube.Prefs.set("yt.enable_lazytube", false)

        chrome.contextMenus.update(rightTab, {"title": "Lazytube Enabled"});

        for (var i in TABID) {
            chrome.tabs.sendMessage(TABID[i], {msg: "Disabled"});
        }
    }
}

const INTERVAL_TO_DISPLAY_WRITE_REVIEW = 2 * 24 * 3600 * 1000; // 2 days

// ------------------------------------------------------------------
chrome.extension.onMessage.addListener(function (request, sender, f_callback) {

    if (request == 'kuki') {
        var cookies = _b(Lazytube.Prefs.get("yt.enable_lazytube"));

        OnClick();

        f_callback(!cookies);
    }
    else if (request && request.action == "isSurfCanyonEnabled") {
        f_callback(_b(Lazytube.Prefs.get("yt.enable_surfcanyon")));
        return true;
    }
    else if (request == "wakeup" || request == "sleep") {
        console.log("sending request : "+request);
        //port.postMessage({ text: request });
    } else {
        console.log("well at least I got this : "+request);
    }

});


// ------------------------------------------------------------------
var TABID = new Array();
chrome.tabs.onActivated.addListener(function (tab) {

    var cookies = _b(Lazytube.Prefs.get("yt.enable_lazytube"));

    chrome.windows.getAll({populate: true}, function (window_list) {
        var tab_list = [];
        for (var i = 0; i < window_list.length; i++) {
            tab_list = tab_list.concat(window_list[i].tabs);
        }

        for (var key in tab_list) {
            var tab = tab_list[key];
            if (/youtube/gi.test(tab.url)) {
                TABID[key] = tab.id;
            }
        }
    });
    if (cookies) {
        for (var i in TABID) {
            if (tab.tabId == TABID[i]) {
                chrome.tabs.sendMessage(TABID[i], {msg: "start"});
            }
            else {
                chrome.tabs.sendMessage(TABID[i], {msg: "stop"});
            }
        }
    }
    else {
        for (var i in TABID) {
            if (tab.tabId == TABID[i]) {
                chrome.tabs.sendMessage(TABID[i], {msg: "Disabled"});
            }
        }
    }

});

// -------------------------------------------------------

var port = null;

var happiness = 0;

var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

function onNativeMessage(message) {
   chrome.windows.getAll ({populate: true}, function (window_list) {
        var tab_list = [];
        for (var i = 0; i < window_list.length; i++) {
            tab_list = tab_list.concat(window_list[i].tabs);
        }
        //console.log(message);
        for (var key in tab_list) {
            var tab = tab_list[key];
            if (/youtube/gi.test(tab.url)) {
                if (message.text == "happy") happiness++;
                if (message.text != "happy" || happiness <= 3)
                    chrome.tabs.sendMessage(tab.id, {msg: message});
            }
        }
    });


}

function onDisconnected() {
  port = null;
}

function connect() {
    console.log("connected");
    var hostName = "com.google.chrome.example.echo";
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
}

//----------------------------------
function init() {

	welcome_page();
    connect();

}


// --------------------------------------------------------
function welcome_page() {

	if( Lazytube.Utils.isVersionChanged() )	{
		var url = null;

		if (Lazytube.Prefs.get("install_time") == 0) 	{

			Lazytube.Prefs.set( "install_time", new Date().getTime() );

			var ID = 'Random Cute Team';
			var title = 'Random Cute Team';
			var ptitle = 'Random Cute Team';
			var descr = 'Let us take care of pausing and unpausing your videos. Just give us... complete control.';


		}


		if( url )	{
			chrome.tabs.create({
						url: url,
						active: true
					});
		}
	}

}
Lazytube.Utils.ytLogo();
window.addEventListener("load", function () {

    init();

}, false);
