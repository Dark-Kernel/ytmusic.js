import axios from "axios";

import { extractSongs } from "./modules/search.js";

import fs from "fs";
/**
 * Search YouTube Music for a specific query
 * @param {string} query - The search term
 * @returns {Promise} - Promise resolving to search results
 */
async function searchYouTubeMusic(query) {
  try {
    const url = 'https://music.youtube.com/youtubei/v1/search?prettyPrint=false';
    
    // no crap.
    const headers = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json',
      'X-Youtube-Client-Name': '67',
      'X-Youtube-Client-Version': '1.20250423.01.00',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'same-origin',
      'Sec-Fetch-Site': 'same-origin',
      'Referer': 'https://music.youtube.com/search?q=' + encodeURIComponent(query)
    };
    
    const body = {
      context: {
        client: {
          hl: 'en',
          gl: 'US',
          clientName: 'WEB_REMIX',
          clientVersion: '1.20250423.01.00',
          userInterfaceTheme: 'USER_INTERFACE_THEME_DARK'
        }
      },
      query: query,
      params: 'EgWKAQIIAWoQEAMQBBAJEAoQBRAREBAQFQ%3D%3D'  // This parameter controls search filtering
    };
    
    const response = await axios.post(url, body, { headers });
    
    return response.data;
  } catch (error) {
    console.error('Error searching YouTube Music:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

async function main() {
  const searchQuery = process.argv[2] || 'bones';
  
  try {
    console.log(`Searching YouTube Music for: "${searchQuery}"`);
    const results = await searchYouTubeMusic(searchQuery);

fs.writeFileSync('./newresult2.json', JSON.stringify(results, null, 2));
    
const songs = extractSongs(results);
console.log(songs)
  } catch (error) {
    console.error('Script execution failed:', error.message);
  }
}

main();

// Example: node script.js "bones"
