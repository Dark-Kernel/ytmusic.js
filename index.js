import axios from "axios";
import fs from "fs";

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
// fs.writeFileSync('./results.json', JSON.stringify(results, null, 2));

const songs = extractSongs(results);
console.log("Fetched Songs:");
songs.forEach((song, index) => {
    console.log(`${index + 1}. ${song.title} by ${song.artist}`);
});

