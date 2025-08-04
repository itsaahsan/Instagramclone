import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
  Modal
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Get device dimensions for responsive design
const { width: screenWidth } = Dimensions.get('window');

// Light theme colors (Instagram-like)
const lightColors = {
  primary: '#405DE6',
  secondary: '#C13584',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#262626',
  textSecondary: '#8E8E8E',
  border: '#DBDBDB',
  like: '#ED4956',
  story: '#405DE6',
  success: '#00C851',
  warning: '#FF8800',
  error: '#FF3547',
};

// Dark theme colors (futuristic style)
const darkColors = {
  primary: '#00D4FF',
  secondary: '#FF00E5',
  background: '#000000',
  surface: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  like: '#FF0066',
  story: '#00FF88',
  success: '#00FF88',
  warning: '#FFAA00',
  error: '#FF3366',
};

// Instagram Clone with Light/Dark Theme Toggle
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [postCaption, setPostCaption] = useState('');

  // Use current theme colors
  const themeColors = isDarkTheme ? darkColors : lightColors;

  // Mock data for posts
  const mockPosts = [
    {
      id: 1,
      username: 'ahsan_dev',
      userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      postImage: 'https://picsum.photos/400/400?random=1',
      likes: 1234,
      caption: '🌟 Beautiful sunset today! #photography #nature',
      timeAgo: '2h',
      isLiked: false,
      isSaved: false,
    },
    {
      id: 2,
      username: 'jane_photographer',
      userImage: 'https://randomuser.me/api/portraits/women/2.jpg',
      postImage: 'https://picsum.photos/400/400?random=2',
      likes: 856,
      caption: '📸 Capturing moments that matter ✨',
      timeAgo: '4h',
      isLiked: true,
      isSaved: false,
    },
    {
      id: 3,
      username: 'travel_explorer',
      userImage: 'https://randomuser.me/api/portraits/men/3.jpg',
      postImage: 'https://picsum.photos/400/400?random=3',
      likes: 2156,
      caption: '🗺️ Adventure awaits! New city, new experiences 🏙️',
      timeAgo: '6h',
      isLiked: false,
      isSaved: true,
    },
  ];

  // Mock stories data
  const mockStories = [
    { id: 1, username: 'Your Story', userImage: 'https://randomuser.me/api/portraits/men/1.jpg', isOwn: true },
    { id: 2, username: 'jane_photographer', userImage: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 3, username: 'travel_explorer', userImage: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: 4, username: 'food_lover', userImage: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { id: 5, username: 'tech_guru', userImage: 'https://randomuser.me/api/portraits/men/5.jpg' },
  ];

  const [posts, setPosts] = useState(mockPosts);
  const [stories] = useState(mockStories);

  // Handle like functionality
  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  // Handle save functionality
  const handleSave = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  // Login Screen
  const LoginScreen = () => (
    <View style={[styles.loginContainer, { backgroundColor: themeColors.background }]}>
      <View style={styles.loginContent}>
        <Text style={[styles.logo, { color: themeColors.primary }]}>Instagram</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Connect with friends and the world around you
        </Text>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: themeColors.primary }]}
          onPress={() => setIsAuthenticated(true)}
        >
          <Text style={[styles.loginButtonText, { color: themeColors.surface }]}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.themeToggleButton}
          onPress={() => setIsDarkTheme(!isDarkTheme)}
        >
          <Ionicons
            name={isDarkTheme ? 'sunny' : 'moon'}
            size={24}
            color={themeColors.primary}
          />
          <Text style={[styles.themeToggleText, { color: themeColors.primary }]}>
            {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Home Screen
  const HomeScreen = () => (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
        <Text style={[styles.headerLogo, { color: themeColors.text }]}>Instagram</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => setIsDarkTheme(!isDarkTheme)}
          >
            <Ionicons name={isDarkTheme ? 'sunny' : 'moon'} size={24} color={themeColors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="paper-plane-outline" size={24} color={themeColors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.storiesContainer, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            {story.isOwn ? (
              <View style={[styles.addStoryCircle, { backgroundColor: themeColors.border }]}>
                <Ionicons name="add" size={24} color={themeColors.textSecondary} />
              </View>
            ) : (
              <View style={[styles.storyImageContainer, { borderColor: themeColors.story }]}>
                <Image source={{ uri: story.userImage }} style={styles.storyImage} />
              </View>
            )}
            <Text style={[styles.storyText, { color: themeColors.text }]} numberOfLines={1}>
              {story.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts */}
      {posts.map((post) => (
        <View key={post.id} style={[styles.postContainer, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <Image source={{ uri: post.userImage }} style={styles.userImage} />
              <Text style={[styles.username, { color: themeColors.text }]}>{post.username}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color={themeColors.text} />
            </TouchableOpacity>
          </View>

          <Image source={{ uri: post.postImage }} style={styles.postImage} />

          <View style={styles.postActions}>
            <View style={styles.leftActions}>
              <TouchableOpacity onPress={() => handleLike(post.id)} style={styles.actionButton}>
                <Ionicons
                  name={post.isLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={post.isLiked ? themeColors.like : themeColors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color={themeColors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="paper-plane-outline" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleSave(post.id)}>
              <Ionicons
                name={post.isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={themeColors.text}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.likesCount, { color: themeColors.text }]}>{post.likes.toLocaleString()} likes</Text>
          <View style={styles.captionContainer}>
            <Text style={[styles.captionText, { color: themeColors.text }]}>
              <Text style={[styles.username, { color: themeColors.text }]}>{post.username}</Text> {post.caption}
            </Text>
          </View>
          <Text style={[styles.timeAgo, { color: themeColors.textSecondary }]}>{post.timeAgo}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.app, { backgroundColor: themeColors.background }]}>
      <StatusBar style={isDarkTheme ? "light" : "dark"} />
      {!isAuthenticated ? <LoginScreen /> : <HomeScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loginContent: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Billabong' : 'serif',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  themeToggleText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Billabong' : 'serif',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
    padding: 8,
  },
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginLeft: 15,
  },
  addStoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  storyImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 5,
  },
  storyImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  storyText: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 60,
  },
  postContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 15,
    padding: 4,
  },
  likesCount: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  captionContainer: {
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 18,
  },
  timeAgo: {
    fontSize: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});
