import React from 'react';
import Grid from '@material-ui/core/Grid';
import '../Styles/Home.css';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../Images/logopng.jpg'

class Home extends React.Component {

    render() {
        const paper = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingLeft: '10px',
            paddingRight: '10px',
            marginTop: '60px'
        }
      

        return (
            <Grid container component="main" className="root">
                <Grid item xs={1} sm={4} md={7} className="imagehome">
                
                    <div className="homeleftimage">
                        <div style={paper}>
                            <h1 className="logoname">
                                Diamond Chat
                               </h1>
                              <h5  className="logoname"> Shree Diamond</h5>
                               </div>
                               <div className="logoname" >
                        <p  style={{marginTop:'85px'}}>Having more than 20 years experience in the Diamond industry. We are Leading Manufacturer and Exporter of Loose Diamonds, Black Diamonds, Fancy Color Diamonds, Diamond Beads Necklace and Rough Diamond Beads Necklace.</p>
                        <i  class="fa fa-phone">: +91 90999 28272</i><br></br>
                        <i  class="fa fa-location-arrow">: 307, Torrent Tower, Near Katargam, Surat-395006 (Gujarat), INDIA</i>
                    </div> 
                    </div>
                </Grid>
                <Grid item xs={12} sm={8} md={5} className="homerightcomponent" elevation={6} square>
                    <Card className="homeitem1">
                        <button className="btnhome">
                            <i class="fa fa-home">Welcome</i>
                        </button>

                    </Card>
                    <div style={paper}>
                        <img src={logo} alt="logo" height="30%" width="30%" />
                        <Link to="/signin" >
                            <button class="button1">
                                <span>Login</span>
                            </button>
                        </Link>
                        <p style={{marginTop:'100px', color:'#ff0080'}}>&copy; 2021 Shree Diasmond</p>
                    </div>
                  
                </Grid>
                

            </Grid>

        );
    };
};
export default Home;