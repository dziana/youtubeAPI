const gestureZone = document.getElementsByClassName('video-container')[0];
gestureZone.addEventListener('touchstart', handleTouchStart, false);
gestureZone.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
            videoPanelClose();
        } else {
            videoPanelClose();
        }
    } else {
        if (yDiff > 0) {
            videoPanelClose();
        } else {
            videoPanelClose();
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

function videoPanelClose() {
    document.getElementsByClassName("video-container")[0].style.display = "none";
}
