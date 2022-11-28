const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');
const path = require('path');

// TODO: fill in your connection details here
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function home(req, res) {
    // a GET request to home page
    if (req.query.name) {
        res.json(`Hello, ${req.query.name}! Welcome to the FIFA server!`)
    } else {
        res.json(`Hello! Welcome to the FIFA server!`)
    }
}

async function allUsStates(req, res) {
    const queryAllStates = `WITH Absolute_FD_Households_State_All (state, avg_housing_units, avg_half, avg_one, avg_ten, avg_twenty) as (
                                SELECT l.state, avg(housing_units), avg(no_car_half_mile) , avg(no_car_1_mile), avg(no_car_10_mile), avg(no_car_20_mile)
                                FROM Food_Desert fd JOIN Location l ON fd.geo_id = l.geo_id
                                GROUP BY l.state
                                ORDER BY state ASC
                            ),
                            Pop (state, population_count) as (
                                SELECT state, SUM(total) as total
                                FROM Age_Sex A JOIN Location L on A.geo_id = L.geo_id
                                GROUP BY state
                            )
                            SELECT state_flag, AB.state, P.population_count, Round((avg_half / avg_housing_units) * 100, 2) as no_car_half_mile_percent, Round((avg_one / avg_housing_units) * 100, 2) as no_car_1_mile_percent, Round((avg_ten / avg_housing_units) * 100, 2) as no_car_10_mile_percent, Round((avg_twenty / avg_housing_units) * 100, 2) as no_car_20_mile_percent
                            FROM Absolute_FD_Households_State_All AB JOIN USA_States US ON AB.state = US.state JOIN Pop P ON P.state=AB.state;`
        connection.query(queryAllStates, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results})
            }
        });
    }


async function searchStatesName(req, res) {
    const stateNameSearch = req.query.name ? req.query.name : ''
    var queryNameSearch = `WITH Absolute_FD_Households_State_All (state, avg_housing_units, avg_half, avg_one, avg_ten, avg_twenty) as (
                                SELECT l.state, avg(housing_units), avg(no_car_half_mile) , avg(no_car_1_mile), avg(no_car_10_mile), avg(no_car_20_mile)
                                FROM Food_Desert fd JOIN Location l ON fd.geo_id = l.geo_id
                                GROUP BY l.state
                                ORDER BY state ASC
                            ),
                            Pop (state, population_count) as (
                                SELECT state, SUM(total) as total
                                FROM Age_Sex A JOIN Location L on A.geo_id = L.geo_id
                                GROUP BY state
                            )
                            SELECT state_flag, AB.state, P.population_count, Round((avg_half / avg_housing_units) * 100, 2) as no_car_half_mile_percent, Round((avg_one / avg_housing_units) * 100, 2) as no_car_1_mile_percent, Round((avg_ten / avg_housing_units) * 100, 2) as no_car_10_mile_percent, Round((avg_twenty / avg_housing_units) * 100, 2) as no_car_20_mile_percent
                            FROM Absolute_FD_Households_State_All AB JOIN USA_States US ON AB.state = US.state JOIN Pop P ON P.state=AB.state
                            WHERE AB.state LIKE '%${stateNameSearch}%';`
        connection.query(queryNameSearch, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }

async function searchStatesPopulation(req, res) {
    const population_low = req.query.poplow ? req.query.poplow : 0
    var population_high = req.query.pophigh ? req.query.pophigh : 40000000
    if (population_high == 12000000) {
        population_high = 40000000
    }

    var queryPopulationSearch = `WITH Absolute_FD_Households_State_All (state, avg_housing_units, avg_half, avg_one, avg_ten, avg_twenty) as (
                                    SELECT l.state, avg(housing_units), avg(no_car_half_mile) , avg(no_car_1_mile), avg(no_car_10_mile), avg(no_car_20_mile)
                                    FROM Food_Desert fd JOIN Location l ON fd.geo_id = l.geo_id
                                    GROUP BY l.state
                                    ORDER BY state ASC),
                                Pop (state, population_count) as (
                                    SELECT state, SUM(total) as total
                                    FROM Age_Sex A JOIN Location L on A.geo_id = L.geo_id
                                    GROUP BY state)
                                SELECT state_flag, AB.state, P.population_count, Round((avg_half / avg_housing_units) * 100, 2) as no_car_half_mile_percent, Round((avg_one / avg_housing_units) * 100, 2) as no_car_1_mile_percent, Round((avg_ten / avg_housing_units) * 100, 2) as no_car_10_mile_percent, Round((avg_twenty / avg_housing_units) * 100, 2) as no_car_20_mile_percent
                                FROM Absolute_FD_Households_State_All AB JOIN USA_States US ON AB.state = US.state JOIN Pop P ON P.state=AB.state
                                WHERE '${population_low}' <= population AND population <= '${population_high}';` 
        connection.query(queryPopulationSearch, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }

async function retrieveStateDetails(req, res) {
    const usState = req.query.state_name
    var queryDetail = `SELECT abbrev, nickname, website, capital_city, population_rank, state_flag, state_seal, map_image, landscape_background, skyline_background
                       FROM USA_States
                       where state = '${usState}';`
    var queryDemographics = `SELECT state, SUM(total) as total, SUM(male) as male, SUM(female) as female, SUM(age_0_9) as age_0_9, SUM(age_10_17) as age_10_17, SUM(age_18_29) as age_18_29, SUM(age_30_39) as age_30_39, SUM(age_40_49) as age_40_49, SUM(age_50_59) as age_50_59, SUM(age_60_69) as age_60_69, SUM(age_70_79) as age_70_79, Sum(age_80_plus) as age_80_plus
                             FROM Age_Sex A JOIN Location L on A.geo_id = L.geo_id
                             GROUP BY state
                             HAVING state = '${usState}';`
    var queryFoodStamps = `WITH Food_Stamps (state, total_2010, total_2015) as (SELECT L.state, SUM(FA.hh_receiving_fs_2010) AS total_receiving_fs_2010, SUM(FA.hh_receiving_fs_2015) AS total_receiving_fs_2015
                                FROM Food_Assistance FA
                                JOIN Location L ON FA.geo_id = L.geo_id
                                GROUP BY state)
                                SELECT state, total_2010, total_2015, ROUND(((total_2015 - total_2010) / total_2010)* 100, 2) as Percent_Change
                                FROM Food_Stamps
                                WHERE state = '${usState}'`
    connection.query(queryDetail, function (error, detailResults, fields) {
    if (error) {
        console.log(error)
        res.json({ error: error })
        } else if (detailResults) {
            connection.query(queryDemographics, function (error, demoResults, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (demoResults) {
                connection.query(queryFoodStamps, function (error, foodStampResults, fields) {
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (foodStampResults) {
                    res.json({ detailResults: detailResults, demoResults, foodStampResults})
                }
                });
            }
            });
        }
        });
    }

async function retrieveStateHS(req, res) {
    var usState = req.query.state_name
    connection.query(`SELECT question, data_value as percent, stratification1 as population_category
                      FROM Health_Surveillance
                      WHERE year = 2011 AND stratification1 = 'total' AND state = '${usState}' ORDER BY question`, function (error, results, fields) {
    if (error) {
            console.log(error)
            res.json({ error: error })
    } else if (results) {
            res.json({ results: results})
        }
    });         
}

async function searchStatesHSTopicTotal(req, res) {
    var usState = req.query.name
    var topic = req.query.topic
    var queryTopicTotal = `SELECT year, question, data_value as percent, stratification1 as population_category
                           FROM Health_Surveillance
                           WHERE question = '${topic}' AND stratification1 = 'total' AND state = '${usState}' ORDER BY year;`
    connection.query(queryTopicTotal, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
        });
            
    }

async function getHeatmapOverlay(req, res) {
    connection.query(`SELECT fips,
                             lat,
                             lon,
                             ((SUM(no_car_half_mile) * 0.5) + 
                              SUM(no_car_1_mile) + 
                              (SUM(no_car_10_mile) * 10) +
                              (SUM(no_car_20_mile) * 20)) AS weight
                      FROM Food_Desert
                      JOIN County_Coordinates ON fips = LEFT(geo_id,5)
                      GROUP BY fips
                      HAVING (SUM(no_car_half_mile) > 0 OR 
                              SUM(no_car_1_mile) > 0 OR
                              SUM(no_car_10_mile) > 0 OR
                              SUM(no_car_20_mile) > 0)`, 
        (error, results, fields) => {
            if (error) {
                console.log(error);
                res.json({error: error});
            } else if (results) {
                res.json({ results: results });
            }

        })
    if (req.query.overlays) {

    }
}


// ********************************************
//            MORE ROUTES HERE
// ********************************************

module.exports = {
    allUsStates,
    searchStatesName,
    searchStatesPopulation,
    retrieveStateDetails,
    retrieveStateHS,
    searchStatesHSTopicTotal,
    getHeatmapOverlay
}