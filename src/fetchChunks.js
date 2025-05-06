import axios from "axios";
import fs from 'fs';

const url = "https://rr1---sn-qpbpu5an5uxaapuxpo-cvhs.googlevideo.com/videoplayback?expire=1746024396&ei=a-MRaMLhPMzd3LUPge7GqA8&ip=103.233.92.38&id=o-APW6pVoq6w9NmNJLSiyCuCINOSUFr-kJrKaVwzDQcz6u&itag=251&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&met=1746002796%2C&mh=Tz&mm=31%2C29&mn=sn-qpbpu5an5uxaapuxpo-cvhs%2Csn-cvh76nlk&ms=au%2Crdu&mv=m&mvi=1&pcm2cms=yes&pl=24&rms=au%2Cau&gcr=in&initcwndbps=1843750&bui=AecWEAYySJiLzBqVQRbG_Y60mf5U5xTy5-nmMm1UHOxdezJzbzWGxbPLojHtNeBjHiNxXpCmG-wkPqIU&spc=wk1kZiBLQtTLbM0yArqg_XhpYdE8gauTA8OA3RpHnP9bogPM4spiJKEZ-UrGiiXU6UI&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=GG_7AZdaQBesQ1QgS7L7nG0Q&rqh=1&gir=yes&clen=2710196&dur=165.281&lmt=1714658531694348&mt=1746002458&fvip=5&keepalive=yes&c=WEB_REMIX&sefc=1&txp=2318224&n=8XT8aj0HF7JLGw&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=met%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Crms%2Cinitcwndbps&lsig=ACuhMU0wRAIgD0FSp3clKBxXT3sZADRZHRZbH550_ZXmy4MGfzNavhMCIBZpxK4UVy5FIVRNsyG4JIit9nbNpqV3J-z8HIARMb2b&alr=yes&sig=AJfQdSswRgIhAMG0CNGk9XnPYcCZPvGr9gt3nV0wajKQx4Ct7SqQeq7AAiEAltr8JAKEqj3NTUhH9bgcOOtBC8MXJW27MYyd2E8hrLQ%3D&cpn=M0SvQE00dAlYH-nX&cver=1.20250423.01.00&range=0-66080&rn=4&rbuf=0&pot=MnQqlNLWmxF7xSqs7FXfyicW85UDEr-u5-OtzzRVO-8VfLX16JsF-whT4xElSRvbxHwdNZ1C9XLT9MuR2GdjNaSEwJwaf7lvfDAJeB-Ouul5nlq-hIVFuP3256peRSO4_mk-tYmgjgUMvMHvxgnLgOFvXvhLZg==&ump=1&srfvp=1"; // Base URL before range/rn/rbuf
const totalLength = 2710196;
const chunkSize = 131072; // ~128 KB
let start = 0;
let rn = 1;
let rbuf = 0;

// const output = fs.createWriteStream("output.webm");
const writer = fs.createWriteStream("audio.webm");

async function fetchChunks() {
  while (start < totalLength) {
    const end = Math.min(start + chunkSize - 1, totalLength - 1);
    const rangeParam = `${start}-${end}`;
    rbuf = rbuf === 0 ? 0 : rbuf * 2;

    const chunkUrl = `${url}&range=${rangeParam}&rn=${rn}&rbuf=${rbuf}`;

    try {
      const response = await axios.get(chunkUrl, {
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0",
          "Accept": "*/*",
          "Range": `bytes=${rangeParam}`
        }
      });

      // Process the chunk (e.g. push to a buffer, stream to audio)
          // output.write(Buffer.from(response.data));
        // fs.writeFileSync('./some.webm', Buffer.from(response.data));
        response.data.pipe(writer);

      console.log(`Fetched bytes: ${rangeParam}`);


    } catch (err) {
      console.error(`Error fetching chunk ${rangeParam}:`, err.message);
      break;
    }

    start += chunkSize;
    rn += 1;
  }
    // output.end()
}

fetchChunks();

