import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import firebase from '../firebase';
import HeaderCss from '../Style/Header.module.css';

function Header() {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    firebase.auth().signOut();
    return alert('You have been logged out successfully.');
  }

  return (
    <div>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="/">Online-Market</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav.Link className={HeaderCss.btn} as={Link} to="/">Home</Nav.Link>
            <Nav.Link className={HeaderCss.btn} as={Link} to="/upload">Upload</Nav.Link>
          </Navbar.Collapse>
          <Navbar.Collapse className='justify-content-end'>
            {user.accessToken ?
            <>
              <Nav.Link className={HeaderCss.btn} as={Link} to="/login" onClick={() => {logoutHandler()}}>Logout</Nav.Link>
            </> :
            <Nav.Link className={HeaderCss.btn} as={Link} to="/login">Login</Nav.Link> }
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;