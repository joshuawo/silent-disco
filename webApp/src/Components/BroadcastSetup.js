import React from 'react';
import TextField from '../../node_modules/material-ui/lib/text-field';
import RaisedButton from '../../node_modules/material-ui/lib/raised-button';
import FontIcon from '../../node_modules/material-ui/lib/font-icon';
import DropDownMenu from '../../node_modules/material-ui/lib/DropDownMenu';
import MenuItem from '../../node_modules/material-ui/lib/menus/menu-item';
import Card from '../../node_modules/material-ui/lib/card/card';
import CardText from '../../node_modules/material-ui/lib/card/card-text';
import CardTitle from '../../node_modules/material-ui/lib/card/card-title';
import { History } from 'react-router';
import reactMixin from 'react-mixin';
import $ from '../../public/js/jquery-1.11.1.min';
import Loading from './Loading.js';
import Auth from '../utils/Auth';


class BroadcastSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: (new Date).getTime().toString() + Math.random().toFixed(2),
      broadcaster: 'anonymous',
      desc: 'Hi, I\'m anonymous and you\'re listening to QuantumRadio',
      isInitializing: false,
      isLoggedIn: false,
      isLive: "AUX",
      favorites: [],
      isLoading: false
    };
  }

  stationNameInput(event, index, value) {
    this.setState({
      name: event.target.value
    });
  }

  stationLiveInput(event, index, value) {
    this.setState({
      isLive: value
    });
  }

  stationDescriptionInput(event, index, value) {
    this.setState({
      desc: event.target.value
    });
  }

  startBroadcast() {
    var serverURL = "http://localhost:3000/api/stream";

    this.setState({
      isLoading: true
    })

    $.ajax({
        url: serverURL,
        method: 'POST',
        contentType: "application/x-www-form-urlencoded",
        data: {
          name: this.state.name,
          creator: JSON.parse(localStorage.getItem("me")),
          desc: this.state.desc,
          lng: 40,
          lat: 30
        }
      })
      .done((responseData) => {
        this.setState({
          isLoading: false
        })
        this.props.history.push({
          pathname: '/broadcast/'+responseData._id,
          state: {
            streamId: responseData._id,
            isLive: this.state.isLive
          }
        });
      });

  }


  render() {
    return (
      <div>
        <Card style={styles.cardContainer}>
          <CardTitle>
            Tell Us About Your Stream
          </CardTitle>
          <CardText>
            <TextField 
              onChange={this.stationNameInput.bind(this)}
              hintText="Stream Name"
              floatingLabelText="Stream Name"
            /><br/>
            <TextField 
              onChange={this.stationDescriptionInput.bind(this)}
              hintText="Description"
              floatingLabelText="Description"
            /><br/><br/>
            <DropDownMenu value={this.state.isLive} onChange={this.stationLiveInput.bind(this)}>
              <MenuItem value={"AUX"} primaryText="AUX or Microphone"/>
              <MenuItem value={"SC"} primaryText="SoundCloud"/>
            </DropDownMenu><br/><br/>
            <RaisedButton 
              primary={true} 
              onClick={this.startBroadcast.bind(this)} 
              label="Start Broadcasting"
              icon={<FontIcon className="fa fa-microphone"/>}
            />
          </CardText>
        </Card>
      </div>
    )
  } 
}

var styles = {

  cardContainer:{
    'display': 'flex',
    'flexDirection':'row',
    'flexWrap': 'wrap',
    alignItem:'center',
    justifyContent:'center'
  },

  box: {
    'flexGrow':1,
  },

  title:{
    'fontFamily':'Roboto, sans-serif'
  }
}

reactMixin.onClass(BroadcastSetup, History);


export default BroadcastSetup;
