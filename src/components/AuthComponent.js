import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signUpUser, signInUser, onAuthStateChange } from '../firebase/auth';

const { width: screenWidth } = Dimensions.get('window');
const isSmallDevice = screenWidth < 375;

const AuthComponent = ({ onAuthSuccess, currentScreen, setCurrentScreen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        onAuthSuccess(user);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signUpUser(email, password, username);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      onAuthSuccess(result.user);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await signInUser(email, password);
    setLoading(false);

    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const LoginForm = () => (
    <View style={styles.authContainer}>
      <View style={styles.authContent}>
        <Text style={styles.logo}>Instagram</Text>
        <Text style={styles.subtitle}>Sign in to see photos and videos from your friends.</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.authButton, loading && styles.authButtonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>
            {loading ? 'Signing In...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={20} color="#4285F4" />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchAuth}>
        <Text style={styles.switchAuthText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
          <Text style={styles.switchAuthLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const SignUpForm = () => (
    <View style={styles.authContainer}>
      <View style={styles.authContent}>
        <Text style={styles.logo}>Instagram</Text>
        <Text style={styles.subtitle}>Sign up to see photos and videos from your friends.</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={[styles.authButton, loading && styles.authButtonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.authButtonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={20} color="#4285F4" />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchAuth}>
        <Text style={styles.switchAuthText}>Have an account? </Text>
        <TouchableOpacity onPress={() => setCurrentScreen('login')}>
          <Text style={styles.switchAuthLink}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return currentScreen === 'login' ? <LoginForm /> : <SignUpForm />;
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: isSmallDevice ? 20 : 40,
  },
  authContent: {
    alignItems: 'center',
  },
  logo: {
    fontSize: isSmallDevice ? 40 : 48,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'serif',
    color: '#262626',
  },
  subtitle: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: isSmallDevice ? 12 : 14,
    fontSize: isSmallDevice ? 14 : 16,
    marginBottom: 12,
    color: '#262626',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: isSmallDevice ? 14 : 16,
  },
  authButton: {
    backgroundColor: '#405DE6',
    paddingVertical: isSmallDevice ? 12 : 14,
    paddingHorizontal: 40,
    borderRadius: 6,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  authButtonDisabled: {
    backgroundColor: '#B2DFFC',
  },
  authButtonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#405DE6',
    fontSize: isSmallDevice ? 12 : 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dbdbdb',
  },
  dividerText: {
    marginHorizontal: 20,
    color: '#8e8e8e',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    paddingVertical: isSmallDevice ? 12 : 14,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: '100%',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
    color: '#262626',
  },
  switchAuth: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
  },
  switchAuthText: {
    color: '#8e8e8e',
    fontSize: isSmallDevice ? 12 : 14,
  },
  switchAuthLink: {
    color: '#405DE6',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
});

export default AuthComponent;
