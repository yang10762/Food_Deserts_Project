const config = require("./config.json");
const mysql = require("mysql");
const e = require("express");
const path = require("path");

var async = require("async");

// TODO: fill in your connection details here
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect();

<<<<<<< HEAD
=======
// const connectionPool = mysql.createPool({
//     host: config.rds_host,
//     user: config.rds_user,
//     password: config.rds_password,
//     port: config.rds_port,
//     database: config.rds_db
// });


>>>>>>> Matt
// ********************************************
//            SIMPLE ROUTE EXAMPLE
// ********************************************

// Route 1 (handler)
async function home(req, res) {
  // a GET request to home page
  if (req.query.name) {
    res.json(`Hello, ${req.query.name}! Welcome to the FIFA server!`);
  } else {
    res.json(`Hello! Welcome to the FIFA server!`);
  }
}

// ********************************************
//                  All States
// ********************************************

async function allUsStates(req, res) {
  const queryAllStates = `SELECT * FROM Materialized_All_States`;
  connection.query(queryAllStates, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.json({ error: error });
    } else if (results) {
      res.json({ results: results });
    }
  });
}

async function searchStatesName(req, res) {
  const stateNameSearch = req.query.name ? req.query.name : "";
  var queryNameSearch = `SELECT * FROM Materialized_All_States
                           WHERE state LIKE '%${stateNameSearch}%';`;
  connection.query(queryNameSearch, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.json({ error: error });
    } else if (results) {
      res.json({ results: results });
    }
  });
}

async function searchStatesPopulation(req, res) {
  const population_low = req.query.poplow ? req.query.poplow : 0;
  var population_high = req.query.pophigh ? req.query.pophigh : 40000000;
  if (population_high == 12000000) {
    population_high = 40000000;
  }

  var queryPopulationSearch = `SELECT * FROM Materialized_All_States
                                 WHERE '${population_low}' <= population_count AND population_count <= '${population_high}';`;
  connection.query(queryPopulationSearch, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.json({ error: error });
    } else if (results) {
      res.json({ results: results });
    }
  });
}

// ********************************************
//          Get State Data for Cards
// ********************************************

async function retrieveStateDetails(req, res) {
  const usState = req.query.state_name;
  var queryDetail = `SELECT abbrev, nickname, website, capital_city, population_rank, state_flag, state_seal, map_image, landscape_background, skyline_background
                       FROM USA_States
                       where state = '${usState}';`;
  var queryDemographicsFS = `WITH DemographicsFS (state, total_pop, male, female, age_0_9, age_10_17, age_18_29, age_30_39, age_40_49, age_50_59, age_60_69, age_70_79, age_80_plus, income_2010, income_2015, total_HH_2010, total_HH_18_under_2010, total_HH_60_over_2010, total_HH_2015, total_HH_18_under_2015, total_HH_60_over_2015, total_FS_2010, total_FS_2015, total_HH_below_pl_2010, total_HH_below_pl_2015, avg_med_income_receiving_fs_2010, avg_med_income_receiving_fs_2015) as (SELECT L.state,SUM(A.total) as total, SUM(male), SUM(female), SUM(age_0_9), SUM(age_10_17), SUM(age_18_29), SUM(age_30_39), SUM(age_40_49), SUM(age_50_59), SUM(age_60_69), SUM(age_70_79), Sum(age_80_plus),AVG(I.est_med_income_2010), AVG(I.est_med_income_2015), SUM(FA.total_hh_2010), ROUND(SUM((FA.pct_hh_18_under_2010/100) * FA.total_hh_2010),0) AS HH_18_under_2010, ROUND(SUM((FA.pct_hh_60_over_2010/100) * FA.total_hh_2010),0) AS HH_60_over_2010, SUM(FA.total_hh_2015), ROUND(SUM((FA.pct_hh_18_under_2015/100) * FA.total_hh_2015),0) AS HH_18_under_2015, ROUND(SUM((FA.pct_hh_60_over_2015/100) * FA.total_hh_2015),0) AS HH_60_over_2015, SUM(FA.hh_receiving_fs_2010) AS total_receiving_fs_2010, SUM(FA.hh_receiving_fs_2015) AS total_receiving_fs_2015, ROUND(SUM((FA.pct_below_pl_2010/100) * FA.total_hh_2010),0) AS hh_below_pl_2010, ROUND(SUM((FA.pct_below_pl_2015/100) * FA.total_hh_2015),0) AS hh_below_pl_2015, Round(AVG(FA.hh_receiving_fs_med_income_2010),2 )AS avg_med_income_receiving_fs_2010, Round(AVG(FA.hh_receiving_fs_med_income_2015),2) AS avg_med_income_receiving_fs_2015
  FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id JOIN Income I ON I.geo_id = L.geo_id JOIN Age_Sex A on L.geo_id = A.geo_id
  GROUP BY state)
  SELECT state, total_pop as total, male, female, age_0_9, age_10_17, age_18_29, age_30_39, age_40_49, age_50_59, age_60_69, age_70_79, age_80_plus, ROUND(income_2010,0) as median_income_2010, ROUND(income_2015, 0) as median_income_2015, total_HH_2010, total_HH_18_under_2010, total_HH_60_over_2010, total_HH_2015, total_HH_18_under_2015, total_HH_60_over_2015, total_FS_2010, total_FS_2015, ROUND(((total_FS_2015 - total_FS_2010) / total_FS_2010)* 100, 2) as Percent_Change_FS, total_HH_below_pl_2010, total_HH_below_pl_2015, avg_med_income_receiving_fs_2010, avg_med_income_receiving_fs_2015
  FROM DemographicsFS
  WHERE state = '${usState}';`;
  var queryHealthInsurance = `SELECT uninsured_rate_2010, uninsured_rate_2015, uninsured_rate_change, health_insurance_coverage_change, employer_health_insurance_coverage_2015 FROM Health_Insurance_Rates
                                WHERE state = '${usState}';`;
  connection.query(queryDetail, function (error, detailResults, fields) {
    if (error) {
      console.log(error);
      res.json({ error: error });
    } else if (detailResults) {
      connection.query(
        queryDemographicsFS,
        function (error, demoFSResults, fields) {
          if (error) {
            console.log(error);
            res.json({ error: error });
          } else if (demoFSResults) {
            connection.query(
              queryHealthInsurance,
              function (error, healthInsuranceResults, fields) {
                if (error) {
                  console.log(error);
                  res.json({ error: error });
                } else if (healthInsuranceResults) {
                  res.json({
                    detailResults: detailResults,
                    demoFSResults,
                    healthInsuranceResults,
                  });
                }
              }
            );
          }
        }
      );
    }
  });
}

async function retrieveStateHS(req, res) {
  var usState = req.query.state_name;
  connection.query(
    `SELECT question, data_value as percent, stratification1 as population_category
                      FROM Health_Surveillance
                      WHERE year = 2011 AND stratification1 = 'total' AND state = '${usState}' ORDER BY question`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

async function searchStatesHSTopicTotal(req, res) {
  var usState = req.query.name;
  var topic = req.query.topic;
  var queryTopicTotal = `SELECT year, question, data_value as percent, stratification1 as population_category
                           FROM Health_Surveillance
                           WHERE question = '${topic}' AND stratification1 = 'total' AND state = '${usState}' ORDER BY year;`;
  connection.query(queryTopicTotal, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.json({ error: error });
    } else if (results) {
      res.json({ results: results });
    }
  });
}

// ********************************************
//               Heatmap
// ********************************************
async function getHeatmapOverlay(req, res) {
<<<<<<< HEAD
  switch (req.query.overlay) {
    case "population":
      connection.query(
        `SELECT fips,
                                     lat,
                                     lon,
                                     SUM(population)/1000 AS weight
                              FROM Food_Desert
                              JOIN County_Coordinates ON fips = LEFT(geo_id,5)
                              GROUP BY fips
                              HAVING SUM(population) > 5000`,
        (error, results, fields) => {
          if (error) {
            console.log(error);
            res.json({ error: error });
          } else if (results) {
            res.json({ results: results });
          }
        }
      );
      break;
    case "avg_hh_size":
      connection.query(
        `SELECT fips,
                                     lat,
                                     lon,
                                     ((SUM(nonfamily_1) / SUM(total_hh)) + ((SUM(family_2) + SUM(nonfamily_2)) / SUM(total_hh) * 2) +
                                      ((SUM(family_3) + SUM(nonfamily_3)) / SUM(total_hh) * 3) + ((SUM(family_4) + SUM(nonfamily_4)) / SUM(total_hh) * 4) +
                                      ((SUM(family_5) + SUM(nonfamily_5)) / SUM(total_hh) * 5) + ((SUM(family_6) + SUM(nonfamily_6)) / SUM(total_hh) * 6) +
                                      ((SUM(family_7_plus) + SUM(nonfamily_7_plus)) / SUM(total_hh) * 7)) AS weight
                              FROM Household_Size HH
                              JOIN County_Coordinates ON fips = LEFT(HH.geo_id,5)
                              GROUP BY fips`,
        (error, results, fields) => {
          if (error) {
            console.log(error);
            res.json({ error: error });
          } else if (results) {
            res.json({ results: results });
          }
        }
      );
      break;
    case "below_poverty_line":
      connection.query(
        `SELECT fips,
                                     lat,
                                     lon,
                                     (SUM(pct_below_pl_2010 * total_hh_2010) / SUM(total_hh_2010)) AS weight
                              FROM Food_Assistance
                              JOIN County_Coordinates ON fips = LEFT(geo_id,5)
                              GROUP BY fips
                              HAVING (SUM(pct_below_pl_2010 * total_hh_2010) / SUM(total_hh_2010)) > 10`,
        (error, results, fields) => {
          if (error) {
            console.log(error);
            res.json({ error: error });
          } else if (results) {
            res.json({ results: results });
          }
        }
      );
      break;
    case "food_desert":
    default:
      connection.query(
        `SELECT fips,
                                     lat,
                                     lon,
                                     (((SUM(no_car_half_mile) / SUM(housing_units)) * 0.5) + 
                                     (SUM(no_car_1_mile) / SUM(housing_units)) + 
                                     ((SUM(no_car_10_mile) / SUM(housing_units)) * 10) +
                                     ((SUM(no_car_20_mile) / SUM(housing_units)) * 20)) * 100 AS weight
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
            res.json({ error: error });
          } else if (results) {
            res.json({ results: results });
          }
        }
      );
      break;
  }
=======
    
    let query;

    switch (req.query.overlay) {
        case 'population':
            query = `SELECT fips, lat, lon,
                            SUM(population)/1000 AS weight
                     FROM Food_Desert
                     JOIN County_Coordinates ON fips = LEFT(geo_id,5)
                     GROUP BY fips
                     HAVING SUM(population) > 5000`;
            break;
        case 'percent_large_hh':
            query = `SELECT fips, lat, lon,
                            (
                            SUM(family_6) + SUM(nonfamily_6) +
                            SUM(family_7_plus) + SUM(nonfamily_7_plus)
                            ) / SUM(total_hh) * 100 AS weight
                        FROM Household_Size HH
                        JOIN County_Coordinates ON fips = LEFT(HH.geo_id,5)
                        GROUP BY fips;`;
            break;
        case 'below_poverty_line':
            query = `SELECT fips, lat, lon,
                            (SUM(pct_below_pl_2010 * total_hh_2010) / SUM(total_hh_2010)) AS weight
                    FROM Food_Assistance
                    JOIN County_Coordinates ON fips = LEFT(geo_id,5)
                    GROUP BY fips`;
            break;
        case 'percent_minority':
            query = `SELECT fips, lat, lon,
                            (SUM(total_black_aa +
                                total_indigenous +
                                total_asian +
                                total_hawaiian_pacific +
                                total_other +
                                total_multi) /
                            SUM(total)) * 100 AS weight
                    FROM Race_Ethnicity
                    JOIN County_Coordinates ON fips = LEFT(geo_id,5)
                    GROUP BY fips`;
            break;
        case 'percent_food_assistance':
            query = `SELECT fips, lat, lon,
                            (SUM(hh_receiving_fs_2010) / SUM(total_hh_2010)) * 100 AS weight
                    FROM Food_Assistance
                    JOIN County_Coordinates ON fips = LEFT(geo_id,5)
                    GROUP BY fips`;
            break;
        case 'food_desert':
        default:
            query = `SELECT fips, lat, lon,
                            (((SUM(no_car_half_mile) / SUM(housing_units)) * 0.2) +
                            ((SUM(no_car_1_mile) / SUM(housing_units)) * 0.8) +
                            ((SUM(no_car_10_mile) / SUM(housing_units)) * 1.5) +
                            ((SUM(no_car_20_mile) / SUM(housing_units)) * 2)) * 100 AS weight
                    FROM Food_Desert
                    JOIN County_Coordinates ON fips = LEFT(geo_id,5)
                    GROUP BY fips
                    HAVING (SUM(no_car_half_mile) > 0 OR
                            SUM(no_car_1_mile) > 0 OR
                            SUM(no_car_10_mile) > 0 OR
                            SUM(no_car_20_mile) > 0)`
            break;
    }

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({error: error});
        } else if (results) {
            res.json({ results: results });
        }
    });
>>>>>>> Matt
}

// ********************************************
//               All Counties
// ********************************************
async function all_counties(req, res) {
  if (req.query.page && !isNaN(req.query.page)) {
    const page = req.query.page;
    const pageSize = req.query.pagesize ? req.query.pagesize : 10;
    const offset = (page - 1) * pageSize;

    connection.query(
      `SELECT * 
        FROM Materialized_All_Counties
        LIMIT ${pageSize} OFFSET ${offset}`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  } else {
    connection.query(
      `SELECT * 
        FROM Materialized_All_Counties`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// ********************************************
//             Search Counties
// ********************************************

async function search_counties(req, res) {
  const county = req.query.County ? req.query.County : "";
  const state = req.query.State ? req.query.State : "";
  const popMin = req.query.PopMin ? req.query.PopMin : 0;
  const popMax = req.query.PopMax ? req.query.PopMax : 10000000;
  const FDMin = req.query.FDMin ? req.query.FDMin : 0;
  const FDMax = req.query.FDMax ? req.query.FDMax : 86500;
  const page = req.query.page ? req.query.page : 1;
  const pageSize = req.query.pagesize ? req.query.pagesize : 10;
  const offset = (page - 1) * pageSize;

  if (req.query.page && !isNaN(req.query.page)) {
    connection.query(
      `SELECT County,  State, Population, Total_Food_Deserts , Total_Households_2010, Total_Households_2015,  Households_Receiving_FoodStamps_2010,  Households_Receiving_FoodStamps_2015
        FROM Materialized_All_Counties
        WHERE County LIKE '%${county}%' AND State LIKE '%${state}%' AND Population >= '${popMin}' AND Population <= '${popMax}'  AND Total_Food_Deserts >= '${FDMin}' AND Total_Food_Deserts <= '${FDMax}'
        ORDER BY State ASC, County ASC
        LIMIT ${pageSize} OFFSET ${offset}`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  } else {
    connection.query(
      `SELECT County,  State, Population, Total_Food_Deserts , Total_Households_2010, Total_Households_2015,  Households_Receiving_FoodStamps_2010,  Households_Receiving_FoodStamps_2015
        FROM Materialized_All_Counties
        WHERE County LIKE '%${county}%' AND State LIKE '%${state}%' AND Population >= ${popMin} AND Population <= ${popMax}  AND Total_Food_Deserts >= ${FDMin} AND Total_Food_Deserts <= ${FDMax}
        ORDER BY State ASC, County ASC`,
      function (error, results, fields) {
        if (error) {
          console.log(error);
          res.json({ error: error });
        } else if (results) {
          res.json({ results: results });
        }
      }
    );
  }
}

// ********************************************
//          Get County Data for Cards
// ********************************************

async function county_data(req, res) {
  if (req.query.State && req.query.County) {
    const county = req.query.County;
    const state = req.query.State;

    async.parallel(
      [
        function (callback) {
          connection.query(
            `WITH FD_counties AS (
                            SELECT DISTINCT L.state, L.county
                            FROM Food_Desert JOIN Location L ON L.geo_id = Food_Desert.geo_id
                            WHERE no_car_10_mile > 0 AND no_car_20_mile > 0 AND L.county = '${county}' AND L.state = '${state}'
                        )
                        SELECT L.county AS County, L.state AS State, SUM(no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile) AS Total_Food_Deserts, SUM(no_car_half_mile) AS no_car_half_M, SUM(no_car_1_mile) AS no_car_1_M, SUM(no_car_10_mile) AS no_car_10_M, SUM(no_car_20_mile) AS no_car_20_M, ROUND(SUM(urban)/COUNT(urban)*100,2) AS percent_urban, FDC.county AS FD_County
                        FROM Food_Desert FD JOIN Location L ON FD.geo_id = L.geo_id LEFT JOIN FD_counties FDC ON FDC.county = L.county
                        WHERE L.state = '${state}' AND L.county = '${county}'
                        GROUP BY state, county`,
            function (error, fd_result, fields) {
              callback(error, fd_result);
            }
          );
        },
        function (callback) {
          connection.query(
            `SELECT L.county AS County, L.state AS State, SUM(total) as Population, SUM(FA.total_hh_2010) AS Total_Households_2010, SUM(FA.total_hh_2015)AS Total_Households_2015, SUM(male) as male, SUM(female) as female, SUM(age_0_9) as age_0_9, SUM(age_10_17) as age_10_17, SUM(age_18_29) as age_18_29, SUM(age_30_39) as age_30_39, SUM(age_40_49) as age_40_49, SUM(age_50_59) as age_50_59, SUM(age_60_69) as age_60_69, SUM(age_70_79) as age_70_79, Sum(age_80_plus) as age_80_plus, ROUND(SUM((pct_hh_18_under_2010/100) * total_hh_2010),0) AS hh_18_under_2010,ROUND(SUM((pct_hh_18_under_2015/100) * total_hh_2015),0) AS hh_18_under_2015,ROUND(SUM((pct_hh_60_over_2010/100) * total_hh_2010),0) AS hh_60_over_2010, ROUND(SUM((pct_hh_60_over_2015/100) * total_hh_2015),0) AS hh_60_over_2015
                            FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id LEFT JOIN Age_Sex A_S ON L.geo_id = A_S.geo_id
                        WHERE L.state = '${state}' AND L.county = '${county}'
                        GROUP BY state, county`,
            function (error, demo_result, fields) {
              callback(error, demo_result);
            }
          );
        },
        function (callback) {
          connection.query(
            `SELECT L.county AS County, L.state AS State, SUM(FA.total_hh_2010) AS Total_Households_2010, SUM(FA.total_hh_2015)AS Total_Households_2015, SUM(FA.hh_receiving_fs_2010) AS Households_Receiving_FoodStamps_2010, SUM(FA.hh_receiving_fs_2015) AS Households_Receiving_FoodStamps_2015, Round(AVG(est_med_income_2010),2 )AS avg_est_med_income_2010, Round(AVG(est_med_income_2015),2 )AS avg_est_med_income_2015, Round(AVG(FA.hh_receiving_fs_med_income_2010),2 )AS avg_med_income_receiving_fs_2010, Round(AVG(FA.hh_receiving_fs_med_income_2015),2) AS avg_med_income_receiving_fs_2015, ROUND(SUM((pct_below_pl_2010/100) * total_hh_2010),0) AS hh_below_pl_2010, ROUND(SUM((pct_below_pl_2015/100) * total_hh_2015),0) AS hh_below_pl_2015
                            FROM Food_Assistance FA JOIN Location L ON FA.geo_id = L.geo_id LEFT JOIN Income I ON L.geo_id = I.geo_id
                        WHERE L.state = '${state}' AND L.county = '${county}'
                        GROUP BY state, county`,
            function (error, income_result, fields) {
              callback(error, income_result);
            }
          );
        },
      ],
      function (err, results) {
        if (err) {
          res.json({ status: "failed", message: error.message });
        } else {
          res.json({
            fd_result: results[0],
            demo_result: results[1],
            income_result: results[2],
          });
          //res.send(JSON.stringify(results)); //both result1 and result2 will be in results
        }
      }
    );
  } else {
    res.json({ error: "County not specified !!!" });
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
  searchStatesHSTopicTotal,
  getHeatmapOverlay,
};
