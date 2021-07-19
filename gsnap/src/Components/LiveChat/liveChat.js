import React from 'react';
import ReactLoading from 'react-loading';
import firebase from '../Firebase/firebase';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/liveChat.css';
import LocalStorageStrings from '../LoginStrings';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import "../Styles/liveChat.css";

class LiveChat extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLoading: false,
            isShowSticker: false,
            inputValue:"",
            currentPeerUser:this.props.currentPeerUser
        }
        this.currentUserName = localStorage.getItem(LocalStorageStrings.Name);
        this.currentUserId = localStorage.getItem(LocalStorageStrings.ID);
        this.currentUserPhoto = localStorage.getItem(LocalStorageStrings.PhotoURL);
        this.currentUserDocumentId = localStorage.getItem(LocalStorageStrings.FirebaseDocumentId)
        this.stateChanged = LocalStorageStrings.UPLOAD_CHANGED;
        this.listMessage = [];
        this.removeListener = null
        this.groupChatId = null;
        this.currentPhotoFile = null;
    }
    componentDidUpdate(prevProps, preState){
        this.scrollToBottom()
        if(this.props.currentPeerUser !== prevProps.currentPeerUser){
            this.getListHistory();
        }

    }
    componentDidMount(){
        this.getListHistory()  
    }
    static getDerivedStateFromProps(props,state){
        if(props.currentPeerUser !== state.currentPeerUser){
            return {currentPeerUser : props.currentPeerUser}
        }
    }
    componentWillUnmount(){
        if(this.removeListener){
            this.removeListener()
        }
    }
    scrollToBottom = () => {
        if(this.messagesEnd){
            this.messagesEnd.scrollIntoView({})
        }
    }
    onKeyboardPress=(event)=>{
        if(event.key === 'Enter'){
            this.onSendMessage(this.state.inputValue, 0)
        }
    }
    openListSticker=()=>{
        this.setState({isShowSticker: !this.state.isShowSticker})
    }
    getListHistory=()=>{
        if(this.removeListener){
            this.removeListener()
        }
        this.listMessage.length = 0
        this.setState({isLoading : true})
        if(
            this.hashString(this.currentUserId)<=
            this.hashString(this.state.currentPeerUser.id)
        ){
            this.groupChatId = `${this.currentUserId}-${this.state.currentPeerUser.id}`
        }else{
            this.groupChatId = `${this.state.currentPeerUser.id}-${this.currentUserId}`
        }
        this.removeListener = firebase.firestore()
        .collection('Messages')
        .doc(this.groupChatId)
        .collection(this.groupChatId)
        .onSnapshot(
            onSnapshot => {
                onSnapshot.docChanges().forEach(change =>{
                    if(change.type === LocalStorageStrings.DOC){
                        this.listMessage.push(change.doc.data())
                    }
                })
                this.setState({isLoading: false})   
            },
            err =>{
                this.props.showToast(0, err.toString())
            }
        )
    }
    onSendMessage = (content, type)=>{
        if(this.state.isShowSticker && type === 2){
            this.setState({isShowSticker: false})
        }
        if(content.trim() === ''){
            return
        }
        const timestamp = moment()
        .valueOf()
        .toString()
        const itemMessage ={
            idFrom: this.currentUserId,
            idTo: this.state.currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type:type
        }
        firebase.firestore()
        .collection('Messages')
        .doc(this.groupChatId)
        .collection(this.groupChatId)
        .doc(timestamp)
        .set(itemMessage)
        .then(()=>{
            this.setState({inputValue:''})
        })
    }
    render(){
        return(
            <div className="content">
                 {this.state.isLoading ? (
                       <div className="viewLoading">
                           <ReactLoading
                           type={'spin'}
                           color={'white'}
                           height={'10%'}
                           width={'10%'}
                           />
                       </div>
                   ): null}
                   <div class="contact-profile">
                       <img src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/nopic.jpg?alt=media&token=b4bbcf51-a6b2-4715-9699-8b26b2cf6c8b" }/>
                        <p>{this.state.currentPeerUser.name}</p>
                        <div class="social-media">
                        {/* <p>for you {this.state.currentPeerUser.name}'s </p> */}
                           <a href="https://www.facebook.com/"> <i class="fa fa-facebook" aria-hidden="true"></i></a>
                           <a href="https://twitter.com/?lang=en"> <i class="fa fa-twitter" aria-hidden="true"></i></a> 
                           <a href="https://www.instagram.com/">  <i class="fa fa-instagram" aria-hidden="true"></i></a>
                        </div>
                   </div>
                   <div className="viewListContentChat">
                       {this.renderListMessage()}
                       <div styles={{float:'left', clear:'both'}}
                        ref={el=>{
                            this.messagesEnd = el
                        }}
                       />                      
                   </div>
                   {this.state.isShowSticker ? this.renderStickers() : null}
                   <div className="message-input">
                       <div class="wrap">
                           <input
                            className="viewInput"
                            placeholder="Type a message"
                            value={this.state.inputValue}
                            onChange={event =>{
                                this.setState({inputValue: event.target.value})
                            }}
                            onKeyPress={this.onKeyboardPress}
                           
                           />
                           <img
                            className="icOpenGallery"
                            src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/ic_photo.png?alt=media&token=0bd7a403-b3b3-44e6-a688-d45fc84ffc76"
                            alt="icon open gallery"
                            onClick={()=> this.refInput.click()}
                           />
                           <input
                                ref={el => {
                                    this.refInput = el
                                }}
                                accept="image/*"
                                className="viewInputGallery"
                                type="file"
                                onChange={this.onChoosePhoto}
                           />
                           <img
                                className="icOpenSticker"
                                src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/ic_sticker.png?alt=media&token=ed8a6583-bff3-49f1-aa0d-901174eb33e8"
                                alt="icon open sticker"
                                onClick={this.openListSticker}
                           />
                           <img
                                className="icSend"
                                src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/ic_send.png?alt=media&token=b90c1181-d62c-4c3c-9feb-ea7c074bbc5b"
                                alt="icon send"
                                onClick={() => this.onSendMessage(this.state.inputValue, 0)}
                           />
                       </div>
                   </div>             
            </div>
        );
    };
    onChoosePhoto = (event)=>{
        if(event.target.files && event.target.files[0]){
            this.setState({isLoading: true})
            this.currentPhotoFile = event.target.files[0]
            const prefixFiletype = event.target.files[0].type.toString()
            if(prefixFiletype.indexOf('image/') === 0){
                this.uploadPhoto()
            }else{
                this.setState({isLoading: false})
                this.props.showToast(0, 'This is not an image')
            }
        }else{
            this.setState({isLoading: false})
        }
    }
    uploadPhoto =()=>{
        if(this.currentPhotoFile){
            const timestamp = moment()
            .valueOf()
            .toString()
            const uploadTask = firebase.storage()
            .ref()
            .child(timestamp)
            .put(this.currentPhotoFile)
            uploadTask.on(
                LocalStorageStrings.UPLOAD_CHANGED,
                null,
                err =>{
                    this.setState({isLoading: false})
                    this.props.showToast(0, err.message)
                },
                ()=>{
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.onSendMessage(downloadURL, 1)
                        this.setState({isLoading: false})
                    })
                }
            )
        }else{
            this.setState({isLoading: false})
            this.props.showToast(0, 'File is null')
        }
    }
    renderListMessage = () => {
        if(this.listMessage.length > 0 ){
            let viewListMessage = []
            this.listMessage.forEach((item, index)=>{
                if(item.idFrom === this.currentUserId){
                    if(item.type === 0){
                        viewListMessage.push(
                            <div className="viewItemRight" key={item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                            </div>
                        )
                    }else if(item.type === 1){
                        viewListMessage.push(
                            <div className="viewItemRight2" key={item.timestamp}>
                                <img
                                className="imgItemRight"
                                src={item.content}
                                alt="content message"                          
                                />
                            </div>
                        )
                    }else{
                        viewListMessage.push(
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img
                                className="imgItemRightSticker"
                                src={this.getGifImage(item.content)}
                                alt="content message"                             
                                />
                            </div>
                        )
                    }
                }else {
                    if(item.type === 0){
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/nopic.jpg?alt=media&token=b4bbcf51-a6b2-4715-9699-8b26b2cf6c8b"}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ):(
                                        <div className="viewPaddingLeft"></div>
                                    )}
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.content}</span>
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index)?(
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('11')}
                                        </div>
                                    </span>
                                ):null}
                            </div>
                        )
                    }else if (item.type === 1){
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemleft3">
                                    {this.isLastMessageLeft(index)?(
                                    <img
                                    src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/nopic.jpg?alt=media&token=b4bbcf51-a6b2-4715-9699-8b26b2cf6c8b"}
                                    alt="avatar"
                                    className="peerAvatarLeft"
                                    />
                                    ):(
                                        <div className="viewPaddingLeft">
                                        </div>
                                    )}
                                    <div className="viewItemLeft2">
                                        <img
                                            className="imgItemLeft"
                                            src={item.content}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index)?(
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('11')}
                                        </div>
                                    </span>
                                ):null}
                            </div>
                        )
                    }else{
                        viewListMessage.push(
                            <div className="viewWrapItemleft2" key={item.timestamp}>
                                <div className="viewWrapitemLeft3">
                                {this.isLastMessageLeft(index)?(
                                    <img
                                    src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/nopic.jpg?alt=media&token=b4bbcf51-a6b2-4715-9699-8b26b2cf6c8b"}
                                    alt="avatar"
                                    className="peerAvatarLeft"
                                    />
                                    ):(
                                        <div className="veiwPaddingLeft"/>             
                                    )}
                                    <div className="viewItemLeft3" key={item.timestamp}>
                                        <img
                                        className="imgItemLeftSticker"
                                        src={this.getGifImage(item.content)}
                                        alt="content message"                                    
                                       />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index)?(
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            <div className="timesetup">
                                                {moment(Number(item.timestamp)).format('ll')}
                                            </div>
                                        </div>
                                        
                                    </span>
                                ):null}
                            </div>
                        )
                    }

                }
            })
            return viewListMessage
        }else{
            return(
                <div className="viewWrapSayHi">
                    <span className="textSayHi"> No messages</span>
                    <img
                    className="imgWaveHand"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/14-wave_hand.png?alt=media&token=2c115c7b-a321-4c76-8fce-28dfec02e3e3"
                    alt="wave hand"        
                    />

                </div>
            )
        }

    }
    renderStickers =()=>{
        return(
            <div className="viewStickers">
                <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l1.png?alt=media&token=093c65b0-3791-4733-99f7-673e8ed75e2b"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l1', 2)}}
                />
                
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l2.png?alt=media&token=3e3c5f79-4448-4226-bfbe-12e7fcb5c89a"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l2', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l3.png?alt=media&token=6669ccc8-172f-49f0-86d0-cd4e75ad6ec9"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l3', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l4.png?alt=media&token=4997b6d8-c857-40bc-9857-08e59cb68f82"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l4', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l5.png?alt=media&token=dc08b6f1-c4e8-43e3-96aa-98b22dbb360c"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l5', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l6.png?alt=media&token=0f813257-f19d-411d-a332-0d471158ef98"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('l6', 2)}}
                />
               
                <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/m1.gif?alt=media&token=664cdc3f-fda7-4ae3-845f-eacf4fad7411"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('m1', 2)}}
                />
                <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/m2.gif?alt=media&token=78a7a97b-2d2e-49a8-b31d-3bcb94a05877"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('m2', 2)}}
                />
                 <img
                    className="imgSticker"
                    src="https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/m3.gif?alt=media&token=ac40c29a-86bd-4149-b052-e100ed659fc2"
                    alt="sticker"
                    onClick={()=>{this.onSendMessage('m3', 2)}}
                />
            </div>
        )
    }
    getGifImage = (value) =>{
        switch(value){
            case 'l1':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l1.png?alt=media&token=093c65b0-3791-4733-99f7-673e8ed75e2b"
            case 'l2':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l2.png?alt=media&token=3e3c5f79-4448-4226-bfbe-12e7fcb5c89a"
            case 'l3':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l3.png?alt=media&token=6669ccc8-172f-49f0-86d0-cd4e75ad6ec9"
            case 'l4':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l4.png?alt=media&token=4997b6d8-c857-40bc-9857-08e59cb68f82"
            case 'l5':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l5.png?alt=media&token=dc08b6f1-c4e8-43e3-96aa-98b22dbb360c"
            case 'l6':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l6.png?alt=media&token=0f813257-f19d-411d-a332-0d471158ef98"
            case 'l7':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l7.png?alt=media&token=7546238b-f550-4444-9b96-635f8319259e"
            case 'l8': 
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/l8.png?alt=media&token=697319de-0d70-417f-87fe-fbc26fb4a0fc"
            case 'm1':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/m1.gif?alt=media&token=664cdc3f-fda7-4ae3-845f-eacf4fad7411"
            case 'm2':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/m2.gif?alt=media&token=78a7a97b-2d2e-49a8-b31d-3bcb94a05877"
            case 'm3':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/m3.gif?alt=media&token=ac40c29a-86bd-4149-b052-e100ed659fc2"
            case 'm4':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/m4.gif?alt=media&token=083d396e-4122-4081-9a08-d3c4b8bc1ab5"
            case 'm5':
                return "https://firebasestorage.googleapis.com/v0/b/react-applciation.appspot.com/o/m5.gif?alt=media&token=f67e890b-0c48-4d86-861c-0fe08458c7b0"
        }
    }
    hashString = str =>{
        let hash = 0
        for(let i = 0; i < str.length; i++){
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash
        }
        return hash
    }
    isLastMessageLeft = (index) =>{
        if(
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom === this.currentUserId) ||
                index === this.listMessage.length - 1
        ){
            return true
        }else{
            return false
        }
        
    }
   

};
export default LiveChat;