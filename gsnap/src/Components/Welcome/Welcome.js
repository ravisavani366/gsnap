import React from 'react';
import '../Styles/Welcome.css';
class Welcome extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="viewWelcomeBoard">
                <img
                className="avatarWelcome"
                src={this.props.currentUserPhoto ? this.props.currentUserPhoto : "https://firebasestorage.googleapis.com/v0/b/react-application-3248d.appspot.com/o/nopic.jpg?alt=media&token=7b8a6a30-ce7b-4fc1-bbd4-db2087e573e1" }
                alt=""
                />
                <span className="textTitleWelcome">{`Hello, ${this.props.currentUserName} 👋` }</span>
                <span className="textDescriptionWelcome">Welcome to the Shree Diamond World 💎</span>
                <marquee className="textDescriptionWelcome"><strong>⚠ Note:</strong> Please 🔖 Update your Daily Work Status and This is a Business diamond Chat do not use 🚫 for Personal</marquee>
            </div>
        )
    }
}
export default Welcome;