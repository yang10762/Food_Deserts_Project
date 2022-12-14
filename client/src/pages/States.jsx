import React from "react";
import DoughnutChart from "../components/DoughnutChart";
import PolarAreaChart from "../components/PolarAreaChart";
import CustomButton from "../components/CustomButton";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import { Line } from "react-chartjs-2";

import {
  Form,
  FormInput,
  FormGroup,
  Button,
  Card,
  CardBody,
  CardTitle,
  Progress,
  Container,
} from "shards-react";
import stateStyles from "../stateStyles.css";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

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
    render: (text, row) => <span>{text}</span>,
  },
  {
    title: "Population",
    dataIndex: "population_count",
    key: "population_count",
    width: 10,
    align: "left",
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
    align: "left",
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
    align: "left",
    sorter: (a, b) => a.no_car_half_mile_percent - b.no_car_half_mile_percent,
    render: (text, row) => <span>{row.no_car_half_mile_percent}%</span>,
  },
  {
    title: "Percentage of Housing Units Beyond 1 Mile From Supermarket**",
    dataIndex: "no_car_1_mile_percent",
    key: "no_car_1_mile_percent",
    width: 10,
    align: "left",
    sorter: (a, b) => a.no_car_1_mile_percent - b.no_car_1_mile_percent,
    render: (text, row) => <span>{row.no_car_1_mile_percent}%</span>,
  },
  {
    title: "Percentage of Housing Units Beyond 10 Miles From Supermarket**",
    dataIndex: "no_car_10_mile_percent",
    key: "no_car_10_miles_percent",
    width: 10,
    align: "left",
    sorter: (a, b) => a.no_car_10_mile_percent - b.no_car_10_mile_percent,
    render: (text, row) => <span>{row.no_car_10_mile_percent}%</span>,
  },
  {
    title: "Percentage of Housing Units Beyond 20 Miles From Supermarket**",
    dataIndex: "no_car_20_mile_percent",
    key: "no_car_20_mile_percent",
    width: 10,
    align: "left",
    sorter: (a, b) => a.no_car_20_mile_percent - b.no_car_20_mile_percent,
    render: (text, row) => <span>{row.no_car_20_mile_percent}%</span>,
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
    this.setState({ usStateQuery: event.target.value });
  }

  // Handling population range change
  handleUsStatePopulationChange(value) {
    this.setState({ populationLowQuery: value[0] });
    this.setState({ populationHighQuery: value[1] });
  }

  // Searching by name of state
  updateSearchResultsName() {
    getStateSearchName(this.state.usStateQuery, null, null).then((res) => {
      this.setState({ usStateResults: res.results });
    });
  }

  // Searching by population range
  updateSearchResultsPopulation() {
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
      <div>
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
                <CustomButton
                  text="Search Name"
                  callback={this.updateSearchResultsName}
                />
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
                <CustomButton
                  text="Search Range"
                  callback={this.updateSearchResultsPopulation}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h2 style={{ textAlign: "left" }}>States</h2>
          <h7>Click on a row to see State details.</h7>

          <Table
            style={{
              width: "100%",
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  window.location = `/states?state_name=${record.state}`;
                },
              };
            }}
            dataSource={this.state.usStateResults}
            columns={stateColumns}
            pagination={{ defaultPageSize: 5, showQuickJumper: true }}
          />
          <p style={{ fontSize: 14, color: "black" }}>
            *Food Desert regions are defined for housing units with no vehicle
            access located 1/2 mile and beyond from the nearest supermarket.
            <br />
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
            <Tabs
              defaultActiveKey="1"
              centered
              type="card"
              tabPosition="top"
              items={[
                // State Summary Card
                {
                  label: `State Summary`,
                  key: "1",
                  children: (
                    <Card style={{ width: "70%" }}>
                      <CardBody>
                        <Row align="center">
                          <h2>
                            {this.state.selectedStateDetails.demoFS.state},{" "}
                            {this.state.selectedStateDetails.detail.abbrev}
                          </h2>
                        </Row>
                        <br />
                        <br />
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
                        <Divider />
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

                        <Divider />
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

                //State Demographic Card
                {
                  label: `Demographic Data`,
                  key: "2",
                  children: (
                    <Card style={{ width: "80%" }}>
                      <CardBody>
                        {/* Card Header */}
                        <Row gutter="30" align="middle" justify="center">
                          <Col flex={2} style={{ textAlign: "left" }}>
                            <h3>Demographic Data </h3>
                          </Col>
                          <Col flex={2} style={{ textAlign: "right" }}>
                            <h3 style={{ color: "#7FB069" }}>
                              {this.state.selectedStateDetails.demoFS.state}
                            </h3>
                          </Col>
                        </Row>
                        <br />
                        <br />
                        <Row gutter="30" align="middle" justify="center">
                          <h3>Population Rank:</h3>
                        </Row>
                        <Row gutter="30" align="middle" justify="center">
                          <h2>
                            {" "}
                            <span style={{ color: "#666A86" }}>
                              {
                                this.state.selectedStateDetails.detail
                                  .population_rank
                              }
                            </span>{" "}
                            / 50{" "}
                          </h2>
                        </Row>
                        <Row align="middle" justify="center">
                          <h6>
                            with a total population of{" "}
                            <span style={{ color: "#7FB069" }}>
                              {this.state.selectedStateDetails.demoFS.total?.toLocaleString(
                                "en-US"
                              )}{" "}
                            </span>
                          </h6>
                        </Row>
                        <Divider />
                        <br />
                        <br />
                        {/* Gender distribution within a selected state*/}
                        <Row align="middle" justify="center">
                          <h4>Gender Distribution:</h4>
                        </Row>
                        <Row align="middle" justify="center">
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
                                  backgroundColor: ["#666A86", "#d68bb7"],
                                },
                              ],
                            }}
                          />
                        </Row>
                        <Divider />
                        <br />
                        <br />
                        {/* Age distribution within a selected state*/}
                        <Row align="middle" justify="center">
                          <h4>Age Distribution: </h4>
                        </Row>

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
                                backgroundColor: [
                                  "rgba(102, 106, 134, 0.6)",
                                  "rgba(51, 51, 51, 0.6)",
                                  "rgba(127, 176, 105, 0.6)",
                                  "rgba(235, 233, 233, 0.6)",
                                  "rgba(143, 150, 199, 0.6)",
                                  "rgba(175, 178, 189, 0.6)",
                                  "rgba(214, 139, 183, 0.6)",
                                  "rgba(178, 224, 157, 0.6)",
                                ],
                              },
                            ],
                          }}
                        />
                        <Divider />
                        <br />
                        <br />
                        {/* Households within a selected state */}
                        <Row align="middle" justify="center">
                          <h4>Households: </h4>
                        </Row>
                        <Row gutter="30" align="left" justify="center">
                          <BarChart
                            data={{
                              labels: ["2010", "2015"],
                              datasets: [
                                {
                                  label: "Total households",
                                  data: [
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_2010,
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_2015,
                                  ],
                                  backgroundColor: "#7FB069",
                                },
                                {
                                  label: "Households with members under 18",
                                  data: [
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_18_under_2010,
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_18_under_2015,
                                  ],
                                  backgroundColor: "#666A86",
                                },
                                {
                                  label: "Households with members over 60",
                                  data: [
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_60_over_2010,
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_60_over_2015,
                                  ],
                                  backgroundColor: "#EBE9E9",
                                },
                              ],
                            }}
                          ></BarChart>
                        </Row>
                        <br />
                        <br />
                      </CardBody>
                    </Card>
                  ),
                },

                // State Income Card
                {
                  label: "Income Data",
                  key: "3",
                  children: (
                    <Card>
                      <CardBody>
                        {/* Card Header */}
                        <Row gutter="30" align="middle" justify="center">
                          <Col flex={2} style={{ textAlign: "left" }}>
                            <h3>Income Data </h3>
                          </Col>
                          <Col flex={2} style={{ textAlign: "right" }}>
                            <h3 style={{ color: "#7FB069" }}>
                              {this.state.selectedStateDetails.demoFS.state}
                            </h3>
                          </Col>
                        </Row>
                        <br />
                        <br />

                        {/* Foodstamps within a selected state */}
                        <Row align="middle" justify="center">
                          <h4>Households and Food Assistance</h4>
                        </Row>
                        <Row gutter="30" align="left" justify="center">
                          <BarChart
                            data={{
                              labels: ["2010", "2015"],
                              datasets: [
                                {
                                  label: "Total households",
                                  data: [
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_2010,
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_2015,
                                  ],
                                  backgroundColor: "#7FB069",
                                },
                                {
                                  label: "Households receiving foodstamps",
                                  data: [
                                    this.state.selectedStateDetails.demoFS
                                      .total_FS_2010,
                                    this.state.selectedStateDetails.demoFS
                                      .total_FS_2015,
                                  ],
                                  backgroundColor: "#666A86",
                                },
                                {
                                  label: "Households below poverty",
                                  data: [
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_below_pl_2010,
                                    this.state.selectedStateDetails.demoFS
                                      .total_HH_below_pl_2015,
                                  ],
                                  backgroundColor: "#EBE9E9",
                                },
                              ],
                            }}
                          ></BarChart>
                        </Row>
                        <br />
                        <br />
                        <Divider />

                        {/* Income data within a selected state */}
                        <Row align="middle" justify="center">
                          <h4>Average Income</h4>
                        </Row>
                        <br />

                        <Line
                          data={{
                            labels: ["2010", "2015"],
                            datasets: [
                              {
                                label: "Avg Median Income",
                                data: [
                                  this.state.selectedStateDetails.demoFS
                                    .median_income_2010,
                                  this.state.selectedStateDetails.demoFS
                                    .median_income_2015,
                                ],
                                backgroundColor: "rgba(127, 176, 105, 0.6)",
                                borderColor: "rgba(127, 176, 105, 0.6)",
                              },
                              {
                                label:
                                  "Avg Median Income Receiving Food Stamps",
                                data: [
                                  this.state.selectedStateDetails.demoFS
                                    .avg_med_income_receiving_fs_2010,
                                  this.state.selectedStateDetails.demoFS
                                    .avg_med_income_receiving_fs_2015,
                                ],
                                backgroundColor: "rgba(102, 106, 134, 0.6)",
                                borderColor: "rgba(102, 106, 134, 0.6)",
                              },
                            ],
                          }}
                        ></Line>
                        <br />
                        <br />

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <h7>2010 Avg Median Income:</h7>
                            <h5>
                              $
                              {this.state.selectedStateDetails.demoFS.median_income_2010?.toLocaleString(
                                "en-US"
                              )}
                            </h5>

                            <h7>
                              2010 Avg Median Income Receiving Food Stamps:
                            </h7>
                            <h5>
                              $
                              {this.state.selectedStateDetails.demoFS.avg_med_income_receiving_fs_2010?.toLocaleString(
                                "en-US"
                              )}
                            </h5>
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <h7>2015 Avg Median Income:</h7>
                            <h5>
                              $
                              {this.state.selectedStateDetails.demoFS.median_income_2015?.toLocaleString(
                                "en-US"
                              )}
                            </h5>

                            <h7>
                              2015 Avg Median Income Receiving Food Stamps:
                            </h7>
                            <h5>
                              $
                              {this.state.selectedStateDetails.demoFS.avg_med_income_receiving_fs_2015?.toLocaleString(
                                "en-US"
                              )}
                            </h5>
                          </div>
                        </div>

                        {/* <Row align="middle" justify="center"> */}
                        {/* <Row gutter="30" align="middle" justify="left">
                          <Col flex={2} style={{ textAlign: "left" }}>
                            <h7>2010 Avg Median Income:</h7>
                            <h5>
                              $
                              {this.state.selectedStateDetails.demoFS.median_income_2010?.toLocaleString(
                                "en-US"
                              )}
                            </h5>
                          </Col>
                          <Col flex={2} style={{ textAlign: "left" }}>
                            <h7>2015 Avg Median Income:</h7>
                            <h5>
                              $
                              {this.state.selectedStateDetails.demoFS.median_income_2015?.toLocaleString(
                                "en-US"
                              )}
                            </h5>
                          </Col>
                          <br />
                        </Row>
                        <Row gutter="30" align="middle" justify="left">
                          <Col flex={2} style={{ textAlign: "left" }}>
                            <h7>
                              2010 Avg Median Income Receiving Food Stamps:
                            </h7>
                            <h5>
                              $
                              {this.state.selectedStateDetails.demoFS.avg_med_income_receiving_fs_2010?.toLocaleString(
                                "en-US"
                              )}
                            </h5>
                          </Col>
                          <Col flex={2} style={{ textAlign: "left" }}>
                            <h7>
                              2015 Avg Median Income Receiving Food Stamps:
                            </h7>
                            <h5>
                              $
                              {this.state.selectedStateDetails.demoFS.avg_med_income_receiving_fs_2015?.toLocaleString(
                                "en-US"
                              )}
                            </h5>
                          </Col>
                        </Row> */}
                        {/* </Row> */}
                      </CardBody>
                    </Card>
                  ),
                },

                // State Health Surveys Card
                {
                  label: `Health Survey Results`,
                  key: "4",
                  children: (
                    <Card>
                      <CardBody>
                        {/* Card Header */}
                        <Row gutter="30" align="middle" justify="center">
                          <Col flex={2} style={{ textAlign: "left" }}>
                            <h3>Health Survey Results </h3>
                          </Col>
                          <Col flex={2} style={{ textAlign: "right" }}>
                            <h3 style={{ color: "#7FB069" }}>
                              {this.state.selectedStateDetails.demoFS.state}
                            </h3>
                          </Col>
                        </Row>
                        <br />
                        <br />
                        {/* Different Survey Topics */}
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
                              Percent of adults classified as overweight
                            </Option>
                            <Option value="Percent of adults aged 18 years and older who have obesity">
                              Percent of adults classified as obese
                            </Option>
                            <Option value="Percent of adults who achieve at least 150 minutes a week of moderate-intensity aerobic physical activity or 75 minutes a week of vigorous-intensity aerobic activity (or an equivalent combination)">
                              Percent of adults who perform 2.5 hours or more a
                              week of moderate aerobic activity or 1.25 hours a
                              week of vigorous aerobic activity (or an
                              equivalent combination)
                            </Option>
                            <Option value="Percent of adults who achieve at least 150 minutes a week of moderate-intensity aerobic physical activity or 75 minutes a week of vigorous-intensity aerobic physical activity and engage in muscle-strengthening activities on 2 or more days a week">
                              Percent of adults who perform at least 2.5 hours a
                              week of moderate aerobic physical activity or 1.25
                              hours a week of vigorous aerobic physical activity
                              and engage in muscle-strengthening activities on 2
                              or more days a week
                            </Option>
                            <Option value="Percent of adults who achieve at least 300 minutes a week of moderate-intensity aerobic physical activity or 150 minutes a week of vigorous-intensity aerobic activity (or an equivalent combination)">
                              Percent of adults who perform 5 hours a week or
                              more of moderate aerobic physical activity or 2.5
                              hours a week of vigorous aerobic activity (or an
                              equivalent combination)
                            </Option>
                            <Option value="Percent of adults who engage in muscle-strengthening activities on 2 or more days a week">
                              Percent of adults who engage in
                              muscle-strengthening activities on 2 or more days
                              a week
                            </Option>
                            <Option value="Percent of adults who engage in no leisure-time physical activity">
                              Percent of adults who engage in no leisure-time
                              physical activity
                            </Option>
                            <Option value="Percent of adults who report consuming fruit less than one time daily">
                              Percent of adults who report consuming fruit less
                              than once daily
                            </Option>
                            <Option value="Percent of adults who report consuming vegetables less than one time daily">
                              Percent of adults who report consuming vegetables
                              less than once daily
                            </Option>
                          </Select>
                        </Row>
                        <br />
                        <br />
                        <h4 align="left">Survey Results for</h4>{" "}
                        {this.state.selectedTopicTotal}
                        <br></br>
                        <br></br>
                        <br></br>
                        {/* Survey Results Line Graph */}
                        <LineChart
                          data={{
                            datasets: [
                              {
                                label: "Health Survey Results",
                                data: this.state.yearlyHSResultsForTopicTotal.map(
                                  (element) => ({
                                    percent: element.percent,
                                    year: element.year,
                                  })
                                ),
                              },
                            ],
                          }}
                        ></LineChart>
                        <br />
                        <br />
                      </CardBody>
                    </Card>
                  ),
                },

                // State Health Insurance Card
                {
                  label: "Health Insurance Data",
                  key: "5",
                  children: (
                    <Card style={{ width: "80%" }}>
                      <CardBody>
                        {/* Card Header */}
                        <Row gutter="30" align="middle" justify="center">
                          <Col flex={2} style={{ textAlign: "left" }}>
                            <h3>Health Insurance Data</h3>
                          </Col>
                          <Col flex={2} style={{ textAlign: "right" }}>
                            <h3 style={{ color: "#7FB069" }}>
                              {this.state.selectedStateDetails.demoFS.state}
                            </h3>
                          </Col>
                        </Row>
                        <br />
                        <br />

                        <Row align="middle" justify="center">
                          <h4>Uninsured Rates in 2010 vs 2015:</h4>
                        </Row>
                        <Row
                          align="middle"
                          justify="center"
                          gutter={10}
                          style={{ marginTop: "2%" }}
                        >
                          <Col span={6}>
                            <Statistic
                              title="Uninsured rate in 2010"
                              value={
                                this.state.selectedStateDetails.healthInsurance
                                  .uninsured_rate_2010
                              }
                              valueStyle={{
                                color:
                                  this.state.selectedStateDetails
                                    .healthInsurance.uninsured_rate_2010 >=
                                  this.state.selectedStateDetails
                                    .healthInsurance.uninsured_rate_2015
                                    ? "#cf1322"
                                    : "#7FB069",
                              }}
                              suffix="%"
                            />
                          </Col>
                          <Col span={6}>
                            <Statistic
                              title="Uninsured rate in 2015"
                              value={
                                this.state.selectedStateDetails.healthInsurance
                                  .uninsured_rate_2015
                              }
                              valueStyle={{
                                color:
                                  this.state.selectedStateDetails
                                    .healthInsurance.uninsured_rate_2010 >=
                                  this.state.selectedStateDetails
                                    .healthInsurance.uninsured_rate_2015
                                    ? "#7FB069"
                                    : "#cf1322",
                              }}
                              suffix="%"
                            />
                          </Col>
                          <Col span={6}>
                            <Statistic
                              title="% Change from 2010 to 2015"
                              value={Math.abs(
                                this.state.selectedStateDetails.healthInsurance
                                  .uninsured_rate_change
                              )}
                              precision={1}
                              valueStyle={{
                                color:
                                  this.state.selectedStateDetails
                                    .healthInsurance.uninsured_rate_change < 0
                                    ? "#7FB069"
                                    : "#cf1322",
                              }}
                              prefix={
                                this.state.selectedStateDetails.healthInsurance
                                  .uninsured_rate_change < 0 ? (
                                  <ArrowDownOutlined />
                                ) : (
                                  <ArrowUpOutlined />
                                )
                              }
                              suffix="%"
                            />
                          </Col>
                        </Row>
                        <br></br>
                        <Divider></Divider>
                        <br></br>
                        <Row align="middle" justify="center" gutter={10}>
                          <h6>
                            This{" "}
                            {Math.abs(
                              this.state.selectedStateDetails.healthInsurance
                                .uninsured_rate_change
                            )}
                            % change in the uninsured rate from 2010 to 2015
                            means that:{" "}
                          </h6>
                        </Row>
                        <Row align="middle" justify="center" gutter={10}>
                          <Statistic
                            value={Math.abs(
                              this.state.selectedStateDetails.healthInsurance
                                .health_insurance_coverage_change
                            )}
                            precision={0}
                            valueStyle={{
                              color:
                                this.state.selectedStateDetails.healthInsurance
                                  .uninsured_rate_change < 0
                                  ? "#7FB069"
                                  : "#cf1322",
                            }}
                            prefix={
                              this.state.selectedStateDetails.healthInsurance
                                .uninsured_rate_change < 0 ? (
                                <ArrowUpOutlined />
                              ) : (
                                <ArrowDownOutlined />
                              )
                            }
                            suffix={
                              this.state.selectedStateDetails.healthInsurance
                                .uninsured_rate_change < 0
                                ? " more people have health insurance"
                                : "less people have health insurance"
                            }
                          />
                        </Row>
                        <br></br>
                        <Divider></Divider>
                        <br></br>
                        <Row align="middle" justify="center" gutter={10}>
                          <h6>
                            {" "}
                            In the year 2015, employers in the state of{" "}
                            {this.state.selectedStateDetails.demoFS.state}{" "}
                            provided health insurance for :
                          </h6>
                        </Row>
                        <Row align="middle" justify="center" gutter={10}>
                          <Statistic
                            value={this.state.selectedStateDetails.healthInsurance.employer_health_insurance_coverage_2015?.toLocaleString(
                              "en-US"
                            )}
                            precision={0}
                            valueStyle={{ color: "#7FB069" }}
                            suffix="people"
                          />
                        </Row>
                        <br></br>
                      </CardBody>
                    </Card>
                  ),
                },

                // State Photos Card
                {
                  label: "Photos",
                  key: "6",
                  children: (
                    <Card>
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
                        <Row
                          style={{
                            displayFlex: "flex-direction-row",
                            justifyContent: "space-evenly",
                          }}
                          align="middle"
                          justify="center"
                        >
                          <CustomButton
                            text="Landscape"
                            callback={() => {
                              carouselRef.current.goTo(0);
                            }}
                          />
                          <CustomButton
                            text="Skyline"
                            callback={() => {
                              carouselRef.current.goTo(1);
                            }}
                          />
                        </Row>
                      </CardBody>
                    </Card>
                  ),
                },
              ]}
            />
            <br />
            <br />
            <br />
          </div>
        ) : null}
      </div>
    );
  }
}

export default StatePage;
