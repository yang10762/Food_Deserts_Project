import config from './config.json'

const getAllCounties = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/counties?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getCountySearch = async (county, state, pop_min, pop_max, fd_min, fd_max, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/counties?County=${county}&State=${state}&PopMin=${pop_min}&PopMax=${pop_max}&FDMin=${fd_min}&FDMax=${fd_max}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getCountyData = async (county, state) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/countyData?County=${county}&State=${state}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getAllCounties,
    getCountyData,
    getCountySearch
}