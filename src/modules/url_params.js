const nSigCache = {};

const url = "https://rr1---sn-qpbpu5an5uxaapuxpo-cvhs.googlevideo.com/videoplayback%3Fexpire%3D1746474384%26ei%3DL8EYaNWnPL31s8IPj6HVoAU%26ip%3D103.233.92.2%26id%3Do-AG5SRKCAA3ND6npwMifcVnHnxq-I3eaEhLaCdaPviWcD%26itag%3D140%26source%3Dyoutube%26requiressl%3Dyes%26xpc%3DEgVo2aDSNQ%253D%253D%26met%3D1746452784%252C%26mh%3DTz%26mm%3D31%252C29%26mn%3Dsn-qpbpu5an5uxaapuxpo-cvhs%252Csn-cvh7knzk%26ms%3Dau%252Crdu%26mv%3Dm%26mvi%3D1%26pl%3D24%26rms%3Dau%252Cau%26gcr%3Din%26initcwndbps%3D1800000%26bui%3DAecWEAZ9HUgTq-S8Tsy7nhse9mpJeNWssIZyfbP8ItjQWVq2qj6YdIfTuBzT7wqrZi-lCO2zFlIgGihm%26spc%3Dwk1kZkAY-s1V6yyWP7f-FlB1AH2AihcXVgusOq8OvHeLvuC5B2p1yzx8C5zbmzoY1HPfvdI%26vprv%3D1%26svpuc%3D1%26mime%3Daudio%252Fmp4%26ns%3DR2HylU7I0kRzZ1bVfNaR4rgQ%26rqh%3D1%26gir%3Dyes%26clen%3D2676945%26dur%3D165.264%26lmt%3D1646979066136001%26mt%3D1746452292%26fvip%3D2%26keepalive%3Dyes%26c%3DWEB_REMIX%26sefc%3D1%26txp%3D2311222%26n%3DR-9BlCF5kFY2NX%26sparams%3Dexpire%252Cei%252Cip%252Cid%252Citag%252Csource%252Crequiressl%252Cxpc%252Cgcr%252Cbui%252Cspc%252Cvprv%252Csvpuc%252Cmime%252Cns%252Crqh%252Cgir%252Cclen%252Cdur%252Clmt%26lsparams%3Dmet%252Cmh%252Cmm%252Cmn%252Cms%252Cmv%252Cmvi%252Cpl%252Crms%252Cinitcwndbps%26lsig%3DACuhMU0wRQIgTjsHRPhxcFpHnnUSmDBmXR6IwG7dvc1OJoSH9f1hx1gCIQCFx100OLZAGG6xiRmfU6jpROE6q-FJ7cbegT786_ufkg%253D%253D"
function maybeDecipherNParam(url) {
  const urlObj = new URL(url);
    console.log(urlObj)

  if (urlObj.searchParams.has('n')) {
    const nParam = urlObj.searchParams.get('n');
      console.log("PARAM", nParam)

    let deciphered;
    if (nSigCache.hasOwnProperty(nParam)) {
      deciphered = nSigCache[nParam];
        console.log("DECIPHERED", deciphered)
    } else {
      deciphered = decipherNSig(nParam); // implement this
      nSigCache[nParam] = deciphered;
    }

    urlObj.searchParams.set('n', deciphered);
  }
    console.log(urlObj.toString())

  return urlObj.toString();
}

maybeDecipherNParam(decodeURIComponent(url))
