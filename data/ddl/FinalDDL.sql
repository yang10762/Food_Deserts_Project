CREATE DATABASE FD_FINDER;

USE FD_FINDER;

CREATE TABLE Location(
    geo_id CHAR(11),
    county VARCHAR(35) NOT NULL,
    state VARCHAR(25) NOT NULL,
    PRIMARY KEY (geo_id)
);

CREATE TABLE Food_Desert(
    geo_id CHAR(11),
    urban INTEGER,
    population INTEGER,
    housing_units INTEGER,
    no_car_half_mile DECIMAL,
    no_car_1_mile DECIMAL,
    no_car_10_mile DECIMAL,
    no_car_20_mile DECIMAL,
    PRIMARY KEY (geo_id)
);

CREATE TABLE Race_Ethnicity(
    geo_id CHAR(11),
    total INTEGER,
    total_white INTEGER,
    total_black_aa INTEGER,
    total_indigenous INTEGER,
    total_asian INTEGER,
    total_hawaiian_pacific INTEGER,
    total_other INTEGER,
    total_multi INTEGER,
    total_not_hisp_lat INTEGER,
    total_hisp_lat INTEGER,
    PRIMARY KEY (geo_id),
    FOREIGN KEY (geo_id) REFERENCES Location(geo_id)
);

CREATE TABLE Age_Sex(
    geo_id CHAR(11),
    total INTEGER,
    male INTEGER,
    female INTEGER,
    age_0_9 INTEGER,
    age_10_17 INTEGER,
    age_18_29 INTEGER,
    age_30_39 INTEGER,
    age_40_49 INTEGER,
    age_50_59 INTEGER,
    age_60_69 INTEGER,
    age_70_79 INTEGER,
    age_80_plus INTEGER,
    PRIMARY KEY (geo_id),
    FOREIGN KEY (geo_id) REFERENCES Location(geo_id)
);

CREATE TABLE Household_Size (
    geo_id CHAR(11),
    total_hh INTEGER,
    total_family INTEGER,
    family_2 INTEGER,
    family_3 INTEGER,
    family_4 INTEGER,
    family_5 INTEGER,
    family_6 INTEGER,
    family_7_plus INTEGER,
    total_nonfamily INTEGER,
    nonfamily_1 INTEGER,
    nonfamily_2 INTEGER,
    nonfamily_3 INTEGER,
    nonfamily_4 INTEGER,
    nonfamily_5 INTEGER,
    nonfamily_6 INTEGER,
    nonfamily_7_plus INTEGER,
    PRIMARY KEY (geo_id),
    FOREIGN KEY (geo_id) REFERENCES Location(geo_id)
);

CREATE TABLE Income(
    geo_id CHAR(11),
    est_hh_2010 INTEGER,
    est_med_income_2010 INTEGER,
    est_hh_2015 INTEGER,
    est_med_income_2015 INTEGER,
    PRIMARY KEY (geo_id),
    FOREIGN KEY (geo_id) REFERENCES Location(geo_id)
);

CREATE TABLE Health_Surveillance(
	`year` INTEGER,
	state VARCHAR(25),
	question VARCHAR(255),
	data_value DECIMAL (3,1),
    sample_size INTEGER,
	age VARCHAR(20),
	education VARCHAR(50),
	gender VARCHAR(10),
	income VARCHAR(25),
	race_ethnicity VARCHAR(35),
	stratification1 VARCHAR(40),
	PRIMARY KEY (`year`, state, question, stratification1)
);

CREATE TABLE Health_Insurance_Rates (
	state VARCHAR(25),
	uninsured_rate_2010 DECIMAL (5,2),
	uninsured_rate_2015 DECIMAL (5,2),
	uninsured_rate_change DECIMAL (5,2),
	health_insurance_coverage_change INTEGER,
	employer_health_insurance_coverage_2015 INTEGER,
	PRIMARY KEY (state)
	) ;

CREATE TABLE Food_Assistance (
    geo_id CHAR(11),
    total_hh_2010 INTEGER,
	hh_receiving_fs_2010 INTEGER,
	total_hh_2015 INTEGER,
	hh_receiving_fs_2015 INTEGER,
    pct_hh_60_over_2010 DECIMAL (5,2),
    pct_receiving_60_over_2010 DECIMAL (5,2),
    pct_hh_18_under_2010 DECIMAL (5,2),
    pct_receiving_18_under_2010 DECIMAL (5,2),
    pct_hh_60_over_2015 DECIMAL (5,2),
    pct_receiving_60_over_2015 DECIMAL (5,2),
    pct_hh_18_under_2015 DECIMAL (5,2),
    pct_receiving_18_under_2015 DECIMAL (5,2),
    pct_below_pl_2010 DECIMAL (5,2),
    pct_below_pl_receiving_2010 DECIMAL (5,2),
    hh_receiving_fs_med_income_2010 INTEGER,
    pct_below_pl_2015 DECIMAL (5,2),
    pct_below_pl_receiving_2015 DECIMAL (5,2),
    hh_receiving_fs_med_income_2015 INTEGER,
    pct_white_2010 DECIMAL (5,2),
    pct_white_receiving_2010 DECIMAL (5,2),
    pct_black_aa_2010 DECIMAL (5,2),
    pct_black_aa_receiving_2010 DECIMAL (5,2),
    pct_indigenous_2010 DECIMAL (5,2),
    pct_indigenous_receiving_2010 DECIMAL (5,2),
    pct_asian_2010 DECIMAL (5,2),
    pct_asian_receiving_2010 DECIMAL (5,2),
    pct_hawaiian_pacific_2010 DECIMAL (5,2),
    pct_hawaiian_pacific_receiving_2010 DECIMAL (5,2),
    pct_other_2010 DECIMAL (5,2),
    pct_other_receiving_2010 DECIMAL (5,2),
    pct_multi_2010 DECIMAL (5,2),
    pct_multi_receiving_2010 DECIMAL (5,2),
    pct_not_hisp_lat_2010 DECIMAL (5,2),
    pct_not_hisp_lat_receiving_2010 DECIMAL (5,2),
    pct_hisp_lat_2010 DECIMAL (5,2),
    pct_hisp_lat_receiving_2010 DECIMAL (5,2),
    pct_white_2015 DECIMAL (5,2),
    pct_white_receiving_2015 DECIMAL (5,2),
    pct_black_aa_2015 DECIMAL (5,2),
    pct_black_aa_receiving_2015 DECIMAL (5,2),
    pct_indigenous_2015 DECIMAL (5,2),
    pct_indigenous_receiving_2015 DECIMAL (5,2),
    pct_asian_2015 DECIMAL (5,2),
    pct_asian_receiving_2015 DECIMAL (5,2),
    pct_hawaiian_pacific_2015 DECIMAL (5,2),
    pct_hawaiian_pacific_receiving_2015 DECIMAL (5,2),
    pct_other_2015 DECIMAL (5,2),
    pct_other_receiving_2015 DECIMAL (5,2),
    pct_multi_2015 DECIMAL (5,2),
    pct_multi_receiving_2015 DECIMAL (5,2),
    pct_not_hisp_lat_2015 DECIMAL (5,2),
    pct_not_hisp_lat_receiving_2015 DECIMAL (5,2),
    pct_hisp_lat_2015 DECIMAL (5,2),
    pct_hisp_lat_receiving_2015 DECIMAL (5,2),
	PRIMARY KEY (geo_id),
	FOREIGN KEY (geo_id) REFERENCES Location(geo_id)
);

CREATE TABLE USA_States (
    state VARCHAR(30),
    abbrev VARCHAR(5),
    nickname VARCHAR(60),
    website VARCHAR(35),
    capital_city VARCHAR(20),
    population INTEGER,
    population_rank INTEGER,
    state_flag VARCHAR(80),
    state_seal VARCHAR(80),
    map_image VARCHAR(80),
    landscape_background VARCHAR(100),
    skyline_background VARCHAR(100),
    PRIMARY KEY (state)
);

CREATE TABLE County_Coordinates (
    fips char(5),
    lat decimal(10, 7),
    lon decimal(10, 7),
    PRIMARY KEY (fips)
);


CREATE TABLE Heatmap_Weight(
    WITH WFD AS (
        SELECT
            LEFT(FD.geo_id, 5) AS fips,
            (
                (
                    (SUM(FD.no_car_half_mile) / SUM(FD.housing_units)) * 0.2
                ) + (
                    (SUM(FD.no_car_1_mile) / SUM(FD.housing_units)) * 0.8
                ) + (
                    (SUM(FD.no_car_10_mile) / SUM(FD.housing_units)) * 1.5
                ) + (
                    (SUM(FD.no_car_20_mile) / SUM(FD.housing_units)) * 2
                )
            ) * 100 AS weight_food_desert,
            SUM(FD.population) / 1000 AS weight_population
        FROM
            Food_Desert FD
        GROUP BY
            LEFT(FD.geo_id, 5)
    ),
    WHH AS (
        SELECT
            LEFT(HH.geo_id, 5) AS fips,
            (
                SUM(HH.family_6) + SUM(HH.nonfamily_6) + SUM(HH.family_7_plus) + SUM(HH.nonfamily_7_plus)
            ) / SUM(HH.total_hh) * 100 AS weight_percent_large_hh
        FROM
            Household_Size HH
        GROUP BY
            LEFT(HH.geo_id, 5)
    ),
    WFA AS (
        SELECT
            LEFT(FA.geo_id, 5) AS fips,
            (
                SUM(FA.pct_below_pl_2010 * FA.total_hh_2010) / SUM(FA.total_hh_2010)
            ) AS weight_below_poverty_line,
            (
                SUM(FA.hh_receiving_fs_2010) / SUM(FA.total_hh_2010)
            ) * 100 AS weight_percent_food_assistance
        FROM
            Food_Assistance FA
        GROUP BY
            LEFT(FA.geo_id, 5)
    ),
    WRE AS (
        SELECT
            LEFT(RE.geo_id, 5) AS fips,
            (
                SUM(
                    RE.total_black_aa + RE.total_indigenous + RE.total_asian + RE.total_hawaiian_pacific + RE.total_other + RE.total_multi
                ) / SUM(RE.total)
            ) * 100 AS weight_percent_minority
        FROM
            Race_Ethnicity RE
        GROUP BY
            LEFT(RE.geo_id, 5)
    )
    SELECT
        CC.fips,
        CC.lat,
        CC.lon,
        WFD.weight_food_desert AS weight_food_desert,
        WFD.weight_population AS weight_population,
        WHH.weight_percent_large_hh AS weight_percent_large_hh,
        WFA.weight_below_poverty_line AS weight_below_poverty_line,
        WRE.weight_percent_minority AS weight_percent_minority,
        WFA.weight_percent_food_assistance AS weight_percent_food_assistance
    FROM
        County_Coordinates CC
        JOIN WFD ON CC.fips = WFD.fips
        JOIN WHH ON CC.fips = WHH.fips
        JOIN WFA ON CC.fips = WFA.fips
        JOIN WRE ON CC.fips = WRE.fips
);

CREATE TABLE Materialized_All_Counties (
    SELECT
        L.county AS County,
        L.state AS State,
        SUM(`AS`.total) AS Population,
        SUM(
            no_car_half_mile + no_car_1_mile + no_car_10_mile + no_car_20_mile
        ) AS Total_Food_Deserts,
        SUM(FA.total_hh_2010) AS Total_Households_2010,
        SUM(FA.total_hh_2015) AS Total_Households_2015,
        SUM(FA.hh_receiving_fs_2010) AS Households_Receiving_FoodStamps_2010,
        SUM(FA.hh_receiving_fs_2015) AS Households_Receiving_FoodStamps_2015
    FROM
        Food_Assistance FA
        JOIN Location L ON FA.geo_id = L.geo_id
        LEFT JOIN Age_Sex `AS` ON L.geo_id = `AS`.geo_id
        JOIN Food_Desert FD ON L.geo_id = FD.geo_id
    GROUP BY
        L.state,
        L.county
    ORDER BY
        L.state ASC,
        L.county ASC
);

CREATE TABLE Materialized_All_States (
    WITH Absolute_FD_Households_State_All (
        state,
        sum_half,
        sum_one,
        sum_ten,
        sum_twenty,
        avg_housing_units,
        avg_half,
        avg_one,
        avg_ten,
        avg_twenty
    ) AS (
        SELECT
            l.state,
            SUM(no_car_half_mile),
            SUM(no_car_1_mile),
            SUM(no_car_10_mile),
            SUM(no_car_20_mile),
            avg(housing_units),
            avg(no_car_half_mile),
            avg(no_car_1_mile),
            avg(no_car_10_mile),
            avg(no_car_20_mile)
        FROM
            Food_Desert FD
            JOIN Location l ON FD.geo_id = l.geo_id
        GROUP BY
            l.state
        ORDER BY
            state ASC
    ),
    Pop (state, population_count) AS (
        SELECT
            state,
            SUM(total) AS total
        FROM
            Age_Sex A
            JOIN Location L ON A.geo_id = L.geo_id
        GROUP BY
            state
    )
    SELECT
        state_flag,
        AB.state,
        P.population_count,
        Round(sum_half + sum_one + sum_ten + sum_twenty, 0) AS total_HH_FD_status,
        Round((avg_half / avg_housing_units) * 100, 2) AS no_car_half_mile_percent,
        Round((avg_one / avg_housing_units) * 100, 2) AS no_car_1_mile_percent,
        Round((avg_ten / avg_housing_units) * 100, 2) AS no_car_10_mile_percent,
        Round((avg_twenty / avg_housing_units) * 100, 2) AS no_car_20_mile_percent
    FROM
        Absolute_FD_Households_State_All AB
        JOIN USA_States US ON AB.state = US.state
        JOIN Pop P ON P.state = AB.state
);

CREATE VIEW All_States_View AS (
    WITH Absolute_FD_Households_State_All AS (
        SELECT
            L.state AS state,
            SUM(FD.no_car_half_mile) AS sum_half,
            SUM(FD.no_car_1_mile) AS sum_one,
            SUM(FD.no_car_10_mile) AS sum_ten,
            SUM(FD.no_car_20_mile) AS sum_twenty,
            AVG(FD.housing_units) AS avg_housing_units,
            AVG(FD.no_car_half_mile) AS avg_half,
            AVG(FD.no_car_1_mile) AS avg_one,
            AVG(FD.no_car_10_mile) AS avg_ten,
            AVG(FD.no_car_20_mile) AS avg_twenty
        FROM
            (
                Food_Desert FD
                JOIN Location L ON ((FD.geo_id = L.geo_id))
            )
        GROUP BY
            L.state
        ORDER BY
            L.state
    ),
    Pop AS (
        SELECT
            L.state AS state,
            sum(A.total) AS total
        FROM
            (
                Age_Sex A
                JOIN Location L ON ((A.geo_id = L.geo_id))
            )
        GROUP BY
            L.state
    )
    SELECT
        US.state_flag AS state_flag,
        AB.state AS state,
        P.population_count AS population_count,
        round(
            (
                (
                    (AB.sum_half + AB.sum_one) + AB.sum_ten
                ) + AB.sum_twenty
            ),
            0
        ) AS total_HH_FD_status,
        round(
            (
                (AB.avg_half / AB.avg_housing_units) * 100
            ),
            2
        ) AS no_car_half_mile_percent,
        round(
            (
                (AB.avg_one / AB.avg_housing_units) * 100
            ),
            2
        ) AS no_car_1_mile_percent,
        round(
            (
                (AB.avg_ten / AB.avg_housing_units) * 100
            ),
            2
        ) AS no_car_10_mile_percent,
        round(
            (
                (AB.avg_twenty / AB.avg_housing_units) * 100
            ),
            2
        ) AS no_car_20_mile_percent
    FROM
        (
            (
                Absolute_FD_Households_State_All AB
                JOIN USA_States US ON ((AB.state = US.state))
            )
            JOIN Pop P ON ((P.state = AB.state))
        )
);

CREATE INDEX idx_County ON Location (county);

CREATE INDEX idx_State ON Location (state);
