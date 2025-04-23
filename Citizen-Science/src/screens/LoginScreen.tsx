import React, { useContext, useState, useEffect } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  View,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomTextField from '../components/CustomTextField';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LogoName from '../components/LogoName';
import BackButton from '../components/BackButton';
import ScreenTitle from '../components/ScreenTitle';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Blobs from '../components/Blobs';
import { loginUser } from '../api/auth';
import { storeToken } from '../util/token';
import { AuthContext } from '../util/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const { setUserToken } = useContext(AuthContext);

  const handleLoginPress = async () => {
    try {
      const response = await loginUser(email, password);
      await storeToken('accessToken', response.accessToken);
      await storeToken('refreshToken', response.refreshToken);
      setUserToken(response.accessToken);
    } catch (error) {
      console.log('Login failed', error);
    }
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleSignInWithGoogle(response.authentication?.accessToken);
    }
  }, [response]);

  const handleSignInWithGoogle = async (token: string | undefined) => {
    if (!token) return;
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ImageBackground source={require('../../assets/background1.png')} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            <Blobs rotationDeg={'0deg'} widthPercentage={20} heightPercentage={10} position={{ top: 6, left: 80 }} />
            <Blobs rotationDeg={'0deg'} widthPercentage={6} heightPercentage={3} position={{ top: 15, left: 93 }} />
            <LogoName position={'bottomRight'} color={'grey'} />
            <BackButton position={{ top: -30, left: -45 }} />
            <ScreenTitle text={'Welcome \nBack'} textStyle={'title'} fontSize={5} color={'white'} position={{ top: -17, left: -20 }} />
            <CustomTextField
              size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
              borderColor='#5EA1E9'
              borderRadius={10}
              position={{ top: 8, left: 0 }}
              textContentType={'oneTimeCode'}
            />
            <CustomTextField
              size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              borderColor='#5EA1E9'
              borderRadius={10}
              position={{ top: 10, left: 0 }}
              textContentType={'oneTimeCode'}
            />
            <CustomButton
              size={{ width: responsiveWidth(70), height: responsiveHeight(5.5) }}
              label='Login'
              labelColor='white'
              backgroundColor='#5EA1E9'
              onPress={handleLoginPress}
              position={{ top: 12, left: 0 }}
            />
            <View style={styles.googleButtonContainer}>
              <Button title='Sign in with Google' onPress={() => promptAsync()} color='#5EA1E9' />
            </View>
            <View style={{ marginTop: responsiveHeight(1) }}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(20),
  },
  googleButtonContainer: {
    marginTop: responsiveHeight(13),
  },
  signupText: {
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
  },
  signupLink: {
    fontSize: responsiveFontSize(2),
    color: '#5EA1E9',
  },
});

export default LoginScreen;
