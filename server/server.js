const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// Route 1 - register as GET 
app.get('/', routes.home)

app.get('/us_states', routes.allUsStates)

app.get('/us_state', routes.retrieveStateDetails)
/*app.get('/us_state', routes.retrieveStateHS)*/

app.get('/search/states_name', routes.searchStatesName)

app.get('/search/states_population', routes.searchStatesPopulation)

app.get('/search/states_topic', routes.searchStatesHSTopicTotal)






app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
