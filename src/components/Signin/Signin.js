import React from 'react';
import './Signin.css';

class Signin extends React.Component {
  constructor(props){
    super()
    this.state={
      signInEmail:'',
      signInPassword:''
    }
  }

  // get email input value
  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }
  // get password input value
  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  // save token to end-user's browser to keep session running
  saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  }

  // request to let server check user's email and password
  onSubmitSignIn = () => {
    // fetch('http://localhost:3000/signin', {
    fetch('https://facedetection-smartbrain-app.herokuapp.com/signin', {
      method:'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response=>response.json())
      .then(data => {
        // if user's email and password correct, then load his/her data to the app
        if (data.userId && data.success === 'true'){
          this.saveAuthTokenInSession(data.token)
          // fetch(`http://localhost:3000/profile/${data.userId}`, {
          fetch(`https://facedetection-smartbrain-app.herokuapp.com/profile/${data.userId}`, {
            method: 'get',
            headers: {
              'Content-Type':'application/json',
              'Authorization': data.token
            }
          })
          .then(resp => resp.json())
          .then(user => {
            if (user && user.email) {
              this.props.loadUser(user)
              this.props.onRouteChange('home');
            }
          })
        }
      })    
      .catch(console.log)
  } 

  render(){
    const {onRouteChange} = this.props;
    return(
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input 
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
                  type="email" 
                  name="email-address"  
                  id="email-address"
                  onChange={this.onEmailChange}
                  />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input 
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black" 
                  type="password" 
                  name="password"  
                  id="password"
                  onChange={this.onPasswordChange}
                  />
              </div>
            </fieldset>
            <div className="">
              <input
              onClick={this.onSubmitSignIn} 
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
              type="submit" 
              value="Sign in"/>
            </div>
            <div className="lh-copy mt3">
              <p onClick={()=>onRouteChange('register')} href="#0" className="f6 link dim black db pointer">Register</p>
            </div>
          </div>
        </main>
      </article>
    );    
  }
}

export default Signin;
