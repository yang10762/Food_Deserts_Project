const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

var async = require('async');

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
    const queryAllStates = `WITH Absolute_FD_Households_State_All (state, sum_half, sum_one, sum_ten, sum_twenty, avg_housing_units, avg_half, avg_one, avg_ten, avg_twenty) as (
        SELECT l.state, SUM(no_car_half_mile), SUM(no_car_1_mile), SUM(no_car_10_mile), SUM(no_car_20_mile), avg(housing_units), avg(no_car_half_mile) , avg(no_car_1_mile), avg(no_car_10_mile), avg(no_car_20_mile)
        FROM Food_Desert fd JOIN Location l ON fd.geo_id = l.geo_id
        GROUP BY l.state
        ORDER BY state ASC
    ),
    Pop (state, population_count) as (
        SELECT state, SUM(total) as total
        FROM Age_Sex A JOIN Location L on A.geo_id = L.geo_id
        GROUP BY state
    )
    SELECT state_flag, AB.state, P.population_count, Round(sum_half + sum_one + sum_ten + sum_twenty,0) as total_HH_FD_status, Round((avg_half / avg_housing_units) * 100, 2) as no_car_half_mile_percent, Round((avg_one / avg_housing_units) * 100, 2) as no_car_1_mile_percent, Round((avg_ten / avg_housing_units) * 100, 2) as no_car_10_mile_percent, Round((avg_twenty / avg_housing_units) * 100, 2) as no_car_20_mile_percent
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
    var queryNameSearch = `WITH Absolute_FD_Households_State_All (state, sum_half, sum_one, sum_ten, sum_twenty, avg_housing_units, avg_half, avg_one, avg_ten, avg_twenty) as (
        SELECT l.state, SUM(no_car_half_mile), SUM(no_car_1_mile), SUM(no_car_10_mile), SUM(no_car_20_mile), avg(housing_units), avg(no_car_half_mile) , avg(no_car_1_mile), avg(no_car_10_mile), avg(no_car_20_mile)
        FROM Food_Desert fd JOIN Location l ON fd.geo_id = l.geo_id
        GROUP BY l.state
        ORDER BY state ASC
    ),
    Pop (state, population_count) as (
        SELECT state, SUM(total) as total
        FROM Age_Sex A JOIN Location L on A.geo_id = L.geo_id
        GROUP BY state
    )
    SELECT state_flag, AB.state, P.population_count, Round(sum_half + sum_one + sum_ten + sum_twenty,0) as total_HH_FD_status, Round((avg_half / avg_housing_units) * 100, 2) as no_car_half_mile_percent, Round((avg_one / avg_housing_units) * 100, 2) as no_car_1_mile_percent, Round((avg_ten / avg_housing_units) * 100, 2) as no_car_10_mile_percent, Round((avg_twenty / avg_housing_units) * 100, 2) as no_car_20_mile_percent
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

    var queryPopulationSearch = `WITH Absolute_FD_Households_State_All (state, sum_half, sum_one, sum_ten, sum_twenty, avg_housing_units, avg_half, avg_one, avg_ten, avg_twenty) as (
        SELECT l.state, SUM(no_car_half_mile), SUM(no_car_1_mile), SUM(no_car_10_mile), SUM(no_car_20_mile), avg(housing_units), avg(no_car_half_mile) , avg(no_car_1_mile), avg(no_car_10_mile), avg(no_car_20_mile)
        FROM Food_Desert fd JOIN Location l ON fd.geo_id = l.geo_id
        GROUP BY l.state
        ORDER BY state ASC
    ),
    Pop (state, population_count) as (
        SELECT state, SUM(total) as total
        FROM Age_Sex A JOIN Location L on A.geo_id = L.geo_id
        GROUP BY state
    )
    SELECT state_flag, AB.state, P.population_count, Round(sum_half + sum_one + sum_ten + sum_twenty,0) as total_HH_FD_status, Round((avg_half / avg_housing_units) * 100, 2) as no_car_half_mile_percent, Round((avg_one / avg_housing_units) * 100, 2) as no_car_1_mile_percent, Round((avg_ten / avg_housing_units) * 100, 2) as no_car_10_mile_percent, Round((avg_twenty / avg_housing_units) * 100, 2) as no_car_20_mile_percent
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
    var queryDemographicsFS = `WITH DemographicsFS (state, total_pop, male, female, age_0_9, age_10_17, age_18_29, age_30_39, age_40_49, age_50_59, age_60_69, age_70_79, age_80_plus, income_2010, income_2015, total_HH_2010, total_HH_2015, total_FS_2010, total_FS_2015) as (SELECT L.state,SUM(A.total) as total, SUM(male), SUM(female), SUM(age_0_9), SUM(age_10_17), SUM(age_18_29), SUM(age_30_39), SUM(age_40_49), SUM(age_50_59), SUM(age_60_69), SUM(age_70_79), Sum(age_80_plus),AVG(I.est_med_income_2010), AVG(I.est_med_income_2015), SUM(FA.total_hh_2010), SUM(FA.total_hh_2015), SUM(FA.hh_receiving_fs_2010) AS total_receiving_fs_2010, SUM(FA.hh_receiving_fs_2015) AS total_receiving_fs_2015
                                    FROM Food_Assistance FA
                                    JOIN Location L ON FA.geo_id = L.geo_id JOIN Income I ON I.geo_id = L.geo_id JOIN Age_Sex A on L.geo_id = A.geo_id
                                    GROUP BY state)
                                SELECT state, total_pop as total, male, female, age_0_9, age_10_17, age_18_29, age_30_39, age_40_49, age_50_59, age_60_69, age_70_79, age_80_plus, ROUND(income_2010,0) as median_income_2010, ROUND(income_2015, 0) as median_income_2015, total_HH_2010, total_HH_2015, total_FS_2010, total_FS_2015, ROUND(((total_FS_2015 - total_FS_2010) / total_FS_2010)* 100, 2) as Percent_Change_FS
                                FROM DemographicsFS
                                WHERE state = '${usState}';`
    var queryHealthInsurance = `SELECT uninsured_rate_2010, uninsured_rate_2015, uninsured_rate_change, health_insurance_coverage_change, employer_health_insurance_coverage_2015 FROM Health_Insurance_Rates
                                WHERE state = '${usState}';`
    connection.query(queryDetail, function (error, detailResults, fields) {
    if (error) {
        console.log(error)
        res.json({ error: error })
        } else if (detailResults) {
            connection.query(queryDemographicsFS, function (error, demoFSResults, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (demoFSResults) {
                connection.query(queryHealthInsurance, function (error, healthInsuranceResults, fields) {
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (healthInsuranceResults) {
                        res.json({ detailResults: detailResults, demoFSResults, healthInsuranceResults})
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


// ********************************************
//               All Counties 
// ********************************************
async function all_counties(req, res) {
    if (req.query.page && !isNaN(req.query.page)) {
        const page = req.query.page
        const pageSize = req.query.pagesize ? req.query.pagesize : 10 
        const offset = ((page - 1) * pageSize) 
        
        connection.query(`SELECT L.county AS County, L.state AS State, SUM(A_S.total) AS Population, SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) AS Total_Food_Deserts , SUM(FA.total_hh_2010) AS Total_Households_2010, SUM(FA.total_hh_2015)AS Total_Households_2015,  SUM(FA.hh_receiving_fs_2010) AS Households_Receiving_FoodStamps_2010, SUM(FA.hh_receiving_fs_2015) AS Households_Receiving_FoodStamps_2015
        FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id LEFT JOIN Age_Sex A_S ON L.geo_id = A_S.geo_id JOIN Food_Desert FD ON L.geo_id = FD.geo_id
        GROUP BY L.state, L.county
        ORDER BY L.state ASC, L.county ASC
        LIMIT ${pageSize} OFFSET ${offset}`, function (error, results, fields) 
        {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
   
    } else {

        connection.query(`SELECT L.county AS County, L.state AS State, SUM(A_S.total) AS Population, SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) AS Total_Food_Deserts , SUM(FA.total_hh_2010) AS Total_Households_2010, SUM(FA.total_hh_2015)AS Total_Households_2015,  SUM(FA.hh_receiving_fs_2010) AS Households_Receiving_FoodStamps_2010, SUM(FA.hh_receiving_fs_2015) AS Households_Receiving_FoodStamps_2015
        FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id LEFT JOIN Age_Sex A_S ON L.geo_id = A_S.geo_id JOIN Food_Desert FD ON L.geo_id = FD.geo_id
        GROUP BY L.state, L.county
        ORDER BY L.state ASC, L.county ASC`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}



// ********************************************
//             Search Counties 
// ********************************************

async function search_counties(req, res) {
   
    const county = req.query.County ? req.query.County : ""
    const state = req.query.State ? req.query.State : ""
    const popMin = req.query.PopMin ? req.query.PopMin : 0
    const popMax = req.query.PopMax ? req.query.PopMax: 10000000
    const FDMin = req.query.FDMin ? req.query.FDMin : 0
    const FDMax = req.query.FDMax ? req.query.FDMax: 86500
    const page = req.query.page ? req.query.page : 1
    const pageSize = req.query.pagesize ? req.query.pagesize : 10 
    const offset = ((page - 1) * pageSize) 


    if (req.query.page && !isNaN(req.query.page)) {
        connection.query(`SELECT L.county AS County, L.state AS State, SUM(A_S.total) AS Population, SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) AS Total_Food_Deserts , SUM(FA.total_hh_2010) AS Total_Households_2010, SUM(FA.total_hh_2015)AS Total_Households_2015,  SUM(FA.hh_receiving_fs_2010) AS Households_Receiving_FoodStamps_2010, SUM(FA.hh_receiving_fs_2015) AS Households_Receiving_FoodStamps_2015
        FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id LEFT JOIN Age_Sex A_S ON L.geo_id = A_S.geo_id JOIN Food_Desert FD ON L.geo_id = FD.geo_id
        WHERE L.county LIKE '%${county}%' AND L.state LIKE '%${state}%'
        GROUP BY L.state, L.county
        HAVING SUM(A_S.total) >= ${popMin} AND SUM(A_S.total) <= ${popMax} AND SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) >= ${FDMin} AND SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) <= ${FDMax}
        ORDER BY L.state ASC, L.county ASC
        LIMIT ${pageSize} OFFSET ${offset}`, function (error, results, fields) 
        {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } 
        });

    } else{
        
        connection.query(`SELECT L.county AS County, L.state AS State, SUM(A_S.total) AS Population, SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) AS Total_Food_Deserts , SUM(FA.total_hh_2010) AS Total_Households_2010, SUM(FA.total_hh_2015)AS Total_Households_2015,  SUM(FA.hh_receiving_fs_2010) AS Households_Receiving_FoodStamps_2010, SUM(FA.hh_receiving_fs_2015) AS Households_Receiving_FoodStamps_2015
        FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id LEFT JOIN Age_Sex A_S ON L.geo_id = A_S.geo_id JOIN Food_Desert FD ON L.geo_id = FD.geo_id
        WHERE L.county LIKE '%${county}%' AND L.state LIKE '%${state}%'
        GROUP BY L.state, L.county
        HAVING SUM(A_S.total) >= ${popMin} AND SUM(A_S.total) <= ${popMax} AND SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) >= ${FDMin} AND SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) <= ${FDMax}
        ORDER BY L.state ASC, L.county ASC`, function (error, results, fields) 
        {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            } 
        });
    }

}


// ********************************************
//          Get County Data for Cards 
// ********************************************

async function county_data(req, res) {
       
    if (req.query.State && req.query.County) { 
           const county = req.query.County 
           const state = req.query.State 
       
            async.parallel([
                function(callback){   
                        connection.query(`WITH FD_counties AS (
                            SELECT DISTINCT L.state, L.county
                            FROM Food_Desert JOIN Location L ON L.geo_id = Food_Desert.geo_id
                            WHERE no_car_10_mile > 0 AND no_car_20_mile > 0 AND L.county = '${county}' AND L.state = '${state}'
                        )
                        SELECT L.county AS County, L.state AS State, SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) AS Total_Food_Deserts, SUM(no_car_half_mile) AS no_car_half_M, SUM(no_car_1_mile) AS no_car_1_M, SUM(no_car_10_mile) AS no_car_10_M, SUM(no_car_20_mile) AS no_car_20_M, ROUND(SUM(urban)/COUNT(urban)*100,2) AS percent_urban, FDC.county AS FD_County
                        FROM Food_Desert FD JOIN Location L ON FD.geo_id = L.geo_id LEFT JOIN FD_counties FDC ON FDC.county = L.county
                        WHERE L.state = '${state}' AND L.county = '${county}'
                        GROUP BY state, county`, function (error, fd_result, fields) 
                    {
                    
                        callback(error,fd_result)
                    });
                },
                function(callback){
                    connection.query(`SELECT L.county AS County, L.state AS State, SUM(total) as Population, SUM(FA.total_hh_2010) AS Total_Households_2010, SUM(FA.total_hh_2015)AS Total_Households_2015, SUM(male) as male, SUM(female) as female, SUM(age_0_9) as age_0_9, SUM(age_10_17) as age_10_17, SUM(age_18_29) as age_18_29, SUM(age_30_39) as age_30_39, SUM(age_40_49) as age_40_49, SUM(age_50_59) as age_50_59, SUM(age_60_69) as age_60_69, SUM(age_70_79) as age_70_79, Sum(age_80_plus) as age_80_plus, ROUND(SUM((pct_hh_18_under_2010/100) * total_hh_2010),0) AS hh_18_under_2010,ROUND(SUM((pct_hh_18_under_2015/100) * total_hh_2015),0) AS hh_18_under_2015,ROUND(SUM((pct_hh_60_over_2010/100) * total_hh_2010),0) AS hh_60_over_2010, ROUND(SUM((pct_hh_60_over_2015/100) * total_hh_2015),0) AS hh_60_over_2015
                            FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id LEFT JOIN Age_Sex A_S ON L.geo_id = A_S.geo_id
                        WHERE L.state = '${state}' AND L.county = '${county}'
                        GROUP BY state, county`, function (error, demo_result, fields) 
                    {
                    
                        callback(error,demo_result)
                    });
                },
                function(callback){
                    connection.query(`SELECT L.county AS County, L.state AS State, SUM(FA.total_hh_2010) AS Total_Households_2010, SUM(FA.total_hh_2015)AS Total_Households_2015, SUM(FA.hh_receiving_fs_2010) AS Households_Receiving_FoodStamps_2010, SUM(FA.hh_receiving_fs_2015) AS Households_Receiving_FoodStamps_2015, Round(AVG(est_med_income_2010),2 )AS avg_est_med_income_2010, Round(AVG(est_med_income_2015),2 )AS avg_est_med_income_2015, Round(AVG(FA.hh_receiving_fs_med_income_2010),2 )AS avg_med_income_receiving_fs_2010, Round(AVG(FA.hh_receiving_fs_med_income_2015),2) AS avg_med_income_receiving_fs_2015, ROUND(SUM((pct_below_pl_2010/100) * total_hh_2010),0) AS hh_below_pl_2010, ROUND(SUM((pct_below_pl_2015/100) * total_hh_2015),0) AS hh_below_pl_2015
                            FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id LEFT JOIN Income I ON L.geo_id = I.geo_id
                        WHERE L.state = '${state}' AND L.county = '${county}'
                        GROUP BY state, county`, function (error, income_result, fields) 
                    {
                    
                        callback(error,income_result)
                    });

                }

                ],function(err,results){if(err){
                    res.json({"status": "failed", "message": error.message})
                }else{
                    res.json({fd_result: results[0],demo_result: results[1],income_result: results[2]  })
                    //res.send(JSON.stringify(results)); //both result1 and result2 will be in results
                }
                })

                    } 
                    else {
                        res.json({error: 'County not specified !!!'})
                    }
                    
}


module.exports = {
    home,
    all_counties,
    search_counties,
    county_data,
    allUsStates,
    searchStatesName,
    searchStatesPopulation,
    retrieveStateDetails,
    retrieveStateHS,
    searchStatesHSTopicTotal
}