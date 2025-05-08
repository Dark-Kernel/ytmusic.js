/**
 * Gets a PO token for the given identifier
 * @param {string} identifier - The identifier to get a token for
 * @returns {Promise<string|undefined>} The PO token or undefined
 */
import { BG } from 'bgutils-js';
import * as ProtoUtils from './protoutils.js';
import * as Utils from './utils.js';


/**
 * Gets a PO token for the given identifier using Puppeteer
 * @param {string} identifier - The identifier to get a token for
 * @returns {Promise<string|undefined>} The PO token or undefined
 */
async function getPo(identifier) {
  // First, make sure puppeteer is installed and imported
  let puppeteer;
  try {
    // Try to import puppeteer - this will only work if it's installed
    puppeteer = (await import('puppeteer')).default;
  } catch (err) {
    throw new Error('This function requires the puppeteer package. Please install it with: npm install puppeteer');
  }
  
  const requestKey = 'O43z0dpjhgX20SCx4KAo';
  let browser;
  
  try {
    console.log("Launching browser...");
    // Launch a headless browser
    browser = await puppeteer.launch({
      headless: "new", // Use the new headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });
    
    console.log("Creating page...");
    const page = await browser.newPage();
    
    // Set a realistic viewport
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Expose the required modules to the page
    await page.evaluateOnNewDocument(`
      window.nodeFetch = ${fetch.toString()};
      window.requestKey = "${requestKey}";
      window.identifier = "${identifier}";
    `);
    
    // Create a basic HTML page
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BG Challenge Runner</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <h1>Running Challenge</h1>
          <div id="result"></div>
          <script>
            window.getPoResult = null;
            window.getPoError = null;
            
            // Function that will be called when the process is complete
            window.setPoResult = function(result) {
              window.getPoResult = result;
              document.getElementById('result').textContent = 'Success: ' + result;
            };
            
            window.setPoError = function(error) {
              window.getPoError = error.toString();
              document.getElementById('result').textContent = 'Error: ' + error;
            };
          </script>
        </body>
      </html>
    `);
    
    // Load the BG module into the page - adjust this based on how you're importing BG
    console.log("Injecting BG module...");
    const bgModule = await import('bgutils-js'); // Adjust this import path as needed
    await page.evaluate((bgModuleStr) => {
      // Create a script tag to load the BG module
      const script = document.createElement('script');
      script.textContent = `
        window.BG = (function() {
          ${bgModuleStr}
          return BG;
        })();
      `;
      document.body.appendChild(script);
    }, bgModule);
    
    // Execute the PO generation process
    console.log("Generating PO token...");
    const poToken = await page.evaluate(async () => {
      try {
        // const bgConfig = {
        //   fetch: window.nodeFetch || window.fetch,
        //   globalObj: window,
        //   requestKey: window.requestKey,
        //   identifier: window.identifier
        // };

           const bgConfig = {
        fetch: window.fetch,
        globalObj: window,
        requestKey: window.requestKey,
        identifier: window.identifier
      };
      
      // console.log("Creating challenge...");
      // const bgChallenge = await window.BG.Challenge.create(bgConfig);
        
        console.log("Creating challenge...");
        const bgChallenge = await window.BG.Challenge.create(bgConfig);
        if (!bgChallenge) {
          throw new Error('Could not get challenge');
        }
        
        console.log("Challenge created successfully");
        
        const interpreterJavascript = bgChallenge.interpreterJavascript.privateDoNotAccessOrElseSafeScriptWrappedValue;
        if (interpreterJavascript) {
          console.log("Executing interpreter JavaScript...");
          // Execute the interpreter JavaScript in the browser context
          const script = document.createElement('script');
          script.textContent = interpreterJavascript;
          document.body.appendChild(script);
          console.log("Interpreter JavaScript executed successfully");
        } else {
          throw new Error('Could not load VM');
        }
        
        console.log("Generating PO token...");
        const poTokenResult = await window.BG.PoToken.generate({
          program: bgChallenge.program,
          globalName: bgChallenge.globalName,
          bgConfig
        });
        
        console.log("PO token generated successfully");
        
        window.setPoResult(poTokenResult.poToken);
        return poTokenResult.poToken;
      } catch (err) {
        console.error("Error in PO token generation:", err);
        window.setPoError(err);
        throw err;
      }
    });
    
    console.log("Token generation completed");
    return poToken;
  } catch (err) {
    console.error('Error generating PO token:', err);
    throw new Error('Could not generate PO token: ' + err.message);
  } finally {
    // Close the browser to clean up resources
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
}

// Export the function
export default getPo;

// async function getPo(identifier) {
//   const requestKey = 'O43z0dpjhgX20SCx4KAo';
//   const bgConfig = {
//     fetch: (input, init) => fetch(input, init),
//     globalObj: typeof window !== 'undefined' ? window : global,
//     requestKey,
//     identifier
//   };
  
//   const bgChallenge = await BG.Challenge.create(bgConfig);
//   if (!bgChallenge)
//     throw new Error('Could not get challenge');
    
//   const interpreterJavascript = bgChallenge.interpreterJavascript.privateDoNotAccessOrElseSafeScriptWrappedValue;
//   if (interpreterJavascript) {
//     new Function(interpreterJavascript)();
//   } else throw new Error('Could not load VM');
  
//   const poTokenResult = await BG.PoToken.generate({
//     program: bgChallenge.program,
//     globalName: bgChallenge.globalName,
//     bgConfig
//   });
  
//   return poTokenResult.poToken;
// }

export async function pomain(){
    let poToken;
    const visitorData = ProtoUtils.encodeVisitorData(Utils.generateRandomString(11), Math.floor(Date.now() / 1000));
    const coldStartToken = BG.PoToken.generatePlaceholder(visitorData);
    getPo(visitorData).then((webPo) => poToken = webPo);
    return poToken;
}
