import Navigation from "../components/Navigation.jsx";
import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,
    Slider,
    Rate 
} from 'antd'

import SliderMarks from 'antd/es/slider';

//import { RadarChart } from 'react-vis';
import { format } from 'd3-format';


//import MenuBar from '../components/MenuBar';
import { getCountySearch, getCountyData, getAllCounties } from '../fetcher'
const wideFormat = format('.3r');
const { Column, ColumnGroup } = Table;
const popMarks = { // :SliderMarks
    0: '0',
    2000000: '2 Mil',
    4000000: '4 Mil',
    6000000: '6 Mil',
    8000000: '8 Mil',
    10000000: {
      style: {
        color: 'blue',
      },
      label: <strong>10</strong>,
    },
  };

  const fdMarks = { //: SliderMarks
    0: '0',
    20000: '20K',
    40000: '40K',
    60000: '60K',
    86500: {
      style: {
        color: 'blue',
      },
      label: <strong>86.5</strong>,
    },
  };


class Counties extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            countyQuery: "",
            stateQuery: "",
            popMaxQuery: 10000000,
            popMinQuery: 0,
            fdMaxQuery: 86500,
            fdMinQuery: 0,
            selectedState: "Alabama", //Alabama
            selectedCounty: "Autauga County", //Autauga County
            selectedCountyFDDetails: null,
            selectedCountyDemoDetails: null,
            selectedCountyIncomeDetails: null,
            countiesResults: []

        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleCountyQueryChange = this.handleCountyQueryChange.bind(this)
        this.handleStateQueryChange = this.handleStateQueryChange.bind(this)
        this.handlePopulationChange = this.handlePopulationChange.bind(this)
        this.handleFDChange = this.handleFDChange.bind(this)
        this.goToCounty = this.goToCounty.bind(this)
       
    }

    handleCountyQueryChange(event) {
        this.setState({ countyQuery: event.target.value })
    }

    handleStateQueryChange(event) {
        this.setState({ stateQuery: event.target.value })
    }

    handlePopulationChange(value) {
        this.setState({ popMinQuery: value[0] })
        this.setState({ popMaxQuery: value[1] })
    }

    handleFDChange(value) {
        this.setState({ fdMinQuery: value[0] })
        this.setState({ fdMaxQuery: value[1] })
    }

    goToCounty(county, state) {
        
        this.setState({selectedCounty: county})
        this.setState({selectedState: state})
        //useEffect(() => { }, []);
        getCountyData(this.state.selectedCounty, this.state.selectedState).then(res => {
            console.log(res.results)
            this.setState({ selectedCountyFDDetails: res.fd_result[0] })
            this.setState({ selectedCountyDemoDetails: res.demo_result[0] })
            this.setState({ selectedCountyIncomeDetails: res.income_result[0]})
        })
     
    }


    updateSearchResults() {
        getCountySearch(this.state.countyQuery, this.state.stateQuery,this.state.popMinQuery,this.state.popMaxQuery, this.state.fdMinQuery,  this.state.fdMaxQuery,  null, null).then(res => {
            this.setState({ countiesResults: res.results })
        })
    }


    componentDidMount() {
        getAllCounties(null, null).then(res => {
            this.setState({ countiesResults: res.results })
        })

        getCountySearch(this.state.countyQuery, this.state.stateQuery, this.state.popMinQuery,this.state.popMaxQuery, this.state.fdMinQuery, this.state.fdMaxQuery,  null, null).then(res => {
            this.setState({ countiesResults: res.results })
        })

        getCountyData(this.state.selectedCounty, this.state.selectedState).then(res => { 
            console.log(res.results)
            this.setState({ selectedCountyFDDetails: res.fd_result[0] })
            this.setState({ selectedCountyDemoDetails: res.demo_result[0] })
            this.setState({ selectedCountyIncomeDetails: res.income_result[0]})
        })
    }

// export default function Counties() {
//   return (
//     <div className="Counties">
//       <Navigation />
//       <header className="Counties">
//         <h1>Find your county</h1>
//         <p>Information on Counties here</p>
//       </header>
//     </div>
//   );
// }


    render() {
        return (

          <div className="Counties">
             <Navigation />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>County</label>
                            <FormInput placeholder="County" value={this.state.countyQuery} onChange={this.handleCountyQueryChange} />
                        </FormGroup></Col>

                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>State</label>
                            <FormInput placeholder="State" value={this.state.stateQuery} onChange={this.handleStateQueryChange} />
                        </FormGroup></Col>

                    </Row>
                    <br></br>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Population</label>
                            <Slider range marks={popMarks} defaultValue={[0, 10000000]} max={10000000} onChange={this.handlePopulationChange} />

                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Number of Food Desserts</label>
                            <Slider range marks={fdMarks} defaultValue={[0, 86500]}  max={86500} onChange={this.handleFDChange} />

                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>


                </Form>
                <Divider style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} />
                    <h3>Counties</h3>
                  <Table onRow={(record, rowIndex) => {
                        return { 
                        onClick: event => {this.goToCounty(record.County, record.State)},}; //columns={countyColumns}
                     }} dataSource={this.state.countiesResults}  pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                        <ColumnGroup >
                            <Column title= 'County' dataIndex= 'County' key= 'County' sorter = {(a, b) => a.County.localeCompare(b.County)} />
                            <Column title=  'State'  dataIndex= 'State' key= 'State' sorter= {(a, b) => a.State.localeCompare(b.State)}/>
                            <Column title=  'Population' dataIndex= 'Population' key= 'Population' sorter= {(a, b) => a.Population - b.Population}/>
                            <Column title=  'Total Number of Food Deserts' dataIndex= 'Total_Food_Deserts' key= 'Total_Food_Deserts' sorter= {(a, b) => a.Total_Food_Deserts - b.Total_Food_Deserts} />
                            <Column title=  'Total Number of Households 2010' dataIndex= 'Total_Households_2010' key= 'Total_Households_2010'sorter={(a, b) => a.Total_Households_2010 - b.Total_Households_2010} />
                            <Column title=  'Total Number of Households 2015' dataIndex= 'Total_Households_2015' key= 'Total_Households_2015' sorter= {(a, b) => a.Total_Households_2015 - b.Total_Households_2015} />
                            <Column title=  'Total Number of Households Receiving Food Stamps 2010' dataIndex= 'Households_Receiving_FoodStamps_2010' key= 'Households_Receiving_FoodStamps_2010' sorter= {(a, b) => a.Households_Receiving_FoodStamps_2010 - b.Households_Receiving_FoodStamps_2010} />
                            <Column title=  'Total Number of Households Receiving Food Stamps 2015' dataIndex = 'Households_Receiving_FoodStamps_2015' key= 'Households_Receiving_FoodStamps_2015' sorter= {(a, b) => a.Households_Receiving_FoodStamps_2015 - b.Households_Receiving_FoodStamps_2015} />
                        </ColumnGroup>
                
                  </Table>
                
                  <Divider />

                {this.state.selectedCountyFDDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card title ="Food Dessert Data ">
                        <CardBody>
                            
                        <Row gutter='30' align='middle' justify='center'>
                        <Col flex={2} style={{ textAlign: 'left' }}>
                            <h3 >Food Dessert Data </h3></Col>
                            <Col flex={2} style={{ textAlign: 'right' }}>
                            <h3>{this.state.selectedCountyFDDetails.County}</h3>
                            <h3>{this.state.selectedCountyFDDetails.State} </h3>

                            </Col>
                            </Row>
                            <br>
                            </br>
                        
                            <Row gutter='30' align='middle' justify='left'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                               Total # of Food Desserts: <h5>{this.state.selectedCountyFDDetails.Total_Food_Deserts}</h5>
                                </Col>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                No Car 1/2 Miles:  <h5>{this.state.selectedCountyFDDetails.no_car_half_M}</h5>
                                </Col>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                No Car 1 Miles: <h5>{this.state.selectedCountyFDDetails.no_car_1_M}</h5>
                                </Col>
                            </Row>
                            <br>
                            </br>
                            <Row gutter='30' align='middle' justify='left'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                                Percentage Urban Areas: <h5>{this.state.selectedCountyFDDetails.percent_urban}</h5>
                                </Col>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                No Car 10 Miles: <h5>{this.state.selectedCountyFDDetails.no_car_10_M}</h5>
                                </Col>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                No Car 20 Miles: <h5>{this.state.selectedCountyFDDetails.no_car_20_M}</h5>
                                </Col>
                        
                                /*<Col flex={2} style={{ textAlign: 'right' }}>{this.state.selectedCountyFDDetails.FD_County}</Col>*/
                                

                    </Row>
                    </CardBody>

                </Card>
                <br>
                        </br>
            </div> : null}
            {this.state.selectedCountyDemoDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                <Card title ="Demographic Data ">
                    <CardBody>
                    <Row gutter='30' align='middle' justify='center'>
                    <Col flex={2} style={{ textAlign: 'left' }}>
                        <h3 >Demographic Data </h3></Col>
                        <Col flex={2} style={{ textAlign: 'right' }}>
                        <h3>{this.state.selectedCountyDemoDetails.County}</h3>
                        <h3>{this.state.selectedCountyDemoDetails.State} </h3>

                        </Col>
                        </Row>

                        <br>
                        </br>
                    
                        <Row gutter='30' align='middle' justify='left'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                           Population: <h5>{this.state.selectedCountyDemoDetails.Population}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                           Men: <h5>{this.state.selectedCountyDemoDetails.male}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                           Women: <h5>{this.state.selectedCountyDemoDetails.female}</h5>
                            </Col>
                        </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'>
                        <Col flex={2} style={{ textAlign: 'left' }}>
                        Age 0-9: <h5>{this.state.selectedCountyDemoDetails.age_0_9}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Age 10-17: <h5>{this.state.selectedCountyDemoDetails.age_10_17}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Age 18-29: <h5>{this.state.selectedCountyDemoDetails.age_18_29}</h5>
                            </Col>
                            
                    
                        </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'>
        
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Age 30-39: <h5>{this.state.selectedCountyDemoDetails.age_30_39}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Age 40-49: <h5>{this.state.selectedCountyDemoDetails.age_40_49}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Age 50-59: <h5>{this.state.selectedCountyDemoDetails.age_50_59}</h5>
                            </Col>
                    
                        </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'>
                        
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Age 60-69: <h5>{this.state.selectedCountyDemoDetails.age_60_69}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Age 70-79: <h5>{this.state.selectedCountyDemoDetails.age_70_79}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Age 80 plus: <h5>{this.state.selectedCountyDemoDetails.age_80_plus}</h5>
                            </Col>
                        </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'>
                            
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Total # of Households 2010:  <h5>{this.state.selectedCountyDemoDetails.Total_Households_2010}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Total # of Households 2015: <h5>{this.state.selectedCountyDemoDetails.Total_Households_2015}</h5>
                            </Col >
                           
                        </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'>
                        <Col flex={2} style={{ textAlign: 'left' }}>
                        Households with member 18 & under 2010: <h5>{this.state.selectedCountyDemoDetails.hh_18_under_2010}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Households with member 18 & under 2015: <h5>{this.state.selectedCountyDemoDetails.hh_18_under_2015}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Households with member 60 & over 2010: <h5>{this.state.selectedCountyDemoDetails.hh_60_over_2010}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Households with member 60 & over 2015: <h5>{this.state.selectedCountyDemoDetails.hh_60_over_2015}</h5>
                            </Col>
                        </Row>
                    </CardBody>

                </Card>
                <br>
                        </br>
            </div> : null}
            {this.state.selectedCountyIncomeDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                <Card title ="Income Data ">
                    <CardBody>
                        <Row gutter='30' align='middle' justify='center'>
                    <Col flex={2} style={{ textAlign: 'left' }}>
                        <h3 >Income Data </h3></Col>
                        <Col flex={2} style={{ textAlign: 'right' }}>
                        <h3>{this.state.selectedCountyIncomeDetails.County}</h3>
                        <h3>{this.state.selectedCountyIncomeDetails.State} </h3>

                        </Col>
                        </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Total # of Households 2010:  <h5>{this.state.selectedCountyIncomeDetails.Total_Households_2010}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Total # of Households 2015: <h5>{this.state.selectedCountyIncomeDetails.Total_Households_2015}</h5>
                            </Col>
                            </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'>
                          
                        <Col flex={2} style={{ textAlign: 'left' }}>
                            # of Households Receiving Food Stamps 2010: <h5>{this.state.selectedCountyIncomeDetails.Households_Receiving_FoodStamps_2010}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            # of Households Receiving Food Stamps 2015: <h5>{this.state.selectedCountyIncomeDetails.Households_Receiving_FoodStamps_2015}</h5>
                            </Col>
                        </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'>
                        <Col flex={2} style={{ textAlign: 'left' }}>
                        Avg Median Income 2010: <h5>{this.state.selectedCountyIncomeDetails.avg_est_med_income_2010}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Avg Median Income 2015: <h5>{this.state.selectedCountyIncomeDetails.avg_est_med_income_2015}</h5>
                            </Col>
            
                             </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'> 
                        <Col flex={2} style={{ textAlign: 'left' }}>
                            Avg Median Income Receiving Food Stamps 2010: <h5>{this.state.selectedCountyIncomeDetails.avg_med_income_receiving_fs_2010}</h5>
                            </Col>
                            
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            Avg Median Income Receiving Food Stamps 2015: <h5>{this.state.selectedCountyIncomeDetails.avg_med_income_receiving_fs_2015}</h5>
                            </Col>   
                        </Row>
                        <br>
                        </br>
                        <Row gutter='30' align='middle' justify='left'> 
                        <Col flex={2} style={{ textAlign: 'left' }}>
                            # Households Below Poverty Level 2010: <h5>{this.state.selectedCountyIncomeDetails.hh_below_pl_2010}</h5>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            # Households Below Poverty Level 2015: <h5>{this.state.selectedCountyIncomeDetails.hh_below_pl_2015}</h5>
                            </Col>
                    
                        </Row>
    
                    </CardBody>

                </Card>
                <br>
                        </br>
            </div> : null}
        </div>
    )
}
}

export default Counties


{/*import React from "react";
import Navigation from "../components/Navigation.jsx";

export default function Counties() {
  return (
    <div className="Counties">
      <Navigation />
      <header className="Counties">
        <h1>Find your county</h1>
        <p>Information on Counties here</p>
      </header>
    </div>
  );
}*/}
