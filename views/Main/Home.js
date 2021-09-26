import React from 'react';
import { BackHandler, Share, View, Text, Dimensions, Button, YellowBox, StatusBar, ImageBackground, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { GlobalImgs } from '@assets/imgs';
import { width, height, totalSize } from 'react-native-dimension';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import EditProfile from '../Screens/EditProfile';
import EditSemester from '../Screens/EditSemester';
import Setting from '../Screens/Setting';
import ViewSemester from '../Screens/ViewSemester';
import UploadVideo from '../Screens/UploadVideo';
import ZelleNumMsg from '../Screens/ZelleNumMsg';
import { _retrieveData, _storeData, _removeData } from '../../Helper/Util';
import { Linking } from 'react-native';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);


const onShare = async (semester_slug) => {
  if (semester_slug == '') return;
  try {
    const result = await Share.share({
      message:
        'Please take a look at how my college semester is going here! https://www.gradebacker.com/semester/' + semester_slug,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

function CustomDrawerContent(props) {
  const gotoTermsUrl = () => {
    try {
      const terms_url = 'https://gradebacker.com/page/terms-condition'; // Terms and Service
      Linking.openURL(terms_url);
    }
    catch (err) {
      alert(err);
    }
  }
  return (
    <>
      <ImageBackground style={{ width: '100%', height: Dimensions.get('window').height, shadowColor: '#ff0000', flex: 1, resizeMode: 'cover' }}
        // imageStyle={{ resizeMode: 'stretch' }}
        // source={{uri: './../../assets/imgs/global/bg.png'}}>
        // source={Platform.OS === 'ios' ? require('./../../assets/imgs/global/bg.png') : GlobalImgs.bg}>
        // source={require('./../../assets/imgs/global/bg.png')}>
        source={GlobalImgs.bg}>
        <View style={styles.userInfo}>
          <Avatar
            rounded
            containerStyle={{ borderWidth: 2, borderColor: '#fff' }}
            size={width(25)}
            source={{
              uri: 'https://www.gradebacker.com' + global.image,
            }}
            onPress={() => { props.navigation.navigate('edit_profile') }}
          />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{global.username}</Text>
        </View>
        {/* <TouchableOpacity style = {styles.drawerItem} onPress = {() => {props.navigation.navigate('edit_profile')}}>
        <AntDesign name = "edit" color = "#fff" size = {28} style = {styles.drawerItem_icon}/>
        <Text style = {styles.drawerItem_txt}>Edit my profile</Text>
      </TouchableOpacity> */}
        <TouchableOpacity style={styles.drawerItem} onPress={() => { props.navigation.navigate('view_semester') }}>
          <FontAwesome name="th-list" color="#fff" size={22} style={styles.drawerItem_icon} />
          <Text style={styles.drawerItem_txt}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { props.navigation.navigate('edit_semester') }}>
          <FontAwesome name="graduation-cap" color="#fff" size={22} style={styles.drawerItem_icon} />
          <Text style={styles.drawerItem_txt}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => onShare(global.semester_slug)}>
          <AntDesign name="sharealt" color="#fff" size={22} style={styles.drawerItem_icon} />
          <Text style={styles.drawerItem_txt}>Share Profile Link</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => { props.navigation.navigate('setting') }}>
          <AntDesign name="setting" color="#fff" size={25} style={styles.drawerItem_icon} />
          <Text style={styles.drawerItem_txt}>Edit Information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={() => gotoTermsUrl()}>
          <AntDesign name="questioncircleo" color="#fff" size={25} style={styles.drawerItem_icon} />
          <Text style={styles.drawerItem_txt}>Terms and conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={async () => {
          await _removeData('user_id');
          global.user_id = null;
          props.navigation.navigate('login')
        }}>
          <AntDesign name="logout" color="#fff" size={22} style={styles.drawerItem_icon} />
          <Text style={styles.drawerItem_txt}>Logout</Text>
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
}

const Drawer = createDrawerNavigator();

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <>
        <StatusBar hidden />
        <Drawer.Navigator initialRouteName="edit_semester"
          drawerType={Dimensions.get('window').width >= 768 ? 'permanent' : 'front'}
          drawerStyle={styles.drawerStyle}
          drawerContent={CustomDrawerContent}
          overlayColor={20}
        >
          <Drawer.Screen name="edit_semester" component={EditSemester} />
          <Drawer.Screen name="view_semester" component={ViewSemester} />
          <Drawer.Screen name="setting" component={Setting} />
          <Drawer.Screen name="upload_video" component={UploadVideo} />
          <Drawer.Screen name="zelle_number" component={ZelleNumMsg} />
          <Drawer.Screen name="edit_profile" component={EditProfile} />
        </Drawer.Navigator>
      </>
    );
  }

}

const styles = StyleSheet.create({
  drawerStyle: {
    backgroundColor: '#fff',
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    width: width(70),
    shadowColor: '#11000055',
    shadowOffset: {
      width: 30,
      height: 30
    },
    shadowRadius: 50,
    shadowOpacity: 0.5
  },
  userInfo: {
    marginTop: height(8),
    marginBottom: height(2),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15
  },
  drawerItem_icon: {
    marginRight: 7
  },
  drawerItem_txt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width: '80%',

    //   borderBottomColor : '#B034CD',
    //  borderBottomWidth : 1
  },
});