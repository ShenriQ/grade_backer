import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, StatusBar, TouchableOpacity, Image, TextInput, Picker, FlatList, SafeAreaView, Platform, ActionSheetIOS } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { GlobalImgs, HomeImgs } from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { width, height, totalSize } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import { api_base_url, Msg_Login_Success, Msg_Login_Failed } from '../../Helper/Constant';
import Spinner from 'react-native-loading-spinner-overlay';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'
import { RNCamera } from 'react-native-camera';
import { Modal } from 'react-native';
import { Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
var RNFS = require('react-native-fs');
// import RNFetchBlob from 'react-native-fetch-blob';
// RNFetchBlob.config({
//     timeout: 2000000
// })

let that = null;
let imageCount = 0;

export default class EditSemester extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        that = this;
        this.camera = React.createRef();
        this.state = {
            status: '',
            loading: false,
            school_name: '',
            level: 1,
            err_msg_schoolname: '',
            err_msg_photo: '',
            images: [],
            lebels: [
                'Freshman',
                'Sophmore',
                'Junior',
                'Senior',
                'Other'
            ],
            label: 'Freshman',
            recording: false,
            processing: false,
            showCamera: false,
            video: '',
            codec: 'mp4',
            remainingSeconds: 0
        }
    }


    requestImagGalleryPermission = async () => {
        try {
            const options = {
                title: 'Select Semestarer Picture',
                includeBase64: true,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            };
            if (imageCount == 4) { console.log("4 images!"); return }
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    // console.log(response)
                    const source = { uri: response.uri };
                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                    console.log(response.uri)
                    imageCount += 1
                    this.addImage(response)
                }
            });
        } catch (err) {
            console.warn(err);
        }
    }

    addImage = (file) => {
        let tmp_imgs = this.state.images.slice();
        tmp_imgs.push(file)
        this.setState({
            images: tmp_imgs,
        });
    }

    doSubmit = async () => {
        if (this.state.school_name == '') {
            this.setState({ err_msg_schoolname: 'Please input name.' })
            return;
        }
        // if(this.state.images.length == 0)
        // {
        //     this.setState({err_msg_photo : 'Please upload semester picture.'})
        //     return;
        // }

        this.setState({
            loading: true,
            err_msg_photo: '',
            err_msg_schoolname: ''
        })

        try {
            let post_data = {};
            post_data.user_id = global.user_id;
            post_data.school = this.state.school_name;
            post_data.level = this.state.level;
            post_data.img_cnt = this.state.images.length;
            this.state.images.map((image, index) => {
                post_data['base64image' + index] = image.base64; // data;
            });

            let result = await axios({
                method: 'post',
                url: api_base_url + "insertsemester",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                data: post_data
            }).then(res => {
                return res;
            }).catch(err => {
                console.log('error occured...')
                console.log(err)
                return err;
            })
            let data = await result.data;
            console.log(data)
            if (data.response === "no") // success
            {
                this.setState({ status: 'success', loading: false });
                this.props.navigation.navigate('upload_video', {semesterid: data.semesterid});
            }
            else {
                this.setState({ status: 'failed', loading: false })
            }
        }
        catch (err) {
            console.log('err.message');
            console.log(err);
            this.setState({ status: err, loading: false });
        }
    }

    onSelect() {
        const options = [
            "Cancel",
            'Freshman',
            'Sophmore',
            'Junior',
            'Senior',
            'Other'
        ];
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: options,
                cancelButtonIndex: 0
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    // cancel action
                } else {
                    this.setState({ label: options[buttonIndex], level: buttonIndex })
                }
            }
        );
    }

    async startRecording() {
        this.setState({ recording: true });
        this.timer = setInterval(() => {
            let _se = this.state.remainingSeconds;
            if (_se != 0) {
                _se -= 1;
                this.setState({ remainingSeconds: _se });
            } else {
                this.camera && this.stopRecording()
            }
        }, 1000);
        setTimeout(() => {
            if (this.state.recording) {
                this.camera && this.stopRecording();
            }
            clearInterval(this.timer)
        }, 30000);
        // default to mp4 for android as codec is not set
        const { uri, codec = "mp4" } = await this.camera.recordAsync({
            maxDuration: 30,
            orientation: 'portrait'
        });
        this.setState({ video: uri, codec: codec })
    }

    stopRecording() {
        this.camera.stopRecording();
        if (this.timer) clearInterval(this.timer)
        this.setState({ showCamera: false, recording: false, processing: false });
    }

    deleteVideo() {
        this.setState({ video: '' })
    }

    render() {
        const { recording, processing, showCamera, video, remainingSeconds } = this.state;

        let button = (
            <TouchableOpacity
                onPress={this.startRecording.bind(this)}
                style={styles.capture}
            >
                <Text style={{ fontSize: 14 }}> RECORD </Text>
            </TouchableOpacity>
        );

        if (recording) {
            button = (
                <TouchableOpacity
                    onPress={this.stopRecording.bind(this)}
                    style={styles.capture}
                >
                    <Text style={{ fontSize: 14 }}> STOP </Text>
                </TouchableOpacity>
            );
        }

        if (processing) {
            button = (
                <View style={styles.capture}>
                    <ActivityIndicator animating size={18} />
                </View>
            );
        }

        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
                <Spinner
                    visible={this.state.loading}
                />
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
                <View style={styles.container} >
                    <View style={styles.banner_container}>
                        <View style={styles.title}>
                            <Text style={[styles.title_label, { textAlign: 'center' }]}>Upload images of your class work, quiz, test or grades.</Text>
                        </View>
                        <ScrollView style={styles.searchBar}>
                            <View style={styles.formItem}>
                                <AntDesignIcon style={{ marginLeft: 8 }} size={24} color='#3434ff77' name='home' />
                                <TextInput
                                    onChangeText={(value) => this.setState({ school_name: value })}
                                    placeholder="Name of School"
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    style={styles.inputTxt}
                                />
                            </View>
                            {
                                this.state.err_msg_schoolname != '' ?
                                    <Text style={{ color: '#ff0000', textAlign: 'center', padding: 10 }}>{this.state.err_msg_schoolname}</Text>
                                    : null
                            }
                            <View style={styles.formItem}>
                                <AntDesignIcon style={{ marginLeft: 8 }} size={24} color='#3434ff77' name='flag' />
                                <View style={{ flex: 1 }}></View>
                                {
                                    Platform.OS === 'android' && (
                                        <Picker
                                            selectedValue={this.state.level}
                                            style={{ flex: 2, height: 50, width: 150 }}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ level: itemValue })}
                                        >
                                            <Picker.Item label="Freshman" value={1} />
                                            <Picker.Item label="Sophmore" value={2} />
                                            <Picker.Item label="Junior" value={3} />
                                            <Picker.Item label="Senior" value={4} />
                                            <Picker.Item label="Other" value={5} />
                                        </Picker>
                                    )
                                }
                                {
                                    Platform.OS === 'ios' && (
                                        <View style={{ width: '90%', height: 50, flexDirection: 'row', padding: 12, justifyContent: 'space-evenly' }}>
                                            <Text onPress={() => this.onSelect()} style={{ width: '90%', fontSize: 18, textAlign: 'center' }}>{this.state.label}</Text>
                                            <Icon
                                                name="angle-down"
                                                color="#aaa"
                                                size={26}
                                                style={{ justifyContent: 'flex-end' }}
                                            />
                                        </View>
                                    )
                                }
                            </View>
                            <View style={{ marginTop: 10, paddingLeft: 5 }}>
                                {
                                    this.state.images.map((item, index) =>
                                        <View key={index} style={{ flexDirection: 'row', margin: 4 }}>
                                            <FontAwesome size={20} name="image" style={{ marginRight: 6 }} />
                                            <Text style={{ color: '#3434ff77', fontSize: 16, fontWeight: 'bold' }}>{item.fileName}</Text>
                                        </View>
                                    )
                                }
                            </View>

                            <View style={{ width: '100%', marginTop: 24 }}>
                                <TouchableOpacity onPress={() => this.requestImagGalleryPermission()} style={{ justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10, }}>
                                    <AntDesignIcon style={{ marginLeft: 8 }} size={32} color='#3434ff77' name='cloudupload' />
                                    <Text style={{ color: '#3434ff77', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Upload picture or screenshot of grades</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.err_msg_photo != '' ?
                                    <Text style={{ color: '#ff0000', textAlign: 'center' }}>{this.state.err_msg_photo}</Text>
                                    : null
                            }
                            <View style={{ width: '100%', marginTop: 24 }}>
                                <TouchableOpacity onPress={() => this.doSubmit()} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#3434ff77', padding: 10, borderRadius: 10, }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
        paddingTop: 30,
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
        flex: 1,
        padding: 16
    },
    searchBar: {
        flex: 1,
        width: '100%'
    },
    formItem: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000'
    },
    preview: {
        width: '100%',
        height: '100%'
    },
    capture: {
        width: 100,
        height: 40,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',

    }

});

