export function getSearchParams(filter, scope, ignoreSpelling) {
    const filteredParam1 = 'EgWKAQI';
    let params = null;
    let param1 = null;
    let param2 = null;
    let param3 = null;

    // Return early if no parameters are set
    if (!filter && !scope && !ignoreSpelling) {
        return params;
    }

    // Handle uploads scope
    if (scope === 'uploads') {
        params = 'agIYAw%3D%3D';
    }

    // Handle library scope
    if (scope === 'library') {
        if (filter) {
            param1 = filteredParam1;
            param2 = getParam2(filter);
            param3 = 'AWoKEAUQCRADEAoYBA%3D%3D';
        } else {
            params = 'agIYBA%3D%3D';
        }
    }

    // Handle filter without scope
    if (!scope && filter) {
        if (filter === 'playlists') {
            params = 'Eg-KAQwIABAAGAAgACgB';
            if (!ignoreSpelling) {
                params += 'MABqChAEEAMQCRAFEAo%3D';
            } else {
                params += 'MABCAggBagoQBBADEAkQBRAK';
            }
        } else if (filter.includes('playlists')) {
            param1 = 'EgeKAQQoA';
            param2 = filter === 'featured_playlists' ? 'Dg' : 'EA';
            
            if (!ignoreSpelling) {
                param3 = 'BagwQDhAKEAMQBBAJEAU%3D';
            } else {
                param3 = 'BQgIIAWoMEA4QChADEAQQCRAF';
            }
        } else {
            param1 = filteredParam1;
            param2 = getParam2(filter);
            
            if (!ignoreSpelling) {
                param3 = 'AWoMEA4QChADEAQQCRAF';
            } else {
                param3 = 'AUICCAFqDBAOEAoQAxAEEAkQBQ%3D%3D';
            }
        }
    }

    // Handle only ignoreSpelling
    if (!scope && !filter && ignoreSpelling) {
        params = 'EhGKAQ4IARABGAEgASgAOAFAAUICCAE%3D';
    }

    // Return either params or concatenated parameters
    console.log(param1, param2, param3);
    console.log(params);
    return params || (param1 + param2 + param3);
}


function getParam2(filter) {
    const filterParams = {
        'songs': 'I',
        'videos': 'Q',
        'albums': 'Y',
        'artists': 'g',
        'playlists': 'o'
    };
    console.log(filterParams[filter]);
    return filterParams[filter];
}
