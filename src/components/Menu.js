import React, {useContext} from 'react';
import {Nav, Navbar, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {AuthContext} from '../providers/AuthProvider';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSync} from '@fortawesome/free-solid-svg-icons';

export default function Menu() {
  const {setRefresh} = useContext(AuthContext);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link className="nav-link" to="/">
            <img src="./icon-192x192.png" width="30px" className="logo" alt="logo" />
            Helium Tools
          </Link>
        </Navbar.Brand>
        <Nav.Item>
          <span className="nav-link sync" onClick={() => setRefresh(new Date().toISOString())}>
            <FontAwesomeIcon icon={faSync} />
          </span>
        </Nav.Item>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>

          <Nav.Item>
            <Link className="nav-link" to="/rewards">
              Rewards
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/compare">
              Compare
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/nearby">
              Nearby
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/settings">
              Settings
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/about">
              About
            </Link>
          </Nav.Item>
          <Nav.Item>
            <a target="_blank" className="nav-link" href="https://status.helium.com/?utm_source=embed" rel="noreferrer">
              Status
            </a>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/donate">
              Donate
            </Link>
          </Nav.Item>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
