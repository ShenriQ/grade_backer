import React from 'react';
import { View, Text, StyleSheet, ImageBackground,TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import { width, height, totalSize } from 'react-native-dimension';

export default class GradePicture extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            loading : true
        }
    }

    onPressedImage = () => {
       this.props.onPressedImage(this.props.index);
    }

    render(){
        return (
            <TouchableOpacity activeOpacity = {0.8} style = {{width: this.props.width, height : this.props.height, }}
                onPress = {this.onPressedImage} elevation={15} >
                <Card  style = {{width: this.props.width, height : this.props.height, }} containerStyle = {{borderRadius: 5, padding : 0}}> 
                    <ImageBackground source ={this.props.img.source}
                    imageStyle = {{borderRadius : 5}} style= {styles.bgImg} onLoad = {() => {this.setState({loading : false})}}
                    >
                        {this.state.loading == true ? <ActivityIndicator style = {{position : 'absolute', left : this.props.width / 2 - 30, top : this.props.height / 2 - 30}} size = {50} color = "#ff0000"/> : null}
                    </ImageBackground>
                </Card>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    bgImg: {
        width: '100%', height: '100%', resizeMode: 'cover', 
         justifyContent: 'flex-end', alignItems: 'flex-start',
    },
    container: {
        flexDirection : 'column', justifyContent: 'center', alignItems : 'center', width: '100%',
    },
    title : {
        color : '#fff',
        fontWeight : 'bold'
    },
    price : {
        color : '#85E491',
        fontWeight : 'bold'
    },
    info : {
        justifyContent: 'flex-end', alignItems: 'flex-start', paddingLeft : 20
    }
});

