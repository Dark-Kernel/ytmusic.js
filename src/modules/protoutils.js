import { base64ToU8, u8ToBase64 } from './utils.js';
import { VisitorData } from './params.js';

/**
 * Encodes visitor data into a URL-safe string
 * @param {string} id - Visitor ID
 * @param {number} timestamp - Timestamp
 * @returns {string} Encoded visitor data
 */
export function encodeVisitorData(id, timestamp) {
  const writer = VisitorData.encode({ id, timestamp });
  return encodeURIComponent(u8ToBase64(writer.finish()).replace(/\+/g, '-').replace(/\//g, '_'));
}

/**
 * Decodes visitor data from a URL-safe string
 * @param {string} visitor_data - Encoded visitor data
 * @returns {object} Decoded VisitorData object
 */
export function decodeVisitorData(visitor_data) {
  return VisitorData.decode(base64ToU8(decodeURIComponent(visitor_data).replace(/-/g, '+').replace(/_/g, '/')));
}

/**
 * Encodes comment action parameters
 * @param {number} type - Action type
 * @param {object} args - Comment action arguments
 * @param {string} [args.comment_id] - Comment ID
 * @param {string} [args.video_id] - Video ID
 * @param {string} [args.text] - Comment text
 * @param {string} [args.target_language] - Target language for translation
 * @returns {string} Encoded comment action parameters
 */
export function encodeCommentActionParams(type, args = {}) {
  const data = {
    type,
    commentId: args.comment_id || ' ',
    videoId: args.video_id || ' ',
    channelId: ' ',
    unkNum: 2
  };
  
  if (args.hasOwnProperty('text')) {
    if (typeof args.target_language !== 'string')
      throw new Error('target_language must be a string');
    
    if (args.comment_id)
      delete data.unkNum;
      
    data.translateCommentParams = {
      params: {
        comment: {
          text: args.text
        }
      },
      commentId: args.comment_id || ' ',
      targetLanguage: args.target_language
    };
  }
  
  const writer = PeformCommentActionParams.encode(data);
  return encodeURIComponent(u8ToBase64(writer.finish()));
}

/**
 * Encodes next parameters for video IDs
 * @param {string[]} video_ids - Array of video IDs
 * @returns {string} Encoded next parameters
 */
export function encodeNextParams(video_ids) {
  const writer = NextParams.encode({ videoId: video_ids });
  return encodeURIComponent(u8ToBase64(writer.finish()).replace(/\+/g, '-').replace(/\//g, '_'));
}
