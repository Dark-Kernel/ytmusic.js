// fetch https://music.youtube.com/s/player/14cfd4c0/player_ias.vflset/en_US/base.js
import fs from "fs";
import { Jinter } from 'jintr';
import { findVariable, findFunction } from "./utils.js";

import { CipherManifest } from "./playerdecipher.js";

const data = await fetch("https://music.youtube.com/s/player/14cfd4c0/player_ias.vflset/en_US/base.js").then((response) => response.text());
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
console.log(sig_timestamp)
const global_variable = extractGlobalVariable(player_js, ast);
// console.log(global_variable)
const sig_sc = extractSigSourceCode(player_js, global_variable);
console.log(sig_sc)
const nsig_sc = extractNSigSourceCode(player_js, ast, global_variable);
console.log(nsig_sc)

// console.log(data.match("signatureTimestamp"));
// fs.writeFileSync("base.js", data);

// const match = player_js.match(/function\(([A-Za-z_0-9]+)\)\{([A-Za-z_0-9]+=[A-Za-z_0-9]+\.split\((?:[^)]+)\)(.+?)\.join\((?:[^)]+)\))\}/);
// console.log(match);
// const decipherManifest = CipherManifest.decode(data);
// console.log(decipherManifest);
