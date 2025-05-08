import evaluate, { Platform } from "./utils.js";
export function decipher(url, signature_cipher, this_response_nsig_cache, po_token, sig_sc, nsig_sc) {
    url = url || signature_cipher;

    if (!url)
      console.log('No valid URL to decipher');

    const args = new URLSearchParams(url);
    const url_components = new URL(args.get('url') || url);

    if (sig_sc && signature_cipher) {
        // console.log("sig_sc\n",sig_sc)
      const signature = evaluate(sig_sc, {
        sig: args.get('s')
      });

      console.log(`Transformed signature from ${args.get('s')} to ${signature}.`);

      if (typeof signature !== 'string')
        console.log('Failed to decipher signature');

      const sp = args.get('sp');

      if (sp) {
        url_components.searchParams.set(sp, signature);
      } else {
        url_components.searchParams.set('signature', signature);
      }
    }

    const n = url_components.searchParams.get('n');

    if (nsig_sc && n) {
      let nsig;

      // if (this_response_nsig_cache && this_response_nsig_cache.has(n)) {
      //   nsig = this_response_nsig_cache.get(n);
      // } else {
        nsig = evaluate(nsig_sc, {
          nsig: n
        });

        console.log(`Transformed n signature from ${n} to ${nsig}.`);

        if (typeof nsig !== 'string')
          throw new PlayerError('Failed to decipher nsig');

        if (nsig.startsWith('enhanced_except_')) {
          console.log('Something went wrong while deciphering nsig.');
        } else if (this_response_nsig_cache) {
          // this_response_nsig_cache.set(n, nsig);
        }
      // }

      url_components.searchParams.set('n', nsig);
    }

    // @NOTE: SABR requests should include the PoToken (not base64d, but as bytes!) in the payload.
    if (url_components.searchParams.get('sabr') !== '1' && po_token)
      url_components.searchParams.set('pot', po_token);

    const client = url_components.searchParams.get('c');

    switch (client) {
      case 'WEB':
        url_components.searchParams.set('cver', Constants.CLIENTS.WEB.VERSION);
        break;
      case 'MWEB':
        url_components.searchParams.set('cver', Constants.CLIENTS.MWEB.VERSION);
        break;
      case 'WEB_REMIX':
        url_components.searchParams.set('cver', '1.20250219.01.00');
        break;
      case 'WEB_KIDS':
        url_components.searchParams.set('cver', Constants.CLIENTS.WEB_KIDS.VERSION);
        break;
      case 'TVHTML5':
        url_components.searchParams.set('cver', Constants.CLIENTS.TV.VERSION);
        break;
      case 'TVHTML5_SIMPLY_EMBEDDED_PLAYER':
        url_components.searchParams.set('cver', Constants.CLIENTS.TV_EMBEDDED.VERSION);
        break;
      case 'WEB_EMBEDDED_PLAYER':
        url_components.searchParams.set('cver', Constants.CLIENTS.WEB_EMBEDDED.VERSION);
        break;
    }

    const result = url_components.toString();

    console.log(`Deciphered URL: ${result}`);

    return url_components.toString();
  }
