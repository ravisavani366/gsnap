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
                src={this.props.currentUserPhoto ? this.props.currentUserPhoto : "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/nopic.jpg?alt=media&token=d375ecd2-5905-4dee-8185-b351701915d0" }
                alt=""
                />
                <span className="textTitleWelcome">{`Welcome,${this.props.currentUserName}` }</span>
                <span className="textDescriptionWelcome">Start Chatting</span>
            </div>
        )
    }
}
export default Welcome;