import React from 'react';
import { View, Text, StyleSheet, Share, ImageBackground,ActivityIndicator, StatusBar,TouchableOpacity, Image, TextInput, ScrollView , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar, Header, Card} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { width, height, totalSize } from 'react-native-dimension';
import GradePicture from '../Component/GradePicture';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from '../../Helper/Constant';
import Gallery from 'react-native-image-gallery';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

export default class ZelleNumMsg extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            loading : false,
            isGalleryVisible : false,
            galleryIndex : 0,
            semester_slug : '',
            semester_data : null,
            imgs :  [],
            answers : []
        }
    }

    componentDidMount = () => {
    }

    
    render(){
        return (
            <SafeAreaView style = {{flex : 1, flexDirection : 'column'}}>
                <Spinner
                    visible={this.state.loading}
                />
                <View style = {styles.header} >
                    <TouchableOpacity onPress = {() => {this.props.navigation.openDrawer()}} >
                        <Entypo name = "menu" size = {32} color='#fff'/>
                    </TouchableOpacity>
                    <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style ={{fontSize : 20, color : '#fff', fontWeight : 'bold'}} >Edit Profile</Text>
                    </View>
                    <TouchableOpacity style = {{width : 30, marginRight : 10}} >
                    </TouchableOpacity>
                </View>
                <ScrollView style = {styles.container} >
                    <View style ={styles.banner_container}>
                        <Text style = {[styles.title_val, {textAlign : 'center', marginBottom : 12}]}>Please input your zelle number so people can reward you, using your zelle pay number.</Text>
                        {/* <View  style = {styles.title}>
                        </View> */}
                        <TouchableOpacity onPress = {() => {this.props.navigation.navigate('setting');}} style = {{justifyContent : 'center', alignItems : 'center', backgroundColor : '#3434ff77', width : width(50), padding : 10, borderRadius : 10, marginTop : 8, }}>
                            <Text style = {{color : 'white', fontSize : 16, fontWeight : 'bold'}}>Input Zelle Number</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress = {() => {this.props.navigation.navigate('view_semester');}} style = {{justifyContent : 'center', alignItems : 'center', backgroundColor : '#3434ff77', width : width(50), padding : 10, borderRadius : 10,marginTop : 12, }}>
                            <Text style = {{color : 'white', fontSize : 16, fontWeight : 'bold'}}>View Profile</Text>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    
    header:{
        backgroundColor : '#F7991C',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        paddingLeft : 10,
        width : width(100),
        height: 62
    },
    container:{
        flex : 1,
        flexDirection : 'column',
        paddingLeft : 30,
        paddingRight : 30,
        paddingTop : 30,
        paddingBottom : 40,
        marginBottom : 20,
        width : width(100),
    },
    banner_container : {
        flex : 1,
        flexDirection : 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : 20,
    },
    list_container : {  
        flex : 1,
        width: '100%',
        alignSelf : 'center',
    },
    summary : {
        marginTop : 8,
        width : '100%',
        flexDirection  :'row',
        justifyContent : 'flex-start',
        alignItems : 'flex-start',
    },
    title_label : {
        color: '#3434ff77',
        fontSize: 16,
        fontWeight : 'bold',
        marginLeft : 8,
    },
    title_val : {
        color: '#000',
        fontSize: 16,
        fontWeight : 'bold',
        marginLeft : 8,
    },
    title : {
        marginTop : 8,
        width : '100%',
        flexDirection  :'row',
        justifyContent : 'flex-start',
        alignItems : 'center',
    },
    inputTxt: {
        textAlignVertical: 'center',
        fontSize: 16,
        textAlign : 'center',
        flex : 1
    },
    searchBar : {
        flex : 1,
        width : '100%'
    },
    formItem : {
        flexDirection : 'row', 
        width : '100%', 
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 24,
        borderRadius :10, 
        borderWidth : 1,
        borderColor : '#000'
    },
    q_label : {
        color : '#444',
        paddingLeft : 20,
        // width : '100%',
        textAlign : 'left',
        alignSelf : 'flex-start',
        flexWrap : 'wrap'
    },
    ans_val : {
        // width : '100%',
        paddingLeft : 35,
        textAlign : 'left',
        alignSelf : 'flex-start',
        flexWrap : 'wrap'
    }
    
});

