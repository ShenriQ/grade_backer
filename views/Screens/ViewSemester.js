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
import Video from 'react-native-video';

const onShare = async (semester_slug) => {
    if(semester_slug == '') return;
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

export default class ViewSemester extends React.Component {
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
            answers : [],
            loaded: false
        }
    }

    componentDidMount = () => {
        this.getSemester();
        this.subs = this.props.navigation.addListener("focus", async () => {
            this.getSemester();
        });
    }


    getSemester = async () => {
        try{
            this.setState({loading : true});
            let response = await axios({
                method  :'post',
                url : api_base_url + "checksemester",
                headers : {
                    Accept : "application/json",
                    "Content-Type" : "application/json",
                },
                data : {
                    "user_id" : global.user_id,
                }
            })
            let data = await response.data;
            if(data.reponse == 'yes') // success
            {
                // get semester
                global.semester_slug = data.semester;
                response = await axios({
                    method  :'post',
                    url : api_base_url + "getsemester",
                    headers : {
                        Accept : "application/json",
                        "Content-Type" : "application/json",
                    },
                    data : {
                        "slug" : data.semester,
                    }
                })

                let tmp_imgs = [];
                for(var i = 0; i < response.data.otherimages.length; i ++)
                {
                    tmp_imgs.push({ source: { uri: 'https://www.gradebacker.com' + response.data.otherimages[i] } }); 
                }

                let semester_data = response.data;
                console.log(JSON.stringify(semester_data))
                let answers = semester_data.semester.question.split("@#!!#@");

                this.setState({semester_data : response.data, answers : answers, imgs : tmp_imgs,  semester_slug : data.semester,  loading : false});
            }
            else{
                this.setState({semester_data : null, loading : false})
            }
        }
        catch(err)
        {
            this.setState({semester_data : null,  loading : false});
        }
    }
 

    openGallery = (img_index) => {
        this.setState({
            galleryIndex : img_index,
            isGalleryVisible : true,
        })
    }

    closeGallery = () => {
        this.setState({
            isGalleryVisible : false,
        })
    }

    render(){
        return (
            this.state.isGalleryVisible == true ?
            <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }} contentInsetAdjustmentBehavior="always">
                <TouchableOpacity style = {{margin : 14}} onPress = {() => this.closeGallery()}>
                    <AntDesignIcon name = "close" size = {26} color = "#fff" />
                </TouchableOpacity>
                <Gallery
                    style={{ flex: 1, backgroundColor: 'black' }}
                    images={this.state.imgs}
                    initialPage = {this.state.galleryIndex}
                />
            </SafeAreaView>
            :
            <SafeAreaView style = {{flex : 1, flexDirection : 'column'}} contentInsetAdjustmentBehavior="always">
                <Spinner
                    visible={this.state.loading}
                />
                <View style = {styles.header} >
                    <TouchableOpacity onPress = {() => {this.props.navigation.openDrawer()}} >
                        <Entypo name = "menu" size = {32} color='#fff'/>
                    </TouchableOpacity>
                    <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style ={{fontSize : 20, color : '#fff', fontWeight : 'bold'}} >View Profile</Text>
                    </View>
                    <TouchableOpacity style = {{width : 30, marginRight : 10}} onPress = {() => onShare(this.state.semester_slug)}>
                        <AntDesignIcon name = "sharealt" size = {26} color='#fff'/>
                    </TouchableOpacity>
                </View>
                {this.state.semester_data == null ?
                <View>
                    <View  style = {{justifyContent : 'center', alignItems : 'center', flexDirection : 'row', marginTop : 30}}>
                        <Entypo style = {{marginLeft : 8}} size={20} color='#ff0000'  name = 'warning' />
                        <Text style = {styles.title_label}>Nothing to show </Text>
                    </View>
                </View>
                 :
                <ScrollView style = {styles.container} contentInsetAdjustmentBehavior="always">
                    <View style ={styles.banner_container}>
                        <Text style = {[styles.title_val, {textAlign : 'center', marginBottom : 12}]}>Please share with friends/family people that care about your educational journey!</Text>
                        <View  style = {styles.title}>
                            <AntDesignIcon style = {{marginLeft : 8}} size={20} color='#3434ff77'  name = 'home' />
                            <Text style = {styles.title_label}>School Name : </Text>
                            <Text style = {[styles.title_val, {flex : 1, flexWrap : 'wrap'}]}> {this.state.semester_data.semester.name}</Text>
                        </View>
                        <View  style = {styles.title}>
                            <AntDesignIcon style = {{marginLeft : 8}} size={20} color='#3434ff77'  name = 'flag' />
                            <Text style = {styles.title_label}>Grade Level : </Text>
                            <Text style = {[styles.title_val, {flex : 1, flexWrap : 'wrap'}]}> {this.state.semester_data.semester.level}</Text>
                        </View>
                        {/* <View  style = {styles.summary}>
                            <Entypo style = {{marginLeft : 8}} size={20} color='#3434ff77'  name = 'text' />
                            <Text style = {styles.title_label}>Semester Summary : </Text>
                        </View>
                        <View  style = {{flexDirection : 'column', justifyContent: 'flex-start', alignItems : 'center'}}>
                            <Text style = {styles.q_label}>1) What do you hope to gain during this academic term?</Text>
                            <Text style = {[styles.ans_val, {flexWrap : 'wrap'}]}>{this.state.answers.length > 0 ? this.state.answers[0] : ''}</Text>
                            <Text style = {styles.q_label}>2) What is your favorite or worst thing about your educational journey so far?</Text>
                            <Text style = {[styles.ans_val, {flexWrap : 'wrap'}]}>{this.state.answers.length > 1 ? this.state.answers[1] : ''}</Text>
                            <Text style = {styles.q_label}>3) How will financial assistance from Gradebacker help you?</Text>
                            <Text style = {[styles.ans_val, {flexWrap : 'wrap'}]}>{this.state.answers.length > 2 ? this.state.answers[2] : ''}</Text>
                            <Text style = {styles.q_label}>4) Do you want to add anything else?</Text>
                            <Text style = {[styles.ans_val, {flexWrap : 'wrap'}]}>{this.state.answers.length > 3 ? this.state.answers[3] : ''}</Text>
                        </View> */}
                        <View  style = {styles.summary}>
                            <FontAwesome style = {{marginLeft : 8}} size={20} color='#3434ff77'  name = 'image' />
                            <Text style = {styles.title_label}>Pictures : </Text>
                        </View>
                        <View  style = {styles.summary}>
                            <FlatList
                                data={this.state.imgs}
                                renderItem={({ item, index }) => (
                                    <GradePicture img = {item} width = {width(55)} height = {width(55) * 10 / 16} index = {index} onPressedImage = {(img_index) => {
                                        this.openGallery(img_index);
                                    }}/>
                                )}
                                horizontal = {true}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        <View  style = {styles.summary}>
                            <Entypo style = {{marginLeft : 8}} size={20} color='#3434ff77'  name = 'video' />
                            <Text style = {styles.title_label}>Video : </Text>
                        </View>
                        {
                            this.state.semester_data.semester.video != null && (
                                <View style={{
                                    width: '100%',
                                    height: 300,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: 16
                                }}>
                                    {
                                        this.state.loaded == false && (
                                            <ActivityIndicator size="large" color="#ff99ee" />
                                        )
                                    }
                                    <Video
                                        source={{ uri: 'https://www.gradebacker.com/uploads/' + this.state.semester_data.semester.video }}
                                        style={{
                                            width: this.state.loaded ? 250 : 0,
                                            height: 300,
                                        }}
                                        resizeMode="contain"
                                        repeat
                                        onLoad={() => this.setState({loaded: true})}
                                    ></Video>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>
                }
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
        padding: 3,
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
