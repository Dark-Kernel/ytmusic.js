// fetch https://music.youtube.com/s/player/14cfd4c0/player_ias.vflset/en_US/base.js
import fs from "fs";
import { Jinter } from 'jintr';
import { findVariable, findFunction } from "./utils.js";

// import { CipherManifest } from "./playerdecipher.js";

const data = await fetch("https://music.youtube.com/s/player/14cfd4c0/player_ias.vflset/en_US/base.js").then((response) => response.text());

const stream_url = "https://rr1---sn-qpbpu5an5uxaapuxpo-cvhs.googlevideo.com/videoplayback%3Fexpire%3D1746474384%26ei%3DL8EYaNWnPL31s8IPj6HVoAU%26ip%3D103.233.92.2%26id%3Do-AG5SRKCAA3ND6npwMifcVnHnxq-I3eaEhLaCdaPviWcD%26itag%3D140%26source%3Dyoutube%26requiressl%3Dyes%26xpc%3DEgVo2aDSNQ%253D%253D%26met%3D1746452784%252C%26mh%3DTz%26mm%3D31%252C29%26mn%3Dsn-qpbpu5an5uxaapuxpo-cvhs%252Csn-cvh7knzk%26ms%3Dau%252Crdu%26mv%3Dm%26mvi%3D1%26pl%3D24%26rms%3Dau%252Cau%26gcr%3Din%26initcwndbps%3D1800000%26bui%3DAecWEAZ9HUgTq-S8Tsy7nhse9mpJeNWssIZyfbP8ItjQWVq2qj6YdIfTuBzT7wqrZi-lCO2zFlIgGihm%26spc%3Dwk1kZkAY-s1V6yyWP7f-FlB1AH2AihcXVgusOq8OvHeLvuC5B2p1yzx8C5zbmzoY1HPfvdI%26vprv%3D1%26svpuc%3D1%26mime%3Daudio%252Fmp4%26ns%3DR2HylU7I0kRzZ1bVfNaR4rgQ%26rqh%3D1%26gir%3Dyes%26clen%3D2676945%26dur%3D165.264%26lmt%3D1646979066136001%26mt%3D1746452292%26fvip%3D2%26keepalive%3Dyes%26c%3DWEB_REMIX%26sefc%3D1%26txp%3D2311222%26n%3DR-9BlCF5kFY2NX%26sparams%3Dexpire%252Cei%252Cip%252Cid%252Citag%252Csource%252Crequiressl%252Cxpc%252Cgcr%252Cbui%252Cspc%252Cvprv%252Csvpuc%252Cmime%252Cns%252Crqh%252Cgir%252Cclen%252Cdur%252Clmt%26lsparams%3Dmet%252Cmh%252Cmm%252Cmn%252Cms%252Cmv%252Cmvi%252Cpl%252Crms%252Cinitcwndbps%26lsig%3DACuhMU0wRQIgTjsHRPhxcFpHnnUSmDBmXR6IwG7dvc1OJoSH9f1hx1gCIQCFx100OLZAGG6xiRmfU6jpROE6q-FJ7cbegT786_ufkg%253D%253D"

// console.log(data);

const baseURL = "https://www.youtube.com/"

const url = new URL('/iframe_api', baseURL);
const res = await fetch(url);
if (!res.ok)
  throw new Error(`Failed to get player id: ${res.status} (${res.statusText})`);

const js = await res.text();

export function escapeStringRegexp(input) {
  return input.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

export function getStringBetweenStrings(data, start_string, end_string){
  const regex = new RegExp(`${escapeStringRegexp(start_string)}(.*?)${escapeStringRegexp(end_string)}`, 's');
  const match = data.match(regex);
  return match ? match[1] : undefined;
}

const player_id = getStringBetweenStrings(js, 'player\\/', '\\/');

const player_url = new URL(`/s/player/${player_id}/player_ias.vflset/en_US/base.js`, baseURL);
const player_res = await fetch(player_url);
const player_js = await player_res.text();
// console.log(player_js)

const ast = Jinter.parseScript(player_js, { ecmaVersion: 'latest', ranges: true });

function extractSigTimestamp(data){
    return parseInt(getStringBetweenStrings(data, 'signatureTimestamp:', ',') || '0');
}

function extractGlobalVariable(data, ast){
    let variable = findVariable(data, { includes: '-_w8_', ast });

    // For redundancy/the above fails:
    if (!variable)
      variable = findVariable(data, { includes: 'Untrusted URL{', ast });

    if (!variable)
      variable = findVariable(data, { includes: '1969', ast });

    if (!variable)
      variable = findVariable(data, { includes: '1970', ast });

    if (!variable)
      variable = findVariable(data, { includes: 'playerfallback', ast });

    return variable;
  }

function extractSigSourceCode(data, global_variable) {
    // Classic static split/join.
    const split_join_regex = /function\(([A-Za-z_0-9]+)\)\{([A-Za-z_0-9]+=[A-Za-z_0-9]+\.split\((?:[^)]+)\)(.+?)\.join\((?:[^)]+)\))\}/;

    // Using the global lookup variable.
    const lookup_var = global_variable?.name?.replace(/[$^\\.*+?()[\]{}|]/g, '\\$&');
    const lookup_regex = lookup_var
      ? new RegExp(
        `function\\(([A-Za-z_0-9]+)\\)\\{([A-Za-z_0-9]+=[A-Za-z_0-9]+\\[${lookup_var}\\[\\d+\\]\\]\\([^)]*\\)([\\s\\S]+?)\\[${lookup_var}\\[\\d+\\]\\]\\([^)]*\\))\\}`
      )
      : null;

    const match = data.match(split_join_regex) || (lookup_regex ? data.match(lookup_regex) : null);

    if (!match) {
      Log.warn(TAG, 'Failed to extract signature decipher algorithm.');
      return;
    }

    const var_name = match[1];
    const obj_name = match[3].split(/\.|\[/)[0]?.replace(';', '').trim();
    const functions = getStringBetweenStrings(data, `var ${obj_name}={`, '};');

    if (!functions || !var_name)
      Log.warn(TAG, 'Failed to extract signature decipher algorithm.');

    return `${global_variable?.result || ''} function descramble_sig(${var_name}) { let ${obj_name}={${functions}}; ${match[2]} } descramble_sig(sig);`;
  }

function extractNSigSourceCode(data, ast, global_variable){
    let nsig_function;

    if (global_variable) {
      nsig_function = findFunction(data, { includes: `new Date(${global_variable.name}`, ast });
      
      // For redundancy/the above fails:
      if (!nsig_function)
        nsig_function = findFunction(data, { includes: '.push(String.fromCharCode(', ast });
      
      if (!nsig_function)
        nsig_function = findFunction(data, { includes: '.reverse().forEach(function', ast });
      
      if (nsig_function)
        return `${global_variable.result} var ${nsig_function.result} ${nsig_function.name}(nsig);`;
    }
        // This is the suffix of the error tag.
    nsig_function = findFunction(data, { includes: '-_w8_', ast });
    
    // Usually, only this function uses these dates in the entire script.
    if (!nsig_function)
      nsig_function = findFunction(data, { includes: '1969', ast });
    
    // This used to be the prefix of the error tag (leaving it here for reference).
    if (!nsig_function)
      nsig_function = findFunction(data, { includes: 'enhanced_except', ast });
    
    if (nsig_function)
      return `let ${nsig_function.result} ${nsig_function.name}(nsig);`;
  }

  function urll(){
    return new URL(`/s/player/${this.player_id}/player_ias.vflset/en_US/base.js`, Constants.URLS.YT_BASE).toString();
  }

  function LIBRARY_VERSION() {
    return 14;
  }

const sig_timestamp = extractSigTimestamp(player_js);
// console.log(sig_timestamp)
const global_variable = extractGlobalVariable(player_js, ast);
// console.log(global_variable)
const sig_sc = extractSigSourceCode(player_js, global_variable);
// console.log(sig_sc)
const nsig_sc = extractNSigSourceCode(player_js, ast, global_variable);
// console.log(nsig_sc)
import { decipher } from "./decipher_url.js";
import { pomain } from "./getpo.js";

const po_token = await pomain();
const signature_cipher = "s=%3D%3D%3DgRRbYnL_2j1ZJrgdt0ytqqgoj2tNJCUSnfYUmdzvm_RAiAa240p2Cv7rTs0BYVdWET7WAxqdCNPcj5Qc_o4fvXs3MAhIQRwsjdQfJAjAS&sp=sig&url=https://rr1---sn-qpbpu5an5uxaapuxpo-cvhs.googlevideo.com/videoplayback%3Fexpire%3D1746474384%26ei%3DL8EYaNWnPL31s8IPj6HVoAU%26ip%3D103.233.92.2%26id%3Do-AG5SRKCAA3ND6npwMifcVnHnxq-I3eaEhLaCdaPviWcD%26itag%3D18%26source%3Dyoutube%26requiressl%3Dyes%26xpc%3DEgVo2aDSNQ%253D%253D%26met%3D1746452784%252C%26mh%3DTz%26mm%3D31%252C29%26mn%3Dsn-qpbpu5an5uxaapuxpo-cvhs%252Csn-cvh7knzk%26ms%3Dau%252Crdu%26mv%3Dm%26mvi%3D1%26pl%3D24%26rms%3Dau%252Cau%26gcr%3Din%26initcwndbps%3D1800000%26bui%3DAecWEAZLBANVWGQRWf71lAWW2HdO_0qNUgvClebHTcTExvUeGjEJYynQO1MF31vgkW1p563uKXOlO51O%26spc%3Dwk1kZkAb-s1V6yyWP7f-FlB1AH2BihcXVgusOq8OvHeLvuC5B2p1yzx8C5zboTpg0mHc3dL8BA%26vprv%3D1%26svpuc%3D1%26xtags%3Dheaudio%253Dtrue%26mime%3Dvideo%252Fmp4%26ns%3DTNXmkQ61zOQfIAM6wAKYJRcQ%26rqh%3D1%26cnr%3D14%26ratebypass%3Dyes%26dur%3D165.339%26lmt%3D1662944944570339%26mt%3D1746452292%26fvip%3D2%26c%3DWEB_REMIX%26sefc%3D1%26txp%3D2318224%26n%3DuirG_DkSGJoNju%26sparams%3Dexpire%252Cei%252Cip%252Cid%252Citag%252Csource%252Crequiressl%252Cxpc%252Cgcr%252Cbui%252Cspc%252Cvprv%252Csvpuc%252Cxtags%252Cmime%252Cns%252Crqh%252Ccnr%252Cratebypass%252Cdur%252Clmt%26lsparams%3Dmet%252Cmh%252Cmm%252Cmn%252Cms%252Cmv%252Cmvi%252Cpl%252Crms%252Cinitcwndbps%26lsig%3DACuhMU0wRQIgTjsHRPhxcFpHnnUSmDBmXR6IwG7dvc1OJoSH9f1hx1gCIQCFx100OLZAGG6xiRmfU6jpROE6q-FJ7cbegT786_ufkg%253D%253D"
const signature_url = signature_cipher;
let this_response_nsig_cache= "https://rr1---sn-qpbpu5an5uxaapuxpo-cvhs.googlevideo.com/videoplayback%3Fexpire%3D1746474384%26ei%3DL8EYaNWnPL31s8IPj6HVoAU%26ip%3D103.233.92.2%26id%3Do-AG5SRKCAA3ND6npwMifcVnHnxq-I3eaEhLaCdaPviWcD%26itag%3D140%26source%3Dyoutube%26requiressl%3Dyes%26xpc%3DEgVo2aDSNQ%253D%253D%26met%3D1746452784%252C%26mh%3DTz%26mm%3D31%252C29%26mn%3Dsn-qpbpu5an5uxaapuxpo-cvhs%252Csn-cvh7knzk%26ms%3Dau%252Crdu%26mv%3Dm%26mvi%3D1%26pl%3D24%26rms%3Dau%252Cau%26gcr%3Din%26initcwndbps%3D1800000%26bui%3DAecWEAZ9HUgTq-S8Tsy7nhse9mpJeNWssIZyfbP8ItjQWVq2qj6YdIfTuBzT7wqrZi-lCO2zFlIgGihm%26spc%3Dwk1kZkAY-s1V6yyWP7f-FlB1AH2AihcXVgusOq8OvHeLvuC5B2p1yzx8C5zbmzoY1HPfvdI%26vprv%3D1%26svpuc%3D1%26mime%3Daudio%252Fmp4%26ns%3DR2HylU7I0kRzZ1bVfNaR4rgQ%26rqh%3D1%26gir%3Dyes%26clen%3D2676945%26dur%3D165.264%26lmt%3D1646979066136001%26mt%3D1746452292%26fvip%3D2%26keepalive%3Dyes%26c%3DWEB_REMIX%26sefc%3D1%26txp%3D2311222%26n%3DR-9BlCF5kFY2NX%26sparams%3Dexpire%252Cei%252Cip%252Cid%252Citag%252Csource%252Crequiressl%252Cxpc%252Cgcr%252Cbui%252Cspc%252Cvprv%252Csvpuc%252Cmime%252Cns%252Crqh%252Cgir%252Cclen%252Cdur%252Clmt%26lsparams%3Dmet%252Cmh%252Cmm%252Cmn%252Cms%252Cmv%252Cmvi%252Cpl%252Crms%252Cinitcwndbps%26lsig%3DACuhMU0wRQIgTjsHRPhxcFpHnnUSmDBmXR6IwG7dvc1OJoSH9f1hx1gCIQCFx100OLZAGG6xiRmfU6jpROE6q-FJ7cbegT786_ufkg%253D%253D"

const deciphered_url = decipher( signature_url, signature_cipher, this_response_nsig_cache, po_token, sig_sc, nsig_sc);
console.log(deciphered_url)

// console.log(data.match("signatureTimestamp"));
// fs.writeFileSync("base.js", data);

// const match = player_js.match(/function\(([A-Za-z_0-9]+)\)\{([A-Za-z_0-9]+=[A-Za-z_0-9]+\.split\((?:[^)]+)\)(.+?)\.join\((?:[^)]+)\))\}/);
// console.log(match);
// const decipherManifest = CipherManifest.decode(data);
// console.log(decipherManifest);
