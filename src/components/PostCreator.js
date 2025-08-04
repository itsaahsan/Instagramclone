import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createPost } from '../firebase/firestore';

const { width: screenWidth } = Dimensions.get('window');
const isSmallDevice = screenWidth < 375;

const PostCreator = ({ user, onPostCreated, onClose }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Extract hashtags from caption
  const extractHashtags = (text) => {
    const hashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];
    return hashtags.map(tag => tag.toLowerCase());
  };

  // Extract mentions from caption
  const extractMentions = (text) => {
    const mentions = text.match(/@[a-zA-Z0-9_]+/g) || [];
    return mentions.map(mention => mention.substring(1).toLowerCase());
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0]);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedMedia) {
      Alert.alert('Error', 'Please select an image or video');
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Error', 'Please add a caption');
      return;
    }

    setLoading(true);

    try {
      const hashtags = extractHashtags(caption);
      const mentions = extractMentions(caption);

      const postData = {
        userId: user.uid,
        username: user.displayName || user.email.split('@')[0],
        userImage: user.photoURL || `https://picsum.photos/50/50?random=${user.uid}`,
        postImage: selectedMedia.uri, // In production, upload to Firebase Storage
        caption: caption.trim(),
        location: location.trim(),
        hashtags,
        mentions,
        taggedUsers,
        likes: 0,
        comments: [],
        saves: 0,
        createdAt: new Date().toISOString(),
      };

      const result = await createPost(postData);

      if (result.success) {
        Alert.alert('Success', 'Post created successfully!');
        onPostCreated();
        onClose();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }

    setLoading(false);
  };

  const popularLocations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA'
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity 
          onPress={handleCreatePost}
          disabled={loading || !selectedMedia || !caption.trim()}
          style={[styles.shareButton, (!selectedMedia || !caption.trim()) && styles.shareButtonDisabled]}
        >
          <Text style={[styles.shareButtonText, (!selectedMedia || !caption.trim()) && styles.shareButtonTextDisabled]}>
            {loading ? 'Sharing...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Media Selection */}
        <View style={styles.mediaSection}>
          {selectedMedia ? (
            <View style={styles.selectedMediaContainer}>
              <Image source={{ uri: selectedMedia.uri }} style={styles.selectedMedia} />
              <TouchableOpacity style={styles.changeMediaButton} onPress={pickImage}>
                <Ionicons name="swap-horizontal" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mediaPlaceholder}>
              <Ionicons name="image-outline" size={64} color="#999" />
              <Text style={styles.mediaPlaceholderText}>Select a photo or video</Text>
              <View style={styles.mediaButtons}>
                <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                  <Ionicons name="images" size={20} color="#405DE6" />
                  <Text style={styles.mediaButtonText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={20} color="#405DE6" />
                  <Text style={styles.mediaButtonText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Caption Input */}
        <View style={styles.captionSection}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: user.photoURL || `https://picsum.photos/40/40?random=${user.uid}` }} 
              style={styles.userImage} 
            />
            <Text style={styles.username}>{user.displayName || user.email.split('@')[0]}</Text>
          </View>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption... Use # for hashtags and @ to mention friends"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={2200}
            placeholderTextColor="#999"
          />
          <Text style={styles.characterCount}>{caption.length}/2200</Text>
        </View>

        {/* Location Section */}
        <TouchableOpacity 
          style={styles.locationSection}
          onPress={() => setShowLocationPicker(!showLocationPicker)}
        >
          <Ionicons name="location-outline" size={24} color="#262626" />
          <Text style={styles.locationText}>
            {location || 'Add location'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {showLocationPicker && (
          <View style={styles.locationPicker}>
            <TextInput
              style={styles.locationInput}
              placeholder="Search locations..."
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            />
            <ScrollView style={styles.locationList}>
              {popularLocations.map((loc, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.locationItem}
                  onPress={() => {
                    setLocation(loc);
                    setShowLocationPicker(false);
                  }}
                >
                  <Ionicons name="location" size={16} color="#999" />
                  <Text style={styles.locationItemText}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Advanced Options */}
        <View style={styles.advancedOptions}>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="people-outline" size={24} color="#262626" />
            <Text style={styles.optionText}>Tag people</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="musical-notes-outline" size={24} color="#262626" />
            <Text style={styles.optionText}>Add music</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="settings-outline" size={24} color="#262626" />
            <Text style={styles.optionText}>Advanced settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Hashtag Suggestions */}
        {caption.includes('#') && (
          <View style={styles.hashtagSuggestions}>
            <Text style={styles.suggestionsTitle}>Suggested hashtags:</Text>
            <View style={styles.hashtagList}>
              {['#instagram', '#photo', '#love', '#instagood', '#photooftheday', '#beautiful'].map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.hashtagTag}
                  onPress={() => {
                    if (!caption.includes(tag)) {
                      setCaption(caption + ' ' + tag);
                    }
                  }}
                >
                  <Text style={styles.hashtagTagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  shareButton: {
    backgroundColor: '#405DE6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  shareButtonDisabled: {
    backgroundColor: '#B2DFFC',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  shareButtonTextDisabled: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  mediaSection: {
    height: screenWidth,
    backgroundColor: '#f8f8f8',
  },
  selectedMediaContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  selectedMedia: {
    width: '100%',
    height: '100%',
  },
  changeMediaButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },
  mediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPlaceholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  mediaButtonText: {
    color: '#405DE6',
    fontWeight: '600',
  },
  captionSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#262626',
  },
  captionInput: {
    fontSize: 16,
    color: '#262626',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#262626',
  },
  locationPicker: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  locationList: {
    maxHeight: 200,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  locationItemText: {
    fontSize: 14,
    color: '#262626',
  },
  advancedOptions: {
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#262626',
  },
  hashtagSuggestions: {
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 12,
  },
  hashtagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hashtagTagText: {
    fontSize: 12,
    color: '#405DE6',
    fontWeight: '600',
  },
});

export default PostCreator;
