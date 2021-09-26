import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar,TouchableOpacity, Image, TextInput , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { width, height, totalSize } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from '../../Helper/Constant';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

export default class Setting extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            zelle_phone : '',
            zelle_email : '',
            err_zelle : '',
            loading : false,
        }
    }
 
    componentDidMount = () => {
        this.getZelle();
        this.subs = this.props.navigation.addListener("focus", async () => {
            this.getZelle();
        });
    }
    
    getZelle = async () => {
        try{
            this.setState({err_zelle : '', loading : true});
            let response = await axios({
                method  :'post',
                url : api_base_url + "getzelle",
                headers : {
                    Accept : "application/json",
                    "Content-Type" : "application/json",
                },
                data : {
                    "user_id" : global.user_id,
                }
            })
            let data = await response.data;
            if(data.reponse == '') // success
            {
                this.setState({err_zelle : '', zelle_email : data.zelle_email, zelle_phone : data.zelle_phone,  loading : false});
            }
            else{
                this.setState({err_zelle : 'Error ocurred.', loading : false})
            }
        }
        catch(err)
        {
            this.setState({err_zelle : err.message,  loading : false});
        }
    }

    addZelle = async () => {
        try{
            this.setState({err_zelle : '', loading : true});
            let response = await axios({
                method  :'post',
                url : api_base_url + "addzelle",
                headers : {
                    Accept : "application/json",
                    "Content-Type" : "application/json",
                },
                data : {
                    "zelle_phone" : this.state.zelle_phone,
                    "zelle_email" : this.state.zelle_email,
                    "user_id" : global.user_id
                }
            })

            let data = await response.data;
            if(data.reponse == '') // success
            {
                
                this.setState({err_zelle : 'Your zelle information is set successfully.', loading : false});
                this.props.navigation.navigate('view_semester');
            }
            else{
                this.setState({status : 'Error occured', loading : false})
            }
        }
        catch(err)
        {
            this.setState({status : err.message,  loading : false});
        }
    }

    render(){
        return (
            <SafeAreaView style = {{flex : 1, flexDirection : 'column'}}>
                <View style = {styles.header} >
                    <TouchableOpacity onPress = {() => {this.props.navigation.openDrawer()}} >
                        <Entypo name = "menu" size = {32} color='#fff'/>
                    </TouchableOpacity>
                    <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style ={{fontSize : 20, color : '#fff', fontWeight : 'bold'}} >Settings</Text>
                    </View>
                    <TouchableOpacity style = {{width : 30}}>
                    </TouchableOpacity>
                </View>
                <View style = {styles.container} >
                    <Spinner
                        visible={this.state.loading}
                    />
                    <View style ={styles.banner_container}>
                        <View  style = {styles.title}>
                            <Text style = {styles.title_label}>Zelle Info</Text>
                        </View>
                        {
                            this.state.err_zelle != '' ? 
                            <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_zelle}</Text>
                            : null
                        }
                        <View style = {styles.searchBar}>
                            <View style={styles.formItem}>
                                <AntDesignIcon size={24} color='#3434ff77'  name = 'phone' />
                                <TextInput
                                onChangeText={(value) => this.setState({ zelle_phone: value })}
                                placeholder= "Your phone number"
                                autoCorrect={false}
                                autoCapitalize='none'
                                value = {this.state.zelle_phone}
                                style={styles.inputTxt}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <AntDesignIcon  size={24} color='#3434ff77'  name = 'mail' />
                                <TextInput
                                onChangeText={(value) => this.setState({ zelle_email: value })}
                                placeholder= "Your email"
                                autoCapitalize='none'
                                value = {this.state.zelle_email}
                                style={styles.inputTxt}
                                />
                            </View>
                            <View style = {{width : '100%', marginTop : 24}}>
                                <TouchableOpacity onPress = {() => this.addZelle()} style = {{justifyContent : 'center', alignItems : 'center', backgroundColor : '#3434ff77', height : 40, borderRadius : 10, }}>
                                    <Text style = {{color : 'white', fontSize : 20, fontWeight : 'bold'}}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
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
        justifyContent : 'flex-start',
        alignItems : 'center',
        paddingLeft : 30,
        paddingRight : 30,
        paddingTop : 30,
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
    title_label : {
        color: '#000',
        fontSize: 18,
        fontWeight : 'bold',
        alignSelf: 'center',
        marginLeft : 24,
        marginBottom : 24
    },
    title : {
    },
    inputTxt: {
        textAlignVertical: 'center',
        fontSize: 16,
        textAlign : 'center',
        borderRadius : 16,
        borderWidth : 1,
        width : '100%',
        marginLeft : -40,
        padding: 16
    },
    searchBar : {
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'flex-start',
        alignItems : 'center',
        width : '100%'
    },
    formItem : {
        flexDirection : 'row', 
        width : '100%', 
        justifyContent : 'center',
        alignItems : 'center',
        marginLeft : 20,
        marginTop : 24,
        height: 50
    }
    
});

