const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

app.get('/counties', routes.all_counties)  

app.get('/search/counties', routes.search_counties)  

app.get('/countyData',routes.county_data) 

app.get('/us_states', routes.allUsStates)

app.get('/state', routes.retrieveStateDetails)

app.get('/search/states_name', routes.searchStatesName)

app.get('/search/states_population', routes.searchStatesPopulation)

app.get('/search/states_topic', routes.searchStatesHSTopicTotal)

app.get('/map', routes.getHeatmapOverlay)






app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
