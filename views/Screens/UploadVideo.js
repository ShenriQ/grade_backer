import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, StatusBar, KeyboardAvoidingView, TouchableOpacity, Image, TextInput, Picker, FlatList, SafeAreaView } from 'react-native';
import { Input, Avatar, Divider } from 'react-native-elements';
import { GlobalImgs, HomeImgs } from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { width, height, totalSize } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { api_base_url, Msg_Login_Success, Msg_Login_Failed } from '../../Helper/Constant';
import { retrieveData, storeData, seconds2Time } from '../../Helper/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import AudioPlayItem from '../Component/AudioPlayItem';
var RNFS = require('react-native-fs');
 
const UploadVideo = (props) => {
    const semesterid = props.route?.params?.semesterid;
    const [loading, setLoading] = useState(false);

    const audioPath = AudioUtils.DocumentDirectoryPath + '/tmp.aac'; 

    const [audioFile, setAudioFile] = useState(null);
    const [finished, setFinished] = useState(false); 
    const [hasPermission, setHasPermission] = useState(null);

    const statusRef = useRef('cancel');

    const [currentTime, setTime] = useState(0);
    const curTimeRef = useRef(currentTime);
    const setCurrentTime = time => {
        curTimeRef.current = time
        setTime(time)
    };

    useEffect(() => {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            setHasPermission(isAuthorised);
            if (!isAuthorised) return;

            prepareRecordingPath(audioPath);

            AudioRecorder.onProgress = (data) => {
                setCurrentTime(Math.floor(data.currentTime))
            };

            AudioRecorder.onFinished = (data) => {
                _finishRecording(data.status === "OK", data.audioFileURL, data.base64.length, data.base64);
                // Android callback comes in the form of a promise instead.
                // if (Platform.OS === 'ios') {
                //   _finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                // }
            }; 
            
        });

        const removeFocus = props.navigation.addListener("focus", async () => {
            setLoading(false)
            setCurrentTime(0)
            setFinished(false)
            setAudioFile(null)
            statusRef.current = 'cancel';
        });

        return () => {
            if(removeFocus) {
                removeFocus()
            }
        } 
    }, [])

    const prepareRecordingPath = (audioPath) => {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000,
            IncludeBase64: true
        });
    }

    const _finishRecording = (didSucceed, filePath, fileSize, base64) => {
        setFinished(didSucceed);
        if (didSucceed == true) {
            console.log(`Finished recording of duration ${curTimeRef.current} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
            
            setAudioFile(base64)
        } 
        else {
            setAudioFile(null)
        }
    }

    const _pause = async () => {
        if (statusRef.current != 'recording') {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording(); 
            statusRef.current = 'paused'; 
        }
        catch (error) {
            console.error(error);
        }
    }

    const _resume = async () => {
        if (statusRef.current != 'paused') {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            statusRef.current = 'recording'; 
        } catch (error) {
            console.error(error);
        }
    }

    const _stop = async () => {
        if (statusRef.current != 'recording') {
            console.warn('Can\'t stop, not recording!');
            return;
        }
 
        try {
            const filePath = await AudioRecorder.stopRecording();
            statusRef.current = 'cancel';
            // if (Platform.OS === 'android') {
            //   _finishRecording(true, filePath);
            // }
            return filePath;
        } catch (error) {
            console.error(error);
        }
        return;
    }

    const _record = async () => {
        if (statusRef.current == 'recording') {
            console.warn('Already recording!');
            return;
        }

        if (!hasPermission) {
          console.warn('Can\'t record, no permission granted!');
          return;
        }
        if (statusRef.current == 'cancel') {
            prepareRecordingPath(audioPath);
        }
  
        try {
            const filePath = await AudioRecorder.startRecording();
            statusRef.current = 'recording';
            setAudioFile(null);
        } 
        catch (error) {
            console.error(error);
        }
    }
  
    const onPressMicroPhone = () => {
        if (statusRef.current == 'cancel') {
            _record();
        }
        else if (statusRef.current == 'recording') {
            _stop();
        }
        else if (statusRef.current == 'paused') {
            _resume();
        } 
    }

    const handleUploadAudio = async () => {
        try { 
            setLoading(true); 
            let post_data = {};
            post_data.semesterid = semesterid;
            post_data.audio = audioFile;

            let result = await axios({
                method: 'post',
                url: api_base_url + "uploadaudio",
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
                setLoading(false); 
                props.navigation.navigate('zelle_number');
            }
            else {
                setLoading(false);
            }
        }
        catch (err) {
            console.log('err.message');
            console.log(err);
            setLoading(false);
        }
    }

    const onSkip= async ()=>{
        await _stop();
        props.navigation.navigate('zelle_number');
    }

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>

            <Spinner
                visible={loading}
            />
            <View style={styles.header} >
                <TouchableOpacity onPress={() => { props.navigation.openDrawer() }} >
                    <Entypo name="menu" size={32} color='#fff' />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }} >Edit Profile</Text>
                </View>
                <TouchableOpacity style={{ width: 30 }}>
                </TouchableOpacity>
            </View>

            <KeyboardAwareScrollView enableOnAndroid> 
                <View style={styles.container} >
                    <View style={styles.title}>
                        <Text style={[styles.title_label, { fontWeight: 'bold', alignSelf: 'center', fontSize: 20 }]}>Summary Audio</Text>
                    </View>
                    <View style={[styles.title, { fontSize: 28, fontWeight: 'bold' }]}>
                        <Text style={styles.title_label}>In a short audio please share in detail how your college life went for this month. What did you do?did you try anything new? Did you go anywhere? what is a fun story you want to share with your friends and family, etc.</Text>
                    </View>
                    {
                        audioFile && statusRef.current == 'cancel' ?
                            <AudioPlayItem audio={{duration : curTimeRef.current, url : audioPath}} />
                            :
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
                                <Text style={{ fontSize: 16, }}>{seconds2Time(currentTime)}</Text>
                            </View>
                    }
                    <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 60, }}>
                        <TouchableOpacity onPress={onPressMicroPhone}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 45, height: 45, borderRadius: 30, backgroundColor: '#23cbd8' }}>
                            <MaterialCommunityIcons name={statusRef.current == 'recording' ? "microphone-off" : "microphone"}
                                style={{ fontSize: 32, color: '#fff' }}
                            />
                        </TouchableOpacity>
                        <Text style={{marginTop: 12, fontSize: 13, fontWeight: '500', color: '#222'}}>{statusRef.current == 'recording' ? "Stop" : "Start"}</Text>
                    </View>

                    {
                        audioFile && statusRef.current == 'cancel' && (
                            <TouchableOpacity onPress={() => handleUploadAudio()} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#3434ff77', width: width(50), padding: 10, borderRadius: 10, marginTop: 8, alignSelf: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
                            </TouchableOpacity>
                        )
                    }
                    <TouchableOpacity onPress={onSkip} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#888', padding: 10, borderRadius: 10, marginTop: 8, alignSelf: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', }}>Skip audio uploading</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>

        </SafeAreaView>
    );
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
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 30,
        marginBottom: 60,
        width: width(100),
    },
    banner_container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 50
    },
    list_container: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
    },
    title_label: {
        color: '#000',
        fontSize: 16,
        // marginLeft : 24,
        marginBottom: 24,
        textAlign: 'left',
        alignSelf: 'flex-start'
    },
    title: {
        width: '100%',
    }, 
    elapsedtime: { marginLeft: 16, flex: 1, fontSize: 16,  color: '#222' },
    cancelTxt: { marginRight: 5, fontSize: 14,  color: '#23cbd8' },
}); 

export default UploadVideo;