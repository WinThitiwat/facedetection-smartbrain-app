import React from 'react';
import { 
  Dropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem 
} from 'reactstrap';

import './ProfileIcon.css';

class ProfileIcon extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      dropdownOpen: false
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  onSignoutSubmit = () => {
    const token = window.sessionStorage.getItem('token');
    // fetch('http://localhost:3000/signout', {
      fetch('https://facedetection-smartbrain-app.herokuapp.com/signout', {
        method:'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // user: this.props.user
          'Authorization': token
        })
    })
    .then(response => response.json())
    .then(result => {
      if (result.signoutSuccess === 'true')
        window.sessionStorage.removeItem('token')
        this.props.onRouteChange('signout');
    })
    .catch(console.log)
  }


  render(){
    return(
      <div className="pa4 tc">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle
            tag="span" 
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
          >
            <img
              src="http://tachyons.io/img/logo.jpg"
              className="br-100 ba h3 w3 dib" alt="avatar"
              />
          </DropdownToggle>
          <DropdownMenu 
            className="b--transparent shadow-5"
            style={{marginTop: '20px', backgroundColor: 'rgba(255,255,255,0.5)'}}  
            right
          >
            <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
            <DropdownItem onClick={this.onSignoutSubmit}>Sign Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
}

export default ProfileIcon;