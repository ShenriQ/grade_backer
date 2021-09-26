import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, StatusBar, TouchableOpacity, Image, TextInput, PermissionsAndroid, Linking, FlatList, SafeAreaView } from 'react-native';
import { Input, Button, Avatar, CheckBox } from 'react-native-elements';
import { GlobalImgs, HomeImgs } from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { width, height, totalSize } from 'react-native-dimension';
import * as ImagePicker from 'react-native-image-picker';
import MyModal from '../../customComponent/MyModal';
import { api_base_url, Msg_Register_Success, Msg_Register_Failed } from '../../Helper/Constant';
import { _retrieveData, _storeData, _getUserDetail, _getSemesterSlug } from '../../Helper/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            name: '',
            email: '',
            phone: '',
            pass: '',
            confirmpass: '',
            err_msg_name: '',
            err_msg_email: '',
            err_msg_pass: '',
            err_msg_phone: '',
            err_msg_confirmpass: '',
            status: '',
            term_checked: false,
            loading: false,
            isModalVisible: false,
            photoUrl: '',
            base64Image: '',
        }
    }

    close = () => {
        this.props.close();
    }

    doRegister = async () => {
        this.setState({
            err_msg_name: '',
            err_msg_email: '',
            err_msg_phone: '',
            err_msg_pass: '',
            err_msg_confirmpass: '',
        });
        if (this.state.name == '') {
            this.setState({ err_msg_name: 'Please input username.' })
            return;
        }
        if (this.state.email == '') {
            this.setState({ err_msg_email: 'Please input email.' })
            return;
        }
        if (this.state.phone == '') {
            this.setState({ err_msg_phone: 'Please input phonenumber.' })
            return;
        }
        if (this.state.pass == '') {
            this.setState({ err_msg_pass: 'Please input password.' })
            return;
        }
        if (this.state.confirmpass == '') {
            this.setState({ err_msg_confirmpass: 'Please confirm password.' })
            return;
        }
        if (this.state.confirmpass != this.state.pass) {
            this.setState({ err_msg_confirmpass: 'Please confirm password.' })
            return;
        }
        if (this.state.term_checked == false) {
            return;
        }

        this.setState({
            err_msg_name: '',
            err_msg_email: '',
            err_msg_phone: '',
            err_msg_pass: '',
            err_msg_confirmpass: '',
            status: '',
            loading: true
        });

        try {
            let response = await axios({
                method: 'post',
                url: api_base_url + "register",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                data: {
                    "username": this.state.name,
                    "password": this.state.pass,
                    "email": this.state.email,
                    "phone": this.state.phone, //'12345678901234',
                    "name": this.state.name,
                    "base64Image": this.state.base64Image
                }
            })

            let data = await response.data;

            if (data.user != null && data.user != 0) // success
            {
                await _storeData('user_id', '' + data.user);

                let user_detail = await _getUserDetail(data.user);
                global.user_id = data.user;
                if (user_detail != null) {

                    global.username = user_detail.username;
                    global.email = user_detail.youremail;
                    global.phone = user_detail.yourphone;
                    global.image = user_detail.image;
                }

                let semester_slug = _getSemesterSlug(global.user_id);
                if (semester_slug != null) {
                    global.semester_slug = semester_slug;
                }

                this.setState({ status: Msg_Register_Success, loading: false });
                this.props.goHome();
            }
            else if (data.user == null) {
                this.setState({ status: Msg_Register_Failed, loading: false })
            }
            else {
                if (data.reponse.username != null && data.reponse.username.length != null && data.reponse.username.length > 0) {
                    this.setState({ status: Msg_Register_Failed, err_msg_name: data.reponse.username[0], loading: false })
                }
                if (data.reponse.email != null && data.reponse.email.length != null && data.reponse.email.length > 0) {
                    this.setState({ err_msg_email: data.reponse.email[0], loading: false })
                }
                if (data.reponse.phone != null && data.reponse.phone.length != null && data.reponse.phone.length > 0) {
                    this.setState({ err_msg_phone: data.reponse.phone[0], loading: false })
                }
                if (data.reponse.password != null && data.reponse.password.length != null && data.reponse.password.length > 0) {
                    this.setState({ err_msg_pass: data.reponse.password[0], loading: false })
                }
                this.setState({ status: Msg_Register_Failed, loading: false })
            }
        }
        catch (err) {
            this.setState({ status: err.message, loading: false });
        }
    }
    
   
    requestCameraPermission = async () => {
        try {
            const options = {
                title: 'Select Avatar',
                includeBase64: true,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            };
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const source = { uri: response.uri };
                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                    console.log(response.data)
                    this.setState({
                        photoUrl: source,
                        base64Image: response.base64, //...data
                    });
                }
                this.setState({ isModalVisible: false });
            });
        } catch (err) {
            console.warn(err);
        }
    }

    requestImagGalleryPermission = async () => {
        try {
            const options = {
                title: 'Select Avatar',
                includeBase64: true,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            };
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    const source = { uri: response.uri };
                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                    console.log(response.data)
                    this.setState({
                        photoUrl: source,
                        base64Image: response.base64,   //...data
                    });
                }
                this.setState({ isModalVisible: false });
            });
        } catch (err) {
            console.warn(err);
        }
    }
    
    showModal = () => {
        this.setState({ isModalVisible: true });
    };

    onCloseModal = () => {
        this.setState({ isModalVisible: false })
    }
    onModalResult = (res) => {
        // this.setState({isModalVisible: false});
        if (res == -1) {
            this.setState({ isModalVisible: false })
            return;
        }
        else if (res == 0) { // take photo
            this.requestCameraPermission();
        }
        else if (res == 1) { // select from image gallery
            this.requestImagGalleryPermission();
        }
    }

    gotoTermsUrl = () => {
        try {
            const terms_url = 'https://gradebacker.com/page/terms-condition'; // Terms and Service
            Linking.openURL(terms_url);
        }
        catch (err) {
            alert(err);
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView style={{ flex: 1, flexDirection: 'column' }} extraScrollHeight={80}>
                <Spinner
                    visible={this.state.loading}
                    textContent={"Please remember your password."}
                    textStyle={{backgroundColor:'#ffffff', height:30}}
                />
                <MyModal isModalVisible={this.state.isModalVisible} onModalResult={this.onModalResult} onCloseModal={this.onCloseModal}
                    title="Select Avatar" buttons={["Take Photo from Camera", "Select from Image Library"]} />
                <View style={styles.container} >
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginBottom: 10 }}>
                        <TouchableOpacity onPress={this.close} >
                            <AntDesignIcon name="closecircleo" size={22} color='#ff3433' />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.banner_container}>
                        <View style={styles.title}>
                            <Text style={[styles.title_label, { textAlign: 'center' }]}>Register Gradebacker Account</Text>
                        </View>
                        <View style={styles.title}>
                            <Text style={{ color: '#ff0000' }}>{this.state.status}</Text>
                        </View>
                        <View style={styles.searchBar}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar
                                    onPress={this.showModal}
                                    rounded
                                    size={width(25)}
                                    source={this.state.photoUrl == '' ? GlobalImgs.default_user : this.state.photoUrl}
                                />
                                <Text style={{ color: '#ff0000' }}>Choose Image</Text>
                            </View>
                            <ScrollView style={{ width: width(90), padding: 20, marginTop: 10 }} >
                                <View style={styles.formItem}>
                                    <AntDesignIcon size={24} color='#3434ff77' name='user' />
                                    <TextInput
                                        onChangeText={(value) => this.setState({ name: value })}
                                        placeholder="Name"
                                        autoCapitalize='none'
                                        style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_name != '' ?
                                        <Text style={{ color: '#ff0000', textAlign: 'center' }}>{this.state.err_msg_name}</Text>
                                        : null
                                }
                                <View style={styles.formItem}>
                                    <AntDesignIcon size={24} color='#3434ff77' name='mail' />
                                    <TextInput
                                        onChangeText={(value) => this.setState({ email: value })}
                                        placeholder="Email"
                                        autoCorrect={true}
                                        autoCapitalize='none'
                                        style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_email != '' ?
                                        <Text style={{ color: '#ff0000', textAlign: 'center' }}>{this.state.err_msg_email}</Text>
                                        : null
                                }
                                 <View style={styles.formItem}>
                                    <AntDesignIcon size={24} color='#3434ff77' name='phone' />
                                    <TextInput
                                        onChangeText={(value) => this.setState({ phone: value })}
                                        placeholder="Phonenumber"
                                        autoCorrect={true}
                                        autoCapitalize='none'
                                        style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_phone != '' ?
                                        <Text style={{ color: '#ff0000', textAlign: 'center' }}>{this.state.err_msg_phone}</Text>
                                        : null
                                }
                                <View style={styles.formItem}>
                                    <AntDesignIcon size={24} color='#3434ff77' name='lock' />
                                    <TextInput
                                        onChangeText={(value) => this.setState({ pass: value })}
                                        placeholder="Password"
                                        secureTextEntry={true}
                                        autoCapitalize='none'
                                        style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_pass != '' ?
                                        <Text style={{ color: '#ff0000', textAlign: 'center' }}>{this.state.err_msg_pass}</Text>
                                        : null
                                }
                                <View style={styles.formItem}>
                                    <AntDesignIcon size={24} color='#3434ff77' name='lock' />
                                    <TextInput
                                        onChangeText={(value) => this.setState({ confirmpass: value })}
                                        placeholder="Confirm password"
                                        secureTextEntry={true}
                                        autoCapitalize='none'
                                        style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_confirmpass != '' ?
                                        <Text style={{ color: '#ff0000', textAlign: 'center' }}>{this.state.err_msg_confirmpass}</Text>
                                        : null
                                }
                                <View style={styles.terms_line}>
                                    <CheckBox checked={this.state.term_checked} onPress={() => {
                                        this.setState({ term_checked: !this.state.term_checked })
                                    }}
                                        checkedColor='#3434aa' activeOpacity={1} textStyle={styles.terms_checkbox_txt}
                                        containerStyle={styles.terms_checkbox} title='I agree with ' />
                                    <Text style={styles.terms_txt} onPress={() => this.gotoTermsUrl()}>Terms and conditions</Text>
                                </View>                                
                                
                                <View style={{ padding: 30, width: '100%', marginBottom: 30 }}>
                                    <TouchableOpacity onPress={this.doRegister} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#3434ff77', height: 40, borderRadius: 10, }}>
                                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Register</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: width(90),
    },
    banner_container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    list_container: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
    },
    title_label: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginLeft: 24,
        marginBottom: 24
    },
    title: {
    },
    inputTxt: {
        textAlignVertical: 'center',
        fontSize: 16,
        textAlign: 'center',
        borderRadius: 16,
        borderWidth: 1,
        flex: 1,
        marginLeft: -40,
        padding: 16
    },
    searchBar: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    formItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginLeft: 10,
    },
    terms_checkbox: {
        backgroundColor: "transparent",
        borderWidth: 0,
        color: '#3434aa',
        padding: 0,
        margin: 0
    },
    terms_checkbox_txt: {
        color: '#3434aa',
        fontWeight: 'normal',
        marginRight: 0
    },
    terms_line: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginBottom: 8,
        marginTop: 8,
        width: width(80),
        paddingLeft: 0,
    },
    terms_txt: {
        color: '#3434aa',
        fontWeight: 'normal',
        marginLeft: -5,
        height: 21
    }

});

