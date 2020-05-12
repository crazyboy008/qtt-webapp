import TopClient from 'node-taobao-topclient';
import config from '../../config'

export default new TopClient({
  appkey: config.tb.app_key,
  appsecret: config.tb.app_secret,
  REST_URL: config.tb.http
});