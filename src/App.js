import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
// import Clarifai from 'clarifai';

// const app = new Clarifai.App({
//   apiKey: '851885a104204a2191f730b890d7e6bf'
// });
const returnClarifaiRequestOptions = (imageUrl) =>{
  const PAT = '851885a104204a2191f730b890d7e6bf';
  const USER_ID = 'nzxs15syr1vg';       
  const APP_ID = 'Myfirstapplication';
  // const MODEL_ID = 'face-detection';    
  const IMAGE_URL = imageUrl;
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions
}

      // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
      // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
      // this will default to the latest version_id
const initialState = {
  input: '',
  imageUrl:'',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
      id: '',
      name : '',
      email: '',
      entries: 0,
      joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState
  }

  loadUser = (data) =>{
    this.setState({user: {
      id: data.id,
      name : data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box : box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});    
    // app.models.predict('face-detection', this.state.input)
    fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, returnClarifaiRequestOptions(this.state.input))
      .then(response => response.json())
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
    fetch('https://smart-brain-vss4.onrender.com/image', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.state.user.id,
      })
    })
      .then(response => response.json())
      .then(entryCount => {
        // Update the user's entry count in the state
        this.setState(Object.assign(this.state.user, { entries: entryCount }));
      })
      .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={{position: "fixed", zIndex: -1, top: 0, left: 0, right: 0, bottom: 0}} />
        <Navigation isSignedIn={this.state.isSignedIn}onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home'
          ? <div>
              <Logo />   
              <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div>
          :(
            this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }      
      </div>
    );
  }
}

export default App;
