import axios from 'axios'
import Qs from 'qs'
import md5 from 'md5'
import Util from './util'

const needParam = {
	'is_api': 1,
	'platform': 'api',
	'version': '1.0',
	'pkg': 'nine'
}

function get (url, data) {
	let allParams = Object.assign({}, needParam, data)
	// let params = Object.assign(allParams, {sign: setSign(allParams)})

	return axios.get(`/api${url}`, {
		params: allParams
	}).then((res) => {
		if (res.data.status === 'success') {
			return Promise.resolve(res.data.result)
		} else {
			return Promise.reject(res.data)
		}
	})
}

function post (url, data) {
	let allParams = Object.assign({}, needParam, data)
	// let params = Object.assign(allParams, {sign: setSign(allParams)})

	return axios({
		url: `/api${url}`,
		method: 'post',
		data: allParams,
		transformRequest: [function (ret) {
			return Qs.stringify(ret)  // 序列化参数
		}],
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then((res) => {
		if (res.data.status === 'success') {
			return Promise.resolve(res.data.result)
		} else {
			return Promise.reject(res.data)
		}
	})
}

function setSign(data) {
	let params = Util.objKeySort(data)
	let map = new Map()
	for (let key in params) {
		map.set(key, params[key])
	}
	return md5Sign(map)
}

function md5Sign (map) {
	let signDataList = ''
	const signKey = 'uMktAlFBtw3dZjf71ArCF23e7zhtNbr9'

	map.forEach((value, key) => {
		if (signDataList === '') {
			signDataList += (key + '=' + value)
		} else {
			signDataList += ('+' + key + '=' + value)
		}
	})
	signDataList += '+' + signKey
	return md5(signDataList).substr(12, 8)
}

export default {get, post}