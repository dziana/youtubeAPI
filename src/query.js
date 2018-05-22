
function addBaseDesign() {

    var body = document.getElementsByTagName("body")[0];

    var loaderDiv = document.createElement("div");
    loaderDiv.classList.add("loader");
    body.appendChild(loaderDiv);

    var queryDiv = document.createElement("div");
    queryDiv.classList.add("query-wrapper");

    var inputStr = document.createElement("input");
    inputStr.classList.add("query-str");
    inputStr.setAttribute("type", "text");
    inputStr.setAttribute("placeholder", "input query");

    var inputButton = document.createElement("input");
    inputButton.classList.add("query-button");
    inputButton.setAttribute("type", "submit");
    inputButton.setAttribute("value", "submit");

    inputButton.onclick = handleQuery;
    queryDiv.appendChild(inputStr);
    queryDiv.appendChild(inputButton);
    body.appendChild(queryDiv);

    var resultDiv = document.createElement("div");
    resultDiv.classList.add("result-container");

    var resultList = document.createElement("ul");
    resultList.classList.add("result-list");

    resultDiv.appendChild(resultList);
    body.appendChild(resultDiv);

    var videoDiv = document.createElement("div");
    videoDiv.classList.add("video-container");

    var closeVideo = document.createElement("input");
    closeVideo.classList.add("close-video-button");
    closeVideo.setAttribute("type", "submit");
    closeVideo.setAttribute("value", "×");

    closeVideo.onclick = videoPanelClose;

    var videoFrame = document.createElement("div");
    videoFrame.classList.add("video-frame");

    var likesDiv = document.createElement("div");
    likesDiv.classList.add("video-likes");

    var viewVideoDiv = document.createElement("div");
    viewVideoDiv.classList.add("view-fl");
    var viewVideoText = document.createElement("p");
    viewVideoText.innerHTML = "<b>views</b>";

    viewVideoDiv.appendChild(document.createElement("p"));
    viewVideoDiv.appendChild(viewVideoText);

    var listLikes = document.createElement("ul");
    listLikes.classList.add("likes-list");
    for (var i = 0; i < 4; i++) {
        listLikes.appendChild(document.createElement("li"));
    }
    listLikes.childNodes[0].innerHTML = "<img src='./images/like.png'/>";
    listLikes.childNodes[2].innerHTML = "<img src='./images/dislike.png'/>"

    likesDiv.appendChild(viewVideoDiv);
    likesDiv.appendChild(listLikes);

    var videoDescription = document.createElement("div");
    videoDescription.classList.add("video-description");

    var videoInf = document.createElement("ul");
    videoInf.classList.add("desc-video-list");

    for (var i = 0; i < 7; i++) {
        videoInf.appendChild(document.createElement("li"));
    }

    var descText = document.createElement("p");
    descText.classList.add("desc");
    descText.innerHTML = "<b class='hilight'>Descritption</b>"

    videoDescription.appendChild(descText);
    videoDescription.appendChild(videoInf);

    videoDiv.appendChild(closeVideo);
    videoDiv.appendChild(videoFrame);
    videoDiv.appendChild(likesDiv);
    videoDiv.appendChild(videoDescription);
    body.appendChild(videoDiv);
}
addBaseDesign();


window.onscroll = function () {
    var sT = window.pageYOffset || document.documentElement.scrollTop;
    var cH = document.documentElement.clientHeight;
    var sH = document.documentElement.scrollHeight;
    if (sT >= sH - cH - 10) {
        sendMoreQuery();
    }
}

function videoPanelOpen(videoID) {
    return function (e) {
        sendVideoQuery(videoID);
    }
}

function videoPanelClose() {
    document.getElementsByClassName("video-container")[0].style.display = "none";
}


var nextToken = "";


function handleQuery() {
    var query = document.getElementsByClassName("query-button")[0];
    if (query.value === "submit") {
        query.value = "clear";
        sendQuery();
    } else {
        var ulNode = document.getElementsByClassName("result-list")[0];
        while (ulNode.firstChild) {
            ulNode.removeChild(ulNode.firstChild);
        }
        query.value = "submit";
        document.getElementsByClassName("query-str")[0].value = "";
    }
}

function sendQuery() {

    document.getElementsByClassName("loader")[0].style.display = "block";
    var xhr = new XMLHttpRequest();
    var query = document.getElementsByClassName("query-str")[0].value;
    xhr.open('GET', 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCPs_di_rybTRvpjjZmwTjiZtH3rYZVlbU&type=video&part=snippet&maxResults=15&q=' + query, true);
    //https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&id=nq4aU9gmZQk,REu2BcnlD34,qbPTdW7KgOg&part=snippet,statistics
    //xhr.open('GET', 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCPs_di_rybTRvpjjZmwTjiZtH3rYZVlbU&id=nq4aU9gmZQk,REu2BcnlD34,qbPTdW7KgOg&part=snippet,statistics', true);
    xhr.onload = function () {
        var json = JSON.parse(this.responseText);

        nextToken = json.nextPageToken;
        for (var i = 0; i < json.items.length; i++) {
            var title = json.items[i].snippet.title; //
            var thumbnails_medium = json.items[i].snippet.thumbnails.medium.url;
            var videoID = json.items[i].id.videoId;

            var ulChild = document.createElement("li");
            var img = document.createElement("img");
            img.setAttribute("src", thumbnails_medium);
            img.setAttribute("width", "100%");
            var videoName = document.createElement("p");
            videoName.innerHTML = title;
            videoName.classList.add("video-name");
            ulChild.appendChild(img);
            ulChild.appendChild(videoName);
            ulChild.onclick = videoPanelOpen(videoID);
            var resultList = document.getElementsByClassName("result-list")[0];
            resultList.appendChild(ulChild);
        }
        document.getElementsByClassName("loader")[0].style.display = "none";
    }

    xhr.onerror = function () {
        document.getElementsByClassName("loader")[0].style.display = "none";
        alert('Error ' + this.status);
    }

    xhr.send();
}


function sendVideoQuery(videoID) {

    document.getElementsByClassName("loader")[0].style.display = "block";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCPs_di_rybTRvpjjZmwTjiZtH3rYZVlbU&id=' + videoID + '&part=snippet,statistics', true);

    xhr.onload = function () {

        var json = JSON.parse(this.responseText);
        for (var i = 0; i < json.items.length; i++) {
            var publishedAt = json.items[i].snippet.publishedAt;
            var title = json.items[i].snippet.title;
            var description = json.items[i].snippet.description;
            var channelTitle = json.items[i].snippet.channelTitle;
            var likes = json.items[i].statistics.likeCount;
            var dislikes = json.items[i].statistics.dislikeCount;
            var viewCount = json.items[i].statistics.viewCount;
            var thumbnails_medium = json.items[i].snippet.thumbnails.medium.url;
            var list = document.getElementsByClassName("desc-video-list")[0];
            list.childNodes[0].innerHTML = "<b class='hilight'>title   </b>" + title;
            list.childNodes[1].innerHTML = "<b class='hilight'>published at   </b>" + publishedAt;
            list.childNodes[2].innerHTML = "<b class='hilight'>author   </b>" + channelTitle;
            list.childNodes[3].innerHTML = "<b class='hilight'>description   </b>" + description;

            var likesList = document.getElementsByClassName("likes-list")[0];

            likesList.childNodes[1].innerHTML = likes;
            likesList.childNodes[3].innerHTML = dislikes;

            var likesDiv = document.getElementsByClassName("video-likes")[0];
            likesDiv.childNodes[0].childNodes[0].innerHTML = viewCount;
        }

        var fr = document.getElementsByClassName("video-frame")[0];

        fr.innerHTML = '<iframe src="http://www.youtube.com/embed/' + videoID + '" class="video" frameborder="0" scrolling=no allowfullscreen></iframe>';

        document.getElementsByClassName("loader")[0].style.display = "none";
        document.getElementsByClassName("video-container")[0].style.display = "block";
    }
    xhr.onerror = function () {
        document.getElementsByClassName("loader")[0].style.display = "none";
        alert('Ошибка ' + this.status);
    }

    xhr.send();
}


function sendMoreQuery() {

    document.getElementsByClassName("loader")[0].style.display = "block";
    var xhr = new XMLHttpRequest();
    var query = document.getElementsByClassName("query-str")[0].value;

    xhr.open('GET', 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCPs_di_rybTRvpjjZmwTjiZtH3rYZVlbU&type=video&part=snippet&maxResults=15&q=' + query + '&pageToken=' + nextToken, true);
    xhr.onload = function () {
        var json = JSON.parse(this.responseText);
        nextToken = json.nextPageToken;
        for (var i = 0; i < json.items.length; i++) {
            var title = json.items[i].snippet.title; //
            var thumbnails_medium = json.items[i].snippet.thumbnails.medium.url;
            var videoID = json.items[i].id.videoId;

            var ulChild = document.createElement("li");
            var img = document.createElement("img");
            img.setAttribute("src", thumbnails_medium);
            img.setAttribute("width", "100%");
            var videoName = document.createElement("p");
            videoName.innerHTML = title;
            videoName.classList.add("video-name");
            ulChild.appendChild(img);
            ulChild.appendChild(videoName);
            //	ulChild.setAttribute("onclick", "videoPanelOpen('"+videoID+"')");
            ulChild.onclick = videoPanelOpen(videoID);
            var resultList = document.getElementsByClassName("result-list")[0];
            resultList.appendChild(ulChild);
        }
        document.getElementsByClassName("loader")[0].style.display = "none";
    }

    xhr.onerror = function () {
        document.getElementsByClassName("loader")[0].style.display = "none";
        alert('Error ' + this.status);
    }

    xhr.send();
}