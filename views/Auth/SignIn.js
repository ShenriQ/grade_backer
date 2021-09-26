import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, TouchableOpacity, Image, TextInput, FlatList, SafeAreaView } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import { GlobalImgs, HomeImgs } from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { width, height, totalSize } from 'react-native-dimension';
import { api_base_url, Msg_Login_Success, Msg_Login_Failed } from '../../Helper/Constant';
import { _retrieveData, _storeData, _getUserDetail, _getSemesterSlug } from '../../Helper/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            loading: false,
            status: '',
            email: '',
            password: '',
            err_msg_email: '',
            err_msg_pass: '',
            forgotPassword: false
        }
    }

    close = () => {
        this.props.close();
    }

    doSign = async () => {
        this.setState({
            err_msg_email: '',
            err_msg_pass: '',
        });
        if (this.state.email == '') {
            this.setState({ err_msg_email: 'Please input username or email' })
            return;
        }
        if (this.state.password == '') {
            this.setState({ err_msg_pass: 'Please input password' })
            return;
        }

        this.setState({
            err_msg_email: '',
            err_msg_pass: '',
            status: '',
            loading: true
        });

        try {
            let response = await axios({
                method: 'post',
                url: api_base_url + "login",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                data: {
                    "username": this.state.email,
                    "password": this.state.password
                }
            })

            let data = await response.data;
            if (data.reponse == '') // success
            {
                await _storeData('user_id', '' + data.user);

                global.user_id = data.user;
                let user_detail = await _getUserDetail(data.user);
                if (user_detail != null) {
                    global.username = user_detail.username;
                    global.email = user_detail.youremail;
                    global.phone = user_detail.phone;
                    global.image = user_detail.image;
                }

                let semester_slug = _getSemesterSlug(global.user_id);
                if (semester_slug != null) {
                    global.semester_slug = semester_slug;
                }

                this.setState({ status: Msg_Login_Success, loading: false });
                this.props.goHome();
            }
            else {
                this.setState({ status: data.reponse, loading: false })
            }
        }
        catch (err) {
            console.log(err)
            this.setState({ status: err.message, loading: false });
        }
    }

    openForgotPassword = async () => {
        this.setState({ forgotPassword: true })
    }
    submitCode = async () => {
        this.setState({
            err_msg_email: '',
        });
        if (this.state.email == '') {
            this.setState({ err_msg_email: 'Please input or email' })
            return;
        }
        this.setState({
            err_msg_email: '',
            status: '',
            loading: true
        });

        try {
            let response = await axios({
                method: 'post',
                url: api_base_url + "forgotpassword",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                data: {
                    "email": this.state.email,
                }
            })

            let data = await response.data;
            this.setState({ forgotPassword: false, loading: false })
            alert('Please check your mailbox. You will receive a message including a web link to reset your password. It might take about a few minutes.')
        }
        catch (err) {
            // console.log(err)
            this.setState({ status: err.message, loading: false });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Spinner
                    visible={this.state.loading}
                />
                {
                    this.state.forgotPassword ? (
                        <View style={styles.container} >
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginBottom: 10 }}>
                                <TouchableOpacity onPress={this.close} >
                                    <AntDesignIcon name="closecircleo" size={22} color='#ff3433' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.banner_container}>
                                <View style={styles.title}>
                                    <Text style={styles.title_label}>Forgot Password</Text>
                                </View>
                                <View style={styles.title}>
                                    <Text style={{ color: '#ff0000' }}>{this.state.status}</Text>
                                </View>
                                <View style={styles.searchBar}>
                                    <View style={styles.formItem}>
                                        <AntDesignIcon style={{ marginHorizontal: -30 }} size={24} color='#3434ff77' name='mail' />
                                        <TextInput
                                            onChangeText={(value) => this.setState({ email: value })}
                                            placeholder="Email"
                                            autoCapitalize='none'
                                            style={styles.inputTxt}
                                        />
                                    </View>
                                    {
                                        this.state.err_msg_email != '' ?
                                            <Text style={{ color: '#ff0000' }}>{this.state.err_msg_email}</Text>
                                            : null
                                    }

                                    <View style={{ padding: 30, width: '100%' }}>
                                        <TouchableOpacity onPress={() => this.submitCode()} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#3434ff77', height: 40, borderRadius: 10, }}>
                                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Send code</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.container} >
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginBottom: 10 }}>
                                <TouchableOpacity onPress={this.close} >
                                    <AntDesignIcon name="closecircleo" size={22} color='#ff3433' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.banner_container}>
                                <View style={styles.title}>
                                    <Text style={styles.title_label}>Login</Text>
                                </View>
                                <View style={styles.title}>
                                    <Text style={{ color: '#ff0000' }}>{this.state.status}</Text>
                                </View>
                                <View style={styles.searchBar}>
                                    <View style={styles.formItem}>
                                        <AntDesignIcon style={{ marginHorizontal: -30 }} size={24} color='#3434ff77' name='mail' />
                                        <TextInput
                                            onChangeText={(value) => this.setState({ email: value })}
                                            placeholder="Email"
                                            autoCapitalize='none'
                                            style={styles.inputTxt}
                                        />
                                    </View>
                                    {
                                        this.state.err_msg_email != '' ?
                                            <Text style={{ color: '#ff0000' }}>{this.state.err_msg_email}</Text>
                                            : null
                                    }
                                    <View style={styles.formItem}>
                                        <AntDesignIcon style={{ marginHorizontal: -30 }} size={24} color='#3434ff77' name='lock' />
                                        <TextInput
                                            onChangeText={(value) => this.setState({ password: value })}
                                            placeholder="Password"
                                            secureTextEntry={true}
                                            autoCapitalize='none'
                                            style={styles.inputTxt}
                                        />
                                    </View>
                                    {
                                        this.state.err_msg_pass != '' ?
                                            <Text style={{ color: '#ff0000' }}>{this.state.err_msg_pass}</Text>
                                            : null
                                    }

                                    <View style={{ padding: 30, width: '100%' }}>
                                        <TouchableOpacity onPress={() => this.doSign()} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#3434ff77', height: 40, borderRadius: 10, }}>
                                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Login</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingHorizontal: 30, width: '100%' }}>
                                        <TouchableOpacity onPress={() => this.openForgotPassword()} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000022', height: 40, borderRadius: 10, }}>
                                            <Text style={{ color: '#787878', fontSize: 20, fontWeight: '400' }}>Forgot password</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                }
            </View>
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
        // marginBottom : 24
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
        padding: 16
    },
    searchBar: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    formItem: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginLeft: 40
    }

});

