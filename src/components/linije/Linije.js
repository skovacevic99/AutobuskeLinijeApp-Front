import React, { Component } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import TestAxios from '../../apis/TestAxios';

class Linije extends Component {

    constructor(props){
        super(props)

        let create = {
            brojMesta: "",
            cenaKarte: "",
            destinacija: "",
            vremePolaska: "",
            prevoznikId: -1
        }

        let search = {
            destinacija: "",
            maksCena: "",
            prevoznikId: -1
        }

        this.state = {
            linije: [],
            prevoznici: [],
            pageNo: 0,
            totalPages: 1,
            create: create,
            search: search
        }
    }

    componentDidMount(){
        this.getLinije(0);
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

    getLinije(newPageNo){
        
        let config = {
            params : {
                pageNo: newPageNo
            }
        }

        if(this.state.search.destinacija != ""){
            config.params["destinacija"] = this.state.search.destinacija
        }
        if(this.state.search.prevoznikId != -1){
            config.params["prevoznikId"] = this.state.search.prevoznikId
        }
        if(this.state.search.maksCena != ""){
            config.params["maksCena"] = this.state.search.maksCena
        }

        console.log(config.params)

        TestAxios.get("/linije", config)
            .then(res => {
                this.setState({
                    linije: res.data,
                    pageNo: newPageNo,
                    totalPages: res.headers['total-pages']
                })
            })
            .catch(error => {
                console.log(error)
                alert('Neuspesno dobavljanje Linija.')
            })
    }

    renderTable(){
        return this.state.linije.map(linija => {
            return(
                <tr key={linija.id}>
                    <td>{linija.prevoznikNaziv}</td>
                    <td>{linija.destinacija}</td>
                    <td>{linija.brojMesta}</td>
                    <td>{linija.vremePolaska}</td>
                    <td>{linija.cenaKarte}</td>
                    <td><Button variant="primary" onClick={() => this.rezervisi(linija.id)}>Rezervisi</Button></td>
                    <td><Button variant="warning" onClick={() => this.idiNaIzmenu(linija.id)}>Izmeni</Button></td>
                    <td><Button variant="danger" onClick={() => this.obrisi(linija.id)}>Obrisi</Button></td>
                </tr>
            )
        })
    }

    rezervisi(id){
        TestAxios.put("/linije/rezervacije/" + id)
            .then(res => {
                alert("Uspesna rezervacija!")
                this.getLinije(0);
            })
            .catch(error => {
                console.log(error)
                alert("Neuspesna rezervacija!")
            })
    }

    obrisi(id) {
        TestAxios.delete("/linije/" + id)
            .then(res => {
                this.obrisiIzState(id)
            })
            .catch(error => {
                console.log(error)
                alert("Greska prilikom brisanja!")
            })
    }

    obrisiIzState(id){
        let linije = this.state.linije

        for(var i in linije){
            if(linije[i].id == id){
                linije.splice(i, 1)
            }
        }
        this.setState({linije: linije})
    }

    idiNaIzmenu(id){
        this.props.history.push("/linije/izmena/" + id)
    }

    onInputChange(e) {
        let name = e.target.name
        let value = e.target.value

        let create = this.state.create
        create[name] = value
        this.setState(create)
    }

    dodajLiniju(){
        return(
            <div>
                <h3>Dodavanje linija</h3>

                <Row>
                    <Col md={8}>
                        <Form>
                            <Form.Group>
                                <Form.Label>Broj mesta</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="brojMesta"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Cena karte</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="cenaKarte"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Destinacija</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="destinacija"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Vreme polaska</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="vremePolaska"
                                    onChange={(e) => this.onInputChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Prevoznik</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="prevoznikId"
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
                        <Button variant="primary" onClick={() => this.dodaj()}>Dodaj</Button>
                    </Col>
                </Row>
            </div>
        )
    }

    dodaj(){

        if(this.proveraInputPolja() == true){
            let params = {
                brojMesta: this.state.create.brojMesta,
                cenaKarte: this.state.create.cenaKarte,
                destinacija: this.state.create.destinacija,
                vremePolaska: this.state.create.vremePolaska,
                prevoznikId: this.state.create.prevoznikId
            }
            console.log(params)
    
            TestAxios.post("/linije", params)
                .then(res => {
                    alert("Uspesno dodata linija.")
                    window.location.reload()
                })
                .catch(error => {
                    console.log(error)
                    alert("Greska prilikom dodavanja linije.")
                })
        } else {
            alert("Niste uneli sva polja.")
        }
       
    }

    proveraInputPolja(){
        if(this.state.create.brojMesta != "" && this.state.create.cenaKarte != "" && this.state.create.destinacija != "" && this.state.create.vremePolaska != ""
            && this.state.create.prevoznikId != -1){
                return true
            } else {
                return false
            }
    }


    pretragaLinija(){
        return(
            <div style={{marginTop: '20px'}}>
                <Row>
                    <Col md={6}>
                        <Form>
                            <Form.Group>
                                <Form.Label>Destinacija</Form.Label>
                                <Form.Control
                                    as="input"
                                    type="text"
                                    name="destinacija"
                                    onChange={(e) => this.onSearchChange(e)}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                            <Form.Label>Prevoznik</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="prevoznikId"
                                    onChange={(e) => this.onSearchChange(e)}>
                                        <option value={-1}></option>
                                        {this.state.prevoznici.map(prevoznik => {
                                            return(
                                                <option key={prevoznik.id} value={prevoznik.id}>{prevoznik.naziv}</option>
                                            )
                                        })}

                                </Form.Control>
                                </Form.Group>
                                 <Form.Group>
                                    <Form.Label>Maksimalna cena</Form.Label>
                                    <Form.Control
                                        as="input"
                                        type="text"
                                        name="maksCena"
                                        onChange={(e) => this.onSearchChange(e)}>

                                    </Form.Control>
                                </Form.Group>
                        </Form>
                        <Button variant="primary" onClick={() => this.getLinije(0)}>Trazi</Button>
                    </Col>
                </Row>
            </div>
        )
    }

    onSearchChange(e){
        let name = e.target.name
        let value = e.target.value

        let search = this.state.search
        search[name] = value

        this.setState(search)
    }
    
    render() {
        return (
            <div>
                <h1 style={{textAlign: 'center'}}>Autobuska stanica Subotica</h1>

                {this.dodajLiniju()}

                {this.pretragaLinija()}

                <div style={{marginTop: '10px'}}>
                    <Button style={{float: 'right'}} disabled={this.state.pageNo == this.state.totalPages - 1} onClick={() => this.getLinije(this.state.pageNo + 1)} variant="info">Sledeca</Button>
                    <Button style={{float: 'right'}} disabled={this.state.pageNo == 0} onClick={() => this.getLinije(this.state.pageNo - 1)} variant="info">Prethodna</Button>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Naziv prevoznia</th>
                            <th>Destinacije</th>
                            <th>Broj mesta</th>
                            <th>Vreme polaska</th>
                            <th>Cena karte</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTable()}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Linije;