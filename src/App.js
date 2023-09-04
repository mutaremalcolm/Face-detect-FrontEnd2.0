import './App.css';
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import ImageLinkform from './Components/ImageLinkForm/ImageLinkForm.js';
import Logo from './Components/Logo/Logo';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Rank from './Components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import clarifai from clarifai;
import React, { Component } from 'react';
import fetch from 'cross-fetch';

const app = new clarifai.App({
  apiKey: 'bbc3f9c5d7a847e2b22eb8fb55f7978e'
 });


const initialState = {
  input: '',
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: "", 
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }   
    };

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: "", 
        name: "",
        email: "",
        entries: 0,
        joined: ""
      }   
    };
    this.USER_ID = 'face-detection';
    }

    loadUser = (data) => {
      this.setState({user: {
        id: data.id, 
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
    }
  
  calculateFaceLocation = (data) =>  {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
 
  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict('face-detection', this.state.input)
    .then(response => {
      if (response) {
        fetch('https://facedetectappbe.onrender.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })  
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })

      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
}

onRouteChange = (route) => {
  if (route === 'signout'){
    this.setState(initialState)
  } else if (route === 'home') { 
    this.setState({isSignedIn: 'true'})
  }
  this.setState({route: route});
}

  render () {
    const { isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
      <div>...</div>
        <ParticlesBg className='particles' type="square" bg={true} />
      <Navigation isSignedIn={isSignedIn}onRouteChange={this.onRouteChange}/>
      {route === 'home' 
          ?
          <div>
          <Logo />
          <Rank
          name={this.state.user.name}
          entries={this.state.user.entries} 
          />
          <ImageLinkform 
      onInputChange = {this.onInputChange} onButtonSubmit ={this.onButtonSubmit}/>
      <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>
          :(
            route === 'signin' ?
            <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/> 
          )
          
          }
    </div>
  );
}
}
export default App;
