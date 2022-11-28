import config from './config.json'


const getAllStates = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/us_states`, {
        method: 'GET',
    })
    return res.json()
}

//this url only gets id in order to use it to select all info for the player using ${id}
const getStateDetails = async (name) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/state?state_name=${name}`, {
        method: 'GET',
    })
    return res.json()
}

//this url contains only the parameters needed to do the search
const getStateSearchName = async (state) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/states_name?name=${state}`, {
        method: 'GET',
    })
    return res.json()
}


const getStateSearchPopulation = async (popHigh, popLow) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/states_population?pophigh=${popHigh}&poplow=${popLow}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllHSYearsForTopicTotal= async (state, topic) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/states_topic?name=${state}&topic=${topic}`, {
        method: 'GET',
    })
    return res.json()
}

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
    getAllStates,
    getStateDetails,
    getStateSearchName,
    getStateSearchPopulation,
    getAllHSYearsForTopicTotal,
    getAllCounties,
    getCountyData,
    getCountySearch
}