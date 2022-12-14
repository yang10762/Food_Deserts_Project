import Navigation from "../components/Navigation.jsx";
import CustomButton from "../components/CustomButton.jsx";
import React from "react";
import DoughnutChart from "../components/DoughnutChart";
import PolarAreaChart from "../components/PolarAreaChart";
import BarChart from "../components/BarChart.jsx";
import {
  Form,
  FormInput,
  FormGroup,
  Button,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
} from "shards-react"; //CardTitle,
import { Table, Row, Col, Divider, Slider, Progress, Tabs } from "antd"; //Pagination, Rate,
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
//import { red, blue } from '@ant-design/colors';
//import SliderMarks from 'antd/es/slider';
//import { format } from 'd3-format';
import { getCountySearch, getCountyData, getAllCounties } from "../fetcher";

//const wideFormat = format('.3r');
const { Column } = Table; //ColumnGroup
const onChange = (key) => {
  console.log(key);
};
const popMarks = {
  // :SliderMarks
  0: "0",
  2000000: "2 Mil",
  4000000: "4 Mil",
  6000000: "6 Mil",
  8000000: "8 Mil",
  10000000: {
    style: {
      color: "black",
    },
    label: <strong>10</strong>,
  },
};

const fdMarks = {
  //: SliderMarks
  0: "0",
  20000: "20K",
  40000: "40K",
  60000: "60K",
  86500: {
    style: {
      color: "black", //#7FB069
    },
    label: <strong>86.5</strong>,
  },
};

class Counties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countyQuery: "",
      stateQuery: "",
      popMaxQuery: 10000000,
      popMinQuery: 0,
      fdMaxQuery: 86500,
      fdMinQuery: 0,
      selectedState: "",
      selectedCounty: "",
      selectedCountyFDDetails: null,
      selectedCountyDemoDetails: null,
      selectedCountyIncomeDetails: null,
      countiesResults: [],
    };

    this.updateSearchResults = this.updateSearchResults.bind(this);
    this.handleCountyQueryChange = this.handleCountyQueryChange.bind(this);
    this.handleStateQueryChange = this.handleStateQueryChange.bind(this);
    this.handlePopulationChange = this.handlePopulationChange.bind(this);
    this.handleFDChange = this.handleFDChange.bind(this);
    this.goToCounty = this.goToCounty.bind(this);
  }

  handleCountyQueryChange(event) {
    this.setState({ countyQuery: event.target.value });
  }

  handleStateQueryChange(event) {
    this.setState({ stateQuery: event.target.value });
  }

  handlePopulationChange(value) {
    this.setState({ popMinQuery: value[0] });
    this.setState({ popMaxQuery: value[1] });
  }

  handleFDChange(value) {
    this.setState({ fdMinQuery: value[0] });
    this.setState({ fdMaxQuery: value[1] });
  }

  goToCounty(county, state) {
    this.setState({ selectedCounty: county });
    this.setState({ selectedState: state });
    getCountyData(county, state).then((res) => {
      this.setState({ selectedCountyFDDetails: res.fd_result[0] });
      this.setState({ selectedCountyDemoDetails: res.demo_result[0] });
      this.setState({ selectedCountyIncomeDetails: res.income_result[0] });
    });
  }

  updateSearchResults() {
    getCountySearch(
      this.state.countyQuery,
      this.state.stateQuery,
      this.state.popMinQuery,
      this.state.popMaxQuery,
      this.state.fdMinQuery,
      this.state.fdMaxQuery,
      null,
      null
    ).then((res) => {
      this.setState({ countiesResults: res.results });
    });
  }


  componentDidMount() {
    getAllCounties(null, null).then((res) => {
      this.setState({ countiesResults: res.results });
    });

    getCountySearch(
      this.state.countyQuery,
      this.state.stateQuery,
      this.state.popMinQuery,
      this.state.popMaxQuery,
      this.state.fdMinQuery,
      this.state.fdMaxQuery,
      null,
      null
    ).then((res) => {
      this.setState({ countiesResults: res.results });
    });

    getCountyData(this.state.selectedCounty, this.state.selectedState).then(
      (res) => {
        this.setState({ selectedCountyFDDetails: res.fd_result[0] });
        this.setState({ selectedCountyDemoDetails: res.demo_result[0] });
        this.setState({ selectedCountyIncomeDetails: res.income_result[0] });
      }
    );
  }

  render() {
    return (
      <div className="County">
        <Navigation />
        <Form style={{ width: "80vw", margin: "0 auto", marginTop: "5vh" }}>
          <Row>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>State</label>
                <FormInput
                  placeholder="State"
                  value={this.state.stateQuery}
                  onChange={this.handleStateQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>County</label>
                <FormInput
                  placeholder="County"
                  value={this.state.countyQuery}
                  onChange={this.handleCountyQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "10vw" }}></FormGroup>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Population</label>
                <Slider
                  range
                  marks={popMarks}
                  defaultValue={[0, 10000000]}
                  max={10000000}
                  onChange={this.handlePopulationChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Number of Food Deserts</label>
                <Slider
                  range
                  marks={fdMarks}
                  defaultValue={[0, 86500]}
                  max={86500}
                  onChange={this.handleFDChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "10vw" }}>
                <CustomButton
                  text="Search"
                  callback={this.updateSearchResults}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>

        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h2>Counties</h2>
          <h7>Click on a row to see County details.</h7>
        </div>

        <Table
          style={{ maxWidth: "70vw", margin: "0 auto" }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                this.goToCounty(record.County, record.State);
              },
            };
          }}
          dataSource={this.state.countiesResults}
          pagination={{
            pageSizeOptions: [5, 10],
            defaultPageSize: 5,
            showQuickJumper: true,
          }}
        >
          <Column
            title="County"
            dataIndex="County"
            key="County"
            sorter={(a, b) => a.County.localeCompare(b.County)}
          />
          <Column
            title="State"
            dataIndex="State"
            key="State"
            sorter={(a, b) => a.State.localeCompare(b.State)}
          />
          <Column
            title="Population"
            dataIndex="Population"
            key="Population"
            sorter={(a, b) => a.Population - b.Population}
            render={(text, row) => (
              <span>{row.Population?.toLocaleString("en-US")}</span>
            )}
          />
          <Column
            title="Total Number of Food Deserts"
            dataIndex="Total_Food_Deserts"
            key="Total_Food_Deserts"
            sorter={(a, b) => a.Total_Food_Deserts - b.Total_Food_Deserts}
            render={(text, row) => (
              <span>{row.Total_Food_Deserts?.toLocaleString("en-US")}</span>
            )}
          />
          <Column
            title="Total Number of Households 2010"
            dataIndex="Total_Households_2010"
            key="Total_Households_2010"
            sorter={(a, b) => a.Total_Households_2010 - b.Total_Households_2010}
            render={(text, row) => (
              <span>{row.Total_Households_2010?.toLocaleString("en-US")}</span>
            )}
          />
          <Column
            title="Total Number of Households 2015"
            dataIndex="Total_Households_2015"
            key="Total_Households_2015"
            sorter={(a, b) => a.Total_Households_2015 - b.Total_Households_2015}
            render={(text, row) => (
              <span>{row.Total_Households_2015?.toLocaleString("en-US")}</span>
            )}
          />
          <Column
            title="Total Number of Households Receiving Food Stamps 2010"
            dataIndex="Households_Receiving_FoodStamps_2010"
            key="Households_Receiving_FoodStamps_2010"
            sorter={(a, b) =>
              a.Households_Receiving_FoodStamps_2010 -
              b.Households_Receiving_FoodStamps_2010
            }
            render={(text, row) => (
              <span>
                {row.Households_Receiving_FoodStamps_2010?.toLocaleString(
                  "en-US"
                )}
              </span>
            )}
          />
          <Column
            title="Total Number of Households Receiving Food Stamps 2015"
            dataIndex="Households_Receiving_FoodStamps_2015"
            key="Households_Receiving_FoodStamps_2015"
            sorter={(a, b) =>
              a.Households_Receiving_FoodStamps_2015 -
              b.Households_Receiving_FoodStamps_2015
            }
            render={(text, row) => (
              <span>
                {row.Households_Receiving_FoodStamps_2015?.toLocaleString(
                  "en-US"
                )}
              </span>
            )}
          />
        </Table>
        <Divider />

        {this.state.selectedCountyFDDetails ? (
          <div style={{ width: "70vw", margin: "0 auto", marginTop: "2vh" }}>
            <Breadcrumb>
              <BreadcrumbItem>
                <a href={`/states?state_name=${this.state.selectedState}`}>
                  {this.state.selectedState}
                </a>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                {this.state.selectedCounty}
              </BreadcrumbItem>
            </Breadcrumb>

            <Tabs
              defaultActiveKey="1"
              centered
              type="card"
              onChange={onChange}
              items={[
                {
                  label: `Food Desert Data`,
                  key: "1",
                  children: this.state.selectedCountyFDDetails ? (
                    <div
                      style={{
                        width: "70vw",
                        margin: "0 auto",
                        marginTop: "2vh",
                      }}
                    >
                      {console.log(this.state.selectedCountyFDDetails)}
                      <Card title="Food Desert Data ">
                        <CardBody>
                          <Row gutter="30" align="middle" justify="center">
                            <Col flex={2} style={{ textAlign: "left" }}>
                              <h3>Food Desert Data </h3>
                            </Col>
                            <Col flex={2} style={{ textAlign: "right" }}>
                              <h3>
                                {this.state.selectedCountyFDDetails.County}
                              </h3>
                              <h3>
                                {this.state.selectedCountyFDDetails.State}{" "}
                              </h3>
                            </Col>
                          </Row>
                          <Row align="left" justify="right">
                            <h5>
                              Total food desserts:{" "}
                              <span style={{ color: "#7FB069" }}>
                                {this.state.selectedCountyFDDetails.Total_Food_Deserts?.toLocaleString(
                                  "en-US"
                                )}{" "}
                              </span>
                            </h5>
                          </Row>
                          <br></br>
                          {/* <Row gutter="30" align="middle" justify="left">
                            {this.state.selectedCountyFDDetails.FD_County !=
                            null ? (
                              <Col flex={2} style={{ textAlign: "left" }}>
                                <h5 style={{ color: "red" }}>
                                  This is a Food Desert County.
                                </h5>
                              </Col>
                            ) : (
                              <Col flex={2} style={{ textAlign: "left" }}>
                                <h5 style={{ color: "#7FB069" }}>
                                  This is not a Food Desert County.
                                </h5>
                              </Col>
                            )}
                          </Row> */}
                          <br></br>

                          <Row gutter="30" align="middle" justify="left">
                            <Col flex={2} style={{ textAlign: "left" }}>
                              Percentage Urban Areas: <nbsp></nbsp>
                              <Progress
                                type="circle"
                                width={80}
                                percent={
                                  this.state.selectedCountyFDDetails
                                    .percent_urban
                                }
                                strokeColor={{
                                  "0%": "#e3eede",
                                  "100%": "#7FB069",
                                }}
                                style={{ marginRight: 10 }}
                              />
                            </Col>
                          </Row>
                          <br></br>
                          <br></br>

                          {/* Households within a county */}
                          <Row align="middle" justify="center">
                            <h4>Food Deserts: </h4>
                          </Row>
                          <Row gutter="30" align="left" justify="center">
                            <BarChart
                              data={{
                                labels: [
                                  "House Distances from Nearest Supermarket",
                                ],
                                datasets: [
                                  {
                                    label: "No Car 1/2 Mile from Supermarket",
                                    data: [
                                      this.state.selectedCountyFDDetails
                                        .no_car_half_M,
                                    ],
                                    backgroundColor: "#7FB069",
                                  },
                                  {
                                    label: "No Car 1 Miles from Supermarket",
                                    data: [
                                      this.state.selectedCountyFDDetails
                                        .no_car_1_M,
                                    ],
                                    backgroundColor: "#666A86",
                                  },
                                  {
                                    label: "No Car 10 Miles from Supermarket",
                                    data: [
                                      this.state.selectedCountyFDDetails
                                        .no_car_10_M,
                                    ],
                                    backgroundColor: "#EBE9E9",
                                  },
                                  {
                                    label: "No Car 20 Miles from Supermarket",
                                    data: [
                                      this.state.selectedCountyFDDetails
                                        .no_car_20_M,
                                    ],
                                    backgroundColor: "#333333",
                                  },
                                ],
                              }}
                            ></BarChart>
                          </Row>
                          <br />
                          <br />
                        </CardBody>
                      </Card>
                      <br></br>
                      <br></br>
                    </div>
                  ) : null,
                },
                // Demographic Data Card
                {
                  label: `Demographic Data`,
                  key: "2",
                  children: this.state.selectedCountyDemoDetails ? (
                    <div
                      style={{
                        width: "70vw",
                        margin: "0 auto",
                        marginTop: "2vh",
                      }}
                    >
                      {console.log(this.state.selectedCountyDemoDetails)}
                      <Card title="Demographic Data ">
                        <CardBody>
                          {/* Card Header */}
                          <Row gutter="30" align="middle" justify="center">
                            <Col flex={2} style={{ textAlign: "left" }}>
                              <h3>Demographic Data </h3>
                            </Col>
                            <Col flex={2} style={{ textAlign: "right" }}>
                              <h3>
                                {this.state.selectedCountyDemoDetails.County}
                              </h3>
                              <h3>
                                {this.state.selectedCountyDemoDetails.State}{" "}
                              </h3>
                            </Col>
                          </Row>
                          <br />
                          <Row align="left" justify="right">
                            <h5>
                              Total population of{" "}
                              <span style={{ color: "#7FB069" }}>
                                {this.state.selectedCountyDemoDetails.Population?.toLocaleString(
                                  "en-US"
                                )}{" "}
                              </span>
                            </h5>
                          </Row>
                          <Divider />
                          <br />

                          {/* Male and Female population distribution within a county */}
                          <Row align="middle" justify="center">
                            <h4>Gender Distribution: </h4>
                          </Row>
                          <Row gutter="30" align="middle" justify="center">
                            <DoughnutChart
                              data={{
                                labels: ["Male", "Female"],
                                datasets: [
                                  {
                                    label: "Total",
                                    data: [
                                      this.state.selectedCountyDemoDetails.male,
                                      this.state.selectedCountyDemoDetails
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

                          {/* Age distribution within a county */}
                          <Row align="middle" justify="center">
                            <h4>Age Distribution: </h4>
                          </Row>
                          <Row gutter="30" align="middle" justify="center">
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
                                      this.state.selectedCountyDemoDetails
                                        .age_0_9,
                                      this.state.selectedCountyDemoDetails
                                        .age_10_17,
                                      this.state.selectedCountyDemoDetails
                                        .age_18_29,
                                      this.state.selectedCountyDemoDetails
                                        .age_30_39,
                                      this.state.selectedCountyDemoDetails
                                        .age_40_49,
                                      this.state.selectedCountyDemoDetails
                                        .age_50_59,
                                      this.state.selectedCountyDemoDetails
                                        .age_60_69,
                                      this.state.selectedCountyDemoDetails
                                        .age_70_79 +
                                        this.state.selectedCountyDemoDetails
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
                          </Row>
                          <Divider />
                          <br />
                          <br />

                          {/* Households within a county */}
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
                                      this.state.selectedCountyDemoDetails
                                        .Total_Households_2010,
                                      this.state.selectedCountyDemoDetails
                                        .Total_Households_2015,
                                    ],
                                    backgroundColor: "#7FB069",
                                  },
                                  {
                                    label: "Households with members under 18",
                                    data: [
                                      this.state.selectedCountyDemoDetails
                                        .hh_18_under_2010,
                                      this.state.selectedCountyDemoDetails
                                        .hh_18_under_2015,
                                    ],
                                    backgroundColor: "#666A86",
                                  },
                                  {
                                    label: "Households with members over 60",
                                    data: [
                                      this.state.selectedCountyDemoDetails
                                        .hh_60_over_2010,
                                      this.state.selectedCountyDemoDetails
                                        .hh_60_over_2015,
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
                      <br />
                      <br />
                    </div>
                  ) : null,
                },

                // Income Data Card
                {
                  label: `Income Data`,
                  key: "3",
                  children: this.state.selectedCountyIncomeDetails ? (
                    <div
                      style={{
                        width: "70vw",
                        margin: "0 auto",
                        marginTop: "2vh",
                      }}
                    >
                      {console.log(this.state.selectedCountyIncomeDetails)}
                      <Card title="Income Data ">
                        <CardBody>
                          {/* Card Header */}
                          <Row gutter="30" align="middle" justify="center">
                            <Col flex={2} style={{ textAlign: "left" }}>
                              <h3>Income Data </h3>
                            </Col>
                            <Col flex={2} style={{ textAlign: "right" }}>
                              <h3>
                                {this.state.selectedCountyIncomeDetails.County}
                              </h3>
                              <h3>
                                {this.state.selectedCountyIncomeDetails.State}{" "}
                              </h3>
                            </Col>
                          </Row>
                          <br></br>
                          <br></br>

                          {/* Foodstamps within a county */}
                          <Row align="middle" justify="center">
                            <h4>Households and Food Assistance </h4>
                          </Row>
                          <Row gutter="30" align="left" justify="center">
                            <BarChart
                              data={{
                                labels: ["2010", "2015"],
                                datasets: [
                                  {
                                    label: "Total households",
                                    data: [
                                      this.state.selectedCountyDemoDetails
                                        .Total_Households_2010,
                                      this.state.selectedCountyDemoDetails
                                        .Total_Households_2015,
                                    ],
                                    backgroundColor: "#7FB069",
                                  },
                                  {
                                    label: "Households receiving foodstamps",
                                    data: [
                                      this.state.selectedCountyIncomeDetails
                                        .Households_Receiving_FoodStamps_2010,
                                      this.state.selectedCountyIncomeDetails
                                        .Households_Receiving_FoodStamps_2015,
                                    ],
                                    backgroundColor: "#666A86",
                                  },
                                  {
                                    label: "Households below poverty",
                                    data: [
                                      this.state.selectedCountyIncomeDetails
                                        .hh_below_pl_2010,
                                      this.state.selectedCountyIncomeDetails
                                        .hh_below_pl_2015,
                                    ],
                                    backgroundColor: "#EBE9E9",
                                  },
                                ],
                              }}
                            ></BarChart>
                          </Row>
                          <br></br>
                          <br></br>

                          {/* Income within a county */}
                          <Row align="middle" justify="center">
                            <h4>Income </h4>
                          </Row>
                          <Row gutter="30" align="middle" justify="left">
                            <Col flex={2} style={{ textAlign: "left" }}>
                              Avg Median Income:{" "}
                              <h5>
                                $
                                {this.state.selectedCountyIncomeDetails.avg_est_med_income_2010 != null ? (this.state.selectedCountyIncomeDetails.avg_est_med_income_2010?.toLocaleString(
                                  "en-US")) : (0)
                                }
                              </h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: "left" }}>
                              Avg Median Income:{" "}
                              <h5>
                                $
                                {this.state.selectedCountyIncomeDetails.avg_est_med_income_2015 != null ? (this.state.selectedCountyIncomeDetails.avg_est_med_income_2015?.toLocaleString(
                                  "en-US")) : (0)
                                }
                              </h5>
                            </Col>
                          </Row>
                          <br></br>
                          <Row gutter="30" align="middle" justify="left">
                            <Col flex={2} style={{ textAlign: "left" }}>
                              Avg Median Income Receiving Food Stamps:{" "}
                              <h5>
                                $
                                {this.state.selectedCountyIncomeDetails.avg_med_income_receiving_fs_2010 != null ? (this.state.selectedCountyIncomeDetails.avg_med_income_receiving_fs_2010?.toLocaleString(
                                  "en-US")) : (0)
                                }
                              </h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: "left" }}>
                              Avg Median Income Receiving Food Stamps:{" "}
                              <h5>
                                $
                                {this.state.selectedCountyIncomeDetails.avg_med_income_receiving_fs_2015 != null ? (this.state.selectedCountyIncomeDetails.avg_med_income_receiving_fs_2015?.toLocaleString(
                                  "en-US")) : (0)
                                }
                              </h5>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                      <br></br>
                      <br></br>
                    </div>
                  ) : null,
                },
              ]}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
export default Counties;
