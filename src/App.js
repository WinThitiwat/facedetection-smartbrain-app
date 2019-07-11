import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';

// setting background attributes for particle.js
// further info -> https://vincentgarreau.com/particles.js/
const particlesOptions={
  particles: {
    number:{
      value: 150,
      density:{
        enable: true,
        value_area: 800
      }
    },
    move:{
      enable: true,
      speed:10
    }
  }
}

// initial state for every user who just opens the page
// this will ensure that whenever previous person logout,
// - the next person will not see the previous person activity include the images they search
const initialState = {
  input:"",
  imageUrl:'',
  boxes:[],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: ''
  }
}

class App extends Component {
  constructor(){
    super()
    this.state = initialState
  }

  componentDidMount() {
    // if user refresh the web, we will keep the user signed in if he/she has token
    const token = window.sessionStorage.getItem('token');
    if (token) {
      // fetch('http://localhost:3000/signin', {
      fetch('https://facedetection-smartbrain-app.herokuapp.com/signin', {
        method: 'post',
        headers: {
          'Content-Type':'application/json',
          'Authorization': token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if (data && data.id) {
          // fetch(`http://localhost:3000/profile/${data.id}`, {
          fetch(`https://facedetection-smartbrain-app.herokuapp.com/profile/${data.id}`, {
            method: 'get',
            headers: {
              'Content-Type':'application/json',
              'Authorization': token
            }
          })
          .then(resp => resp.json())
          .then(user => {
            if (user && user.email) {
              this.loadUser(user)
              this.onRouteChange('home');
            }
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    } else{
      return
    }
  }

  // load user's info to homepage to display user's relevant info
  loadUser= (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined

      }
    })
  }

  // capture the location of the face
  calculateFaceLocations = (data) => {
    if (data && data.outputs){
      return data.outputs[0].data.regions.map(face => {
        const clarifaiFace = face.region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height),
        }

      });
    }
    return;
  }

  // to draw a square that capture a user given human's face
  displayFaceBoxes = (boxes) => {
    if (boxes) {
      this.setState({boxes:boxes})
    }
  }

  // listen to user's input in the text bar and set the input's state to the input
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  // image processing and user's update
  onPictureSubmit = () => {
    // update user's input state and send the input to server to get the result
    this.setState({imageUrl:this.state.input});
    // fetch('http://localhost:3000/imageurl', {
    fetch('https://facedetection-smartbrain-app.herokuapp.com/imageurl', {
      method:'post',
      headers: {
        'Content-Type':'application/json',
        'Authorization': window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())

    // update number of entries for the current user id
    .then(response => {
      if (response){
        // fetch('http://localhost:3000/image', {
          fetch('https://facedetection-smartbrain-app.herokuapp.com/image', {
            method:'put',
            headers: {
              'Content-Type':'application/json',
              'Authorization': window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
        .then(response => response.json())
        // set number of entries for the current user
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      }

    // display a box captures the face
    this.displayFaceBoxes(this.calculateFaceLocations(response))
    })
    .catch(err => console.log(err));
  }

  // check if user is signed in or signed out
  onRouteChange = (route) => {
    if (route === 'signout'){
      return this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }));
  }

  render(){
    const {isSignedIn, imageUrl, route, boxes, isProfileOpen} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
         params={particlesOptions} />

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal} user={this.state.user}
        />
        {isProfileOpen &&
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              user={this.state.user}/>
          </Modal>
          }
        {
          // check if the route is for homepage. If it is, then display the homepage components
          route === "home"
          ?
          <div>
            <Logo/>
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}/>
            <FaceRecognition
              boxes={boxes}
              imageUrl={imageUrl}/>
          </div>
          :
          (
            // if the route is for signin page, then display signin components
            route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
