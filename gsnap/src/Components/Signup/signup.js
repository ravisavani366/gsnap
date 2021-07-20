import React from 'react';
import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import '../Styles/Signup.css';
import LocalStorageStrings  from '../LoginStrings';
import TextField from '@material-ui/core/TextField';
import ReactLoading from 'react-loading';
import firebase from '../Firebase/firebase';
import si1 from '../Images/si1.jpg';



class Signin extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            isLoading: false,
            email: "",
            password: "",
            name:""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
   
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async handleSubmit(event){
        const {name,password,email} = this.state;
        event.preventDefault();
        this.setState({isLoading: true})
        try{
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async result => {
                await firebase.firestore().collection('users')
                .add({
                    name,
                    id:result.user.uid,
                    email,
                    password,
                    URL:'',
                    description:'',
                })
                .then((docRef)=>{
                        localStorage.setItem(LocalStorageStrings.FirebaseDocumentId, docRef.id);
                        localStorage.setItem(LocalStorageStrings.ID, result.user.uid);
                        localStorage.setItem(LocalStorageStrings.Name, name);
                        localStorage.setItem(LocalStorageStrings.Email, email);
                        localStorage.setItem(LocalStorageStrings.PhotoURL, "");
                        localStorage.setItem(LocalStorageStrings.Description, "");
                        this.setState({isLoading: false});
                        this.props.history.push('/chat');
                }).catch(function(error){
                    document.getElementById('1').innerHTML="User Already exit or poor internet";
                })
        })
        }catch{
            console.log("Failed To Authenticate")
        }   
    }
    render(){
        const paper={
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            paddingLeft:'10px',
            paddingRight:'10px',
            marginTop:'10px'
        }
        return(
           <Grid  container component="main" className="root">
              <Grid item xs={1} sm={4} md={7} className="image">
              <div className="texte">
                        <div className="regpage">
                            <span>S</span>
                            <span>I</span>
                            <span>G</span>
                            <span>N</span>
                            <span>U</span>
                            <span>P</span>
                        </div>

                        <div className="regpage">
                           
                            <span>S</span>
                            <span>H</span>
                            <span>R</span>
                            <span>E</span>
                            <span>E</span>
                        </div>
                            
                        <div className="regpage">
                            <span>D</span>
                            <span>I</span>
                            <span>A</span>
                            <span>M</span>
                            <span>O</span>
                            <span>N</span>
                            <span>D</span>
                        </div>
                    </div>
                    
                    <div className="bodyimg123">
                            <img src={si1} alt="logo" height="50%" width="50%" style={{margin:'10px 100px'}}/> 
                        </div>
                   <div className="leftimage">
                   
                   {this.state.isLoading ? (
                       <div className="viewLoadingProfile1">
                           <ReactLoading
                            type={'cylon'}
                            color={'white'}
                            height={'30%'}
                            width={'30%'}
                           />
                       </div>
                   ): null}
                   </div>
                   
                   </Grid>
               <Grid item xs={12} sm={8} md={5} className="loginrightcomponent" elevation={6} square>
                 <Card style={{display:'flex',flexDirection:'column',alignItems:'center', width:'100%', boxShadow:"0 5px 5px #808888"}}>
                     <Link to="/">
                         <button class="btnhome">
                             <i class="fa fa-home">Go to Home</i>
                         </button>
                     </Link>
                 </Card>

                 <div style={paper}>

                     <form style={{marginTop:'50px',width:'100%'}} noValidate onSubmit={this.handleSubmit}>
                         <TextField
                         variant="outlined"
                         margin="normal"
                         required
                         fullWidth
                         id="email"
                         label="Email Address"
                         name="email"
                         autoComplete="email"
                         autoFocus
                         onChange={this.handleChange}
                         value={this.state.email}
                         />
                          <TextField
                         variant="outlined"
                         margin="normal"
                         required
                         fullWidth
                         id="password"
                         label="Password :length Greater than 6"
                         name="password"
                         type="password"
                         autoComplete="current-password"
                         autoFocus
                         onChange={this.handleChange}
                         value={this.state.password}
                         /> 
                           <TextField
                         variant="outlined"
                         margin="normal"
                         required
                         fullWidth
                         id="name"
                         label="Your Name"
                         name="name"
                         autoComplete="name"
                         autoFocus
                         onChange={this.handleChange}
                         value={this.state.name}
                         />
                         <div>
                             <p style={{color:'grey', fontSize:'15px'}}>Please fill all fields and password should be greater than 6</p>
                         </div>
                         <div className="CenterAliningItems">           
                                 <button className="button1" type="submit" >
                                     Signup
                                 </button>     
                            </div>   
                            <div>
                                <p id='1' style={{color:'red'}}></p>
                            </div>     

                     </form>

                 </div>
               </Grid>
               
           </Grid>

        );
    };
};
export default Signin;