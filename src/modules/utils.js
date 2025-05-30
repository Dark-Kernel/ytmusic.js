import { Jinter } from 'jintr';

/**
 * Find a variable declaration in code using various search criteria
 * @param {string} code - The source code to search in
 * @param {object} options - Search options
 * @param {object} [options.ast] - Optional AST if already parsed
 * @param {string} [options.name] - Variable name to search for
 * @param {string} [options.includes] - Text the variable declaration must include
 * @param {RegExp} [options.regexp] - Regular expression to test against variable declaration
 * @returns {object|undefined} Result object or undefined if not found
 */
export function findVariable(code, options) {
  const ast = options.ast ? options.ast : Jinter.parseScript(code, { ecmaVersion: 'latest', ranges: true });
  let found;
  
  function walk(node) {
    if (found) return;
    
    if (node.type === 'VariableDeclaration') {
      const [ start, end ] = node.range;
      const node_source = code.slice(start, end);
      
      for (const declarator of node.declarations) {
        if (declarator.id.type === 'Identifier') {
          const var_name = declarator.id.name;
          if (options.name && var_name === options.name) {
            found = { start, end, name: var_name, node, result: node_source };
            return;
          }
        }
      }
      
      if (
        (options.includes && node_source.includes(options.includes)) ||
        (options.regexp && options.regexp.test(node_source))
      ) {
        found = { 
          start, 
          end, 
          name: node.declarations[0]?.id?.name, 
          node, 
          result: node_source 
        };
        return;
      }
    }
    
    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        const child = node[key];
        
        if (Array.isArray(child)) {
          for (const c of child) {
            if (c && typeof c.type === 'string') {
              walk(c);
              if (found) return;
            }
          }
        } else if (child && typeof child.type === 'string') {
          walk(child);
          if (found) return;
        }
      }
    }
  }
  
  walk(ast);
  return found;
}


/**
 * Find a function declaration in code using various search criteria
 * @param {string} source - The source code to search in
 * @param {object} args - Search arguments
 * @param {string} [args.name] - Function name to search for
 * @param {string} [args.includes] - Text the function must include
 * @param {RegExp} [args.regexp] - Regular expression to test against function
 * @param {object} [args.ast] - Optional AST if already parsed
 * @returns {object|undefined} Result object or undefined if not found
 */
export function findFunction(source, args) {
  const { name, includes, regexp, ast } = args;
  const node = ast ? ast : Jinter.parseScript(source);
  const stack = [node];
  
  for (let i = 0; i < stack.length; i++) {
    const current = stack[i];
    
    if (
      current.type === 'ExpressionStatement' && (
        current.expression.type === 'AssignmentExpression' &&
        current.expression.left.type === 'Identifier' &&
        current.expression.right.type === 'FunctionExpression'
      )
    ) {
      const code = source.substring(current.start, current.end);
      
      if (
        (name && current.expression.left.name === name) ||
        (includes && code.includes(includes)) ||
        (regexp && regexp.test(code))
      ) {
        return {
          start: current.start,
          end: current.end,
          name: current.expression.left.name,
          node: current,
          result: code
        };
      }
    }
    
    for (const key in current) {
      const child = current[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && 'type' in item) {
            stack.push(item);
          }
        }
      } else if (typeof child === 'object' && child !== null && 'type' in child) {
        stack.push(child);
      }
    }
  }
  
  return undefined;
}


export function u8ToBase64(u8){
  return btoa(String.fromCharCode.apply(null, Array.from(u8)));
}

export function base64ToU8(base64){
  const standard_base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  const padded_base64 = standard_base64.padEnd(standard_base64.length + (4 - standard_base64.length % 4) % 4, '=');
  return new Uint8Array(atob(padded_base64).split('').map((char) => char.charCodeAt(0)));
}

export function generateRandomString(length){
  const result = [];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  for (let i = 0; i < length; i++) {
    result.push(alphabet.charAt(Math.floor(Math.random() * alphabet.length)));
  }

  return result.join('');
}

let shim;
export class Platform {
  static load(platform){
    shim = platform;
  }

  static shim(){
    if (!shim) {
      throw new Error('Platform is not loaded');
    }
    return shim;
  }
}

export default function evaluate(code, env) {
    const TAG = 'JsRuntime';
  console.log(TAG, 'Evaluating JavaScript:\n', code);

  const runtime = new Jinter();

  for (const [ key, value ] of Object.entries(env)) {
    runtime.scope.set(key, value);
  }

  const result = runtime.evaluate(code);

  console.log(TAG, 'Done. Result:', result);

  return result;
}
