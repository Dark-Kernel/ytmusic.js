
import fs from "fs";
import axios from "axios";

async function searchMusic(query) {
  const url = 'https://music.youtube.com/youtubei/v1/search?prettyPrint=false';

  const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Content-Type': 'application/json',
    'Referer': `https://music.youtube.com/search?q=${encodeURIComponent(query)}`,
    'X-Goog-Visitor-Id': 'Cgt4VkFERzVCUHZBRSjaj77ABjIKCgJJThIEGgAgaA%3D%3D',
    'X-Youtube-Bootstrap-Logged-In': 'false',
    'X-Youtube-Client-Name': '67',
    'X-Youtube-Client-Version': '1.20250423.01.00',
    'Origin': 'https://music.youtube.com',
    'DNT': '1',
    'Sec-GPC': '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'same-origin',
    'Sec-Fetch-Site': 'same-origin',
    'Connection': 'keep-alive',
    'Priority': 'u=0',
    'TE': 'trailers',
    'Cookie': 'PREF=tz=Asia.Kolkata&f6=40000000&f7=100&repeat=NONE&autoplay=true&f5=20000&f4=4000000; ...' // <--- Ideally load from config or env
  };

  const payload = {
    context: {
      client: {
        hl: 'en',
        gl: 'IN',
        remoteHost: '103.233.92.24',
        deviceMake: '',
        deviceModel: '',
        visitorData: 'Cgt4VkFERzVCUHZBRSjaj77ABjIKCgJJThIEGgAgaA%3D%3D',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0,gzip(gfe)',
        clientName: 'WEB_REMIX',
        clientVersion: '1.20250423.01.00',
        osName: 'X11',
        osVersion: '',
        originalUrl: 'https://music.youtube.com/',
        screenPixelDensity: 1,
        platform: 'DESKTOP',
        clientFormFactor: 'UNKNOWN_FORM_FACTOR',
        configInfo: {
          appInstallData: 'CNqPvsAGEIjjrwUQ37jOHBDg4P8SEJT-sAUQ-ZHPHBCG284cELvZzhwQ5-...',
          coldConfigData: 'CNqPvsAGGjJBT2pGb3gyT3hOUk02U3lQcWpQMENCSm9V...',
          coldHashData: 'CNqPvsAGEhM4MzcyMjg4Nzg1MDY2MDg0NzkyGNqPvsAG...',
          hotHashData: 'CNqPvsAGEhIyMzE1NTI2MTEwMzY5MjU2MDAY2o--wAY...'
        },
        timeZone: 'Asia/Kolkata',
        browserName: 'Firefox',
        browserVersion: '137.0',
        acceptHeader: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    },
    query: query,
    params: 'EgWKAQIIAWoSEAMQBBAJEA4QChAFEBEQEBAV'
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

import { extractSongs } from "./src/modules/search.js";

const results = await searchMusic('bones');
console.log(results);   
fs.writeFileSync('./results2.json', JSON.stringify(results, null, 2));

// const songs = extractSongs(results);
// console.log("Fetched Songs:", songs);
// songs.forEach((song, index) => {
//     console.log(`${index + 1}. ${song.title} by ${song.artist}`);
// });


