import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import Modal from 'react-native-modal';

export default class MyModal extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            isModalVisible: this.props.isModalVisible
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.props = props;
        this.setState({ isModalVisible: props.isModalVisible });
    }

    onModalResult = (res) => {
        this.props.onModalResult(res);
    }

    render() {
        return (
            <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.onModalResult(-1)}>
                <View style={{ width: '90%', alignSelf: 'center', padding: 10, backgroundColor: '#ffffff' }}>
                    <Text style={{ alignSelf: 'center', fontSize: 24 }}>{this.props.title}</Text>
                    {
                        this.props.buttons.map((btn_name, index) => {
                            return (
                                <Button title={btn_name} type="solid" buttonStyle={styles.button} key={index} onPress={() => this.onModalResult(index)} />
                            )
                        })
                    }
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        margin: 6
    }
});