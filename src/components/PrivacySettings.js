import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PrivacySettings = ({ userId, onSettingsChange }) => {d
  const [settings, setSettings] = useState({
    privateAccount: false,
    twoFactorAuth: false,
    closeFriends: [],
    blockedUsers: [],
    restrictedUsers: [],
    storyPrivacy: 'everyone', // everyone, followers, close_friends
    postPrivacy: 'everyone',
    dmPrivacy: 'everyone',
    commentPrivacy: 'everyone',
    activityStatus: true,
    profileVisibility: true,
    emailNotifications: true,
    pushNotifications: true,
    emailAddress: '',
    phoneNumber: '',
  });

  const [closeFriendsModal, setCloseFriendsModal] = useState(false);
  const [blockedUsersModal, setBlockedUsersModal] = useState(false);
  const [restrictedUsersModal, setRestrictedUsersModal] = useState(false);

  useEffect(() => {
    fetchPrivacySettings();
  }, [userId]);

  const fetchPrivacySettings = async () => {
    // Mock privacy settings - replace with Firebase queries
    const mockSettings = {
      privateAccount: false,
      twoFactorAuth: false,
      closeFriends: ['user1', 'user2', 'user3'],
      blockedUsers: ['blocked1', 'blocked2'],
      restrictedUsers: ['restricted1'],
      storyPrivacy: 'everyone',
      postPrivacy: 'everyone',
      dmPrivacy: 'everyone',
      commentPrivacy: 'everyone',
      activityStatus: true,
      profileVisibility: true,
      emailNotifications: true,
      pushNotifications: true,
      emailAddress: 'user@example.com',
      phoneNumber: '+1234567890',
    };

    setSettings(mockSettings);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    onSettingsChange?.({ ...settings, [key]: value });
  };

  const handleTwoFactorToggle = () => {
    if (!settings.twoFactorAuth) {
      Alert.alert(
        'Enable Two-Factor Authentication',
        'Two-factor authentication adds an extra layer of security to your account.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: () => updateSetting('twoFactorAuth', true) },
        ]
      );
    } else {
      updateSetting('twoFactorAuth', false);
    }
  };

  const handlePrivateAccountToggle = () => {
    const newValue = !settings.privateAccount;
    Alert.alert(
      newValue ? 'Private Account' : 'Public Account',
      newValue 
        ? 'Your account will be private. Only approved followers can see your posts and stories.'
        : 'Your account will be public. Anyone can see your posts and stories.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: newValue ? 'Make Private' : 'Make Public', onPress: () => updateSetting('privateAccount', newValue) },
      ]
    );
  };

  const PrivacyOption = ({ title, description, value, onValueChange }) => (
    <View style={styles.privacyOption}>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#5865f2' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  const PrivacySelector = ({ title, options, selected, onSelect }) => (
    <View style={styles.privacySelector}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selected === option.value && styles.selectedOption
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.optionButtonText,
              selected === option.value && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const UserListModal = ({ users, title, onRemove, onClose }) => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <ScrollView>
          {users.map(user => (
            <View key={user} style={styles.userItem}>
              <Text style={styles.userName}>{user}</Text>
              <TouchableOpacity onPress={() => onRemove(user)}>
                <Ionicons name="close-circle" size={24} color="#ff4757" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
          <Text style={styles.closeModalText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const privacyOptions = [
    { label: 'Everyone', value: 'everyone' },
    { label: 'Followers', value: 'followers' },
    { label: 'Close Friends', value: 'close_friends' },
    { label: 'No One', value: 'no_one' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy & Security</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Privacy</Text>
        
        <PrivacyOption
          title="Private Account"
          description="Only approved followers can see your posts and stories"
          value={settings.privateAccount}
          onValueChange={handlePrivateAccountToggle}
        />

        <PrivacyOption
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          value={settings.twoFactorAuth}
          onValueChange={handleTwoFactorToggle}
        />

        <PrivacyOption
          title="Activity Status"
          description="Show when you're active on Instagram"
          value={settings.activityStatus}
          onValueChange={(value) => updateSetting('activityStatus', value)}
        />

        <PrivacyOption
          title="Profile Visibility"
          description="Allow your profile to appear in search results"
          value={settings.profileVisibility}
          onValueChange={(value) => updateSetting('profileVisibility', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content Privacy</Text>

        <PrivacySelector
          title="Story Privacy"
          options={privacyOptions}
          selected={settings.storyPrivacy}
          onSelect={(value) => updateSetting('storyPrivacy', value)}
        />

        <PrivacySelector
          title="Post Privacy"
          options={privacyOptions}
          selected={settings.postPrivacy}
          onSelect={(value) => updateSetting('postPrivacy', value)}
        />

        <PrivacySelector
          title="Direct Message Privacy"
          options={privacyOptions}
          selected={settings.dmPrivacy}
          onSelect={(value) => updateSetting('dmPrivacy', value)}
        />

        <PrivacySelector
          title="Comment Privacy"
          options={privacyOptions}
          selected={settings.commentPrivacy}
          onSelect={(value) => updateSetting('commentPrivacy', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Management</Text>

        <TouchableOpacity 
          style={styles.managementButton}
          onPress={() => setCloseFriendsModal(true)}
        >
          <Ionicons name="people" size={20} color="#5865f2" />
          <Text style={styles.managementText}>Close Friends ({settings.closeFriends.length})</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.managementButton}
          onPress={() => setBlockedUsersModal(true)}
        >
          <Ionicons name="ban" size={20} color="#ff4757" />
          <Text style={styles.managementText}>Blocked Users ({settings.blockedUsers.length})</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.managementButton}
          onPress={() => setRestrictedUsersModal(true)}
        >
          <Ionicons name="eye-off" size={20} color="#ffa502" />
          <Text style={styles.managementText}>Restricted Users ({settings.restrictedUsers.length})</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <PrivacyOption
          title="Email Notifications"
          description="Receive email notifications for account activity"
          value={settings.emailNotifications}
          onValueChange={(value) => updateSetting('emailNotifications', value)}
        />

        <PrivacyOption
          title="Push Notifications"
          description="Receive push notifications on your device"
          value={settings.pushNotifications}
          onValueChange={(value) => updateSetting('pushNotifications', value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={settings.emailAddress}
            onChangeText={(text) => updateSetting('emailAddress', text)}
            placeholder="Enter email address"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={settings.phoneNumber}
            onChangeText={(text) => updateSetting('phoneNumber', text)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {closeFriendsModal && (
        <UserListModal
          users={settings.closeFriends}
          title="Close Friends"
          onRemove={(user) => {
            updateSetting('closeFriends', settings.closeFriends.filter(u => u !== user));
          }}
          onClose={() => setCloseFriendsModal(false)}
        />
      )}

      {blockedUsersModal && (
        <UserListModal
          users={settings.blockedUsers}
          title="Blocked Users"
          onRemove={(user) => {
            updateSetting('blockedUsers', settings.blockedUsers.filter(u => u !== user));
          }}
          onClose={() => setBlockedUsersModal(false)}
        />
      )}

      {restrictedUsersModal && (
        <UserListModal
          users={settings.restrictedUsers}
          title="Restricted Users"
          onRemove={(user) => {
            updateSetting('restrictedUsers', settings.restrictedUsers.filter(u => u !== user));
          }}
          onClose={() => setRestrictedUsersModal(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  privacyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    flex: 1,
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  privacySelector: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#5865f2',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: 'white',
  },
  managementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  managementText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userName: {
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#5865f2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeModalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrivacySettings;
