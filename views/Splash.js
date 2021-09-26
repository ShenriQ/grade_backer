import React from 'react';
import { View, ActivityIndicator, Text, Image, ImageBackground, Alert, Button, StatusBar , YellowBox ,TouchableOpacity } from 'react-native';
//... import { thisTypeAnnotation } from '@babel/types';
import {GlobalImgs} from '@assets/imgs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {_retrieveData, _storeData, _getUserDetail, _getSemesterSlug} from '../Helper/Util';

YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
  ]);

export default class Splash extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            isConnected : false,
        }
    }

    componentDidMount() {
        var that = this;
        
        setTimeout(function(){
            that.goMain();
        }, 3000);
    }

    goMain = async () =>{
        let user_id =  await _retrieveData('user_id');
        
        if(user_id == null)
        {
            this.props.navigation.replace('login');
        }
        else{
            let user_detail = await _getUserDetail(user_id);
            global.user_id = user_id;
            if(user_detail != null)
            {
                global.username = user_detail.username;
                global.email = user_detail.youremail;
                global.phone = user_detail.phone;
                global.image = user_detail.image;
            }

            let semester_slug = await _getSemesterSlug(global.user_id);
            if(semester_slug != null)
            {
                global.semester_slug = semester_slug;
            }
            this.props.navigation.replace('home');
        }
        
    }

    render(){
        return (
            <>
            <StatusBar hidden/>
            <ImageBackground   style={{width: '100%', height: '100%', resizeMode: 'contain'}}  source = {GlobalImgs.bg} >
                <View   style = {{flex: 1, flexDirection : 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Image source = {GlobalImgs.logo}/>
                    {/* <Text style = {{fontSize : 20, fontWeight : 'bold', color : '#fff'}}>GRADEBACKER</Text> */}
                </View>
            </ImageBackground>
            </>
        );
    }
    
}