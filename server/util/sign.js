import crypto from 'crypto'
import md5 from 'md5'
import config from '../../config'

/**
 * Sign taobao api for JSSDK`.
 *
 * @param {args} Obj
 * @api public
 */

let Sign = function (args) {
  let params = {...config.tb.params, ...args}
  let sorted = Object.keys(params).sort();
  let basestring = sorted.map(function(key) { return key + params[key]; }).join('');
  basestring = config.tb.app_secret + basestring + config.tb.app_secret;
  console.log(basestring);
  return SignByHmacMd5(basestring, config.tb.app_secret).toUpperCase();
}
let SignByHmacMd5 = function (message, secret) {

  let hmac = crypto.createHmac("md5", secret);
  let result = hmac.update(message).digest('hex');
  result = result.toUpperCase();
  return result;
}


let PDDSign = function (args) {
  let sorted = Object.keys(args).sort();
  let basestring = sorted.map(function(key) { return key + args[key]; }).join('');
  basestring = config.pdd.client_secret + basestring + config.pdd.client_secret;
  // console.log(basestring);
  return md5(basestring).toUpperCase();
}

export default {
  PDDSign,
  Sign
}