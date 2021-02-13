const apiKey = "AIzaSyAJgREEMQ4t622OxiM_VsUJFuu6K4usiSU"

const formContainer = document.querySelector('.form-container')
const submitButton = document.querySelector('.channel-id-submit')
const inputChannel = document.querySelector('.channel-id')
const body = document.querySelector('body')

let channelInfo //document.querySelector('.channel')
let videoSection    //document.querySelector('.video-section')
let channelId = "" //UCYjFK1MVsqyVMLncosv5A1w



const insertAfter = (newNode, referenceNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const createListItem = (text) => {
    const li = document.createElement('li')
    li.classList.add('channel-info-list-item')

    const strong = document.createElement('strong')
    const textNode = document.createTextNode(text)

    strong.appendChild(textNode)
    li.appendChild(strong)

    return li
}


const iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;

const parseTime = (iso8601Duration) => {
    const matches = iso8601Duration.match(iso8601DurationRegex);

    return {
        sign: matches[1] === undefined ? '+' : '-',
        years: matches[2] === undefined ? 0 : matches[2],
        months: matches[3] === undefined ? 0 : matches[3],
        weeks: matches[4] === undefined ? 0 : matches[4],
        days: matches[5] === undefined ? 0 : matches[5],
        hours: matches[6] === undefined ? 0 : matches[6],
        minutes: matches[7] === undefined ? 0 : matches[7],
        seconds: matches[8] === undefined ? 0 : matches[8]
    };
};

const iso8601DayRegex = /(?:([.,\d]+)-)?(?:([.,\d]+)-)?(?:([.,\d]+))T?(?:([.,\d]+):)?(?:([.,\d]+):)?(?:([.,\d]+))?Z/

const parseDay = (iso8601Day) => {
    const matches = iso8601Day.match(iso8601DayRegex)

    return {
        years: matches[1] ? matches[1] : 0,
        months: matches[2] ? matches[2] : 0,
        days: matches[3] ? matches[3] : 0,
        hours: matches[4] ? matches[4] : 0,
        minutes: matches[5] ? matches[5] : 0,
        seconds: matches[6] ? matches[6] : 0
    }
}

const formatNumber = (str) => {
    return Number(str) < 10 ? `0${str}` : str
}

const abbreviateNumber = (value) => {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B", "T"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}

const showChannel = (data) => {
    const imgUrl = data.items[0].snippet.thumbnails.medium.url
    const title = data.items[0].snippet.title
    const description = data.items[0].snippet.description
    const videos = data.items[0].statistics.videoCount
    const subscribers = data.items[0].statistics.hiddenSubscriberCount ? "Hidden" : data.items[0].statistics.subscriberCount
    const views = data.items[0].statistics.viewCount

    /** Logo */
    const logoDiv = document.createElement('div')
    logoDiv.classList.add('channel-logo-container')

    /** Image */
    const channelImg = document.createElement('img')
    channelImg.src = imgUrl
    channelImg.alt = "Channel Logo"
    channelImg.classList.add('channel-logo')
    
    logoDiv.appendChild(channelImg)

    /** br */
    const br = document.createElement('br')

    insertAfter(br, channelImg)

    /** button */
    const viewChannel = document.createElement('a')
    viewChannel.classList.add('channel-view-btn')
    viewChannel.href = `https://www.youtube.com/channel/${channelId}`
    viewChannel.target = "_blank"

    const btnStrong = document.createElement('strong')
    const btnText = document.createTextNode("View Channel")
    btnStrong.appendChild(btnText)
    viewChannel.appendChild(btnStrong)

    insertAfter(viewChannel, br)

    channelInfo.appendChild(logoDiv)

    /** Info */
    const infoDiv = document.createElement('div')
    infoDiv.classList.add('channel-info-container')

    const infoList = document.createElement('ul')
    infoList.classList.add('channel-info-list')

    infoList.appendChild(createListItem(`Channel: ${title}`))
    infoList.appendChild(createListItem(`Description: ${description}`))
    infoList.appendChild(createListItem(`Videos: ${abbreviateNumber(videos)}`))
    infoList.appendChild(createListItem(`Subscribers: ${abbreviateNumber(subscribers)}`))
    infoList.appendChild(createListItem(`Views: ${abbreviateNumber(views)}`))

    infoDiv.appendChild(infoList)

    insertAfter(infoDiv, logoDiv)
}

const showVideo = (data, time, info) => {
    const videoURL = `https://www.youtube.com/watch?v=${data.id}`
    const thumbnailURL = data.snippet.thumbnails.maxres ? data.snippet.thumbnails.maxres.url : data.snippet.thumbnails.medium.url
    const channelURL = `https://www.youtube.com/channel/${channelId}`
    const channelLogoURL = info.items[0].snippet.thumbnails.default.url

    const article = document.createElement('article')
    article.classList.add('video-container')

    const aThumbnail = document.createElement('a')
    aThumbnail.href = videoURL
    aThumbnail.target = '_blank'
    aThumbnail.classList.add('thumbnail')
    aThumbnail.setAttribute('data-duration', time)

    const imgThumbnail = document.createElement('img')
    imgThumbnail.classList.add('thumbnail-image')
    imgThumbnail.src=thumbnailURL
    aThumbnail.appendChild(imgThumbnail)
    article.appendChild(aThumbnail)

    const videoBottomSection = document.createElement('div')
    videoBottomSection.classList.add('video-bottom-section')

    const aChannel = document.createElement('a')
    aChannel.href=channelURL
    aChannel.target='_blank'

    const imgChannel = document.createElement('img')
    imgChannel.src = channelLogoURL
    imgChannel.classList.add('channel-icon')
    aChannel.appendChild(imgChannel)

    videoBottomSection.appendChild(aChannel)

    const videoDetails = document.createElement('div')
    videoDetails.classList.add('video-details')

    const videoTitle = document.createElement('a')
    const titleText = document.createTextNode(data.snippet.title)
    videoTitle.href = videoURL
    videoTitle.target = '_blank'
    videoTitle.classList.add('video-title')
    videoTitle.appendChild(titleText)

    videoDetails.appendChild(videoTitle)

    const videoChannelName = document.createElement('a')
    const channelNameText = document.createTextNode(info.items[0].snippet.title)
    videoChannelName.href = channelURL
    videoChannelName.target = '_blank'
    videoChannelName.classList.add('video-channel-name')
    videoChannelName.appendChild(channelNameText)

    insertAfter(videoChannelName, videoDetails.lastElementChild)

    const videoMetadata = document.createElement('div')
    videoMetadata.classList.add('video-metadata')


    const pDate = parseDay(data.snippet.publishedAt)
    const utcDate = Date.UTC(pDate.years, pDate.months-1, pDate.days, pDate.hours, pDate.minutes, pDate.seconds)
    const curDate = Date.now()
    const diff = (curDate - utcDate)/1000;
    const pastTime = [diff/31536000, diff/2629746, diff/86400, diff/3600, diff/60, diff]
    const unitDay = ["year", "month", "day", "hour", "minute", "second"]
    let pastTimeText
    for(let i=0; i<pastTime.length; i++){
        if(pastTime[i] >= 1){
            const t = Math.floor(pastTime[i])
            pastTimeText = `${t} ${unitDay[i]}${t>1 ? "s" : ""} ago`
            break
        }
    }

    const metadataText = document.createTextNode(`${abbreviateNumber(data.statistics.viewCount)} views • ${pastTimeText}`)
    videoMetadata.appendChild(metadataText)

    insertAfter(videoMetadata, videoDetails.lastElementChild)
    
    insertAfter(videoDetails, videoBottomSection.lastElementChild)
    

    insertAfter(videoBottomSection, article.lastElementChild)

    return article
}

const loadVideo = (data, info) => {
    const playListItems = data.items

    if(playListItems){
        playListItems.map(item => {
            const videoId = item.snippet.resourceId.videoId
            const url = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId}&part=snippet,contentDetails,statistics`

            fetch(url)
                .then(res => res.json())
                .then(res => {
                    console.log("Video Information")
                    console.log(res.items[0])

                    const duration = parseTime(res.items[0].contentDetails.duration)
                    let time = ""
                    let hr = String(Number(duration.days)*24 + Number(duration.hours))
                    if(hr !== "0") time += `${hr}:${formatNumber(duration.minutes)}:`
                    else time += `${duration.minutes}:`
                    time += formatNumber(duration.seconds)

                    const obj = showVideo(res.items[0], time, info)

                    if(!videoSection.childElementCount) videoSection.appendChild(obj)
                    else insertAfter(obj, videoSection.lastElementChild)
                })
        })
    }
}

const showPlaylist = (playlistId, info) => {
    const maxResults = 8;
    const playlistURL = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`

    fetch(playlistURL)
        .then(res => res.json())
        .then(data => loadVideo(data, info))
}

const youtubeChannelStats = () => {
    channelInfo = document.createElement('div')
    channelInfo.classList.add('channel')
    insertAfter(channelInfo, body.lastElementChild)
    insertAfter(document.createElement('br'), body.lastElementChild)
    insertAfter(document.createElement('hr'), body.lastElementChild)
    insertAfter(document.createElement('br'), body.lastElementChild)

    const videosTitleContainer = document.createElement('div')
    videosTitleContainer.classList.add('videos-title-container')
    const videosTitle = document.createElement('h1')
    videosTitle.classList.add('videos-title')
    const videosTitleText = document.createTextNode("Latest Youtube Videos")
    videosTitle.appendChild(videosTitleText)
    videosTitleContainer.appendChild(videosTitle)
    
    insertAfter(videosTitleContainer, body.lastElementChild)

    const videosDiv = document.createElement('div')
    videosDiv.classList.add('videos')

    videoSection = document.createElement('section')
    videoSection.classList.add('video-section')
    
    videosDiv.appendChild(videoSection)
    insertAfter(videosDiv, body.lastElementChild)

    const endPoint = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=snippet,contentDetails,statistics`;
    fetch(endPoint)
        .then(res => res.json())
        .then(data => {
            console.log('Channel Information')
            console.log(data)
            showChannel(data)
            const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads
            showPlaylist(playlistId, data)
        })
}

submitButton.addEventListener('click', function(event){
    event.preventDefault()
    channelId = String(document.querySelector('.channel-id').value);
    formContainer.remove()

    youtubeChannelStats()
}, { once: true })

inputChannel.addEventListener("keyup", function(event) {
    console.log("input text")
    if (event.keyCode === 13) {
        console.log("input enter")
        event.preventDefault();
        submitButton.click()
    }
});