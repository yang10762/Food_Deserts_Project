import React from "react";
import desert from "../images/Opacity75Desert.jpeg";
import DoughnutChart from "../components/DoughnutChart";
import PolarAreaChart from "../components/PolarAreaChart";

import {
  Form,
  FormInput,
  FormGroup,
  Button,
  Card,
  CardBody,
  CardTitle,
  Progress,
} from "shards-react";
import stateStyles from "../stateStyles.css";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'

import {
  Badge,
  Carousel,
  Dropdown,
  Collapse,
  Progress as ProgressAntd,
  Statistic,
  Tabs,
} from "antd";

import {
  Table,
  Pagination,
  Select,
  Row,
  Col,
  Divider,
  Slider,
  Rate,
} from "antd";
// import {
//   MarkSeries,
//   RadarChart,
//   SearchableDiscreteColorLegend,
// } from "react-vis";
import { format } from "d3-format";

//top menu in components folder thatis put into html using <Navigation />
import Navigation from "../components/Navigation";

import {
  getAllStates,
  getStateSearchName,
  getStateSearchPopulation,
  getStateDetails,
  getAllHSYearsForTopicTotal,
} from "../fetcher";

const wideFormat = format(".3r");

const carouselRef = React.createRef();
const { Column, ColumnGroup } = Table;
const { Option } = Select;


var nameSearch = false;
var popSearch = false;

var average_half_mile_percent = 4.28;
var average_1_mile_percent = 1.97;
var average_10_mile_percent = 0.14;
var average_20_mile_percent = 0.03;

var std_dev_half_mile_percent = 0.85;
var std_dev_1_mile_percent = 0.76;
var std_dev_10_mile_percent = 0.16;
var std_dev_20_mile_percent = 0.07;

// 'States' table
const stateColumns = [
  {
    title: "Flag",
    dataIndex: "state_flag",
    key: "state_flag",
    width: 10,
    height: 10,
    align: "left",
    render: (text, row) => (
      <img
        alt={`${row.state_flag}`}
        src={`${row.state_flag}`}
        width={82.5}
        height={55}
      />
    ),
  },
  {
    title: "State",
    dataIndex: "state",
    key: "state",
    width: 30,
    align: "left",
    sorter: (a, b) => a.state.localeCompare(b.state),
    render: (text, row) => (
      <a href={`/states?state_name=${row.state}`}>{text}</a>
    ),
  },
  {
    title: "Population",
    dataIndex: "population_count",
    key: "population_count",
    width: 10,
    align: "center",
    sorter: (a, b) => a.population_count - b.population_count,
    render: (text, row) => (
      <span>{row.population_count?.toLocaleString("en-US")}</span>
    ),
  },
  {
    title: "Total Housing Units in Food Desert Regions*",
    dataIndex: "total_HH_FD_status",
    key: "total_HH_FD_status",
    width: 10,
    align: "center",
    sorter: (a, b) => a.total_HH_FD_status - b.total_HH_FD_status,
    render: (text, row) => (
      <span>{row.total_HH_FD_status?.toLocaleString("en-US")}</span>
    ),
  },
  {
    title: "Percentage of Housing Units Beyond 1/2 Mile From Supermarket**",
    dataIndex: "no_car_half_mile_percent",
    key: "no_car_half_mile_percent",
    width: 10,
    align: "center",
    sorter: (a, b) => a.no_car_half_mile_percent - b.no_car_half_mile_percent,
    render: (text, row) => (
      <Badge
        className={`${
          row.no_car_half_mile_percent >
          average_half_mile_percent + 0.5 * std_dev_half_mile_percent
            ? row.no_car_half_mile_percent >
              average_half_mile_percent + std_dev_half_mile_percent
              ? "badge bg-danger"
              : "badge bg-warning text-dark"
            : row.no_car_half_mile_percent <
              average_half_mile_percent - std_dev_half_mile_percent
            ? "badge bg-success"
            : "badge bg-warning text-dark"
        }`}
      >
        {row.no_car_half_mile_percent}%
      </Badge>
    ),
  },
  {
    title: "Percentage of Housing Units Beyond 1 Mile From Supermarket**",
    dataIndex: "no_car_1_mile_percent",
    key: "no_car_1_mile_percent",
    width: 10,
    align: "center",
    sorter: (a, b) => a.no_car_1_mile_percent - b.no_car_1_mile_percent,
    render: (text, row) => (
      <Badge
        className={`${
          row.no_car_1_mile_percent >
          average_1_mile_percent + 0.5 * std_dev_1_mile_percent
            ? row.no_car_1_mile_percent >
              average_1_mile_percent + std_dev_1_mile_percent
              ? "badge bg-danger"
              : "badge bg-warning text-dark"
            : row.no_car_1_mile_percent <
              average_1_mile_percent - std_dev_1_mile_percent
            ? "badge bg-success"
            : "badge bg-warning text-dark"
        }`}
      >
        {row.no_car_1_mile_percent}%
      </Badge>
    ),
  },
  {
    title: "Percentage of Housing Units Beyond 10 Miles From Supermarket**",
    dataIndex: "no_car_10_mile_percent",
    key: "no_car_10_miles_percent",
    width: 10,
    align: "center",
    sorter: (a, b) => a.no_car_10_mile_percent - b.no_car_10_mile_percent,
    render: (text, row) => (
      <Badge
        className={`${
          row.no_car_10_mile_percent >
          average_10_mile_percent + 0.5 * std_dev_10_mile_percent
            ? row.no_car_10_mile_percent >
              average_10_mile_percent + std_dev_10_mile_percent
              ? "badge bg-danger"
              : "badge bg-warning text-dark"
            : row.no_car_10_mile_percent <= 0
            ? "badge bg-success"
            : "badge bg-warning text-dark"
        }`}
      >
        {row.no_car_10_mile_percent}%
      </Badge>
    ),
  },
  {
    title: "Percentage of Housing Units Beyond 20 Miles From Supermarket**",
    dataIndex: "no_car_20_mile_percent",
    key: "no_car_20_mile_percent",
    width: 10,
    align: "center",
    sorter: (a, b) => a.no_car_20_mile_percent - b.no_car_20_mile_percent,
    render: (text, row) => (
      <Badge
        className={`${
          row.no_car_20_mile_percent >
          average_20_mile_percent + 0.5 * std_dev_20_mile_percent
            ? row.no_car_20_mile_percent >
              average_20_mile_percent + std_dev_20_mile_percent
              ? "badge bg-danger"
              : "badge bg-warning text-dark"
            : row.no_car_20_mile_percent <= 0
            ? "badge bg-success"
            : "badge bg-warning text-dark"
        }`}
      >
        {row.no_car_20_mile_percent}%
      </Badge>
    ),
  },
];

// 'Search by state population' bar tickers
const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 1,
    label: "2M",
  },
  {
    value: 2,
    label: "4M",
  },
  {
    value: 3,
    label: "6M",
  },
  {
    value: 4,
    label: "8M",
  },
  {
    value: 5,
    label: "10M",
  },
  {
    value: 6,
    label: "12M+",
  },
];

class StatePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usStateQuery: ``,
      populationLowQuery: 0,
      populationHighQuery: 4,
      usStateResults: [],
      selectedStateName: window.location.search
        ? window.location.search.substring(1).split("=")[1]
        : null,
      selectedStateDetails: {
        detail: null,
        HS: null,
        demoFS: null,
        healthInsurance: null,
      },
      yearlyHSResultsForTopicTotal: null,
      selectedTopicTotal: "",
    };

    this.handleUsStateNameChange = this.handleUsStateNameChange.bind(this);
    this.handleUsStatePopulationChange =
      this.handleUsStatePopulationChange.bind(this);
    this.updateSearchResultsName = this.updateSearchResultsName.bind(this);
    this.updateSearchResultsPopulation =
      this.updateSearchResultsPopulation.bind(this);
    this.topicOnChange = this.topicOnChange.bind(this);
  }

  // Handling name of state change
  handleUsStateNameChange(event) {
    nameSearch = false;
    popSearch = false;
    this.setState({ usStateQuery: event.target.value });
  }

  // Handling population range change
  handleUsStatePopulationChange(value) {
    nameSearch = false;
    popSearch = false;
    this.setState({ populationLowQuery: value[0] });
    this.setState({ populationHighQuery: value[1] });
  }

  // Searching by name of state
  updateSearchResultsName() {
    nameSearch = true;
    popSearch = false;
    getStateSearchName(this.state.usStateQuery, null, null).then((res) => {
      this.setState({ usStateResults: res.results });
    });
  }

  // Searching by population range
  updateSearchResultsPopulation() {
    nameSearch = false;
    popSearch = true;
    getStateSearchPopulation(
      this.state.populationHighQuery * 2000000,
      this.state.populationLowQuery * 2000000,
      null,
      null
    ).then((res) => {
      this.setState({ usStateResults: res.results });
    });
  }

  topicOnChange(us_state, topic) {
    getAllHSYearsForTopicTotal(us_state, topic).then((res) => {
      this.setState({ selectedTopicTotal: topic });
      const results = res.results;
      var arr = [];
      if (results.length === 6) {
        this.setState({ yearlyHSResultsForTopicTotal: res.results });
      } else if (results.length === 0) {
        for (let i = 0; i < 6; i++) {
          arr.push({
            year: 0,
            question: "none",
            percent: "-",
            population_category: "Total",
          });
        }
      } else {
        let resultPointer = 0;
        const resultSize = results.length;
        for (let i = 2011; i < 2017; i++) {
          if (resultPointer < resultSize) {
            if (results[resultPointer].year === i) {
              arr.push(results[resultPointer]);
              resultPointer++;
            } else {
              arr.push({
                year: 0,
                question: "none",
                percent: "-",
                population_category: "Total",
              });
            }
          } else {
            arr.push({
              year: 0,
              question: "none",
              percent: "-",
              population_category: "Total",
            });
          }
        }
        this.setState({ yearlyHSResultsForTopicTotal: arr });
      }
    });
  }

  componentDidMount() {
    getAllStates().then((res) => {
      this.setState({ usStateResults: res.results });
    });

    getStateDetails(this.state.selectedStateName).then((res) => {
      this.setState({
        selectedStateDetails: {
          detail: res.detailResults[0],
          demoFS: res.demoFSResults[0],
          healthInsurance: res.healthInsuranceResults[0],
        },
      });
    });

    getAllHSYearsForTopicTotal(
      this.state.selectedStateName,
      "Percent of adults aged 18 years and older who have an overweight classification"
    ).then((res) => {
      this.setState({ yearlyHSResultsForTopicTotal: res.results });
      this.setState({
        selectedTopicTotal:
          "Percent of adults aged 18 years and older who have an overweight classification",
      });
    });
  }

  render() {
    return (
      <div
        style={{
          backgroundImage: `url(${desert})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          minHeight: "100vh",
        }}
      >
        <Navigation />
        <Form
          style={{ width: "80vw", margin: "0 auto", marginTop: "5vh" }}
          onKeyPress={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
        >
          <Row style={{ marginLeft: 50 }}>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label style={{ color: "black" }}>Search by State Name</label>
                <FormInput
                  placeholder="Name of State"
                  value={this.state.usStateQuery}
                  onChange={this.handleUsStateNameChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "10vw" }}>
                <Button
                  style={{ marginTop: "4vh" }}
                  onClick={this.updateSearchResultsName}
                >
                  Search Name
                </Button>
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw" }}>
                <label style={{ color: "black" }}>
                  Search by State Population
                </label>
                <Slider
                  range
                  defaultValue={[0, 4]}
                  min={0}
                  max={6}
                  marks={marks}
                  step={1}
                  valueLabelDisplay="off"
                  onChange={this.handleUsStatePopulationChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "10vw" }}>
                <Button
                  style={{ marginTop: "4vh" }}
                  onClick={this.updateSearchResultsPopulation}
                >
                  Search Range
                </Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h2 style={{ textAlign: "center" }}>States</h2>
          {popSearch ? (
            <span style={{ color: "yellow" }}>
              Search results for states with population size of{" "}
              {this.state.populationLowQuery * 2 + "M"} to{" "}
              {this.state.populationHighQuery * 2}
              {this.state.populationHighQuery === 6 ? "M+:" : "M"}
            </span>
          ) : (
            <span></span>
          )}
          {nameSearch ? (
            <span style={{ color: "yellow" }}>
              Search results for states with letters '{this.state.usStateQuery}
              ':{" "}
            </span>
          ) : (
            <br></br>
          )}
          <Table
            style={{
              width: "100%",
              backgroundColor: "rgb(245, 238, 222, 0.8)",
            }}
            dataSource={this.state.usStateResults}
            columns={stateColumns}
            pagination={{ defaultPageSize: 5, showQuickJumper: true }}
          />
          <p style={{ fontSize: 14, color: "black" }}>
            *Food Desert regions are defined for housing units with no vehicle
            access located 1/2 mile and beyond from the nearest supermarket.
            <br></br>
            **Percentages were calculated based on total housing units without
            car access in both urban and non-urban areas in the year 2010.
            Distance represents the # of miles away from the nearest
            supermarket.
          </p>
        </div>

        <Divider />

        {Object.values(this.state.selectedStateDetails).every(
          (x) => x !== null && typeof x !== "undefined"
        ) &&
        Object.values(this.state.yearlyHSResultsForTopicTotal).every(
          (x) => x !== null && typeof x !== "undefined"
        ) &&
        this.state.selectedTopicTotal !== null &&
        this.state.selectedTopicTotal !== "undefined" ? (
          <div style={{ width: "70vw", margin: "0 auto", marginTop: "2vh" }}>
            {console.log(this.state.yearlyHSResultsForTopicTotal)}
            {console.log(this.state.selectedStateDetails.detail)}
            {console.log(this.state.selectedStateDetails.demoFS)}
            {console.log(this.state.selectedStateDetails.healthInsurance)}
            <Tabs
              defaultActiveKey="1"
              centered
              type="card"
              tabPosition="top"
              items={[
                {
                  label: `State Summary`,
                  key: "1",
                  children: (
                    <Card className="customCardColor" style={{ width: "70%" }}>
                      <CardBody>
                        <Row align="center">
                          <h2>
                            {this.state.selectedStateDetails.demoFS.state},{" "}
                            {this.state.selectedStateDetails.detail.abbrev}
                          </h2>
                        </Row>
                        <Divider></Divider>
                        <Row align="center">
                          <img
                            src={
                              this.state.selectedStateDetails.detail.state_flag
                            }
                            referrerpolicy="no-referrer"
                            alt={null}
                            style={{ height: "15vw ", objectFit: "cover" }}
                          />
                        </Row>
                        <Divider></Divider>
                        <Row align="center">
                          <Col
                            flex=".5"
                            style={{
                              width: "30%",
                              borderRight: "1px solid grey",
                            }}
                            align="center"
                          >
                            <h6> State Seal:</h6>{" "}
                            <img
                              src={
                                this.state.selectedStateDetails.detail
                                  .state_seal
                              }
                              referrerpolicy="no-referrer"
                              alt={null}
                              style={{ height: "10vw " }}
                            />
                          </Col>
                          <Col
                            flex=".5"
                            style={{ width: "30%" }}
                            align="center"
                          >
                            <h6>
                              {" "}
                              Location of{" "}
                              {this.state.selectedStateDetails.demoFS.state} in
                              the USA:
                            </h6>{" "}
                            <img
                              src={
                                this.state.selectedStateDetails.detail.map_image
                              }
                              referrerpolicy="no-referrer"
                              alt={null}
                              style={{ height: "10vw " }}
                            />
                          </Col>
                        </Row>

                        <Divider></Divider>
                        <Row gutter="10" align="middle" justify="center">
                          <Col
                            style={{
                              width: "30%",
                              borderRight: "1px solid grey",
                            }}
                            align="center"
                          >
                            <h6> State Nickname:</h6>{" "}
                            {this.state.selectedStateDetails.detail.nickname}
                          </Col>
                          <Col
                            style={{
                              width: "30%",
                              borderRight: "1px solid grey",
                            }}
                            align="center"
                          >
                            <h6>Capital City:</h6>{" "}
                            {
                              this.state.selectedStateDetails.detail
                                .capital_city
                            }
                          </Col>
                          <Col style={{ width: "30%" }} align="center">
                            <h6>Website:</h6>{" "}
                            <a
                              href={
                                this.state.selectedStateDetails.detail.website
                              }
                            >
                              {this.state.selectedStateDetails.detail.website}
                            </a>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ),
                },

                //State Population Data Tab
                {
                  label: `Population Data`,
                  key: "2",
                  children: (
                    <Card className="customCardColor" style={{ width: "80%" }}>
                      <CardBody>
                        <Row gutter="30" align="middle" justify="center">
                          <h3>Population Rank:</h3>
                        </Row>
                        <Row gutter="30" align="middle" justify="center">
                          <h2>
                            {" "}
                            <span style={{ color: "blue" }}>
                              {
                                this.state.selectedStateDetails.detail
                                  .population_rank
                              }
                            </span>{" "}
                            / 50{" "}
                          </h2>
                        </Row>
                        <Row align="middle" justify="center">
                          <p>
                            with a total population of{" "}
                            <span style={{ color: "green" }}>
                              {this.state.selectedStateDetails.demoFS.total?.toLocaleString(
                                "en-US"
                              )}{" "}
                            </span>
                          </p>
                        </Row>
                        <Divider></Divider>
                        <br></br>
                        <Row align="middle" justify="center">
                          <h4>Gender Distribution:</h4>
                          <br></br>
                          <br></br>
                        </Row>
                        <Row
                          style={{ minHeight: "75%" }}
                          align="middle"
                          justify="center"
                        >
                          {" "}
                          <DoughnutChart
                            data={{
                              labels: ["Male", "Female"],
                              datasets: [
                                {
                                  label: "Total",
                                  data: [
                                    this.state.selectedStateDetails.demoFS.male,
                                    this.state.selectedStateDetails.demoFS
                                      .female,
                                  ],
                                },
                              ],
                            }}
                          />
                        </Row>
                        <br></br>

                        <br></br>
                        <Divider> </Divider>
                        <br></br>
                        <Row align="middle" justify="center">
                          <h4>Age Distribution: </h4>
                        </Row>
                        <Row
                          style={{ maxHeight: "75%" }}
                          align="middle"
                          justify="center"
                        >
                          {" "}
                          <PolarAreaChart
                            data={{
                              labels: [
                                "0-9",
                                "10-17",
                                "18-29",
                                "30-39",
                                "40-49",
                                "50-59",
                                "60-69",
                                "70+",
                              ],
                              datasets: [
                                {
                                  label: "Total of the population",
                                  data: [
                                    this.state.selectedStateDetails.demoFS
                                      .age_0_9,
                                    this.state.selectedStateDetails.demoFS
                                      .age_10_17,
                                    this.state.selectedStateDetails.demoFS
                                      .age_18_29,
                                    this.state.selectedStateDetails.demoFS
                                      .age_30_39,
                                    this.state.selectedStateDetails.demoFS
                                      .age_40_49,
                                    this.state.selectedStateDetails.demoFS
                                      .age_50_59,
                                    this.state.selectedStateDetails.demoFS
                                      .age_60_69,
                                    this.state.selectedStateDetails.demoFS
                                      .age_70_79 +
                                      this.state.selectedStateDetails.demoFS
                                        .age_80_plus,
                                  ],
                                },
                              ],
                            }}
                          />
                        </Row>

                        <br></br>
                      </CardBody>
                    </Card>
                  ),
                },

                // State Foodstamps Tab
                {
                  label: "Foodstamps",
                  key: "3",
                  children: (
                    <Card className="customCardColor">
                      <CardBody>
                        <Row align="middle" justify="center">
                          <h3>Foodstamps</h3> <Divider></Divider>
                        </Row>
                      </CardBody>
                    </Card>
                  ),
                },

                // State Households Tab
                {
                  label: "Households",
                  key: "4",
                  children: (
                    <Card className="customCardColor">
                      <CardBody>
                        <Row align="middle" justify="center">
                          <h3>Households</h3> <Divider></Divider>
                        </Row>
                      </CardBody>
                    </Card>
                  ),
                },

                // State Income Tab
                {
                  label: "Income",
                  key: "5",
                  children: (
                    <Card className="customCardColor">
                      <CardBody>
                        <Row align="middle" justify="center">
                          <h3>Income</h3> <Divider></Divider>
                        </Row>
                      </CardBody>
                    </Card>
                  ),
                },

                // State Health Surveys Tab
                {
                  label: `Health Surveys`,
                  key: "6",
                  children: (
                    <Card className="customCardColor">
                      <CardBody>
                        <Row align="center">
                          <h3>Health Surveys (2011 - 2016)</h3>{" "}
                          <Divider></Divider>
                        </Row>
                        <Row align="left">
                          <p>Select a topic to see results: </p>
                          <Select
                            defaultValue="Percent of adults aged 18 years and older who have an overweight classification"
                            style={{ width: "70%", marginLeft: "10px" }}
                            onChange={(value) => {
                              this.topicOnChange(
                                this.state.selectedStateDetails.demoFS.state,
                                value
                              );
                            }}
                          >
                            <Option value="Percent of adults aged 18 years and older who have an overweight classification">
                              % adults {">="} 18 years overweight
                            </Option>
                            <Option value="Percent of adults aged 18 years and older who have obesity">
                              % adults {">="} 18 years obesity
                            </Option>
                            <Option value="Percent of adults who achieve at least 150 minutes a week of moderate-intensity aerobic physical activity or 75 minutes a week of vigorous-intensity aerobic activity (or an equivalent combination)">
                              % adults w/ {">="}150 min/wk moderate aerobic
                              activity or 75 min/wk of vigorous aerobic
                              activity(or an equivalent combination)
                            </Option>
                            <Option value="Percent of adults who achieve at least 150 minutes a week of moderate-intensity aerobic physical activity or 75 minutes a week of vigorous-intensity aerobic physical activity and engage in muscle-strengthening activities on 2 or more days a week">
                              % adults w/ {">="} 150 min/wk of moderate aerobic
                              physical activity or 75 min/wk of vigorous aerobic
                              physical activity and engage in
                              muscle-strengthening activities on 2+ days/wk
                            </Option>
                            <Option value="Percent of adults who achieve at least 300 minutes a week of moderate-intensity aerobic physical activity or 150 minutes a week of vigorous-intensity aerobic activity (or an equivalent combination)">
                              % adults w/ {">="} 300 min/wk of moderate aerobic
                              physical activity or 150 min/wk of vigorous
                              aerobic activity (or an equivalent combination)
                            </Option>
                            <Option value="Percent of adults who engage in muscle-strengthening activities on 2 or more days a week">
                              % adults who engage in muscle-strengthening
                              activities on 2+ days/wk
                            </Option>
                            <Option value="Percent of adults who engage in no leisure-time physical activity">
                              % adults who engage in no leisure-time physical
                              activity
                            </Option>
                            <Option value="Percent of adults who report consuming fruit less than one time daily">
                              % adults who report consuming fruit {"<"}1 time
                              daily
                            </Option>
                            <Option value="Percent of adults who report consuming vegetables less than one time daily">
                              % adults who report consuming vegetables {"<"}1
                              time daily
                            </Option>
                          </Select>
                        </Row>
                        <Divider></Divider>
                        <h5 align="center">Topic</h5> <br></br>
                        <Row align="center">
                          {this.state.selectedTopicTotal}
                        </Row>
                        <Divider></Divider>
                        <br></br>
                        <Row style={{ width: "100%" }} align="center">
                          <h5>
                            Survey Results for{" "}
                            {this.state.selectedStateDetails.demoFS.state}*
                          </h5>{" "}
                          <br></br>
                          <br></br>
                          <br></br>
                        </Row>
                        <Row
                          style={{ width: "100%" }}
                          gutter="40"
                          align="center"
                        >
                          <Col>
                            <ProgressAntd
                              type="circle"
                              percent={
                                this.state.yearlyHSResultsForTopicTotal[0]
                                  .percent
                              }
                              width={90}
                              strokeColor={{
                                "0%": "#FF0000",
                                "50%": "#FF7F00",
                                "100%": "#FFFF00",
                              }}
                            />{" "}
                            <Divider></Divider>
                            <Row align="center">
                              {" "}
                              <h6>2011</h6>
                            </Row>
                          </Col>
                          <Col>
                            <ProgressAntd
                              type="circle"
                              percent={
                                this.state.yearlyHSResultsForTopicTotal[1]
                                  .percent
                              }
                              width={90}
                              strokeColor={{
                                "0%": "#FFFF00",
                                "50%": "#7FFF00",
                                "100%": "#00FF00",
                              }}
                            />
                            <Divider></Divider>
                            <Row align="center">
                              {" "}
                              <h6>2012</h6>
                            </Row>
                          </Col>
                          <Col>
                            <ProgressAntd
                              type="circle"
                              percent={
                                this.state.yearlyHSResultsForTopicTotal[2]
                                  .percent
                              }
                              width={90}
                              strokeColor={{
                                "0%": "#00FF00",
                                "50%": "#00FF7F",
                                "100%": "#00FFFF",
                              }}
                            />{" "}
                            <Divider></Divider>
                            <Row align="center">
                              {" "}
                              <h6>2013</h6>
                            </Row>
                          </Col>
                          <Col>
                            <ProgressAntd
                              type="circle"
                              percent={
                                this.state.yearlyHSResultsForTopicTotal[3]
                                  .percent
                              }
                              width={90}
                              strokeColor={{
                                "0%": "#00FFFF",
                                "50%": "#007FFF",
                                "100%": "#0000FF",
                              }}
                            />{" "}
                            <Divider></Divider>
                            <Row align="center">
                              {" "}
                              <h6>2014</h6>
                            </Row>
                          </Col>
                          <Col>
                            <ProgressAntd
                              type="circle"
                              percent={
                                this.state.yearlyHSResultsForTopicTotal[4]
                                  .percent
                              }
                              width={90}
                              strokeColor={{
                                "0%": "#0000FF",
                                "50%": "#7F00FF",
                                "100%": "#FF00FF",
                              }}
                            />{" "}
                            <Divider></Divider>
                            <Row align="center">
                              {" "}
                              <h6>2015</h6>
                            </Row>
                          </Col>
                          <Col>
                            <ProgressAntd
                              type="circle"
                              percent={
                                this.state.yearlyHSResultsForTopicTotal[5]
                                  .percent
                              }
                              width={90}
                              strokeColor={{
                                "0%": "#FF00FF",
                                "50%": "#FF007F",
                                "100%": "#FF0000",
                              }}
                            />{" "}
                            <Divider></Divider>
                            <Row align="center">
                              {" "}
                              <h6>2016</h6>
                            </Row>
                          </Col>
                        </Row>
                        <br></br>
                        <br></br>
                        <Row>
                          *Note: Results of '-%' indicate no record for that
                          year.
                        </Row>
                      </CardBody>
                    </Card>
                  ),
                },

                // State Health Insurance Tab
                {
                  label: "Health Insurance",
                  key: "7",
                  children: (
                    <Card className="customCardColor" style={{ width: "80%" }}>
                      <CardBody>
                        <Row align="middle" justify="center">
                          <h3>Health Insurance Statistics</h3> <Divider></Divider> <br></br>
                        </Row>
                        <Row align="middle" justify="center">
                          <h6>Uninsured Rates in 2010 vs 2015 for {this.state.selectedStateDetails.demoFS.state}:</h6> 
                        </Row> 
                          <Row align="middle" justify="center" gutter={10} style={{marginTop: '2%'}}>
                            <Col span={6}>
                              <Statistic title="Uninsured rate in 2010" 
                                value={this.state.selectedStateDetails.healthInsurance.uninsured_rate_2010} 
                                valueStyle={{ color: this.state.selectedStateDetails.healthInsurance.uninsured_rate_2010 >= this.state.selectedStateDetails.healthInsurance.uninsured_rate_2015 ? '#cf1322' : '#3f8600'}} 
                                suffix="%" 
                              />
                            </Col>
                            <Col span={6}>
                              <Statistic title="Uninsured rate in 2015" 
                                value={this.state.selectedStateDetails.healthInsurance.uninsured_rate_2015}
                                valueStyle={{ color: this.state.selectedStateDetails.healthInsurance.uninsured_rate_2010 >= this.state.selectedStateDetails.healthInsurance.uninsured_rate_2015 ? '#3f8600' : '#cf1322'}} 
                                suffix="%" 
                              />
                            </Col>
                            <Col span={6}>
                              <Statistic
                                title="% Change from 2010 to 2015"
                                value={Math.abs(this.state.selectedStateDetails.healthInsurance.uninsured_rate_change)}
                                precision={1}
                                valueStyle={{ color: this.state.selectedStateDetails.healthInsurance.uninsured_rate_change < 0 ? '#3f8600': '#cf1322'}}
                                prefix={this.state.selectedStateDetails.healthInsurance.uninsured_rate_change < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                suffix="%"
                              />
                            </Col>
                          </Row>
                          <br></br>
                          <Divider></Divider>
                          <br></br>
                          <Row align="middle" justify="center" gutter={10}>
                              <h6>This {Math.abs(this.state.selectedStateDetails.healthInsurance.uninsured_rate_change)}% change in the uninsured rate from 2010 to 2015 means that: </h6>
                          </Row>
                          <Row align="middle" justify="center" gutter={10}>
                            <Statistic                                
                              value={Math.abs(this.state.selectedStateDetails.healthInsurance.health_insurance_coverage_change)}
                              precision={0}
                              valueStyle={{color: this.state.selectedStateDetails.healthInsurance.uninsured_rate_change < 0 ? '#3f8600': '#cf1322'}}
                              prefix={this.state.selectedStateDetails.healthInsurance.uninsured_rate_change < 0 ? <ArrowUpOutlined />: <ArrowDownOutlined />}
                              suffix= {this.state.selectedStateDetails.healthInsurance.uninsured_rate_change < 0 ? " more people have health insurance": "less people have health insurance"}
                            />
                          </Row>
                          <br></br>
                          <Divider></Divider> 
                          <br></br>
                          <Row align="middle" justify="center" gutter={10}>
                            <h6> In the year 2015, employers in the state of {this.state.selectedStateDetails.demoFS.state} provided health insurance for :</h6>
                          </Row>
                          <Row align="middle" justify="center" gutter={10}>
                            <Statistic                                
                                value={this.state.selectedStateDetails.healthInsurance.employer_health_insurance_coverage_2015?.toLocaleString("en-US")}
                                precision={0}
                                valueStyle={{color:'#3f8600'}}
                                suffix= "people"
                            />
                          </Row>
                          <br></br>
                      </CardBody>
                    </Card>
                  ),
                },

                // State Photos Tab
                {
                  label: "Photos",
                  key: "8",
                  children: (
                    <Card className="customCardColor">
                      <CardBody>
                        <Row align="middle" justify="center">
                          <h3>
                            {this.state.selectedStateDetails.demoFS.state} Views
                          </h3>
                        </Row>
                        <Divider></Divider>
                        <Carousel
                          dots={true}
                          draggable={true}
                          ref={carouselRef}
                        >
                          <div>
                            <img
                              src={
                                this.state.selectedStateDetails.detail
                                  .landscape_background
                              }
                              referrerpolicy="no-referrer"
                              alt={null}
                              className="center"
                              style={{ width: "90%" }}
                            />
                          </div>
                          <div>
                            <img
                              src={
                                this.state.selectedStateDetails.detail
                                  .skyline_background
                              }
                              referrerpolicy="no-referrer"
                              alt={null}
                              className="center"
                              style={{ width: "90%" }}
                            />
                          </div>
                        </Carousel>
                        <br></br>
                        <Row align="middle" justify="center">
                          <Button
                            style={{ backgroundColor: "orange" }}
                            onClick={() => carouselRef.current.goTo(0)}
                          >
                            Landscape View
                          </Button>
                          <Button
                            style={{
                              backgroundColor: "orange",
                              marginLeft: "15px",
                            }}
                            onClick={() => carouselRef.current.goTo(1)}
                          >
                            Skyline View
                          </Button>
                        </Row>
                      </CardBody>
                    </Card>
                  ),
                },
              ]}
            />
            <br></br> <br></br> <br></br>
          </div>
        ) : null}
      </div>
    );
  }
}

export default StatePage;
