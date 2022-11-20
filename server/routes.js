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

// ********************************************
//            MORE ROUTES HERE
// ********************************************

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
}