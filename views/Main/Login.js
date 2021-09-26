import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Input, Button, Card } from 'react-native-elements';
import { GlobalImgs, HomeImgs, Ad_video } from '@assets/imgs';
import { width, height, totalSize } from 'react-native-dimension';
import Video from 'react-native-video';
import RBSheet from 'react-native-raw-bottom-sheet';
import SignIn from '../Auth/SignIn';
import Register from '../Auth/Register'; 


export default class Login extends React.Component {
  purchaseUpdatedListener;
  purchaseErrorListener;
  constructor(props) {
    super(props);
    this.props = props;
    //console.log(this.props);
    this.state = {
      email: '',
      name: '',
      pass: '',
      confirm_pass: '',
      show_err_email: false,
      show_err_name: false,
      show_err_password: false,
      show_err_confirm: false,
      isSigning: false,
      isVideoLoading: true,
      purchased: false,
      products: [],
    };
  }

  componentDidMount() {
  }
  componentDidUpdate() { }
  goHome = () => {
    this.props.navigation.replace('home');
  };

  openRegister = () => {
    this.RegisterModal.open();
  };
  closeRegister = () => {
    this.RegisterModal.close();
  };

  openSignIn = () => {
    this.LoginModal.open();
  };
  closeSignIn = () => {
    this.LoginModal.close();
  };

  render() {
    return (
      <>
        <StatusBar hidden />
        <ImageBackground style={styles.bgImg} source={GlobalImgs.bg}>
          <Image source={GlobalImgs.logo} style={{ marginTop: height(15) }} />
          {/* <Text style = {{fontSize : 20, fontWeight : 'bold', color : '#fff'}}>Get Reward For Your Grades</Text> */}
          <Card
            containerStyle={{
              padding: 8,
              borderRadius: 20,
              width: width(90),
              height: width(90) * (9 / 16),
            }}>
            <Video
              source={Ad_video.gradebacker_ad}
              // source={{uri: "https://youtu.be/OprIk4HyeqU"}}   // https://youtu.be/OprIk4HyeqU //http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4 Can be a URL or a local file.
              ref={ref => {
                this.player = ref;
              }}
              fullscreenOrientation="landscape"
              fullscreen={true}
              fullscreenAutorotate={true}
              resizeMode={'cover'}
              // onTouchEnd = {() => {
              //     this.player.presentFullscreenPlayer()
              // }}
              repeat={false}
              onLoad={() => {
                this.setState({ isVideoLoading: false });
              }}
              style={styles.backgroundVideo}
              controls={true}
            />
            {this.state.isVideoLoading == true ? (
              <ImageBackground
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: 0,
                  left: 0,
                }}
                source={HomeImgs.video_thumb}>
                <ActivityIndicator size="large" color="#00ff00" />
              </ImageBackground>
            ) : null}
          </Card>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.openSignIn()}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              Sign In
              </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: 12, marginBottom: 30 }}
            onPress={() => this.openRegister()}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                borderBottomColor: '#00f',
                borderBottomWidth: 1,
              }}>
              Create an Account
              </Text>
          </TouchableOpacity>
        </ImageBackground>

        <RBSheet
          ref={ref => {
            this.RegisterModal = ref;
          }}
          height={height(93)}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <Register close={this.closeRegister} goHome={this.goHome} />
        </RBSheet>
        <RBSheet
          ref={ref => {
            this.LoginModal = ref;
          }}
          height={height(80)}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <SignIn close={this.closeSignIn} goHome={this.goHome} />
        </RBSheet>
      </>
    )
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  bgImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '94%',
  },
  textInput: {
    width: '100%',
  },
  button: {
    width: width(90),
    padding: 15,
    backgroundColor: '#B034CD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  register_link: {
    borderBottomColor: '#3355aa',
    borderBottomWidth: 1,
    color: '#3355aa',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButton: {
    padding: 10,
    backgroundColor: '#fc6931',
    borderRadius: 4,
  },
});
