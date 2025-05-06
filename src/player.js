import axios from "axios";

import fs from "fs";


// SEARCh => PLAYER: 
//  VideoId, context, 
    
// PLAYER =>
    // clickTrackingParams


// PLAYER = > VIDEO PLAYBACK
//
    // cpn
    // poToken / pot

// videoplay => videplay
// range, rn, rbuf

    // await fetch("https://music.youtube.com/youtubei/v1/player?prettyPrint=false", {
    // "credentials": "include",
    // "headers": {
    //     "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0",
    //     "Accept": "*/*",
    //     "Accept-Language": "en-US,en;q=0.5",
    //     "Content-Type": "application/json",
    //     "X-Goog-Visitor-Id": "Cgt4VkFERzVCUHZBRSiYl8fABjIKCgJJThIEGgAgaA%3D%3D",
    //     "X-Youtube-Bootstrap-Logged-In": "false",
    //     "X-Youtube-Client-Name": "67",
    //     "X-Youtube-Client-Version": "1.20250423.01.00",
    //     "Sec-GPC": "1",
    //     "Sec-Fetch-Dest": "empty",
    //     "Sec-Fetch-Mode": "cors",
    //     "Sec-Fetch-Site": "same-origin",
    //     "Alt-Used": "music.youtube.com",
    //     "Priority": "u=0"
    // },
    // "referrer": "https://music.youtube.com/search?q=bones",
    // "body": "{\"videoId\":\"V2SVRJ6dcE4\",\"context\":{\"client\":{\"hl\":\"en\",\"gl\":\"IN\",\"remoteHost\":\"103.233.92.38\",\"deviceMake\":\"\",\"deviceModel\":\"\",\"visitorData\":\"Cgt4VkFERzVCUHZBRSiYl8fABjIKCgJJThIEGgAgaA%3D%3D\",\"userAgent\":\"Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0,gzip(gfe)\",\"clientName\":\"WEB_REMIX\",\"clientVersion\":\"1.20250423.01.00\",\"osName\":\"X11\",\"osVersion\":\"\",\"originalUrl\":\"https://music.youtube.com/\",\"screenPixelDensity\":1,\"platform\":\"DESKTOP\",\"clientFormFactor\":\"UNKNOWN_FORM_FACTOR\",\"configInfo\":{\"appInstallData\":\"CJiXx8AGEIiHsAUQ37jOHBC72c4cEOmFgBMQi4KAExD4q7EFEL2ZsAUQopPPHBCHrM4cELfq_hIQ0-GvBRDz1s4cEOfjzhwQndCwBRCHhM8cEImwzhwQuOTOHBDJ968FEKn_zhwQ8OLOHBC52c4cEOCCgBMQgc3OHBCZjbEFEMnmsAUQhtvOHBD8ss4cEMWBzxwQ9quwBRDr6P4SEL22rgUQ4riwBRDW9c4cEM-UzxwQ4NzOHBCU_rAFEMCSzxwQ4OD_EhCI468FEJr0zhwQ4OXOHBDMic8cEPDszhwQ3rzOHBC-irAFEKTvzhwQmZixBRDk5_8SEMzfrgUQ-ZHPHBD1684cEPvfzhwqKENBTVNHQlVUb0wyd0ROSGtCcFNDRXRYUzZndjU3QVBKM0FVZEJ3PT0%3D\",\"coldConfigData\":\"CJiXx8AGGjJBT2pGb3gyT3hOUk02U3lQcWpQMENCSm9VUWRmN3Y0RTJndUYxY0VkNzBEbElaMURNZyIyQU9qRm94Mk94TlJNNlN5UHFqUDBDQkpvVVFkZjd2NEUyZ3VGMWNFZDcwRGxJWjFETWc%3D\",\"coldHashData\":\"CJiXx8AGEhM4MzcyMjg4Nzg1MDY2MDg0NzkyGJiXx8AGMjJBT2pGb3gyT3hOUk02U3lQcWpQMENCSm9VUWRmN3Y0RTJndUYxY0VkNzBEbElaMURNZzoyQU9qRm94Mk94TlJNNlN5UHFqUDBDQkpvVVFkZjd2NEUyZ3VGMWNFZDcwRGxJWjFETWc%3D\",\"hotHashData\":\"CJiXx8AGEhIyMzE1NTI2MTEwMzY5MjU2MDAYmJfHwAYyMkFPakZveDJPeE5STTZTeVBxalAwQ0JKb1VRZGY3djRFMmd1RjFjRWQ3MERsSVoxRE1nOjJBT2pGb3gyT3hOUk02U3lQcWpQMENCSm9VUWRmN3Y0RTJndUYxY0VkNzBEbElaMURNZw%3D%3D\"},\"screenDensityFloat\":1,\"userInterfaceTheme\":\"USER_INTERFACE_THEME_DARK\",\"timeZone\":\"Asia/Kolkata\",\"browserName\":\"Firefox\",\"browserVersion\":\"137.0\",\"acceptHeader\":\"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\",\"deviceExperimentId\":\"ChxOelE1T0RrNU9EY3hNREkzTkRVd01qUTVNQT09EJiXx8AGGJiXx8AG\",\"rolloutToken\":\"CMWEp5To-MzcwwEQ_pvoze_6jAMY1IWS1bH9jAM%3D\",\"screenWidthPoints\":1338,\"screenHeightPoints\":302,\"utcOffsetMinutes\":330,\"playerType\":\"UNIPLAYER\",\"tvAppInfo\":{\"livingRoomAppMode\":\"LIVING_ROOM_APP_MODE_UNSPECIFIED\"},\"clientScreen\":\"WATCH_FULL_SCREEN\"},\"user\":{\"lockedSafetyMode\":false},\"request\":{\"useSsl\":true,\"internalExperimentFlags\":[],\"consistencyTokenJars\":[]},\"clientScreenNonce\":\"_ZRKKJO6feSm6XTq\",\"adSignalsInfo\":{\"params\":[{\"key\":\"dt\",\"value\":\"1745996697838\"},{\"key\":\"flash\",\"value\":\"0\"},{\"key\":\"frm\",\"value\":\"0\"},{\"key\":\"u_tz\",\"value\":\"330\"},{\"key\":\"u_his\",\"value\":\"9\"},{\"key\":\"u_h\",\"value\":\"768\"},{\"key\":\"u_w\",\"value\":\"1366\"},{\"key\":\"u_ah\",\"value\":\"768\"},{\"key\":\"u_aw\",\"value\":\"1366\"},{\"key\":\"u_cd\",\"value\":\"24\"},{\"key\":\"bc\",\"value\":\"31\"},{\"key\":\"bih\",\"value\":\"302\"},{\"key\":\"biw\",\"value\":\"1338\"},{\"key\":\"brdim\",\"value\":\"0,0,0,0,1366,0,1354,722,1338,302\"},{\"key\":\"vis\",\"value\":\"1\"},{\"key\":\"wgl\",\"value\":\"true\"},{\"key\":\"ca_type\",\"value\":\"image\"}]},\"clickTracking\":{\"clickTrackingParams\":\"CLMCEMjeAiITCNqMpMqY_4wDFX8ptwAdOiAbYw==\"}},\"playbackContext\":{\"contentPlaybackContext\":{\"html5Preference\":\"HTML5_PREF_WANTS\",\"lactMilliseconds\":\"19\",\"referer\":\"https://music.youtube.com/search?q=bones\",\"signatureTimestamp\":20206,\"autonavState\":\"STATE_ON\",\"autoCaptionsDefaultOn\":false,\"mdxContext\":{},\"vis\":10},\"devicePlaybackCapabilities\":{\"supportsVp9Encoding\":true,\"supportXhr\":true}},\"cpn\":\"DtkyET85YbCAu0B1\",\"captionParams\":{},\"serviceIntegrityDimensions\":{\"poToken\":\"MnSe6GJfQzIgDp7QVLmYlE5R3yDXEY7PuYe4jcWCvPkXAkPAcsv3gKniCB9Gd7HX3tPJNyfflYiKqoFr2o0p-t0wtwwMHXpJdLqU3qCNbpU1r5NujR9iUZXGVToPn2nhHbUffJ4RfPNn9KkWvFE2FlIOWxaRqw==\"}}",
    // "method": "POST",
    // "mode": "cors"
// });
//


// YouTube Music player API request using axios
axios({
  method: 'POST',
  url: 'https://music.youtube.com/youtubei/v1/player?prettyPrint=false',
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Content-Type': 'application/json',
    'X-Youtube-Client-Name': '67',
    'X-Youtube-Client-Version': '1.20250423.01.00',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
  },
  data: {
    videoId: 'V2SVRJ6dcE4',
    context: {
      client: {
        hl: 'en',
        gl: 'IN',
        clientName: 'WEB_REMIX',
        clientVersion: '1.20250423.01.00',
        userInterfaceTheme: 'USER_INTERFACE_THEME_DARK',
        platform: 'DESKTOP'
      },
      user: {
        lockedSafetyMode: false
      },
      request: {
        useSsl: true
      }
    },
    playbackContext: {
      contentPlaybackContext: {
        html5Preference: 'HTML5_PREF_WANTS',
        signatureTimestamp: 20206
      }
    }
  }
})
.then(response => {
  console.log(response.data);
fs.writeFileSync('./playerresp.json', JSON.stringify(response.data, null, 2));
})
.catch(error => {
  console.error('Error:', error);
});
