

import axios from "axios";

import { extractSongs } from "./modules/search.js";

import fs from "fs";


// YouTube Music next API request with playlist parameters using axios
axios({
  method: 'POST',
  url: 'https://music.youtube.com/youtubei/v1/next?prettyPrint=false',
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Content-Type': 'application/json',
    'X-Youtube-Client-Name': '67',
    'X-Youtube-Client-Version': '1.20250423.01.00',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'same-origin',
    'Sec-Fetch-Site': 'same-origin'
  },
  data: {
    enablePersistentPlaylistPanel: true,
    tunerSettingValue: 'AUTOMIX_SETTING_NORMAL',
    playlistId: 'RDAMVMV2SVRJ6dcE4',
    params: 'wAEB8gECeAHqBAtWMlNWUko2ZGNFNA%3D%3D',
    isAudioOnly: true,
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
    }
  }
})
.then(response => {
  console.log(response.data);
fs.writeFileSync('./nextPlayResp.json', JSON.stringify(response.data, null, 2));
})
.catch(error => {
  console.error('Error:', error);
});
