import React, {Component} from 'react';
import {TouchableHighlight, View, StyleSheet, Text} from 'react-native';

 class MyButton extends Component {
    constructor(props){
        super(props);
        this.props = props;
    }
    render() {
        return(
        <TouchableHighlight activeOpacity = {0.6} underlayColor = {this.props.underlayColor} onPress = {this.props.onPress} style = {[styles.button, this.props.style]} >
            <Text style={this.props.textStyle}>{this.props.title}</Text>
        </TouchableHighlight>); 
    };
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
    }
});

export default MyButton;