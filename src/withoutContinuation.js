import axios from "axios";
import fs from "fs";


// curl 'https://music.youtube.com/youtubei/v1/search?prettyPrint=false' --compressed -X POST -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0' -H 'Accept: */*' -H 'Accept-Language: en-US,en;q=0.5' -H 'Accept-Encoding: gzip, deflate, br, zstd' -H 'Content-Type: application/json' -H 'Referer: https://music.youtube.com/search?q=bones' -H 'X-Goog-Visitor-Id: Cgt4VkFERzVCUHZBRSjaj77ABjIKCgJJThIEGgAgaA%3D%3D' -H 'X-Youtube-Bootstrap-Logged-In: false' -H 'X-Youtube-Client-Name: 67' -H 'X-Youtube-Client-Version: 1.20250423.01.00' -H 'Origin: https://music.youtube.com' -H 'DNT: 1' -H 'Sec-GPC: 1' -H 'Sec-Fetch-Dest: empty' -H 'Sec-Fetch-Mode: same-origin' -H 'Sec-Fetch-Site: same-origin' -H 'Connection: keep-alive' -H 'Alt-Used: music.youtube.com' -H 'Cookie: PREF=tz=Asia.Kolkata&f6=40000000&f7=100&repeat=NONE&autoplay=true&f5=20000&f4=4000000; LOGIN_INFO=AFmmF2swRgIhAIeoTsW5D0xnZ92y-uVKJ4eIctuMu5Sno-01qR1amiwTAiEApIWMtnS0pBqMO9npWaeDAPizQRz4E2N1IBvarWbkAfg:QUQ3MjNmd2RNMzhPa09fMjQxTV9iX0V3ZGhFc1dNaVBTWGdDN1Nfc2h1Q3RfSW40UXV6MHpGVXhYZVlKSmVYUmpJQUdhMVhEb3QzT2lndWZWbFlKWEFtT2YycVBmTkRXakM2bl9fakhIQ28tdFktcjFoS00tdnM1bDk3emdQRzNSalFiM2lkUUk5Slk0X1IzY3N3YnVSaDdpSUdJc1pKWnh3; VISITOR_INFO1_LIVE=xVADG5BPvAE; VISITOR_PRIVACY_METADATA=CgJJThIEGgAgaA%3D%3D; CONSENT=YES+; visitor=1; wide=0; YSC=Vi0vrz8nX9s; __Secure-ROLLOUT_TOKEN=CMWEp5To-MzcwwEQ_pvoze_6jAMYmMGuzu_6jAM%3D' -H 'Priority: u=0' -H 'TE: trailers' --data-raw '{"context":{"client":{"hl":"en","gl":"IN","remoteHost":"103.233.92.24","deviceMake":"","deviceModel":"","visitorData":"Cgt4VkFERzVCUHZBRSjaj77ABjIKCgJJThIEGgAgaA%3D%3D","userAgent":"Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0,gzip(gfe)","clientName":"WEB_REMIX","clientVersion":"1.20250423.01.00","osName":"X11","osVersion":"","originalUrl":"https://music.youtube.com/","screenPixelDensity":1,"platform":"DESKTOP","clientFormFactor":"UNKNOWN_FORM_FACTOR","configInfo":{"appInstallData":"CNqPvsAGEIjjrwUQ37jOHBDg4P8SEJT-sAUQ-ZHPHBCG284cELvZzhwQ5-POHBC-irAFEPirsQUQiJDPHBCk784cEIiEuCIQ_LLOHBDf3M4cENvazhwQ6YWAExCp_84cENb1zhwQ9o7PHBC36v4SEMWBzxwQmvTOHBDM364FEIiHsAUQ4riwBRC7kM8cEMn3rwUQh4TPHBDr6P4SEImwzhwQuOTOHBDw7M4cEIHNzhwQndCwBRCHrM4cEODlzhwQ89bOHBDT4a8FEOCCgBMQmZixBRC52c4cEPDizhwQi4KAExDk5_8SEMyJzxwQiafOHBCQhYATEMCSzxwQ9quwBRCZjbEFEL2ZsAUQyeawBRC9tq4FEN68zhwQ9evOHBD7384cKihDQU1TR0JVVG9MMndETkhrQnBTQ0V0WFM2Z3Y1N0FQSjNBVWRCdz09","coldConfigData":"CNqPvsAGGjJBT2pGb3gyT3hOUk02U3lQcWpQMENCSm9VUWRmN3Y0RTJndUYxY0VkNzBEbElaMURNZyIyQU9qRm94Mk94TlJNNlN5UHFqUDBDQkpvVVFkZjd2NEUyZ3VGMWNFZDcwRGxJWjFETWc%3D","coldHashData":"CNqPvsAGEhM4MzcyMjg4Nzg1MDY2MDg0NzkyGNqPvsAGMjJBT2pGb3gyT3hOUk02U3lQcWpQMENCSm9VUWRmN3Y0RTJndUYxY0VkNzBEbElaMURNZzoyQU9qRm94Mk94TlJNNlN5UHFqUDBDQkpvVVFkZjd2NEUyZ3VGMWNFZDcwRGxJWjFETWc%3D","hotHashData":"CNqPvsAGEhIyMzE1NTI2MTEwMzY5MjU2MDAY2o--wAYyMkFPakZveDJPeE5STTZTeVBxalAwQ0JKb1VRZGY3djRFMmd1RjFjRWQ3MERsSVoxRE1nOjJBT2pGb3gyT3hOUk02U3lQcWpQMENCSm9VUWRmN3Y0RTJndUYxY0VkNzBEbElaMURNZw%3D%3D"},"timeZone":"Asia/Kolkata","browserName":"Firefox","browserVersion":"137.0","acceptHeader":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"}},"query":"bones","params":"EgWKAQIIAWoSEAMQBBAJEA4QChAFEBEQEBAV"}'
const domain = "https://music.youtube.com/";
const baseUrl = `${domain}youtubei/v1/`;
const fixedParms = '?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30';
const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

import { getSearchParams } from "./modules/params.js";
import { extractSongs } from "./modules/search.js";

let headers = {
    'user-agent': userAgent,
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate',
    'content-type': 'application/json',
    'content-encoding': 'gzip',
    'origin': domain,
    'cookie': 'CONSENT=YES+1',
}

let context = {
    'context': {
      'client': {
        "clientName": "WEB_REMIX",
        "clientVersion": "1.20230213.01.00",
      },
      'user': {}
    }
};

async function makeRequest(action, data) {
    try {
        const url = `${baseUrl}${action}${fixedParms}`;
        const response = await axios.post(url, data, {
            headers: headers,
        });

        if (response.status !== 200) {
            console.error('Error:', response.status);
            return null;
        }
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function search(query) {
    const data = JSON.parse(JSON.stringify(context));
    data.context.client.hl = 'en'; 
    data.query = query;
    // const params = getSearchParams("songs", "library", false);
    const params = "EgWKAQII"
    if(params) {data.params = params;}
    const response = await makeRequest("search", data);
    return response.contents
}

const query = 'Bring me horizon';
const results = await search(query);
fs.writeFileSync('./results.json', JSON.stringify(results, null, 2));

const songs = extractSongs(results);
console.log(songs)
console.log("Fetched Songs:");
songs.forEach((song, index) => {
    console.log(`${index + 1}. ${song.title} by ${song.artist}`);
});

