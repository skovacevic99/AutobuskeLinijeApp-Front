import React, { Component } from 'react';
import {Button, Col, Row, Form} from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class IzmenaLinije extends Component {

    state = {
        brojMesta: "",
        cenaKarte: "",
        destinacija: "",
        vremePolaska: "",
        prevoznikId: -1,
        prevoznici: []
    }

    componentDidMount(){
        this.getLinija();
        this.getPrevoznici();
    }

    getPrevoznici(){
        TestAxios.get("/prevoznici")
            .then(res => {
                this.setState({
                    prevoznici: res.data
                })
            })
            .catch(error => {
                console.log(error)
                alert("Neuspesno dobavljanje prevoznika.")
            })
    }

    getLinija(){
        let id = this.props.match.params.id

        TestAxios.get("/linije/" + id)
            .then(res => {
                this.setState({
                    brojMesta: res.data.brojMesta,
                    cenaKarte: res.data.cenaKarte,
                    destinacija: res.data.destinacija,
                    vremePolaska: res.data.vremePolaska,
                    prevoznikId: res.data.prevoznikId
                })
            })
            .catch(error => {
                console.log(error)
                alert("Neuspesno dobavljanje linije.")
            })
    }

    proveraInputPolja(){
        if(this.state.brojMesta != "" && this.state.cenaKarte != "" && this.state.destinacija != "" && this.state.vremePolaska != ""
            && this.state.prevoznikId != -1){
                return true
            } else {
                return false
            }
    }

    izmeni(){

        if(this.proveraInputPolja() == true){
            let id = this.props.match.params.id
            let params = {
                id: id,
                brojMesta: this.state.brojMesta,
                cenaKarte: this.state.cenaKarte,
                destinacija: this.state.destinacija,
                vremePolaska: this.state.vremePolaska,
                prevoznikId: this.state.prevoznikId
            }
    
            TestAxios.put("/linije/" + id, params)
                .then(res => {
                    alert("Uspesna izmena")
                    this.props.history.push("/linije")
                })
                .catch(error => {
                    console.log(error)
                    alert("Neuspensa izmena")
                })
        } else {
            alert("Niste uneli sva polja!")
        }   
    }

    onInputChange(e) {
        let name = e.target.name
        let value = e.target.value

        let create = {}
        create[name] = value
        this.setState(create)
    }

    render() {
        return (
            <div>
                <h3>Izmena linija</h3>

                <Row>
                    <Col md={8}>
                        <Form>
                            <Form.Group>
                                <Form.Label>Broj mesta</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    value={this.state.brojMesta}
                                    name="brojMesta"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Cena karte</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    value={this.state.cenaKarte}
                                    name="cenaKarte"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Destinacija</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    value={this.state.destinacija}
                                    name="destinacija"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Vreme polaska</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    value={this.state.vremePolaska}
                                    name="vremePolaska"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Prevoznik</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="prevoznikId"
                                    value={this.state.prevoznikId}
                                    onChange={(e) => this.onInputChange(e)}>
                                        <option value={-1}></option>
                                        {this.state.prevoznici.map(prevoznik => {
                                            return(
                                                <option key={prevoznik.id} value={prevoznik.id}>{prevoznik.naziv}</option>
                                            )
                                        })}

                                </Form.Control>
                            </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={() => this.izmeni()}>Dodaj</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default IzmenaLinije;