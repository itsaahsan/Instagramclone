import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [recentPhotos, setRecentPhotos] = useState([]);

  useEffect(() => {
    getPermissions();
    loadRecentPhotos();
  }, []);

  const getPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Permission needed', 'Camera and media library permissions are required to use this feature.');
    }
  };

  const loadRecentPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 20,
        mediaType: 'photo',
        sortBy: 'creationTime',
      });
      setRecentPhotos(assets);
    } catch (error) {
      console.log('Error loading photos:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setShowPostModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setShowPostModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const selectRecentPhoto = (photo) => {
    setSelectedImage({ uri: photo.uri });
    setShowPostModal(true);
  };

  const sharePost = () => {
    // In a real app, you would upload the image and save the post
    Alert.alert('Success', 'Your post has been shared!', [
      {
        text: 'OK',
        onPress: () => {
          setShowPostModal(false);
          setSelectedImage(null);
          setCaption('');
        },
      },
    ]);
  };

  const PostModal = () => (
    <Modal visible={showPostModal} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowPostModal(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>New Post</Text>
          <TouchableOpacity onPress={sharePost}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.postPreview}>
            <Image source={{ uri: selectedImage?.uri }} style={styles.previewImage} />
            <View style={styles.captionContainer}>
              <Image 
                source={{ uri: 'https://picsum.photos/40/40?random=user' }} 
                style={styles.userAvatar} 
              />
              <TextInput
                style={styles.captionInput}
                placeholder="Write a caption..."
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>
          </View>

          <View style={styles.optionsSection}>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Tag People</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Add Location</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Text style={styles.optionText}>Share to Facebook</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Camera</Text>
      </View>

      <View style={styles.content}>
        {/* Camera Actions */}
        <View style={styles.cameraActions}>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <View style={styles.actionIcon}>
              <Ionicons name="camera" size={30} color="#fff" />
            </View>
            <Text style={styles.actionText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <View style={styles.actionIcon}>
              <Ionicons name="images" size={30} color="#fff" />
            </View>
            <Text style={styles.actionText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Photos */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentPhotos.map((photo, index) => (
              <TouchableOpacity 
                key={photo.id || index} 
                style={styles.recentPhoto}
                onPress={() => selectRecentPhoto(photo)}
              >
                <Image source={{ uri: photo.uri }} style={styles.recentPhotoImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="videocam" size={24} color="#405DE6" />
            <Text style={styles.quickActionText}>Story</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="radio" size={24} color="#405DE6" />
            <Text style={styles.quickActionText}>Live</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="musical-notes" size={24} color="#405DE6" />
            <Text style={styles.quickActionText}>Reel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PostModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  cameraActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#405DE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  recentSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recentPhoto: {
    marginRight: 10,
  },
  recentPhotoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    marginTop: 8,
    color: '#405DE6',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareText: {
    fontSize: 16,
    color: '#405DE6',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
  },
  postPreview: {
    padding: 15,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  captionInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  optionsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
  },
});
