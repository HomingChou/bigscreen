var win = window;
var doc = win.document;
var docEl = doc.documentElement;
var tid;
var designWidth = 2880;

function refreshRem(){
    var width = docEl.getBoundingClientRect().width;
    var rem = width / designWidth * 28;
    docEl.style.fontSize = rem + 'px';
}

win.addEventListener('resize', function() {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 300);
}, false);
win.addEventListener('pageshow', function(e) {
    if (e.persisted) {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }
}, false);

refreshRem();
