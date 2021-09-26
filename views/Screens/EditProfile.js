import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, ScrollView, TouchableOpacity, Image, TextInput, FlatList, SafeAreaView } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { GlobalImgs, HomeImgs } from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { width, height, totalSize } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import * as ImagePicker from 'react-native-image-picker';
import MyModal from '../../customComponent/MyModal';
import { api_base_url, Msg_Register_Success, Msg_Register_Failed } from '../../Helper/Constant';
import { _retrieveData, _storeData, _getUserDetail } from '../../Helper/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';


export default class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            name: global.username,
            email: global.email,
            phone: global.phone,
            pass: '',
            confirmpass: '',
            err_msg_name: '',
            err_msg_email: '',
            err_msg_phone: '',
            err_msg_pass: '',
            err_msg_confirmpass: '',
            status: '',
            loading: false,
            isModalVisible: false,
            photoUrl: 'https://www.gradebacker.com' + global.image,
            base64Image: ''
        }
    }
 
    doUpdate = async () => {
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
        // if(this.state.pass == '')
        // {
        //     this.setState({err_msg_pass : 'Please input password.'})
        //     return;
        // }
        // if(this.state.confirmpass == '')
        // {
        //     this.setState({err_msg_confirmpass : 'Please confirm password.'})
        //     return;
        // }
        // if(this.state.confirmpass != this.state.pass)
        // {
        //     this.setState({err_msg_confirmpass : 'Please confirm password.'})
        //     return;
        // }

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
                url: api_base_url + "update",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                data: {
                    "user_id": global.user_id,
                    "email": this.state.email,
                    "name": this.state.name,
                    "base64Image": this.state.base64Image
                }
            })

            let data = await response.data;

            if (data.user != null && data.user != 0) // success
            {
                let user_detail = await _getUserDetail(data.user);
                if (user_detail != null) {
                    global.username = user_detail.username;
                    global.email = user_detail.youremail;
                    global.image = user_detail.image;
                }
                this.setState({
                    status: 'Update success!',
                    name: global.username,
                    email: global.email,
                    photoUrl: 'https://www.gradebacker.com' + global.image,
                    loading: false
                });
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
                this.setState({ status: Msg_Register_Failed, loading: false })
            }
        }
        catch (err) {
            this.setState({ status: err.message, loading: false });
        }
    }

    requestCameraPermission = async () => {
        let that = this;
        try {
            console.log('=========== Entered requestCameraPermission  ========');
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
                    console.log('=========== returned requestCameraPermission  ========');
                    // You can also display the image using data:
                    // alert(JSON.stringify(response))

                    that.setState({
                        photoUrl: response.uri,
                        base64Image: response.base64
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
                    // const source = { uri: response.uri };
                    // You can also display the image using data:
                    // console.log('======== selected image res :', response)
                    // let source;
                    // const dest = RNFS.DocumentDirectoryPath + "/avatar.jpg";
                    // if (Platform.OS === 'ios'){
                    //     await RNFS.copyAssetsFileIOS(response.uri, dest, response.width, response.height);
                    //     source = await RNFS.readFile(dest, 'base64');
                    // }
                    // if (Platform.OS === 'android')
                    //     source = await RNFS.readFile(response.uri, 'base64');

                    // console.log('Base64Image')
                    // console.log('====== selected img data:' , response.base64);
                    // console.log('Base64Image')
                    // alert(source)
                    this.setState({
                        photoUrl: response.uri,
                        base64Image: response.base64
                    });
                }
                this.setState({ isModalVisible: false });
            });
        } catch (err) {
            console.warn('====== imagepicker launchImgLibrary error : ', err);
        }
    }

    showModal = () => {
        this.setState({ isModalVisible: true });
    };

    onModalResult = (res) => {
        // this.setState({isModalVisible: false});
        if (res == -1) {
            this.setState({ isModalVisible: false });
            return;
        }
        else if (res == 0) { // take photo
            this.requestCameraPermission();
        }
        else if (res == 1) { // select from image gallery
            this.requestImagGalleryPermission();
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles.header} >
                    <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }} >
                        <Entypo name="menu" size={32} color='#fff' />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }} >Edit Profile</Text>
                    </View>
                    <TouchableOpacity style={{ width: 30 }}>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Spinner
                        visible={this.state.loading}
                    />
                    <MyModal isModalVisible={this.state.isModalVisible} onModalResult={this.onModalResult}
                        title="Select Avatar" buttons={["Take Photo from Camera", "Select from Image Library"]} />
                    <View style={styles.container} >

                        <View style={styles.banner_container}>
                            <View style={styles.title}>
                                <Text style={{ color: '#ff0000' }}>{this.state.status}</Text>
                            </View>
                            <View style={styles.searchBar}>
                                <View>
                                    <Avatar
                                        onPress={() => this.showModal()}
                                        rounded
                                        activeOpacity={0.2}
                                        size={width(25)}
                                        source={{ uri: this.state.photoUrl }}
                                    />
                                </View>
                                <ScrollView style={{ width: width(90), padding: 20, marginTop: 10 }}>
                                    <View style={styles.formItem}>
                                        <AntDesignIcon size={24} color='#3434ff77' name='user' />
                                        <TextInput
                                            onChangeText={(value) => this.setState({ name: value })}
                                            placeholder="Your name"
                                            autoCapitalize='none'
                                            value={this.state.name}
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
                                            placeholder="Your email"
                                            autoCorrect={true}
                                            autoCapitalize='none'
                                            value={this.state.email}
                                            style={styles.inputTxt}
                                        />
                                    </View>
                                    {
                                        this.state.err_msg_email != '' ?
                                            <Text style={{ color: '#ff0000', textAlign: 'center' }}>{this.state.err_msg_email}</Text>
                                            : null
                                    }

                                    {/* <View style={styles.formItem}>
                                        <AntDesignIcon  size={24} color='#3434ff77'  name = 'lock' />
                                        <TextInput
                                        onChangeText={(value) => this.setState({ pass: value })}
                                        placeholder= "Your password"
                                        secureTextEntry = {false}
                                        autoCapitalize='none'
                                        style={styles.inputTxt}
                                        />
                                    </View> */}
                                    {/* {
                                        this.state.err_msg_pass != '' ? 
                                        <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_msg_pass}</Text>
                                        : null
                                    }
                                    <View style={styles.formItem}>
                                        <AntDesignIcon  size={24} color='#3434ff77'  name = 'lock' />
                                        <TextInput
                                        onChangeText={(value) => this.setState({ confirmpass: value })}
                                        placeholder= "Confirm password"
                                        secureTextEntry = {true}
                                        autoCapitalize='none'
                                        style={styles.inputTxt}
                                        />
                                    </View>
                                    {
                                        this.state.err_msg_confirmpass != '' ? 
                                        <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_msg_confirmpass}</Text>
                                        : null
                                    } */}
                                    <View style={{ padding: 30, width: '100%', marginBottom: 20 }}>
                                        <TouchableOpacity onPress={this.doUpdate} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#3434ff77', height: 40, borderRadius: 10, }}>
                                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Update</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>

                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#F7991C',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        width: width(100),
        height: 62
    },
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
        width: width(100),
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
        marginTop: 24,
        marginLeft: 10,
        height: 50
    }

});

