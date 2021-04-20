import React from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import Login from './components/authorization/Login';
import IzmenaLinije from './components/linije/IzmenaLinije';
import Linije from './components/linije/Linije';
import Home from './Home';
import NotFound from './NotFound';
import {logout} from './services/auth';

class App extends React.Component {

    render() {

        const jwt = window.localStorage['jwt'];

        if(jwt){
            return (    
                <div>
                    <Router>
                        <Navbar expand bg="dark" variant="dark">
                            <Navbar.Brand as={Link} to="/">
                                JWD
                            </Navbar.Brand>
                            <Nav>
                                <Nav.Link as={Link} to="/linije">
                                    Linije
                                </Nav.Link>
                                <Button style={{right: '10px', position: 'absolute'}} onClick={() => logout()}>Logout</Button>
                            </Nav>
                        </Navbar>
                        <Container style={{paddingTop: "25px"}}>
                            <Switch>
                                <Route exact path="/" component = {Home} />
                                <Route exact path="/login" component = {Login} />
                                <Route exact path="/linije" component = {Linije}/>
                                <Route exact path="/linije/izmena/:id" component = {IzmenaLinije}/>
                                <Route component = {NotFound} />
                            </Switch>
                        </Container>
                    </Router>
                </div>
             );
         } else {
            return (
                <Container>
                    <Router>   
                        <Switch>
                            <Route exact path="/login" component = {Login} />
                            <Route render={() => <Redirect to ="/login"/>}/>
                        </Switch>
                    </Router>
                </Container>
             );
         }
    }
}

ReactDOM.render(
    <App/>,
    document.querySelector("#root")
);