import fs from "fs";
import child_process from "child_process";

// Read the results from the JSON file
// const results = JSON.parse(fs.readFileSync('./results.json', 'utf-8'));

// Extract songs data
export function extractSongs(results) {
    
const songs = [];
const contents = results?.contents?.tabbedSearchResultsRenderer?.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents;
//const contents = results?.contents;
// console.log(contents);

if (contents) {
    contents.forEach((section) => {
        const items = section.musicShelfRenderer?.contents || section.musicCardShelfRenderer?.contents;
        // const items = section
        if (items) {
            items.forEach((item) => {
                const song = item.musicResponsiveListItemRenderer;
                if (song) {
                    const title = song?.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text;
                    const artistInfo = song?.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs;
                    let artist;
                    if(artistInfo && artistInfo[1]?.text === ' & '){
                        const firstName = artistInfo[0]?.text;
                        const separator = artistInfo[1]?.text;
                        const secondName = artistInfo[2]?.text;
                        artist =[firstName, separator, secondName].join('');
                    }else{
                          artist = artistInfo?.[0]?.text;
                    }
                    // const artist = song?.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text;
                    const videoId = song?.playlistItemData?.videoId || song?.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId;

                    if (title && artist && videoId) {
                        songs.push({ title, artist, videoId });
                    }
                }
            });
        }
    });
}
return songs;
}

// Display the extracted songs
// console.log("Fetched Songs:");
// songs.forEach((song, index) => {
//     console.log(`${index + 1}. ${song.title} by ${song.artist}`);
// });

// // Play a song using mpv
// if (songs.length > 0) {
//     const selectedIndex = 0; // Replace with dynamic selection (e.g., user input)
//     const selectedSong = songs[selectedIndex];
//     const videoUrl = `https://www.youtube.com/watch?v=${selectedSong.videoId}`;
//     console.log(`Playing: ${selectedSong.title} by ${selectedSong.artist}`);
//     child_process.execSync(`mpv ${videoUrl}`, { stdio: 'inherit' });
// } else {
//     console.log("No songs found.");
// }

