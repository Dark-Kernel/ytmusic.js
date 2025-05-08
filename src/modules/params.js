import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
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
    // console.log(param1, param2, param3);
    // console.log(params);
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
    // console.log(filterParams[filter]);
    return filterParams[filter];
}

/**
 * Message functions for handling VisitorData encoding and decoding
 */

export function createBaseVisitorData() {
  return { id: "", timestamp: 0 };
}
export const VisitorData = {
  /**
   * Encodes a VisitorData message to binary format
   * @param {object} message - The VisitorData message to encode
   * @param {BinaryWriter} [writer=new BinaryWriter()] - Binary writer instance
   * @returns {BinaryWriter} The writer with encoded data
   */
  encode(message, writer = new BinaryWriter()) {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.timestamp !== 0) {
      writer.uint32(40).int32(message.timestamp);
    }
    return writer;
  },

  /**
   * Decodes a VisitorData message from binary format
   * @param {BinaryReader|Uint8Array} input - Binary input to decode
   * @param {number} [length] - Length of data to read
   * @returns {object} Decoded VisitorData message
   */
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVisitorData();
    
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }
          message.id = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }
          message.timestamp = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
};
