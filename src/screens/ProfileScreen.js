import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HDImage from '../components/HDImage';

const { width } = Dimensions.get('window');
const imageSize = (width - 6) / 3;

// Mock user data
const userData = {
  username: 'travel_photographer',
  fullName: 'Alex Morgan',
  bio: 'Professional travel photographer \nExploring the world one adventure at a time \nDM for collaborations and prints ',
  bio: 'Professional travel photographer 📸\nExploring the world one adventure at a time ✈️\nDM for collaborations and prints 🖼️',
  profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  posts: 127,
  followers: 45600,
  following: 892,
  isPrivate: false,
  isVerified: true,
  website: 'www.alexmorganphotography.com',
  isOnline: true,
};

// Mock posts data
const userPosts = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  uri: `https://picsum.photos/300/300?random=${i + 100}`,
  likes: Math.floor(Math.random() * 500) + 10,
  comments: Math.floor(Math.random() * 50) + 1,
}));

// Mock story highlights
const storyHighlights = [
  { id: 1, title: 'Travel', imageUri: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=100&h=100&fit=crop' },
  { id: 2, title: 'Food', imageUri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop' },
  { id: 3, title: 'Nature', imageUri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop' },
  { id: 4, title: 'Events', imageUri: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=100&h=100&fit=crop' },
  { id: 5, title: 'Work', imageUri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop' },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // In a real app, you would handle logout here
          Alert.alert('Logged out', 'You have been logged out successfully');
        }},
      ]
    );
  };

  const TabButton = ({ tab, icon, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.activeTab]} 
      onPress={onPress}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={isActive ? '#000' : '#999'} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="lock-closed-outline" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.username}>{userData.username}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Ionicons name="add-outline" size={24} color="#000" style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="archive-outline" size={24} color="#000" style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="menu-outline" size={24} color="#000" style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{userData.posts.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{userData.followers.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{userData.following.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.fullName}>{userData.fullName}</Text>
              {userData.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#405DE6" style={styles.verifiedBadge} />
              )}
              {userData.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <Text style={styles.bio}>{userData.bio}</Text>
            {userData.website && (
              <TouchableOpacity>
                <Text style={styles.website}>{userData.website}</Text>
              </TouchableOpacity>
            )}
            <View style={styles.profileDetails}>
              <Text style={styles.detailItem}>📍 San Francisco, CA</Text>
              <Text style={styles.detailItem}>🔗 linkin.bio/{userData.username}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="person-add-outline" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chevron-down-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Share Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Story Highlights */}
        <View style={styles.highlightsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.addHighlight}>
              <View style={styles.addHighlightCircle}>
                <Ionicons name="add-outline" size={30} color="#999" />
              </View>
              <Text style={styles.highlightText}>New</Text>
            </TouchableOpacity>
            {storyHighlights.map((highlight) => (
              <TouchableOpacity key={highlight.id} style={styles.highlight}>
                <Image 
                  source={{ uri: highlight.imageUri }} 
                  style={styles.highlightImage}
                />
                <Text style={styles.highlightText}>{highlight.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TabButton 
            tab="posts" 
            icon="grid-outline" 
            isActive={activeTab === 'posts'} 
            onPress={() => setActiveTab('posts')}
          />
          <TabButton 
            tab="reels" 
            icon="film-outline" 
            isActive={activeTab === 'reels'} 
            onPress={() => setActiveTab('reels')}
          />
          <TabButton 
            tab="tagged" 
            icon="person-circle-outline" 
            isActive={activeTab === 'tagged'} 
            onPress={() => setActiveTab('tagged')}
          />
        </View>

        {/* Content Grid */}
        {activeTab === 'posts' && (
          <View style={styles.gridContainer}>
            {userPosts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.gridItem}>
                <HDImage 
                  source={{ uri: post.uri }} 
                  style={styles.gridImage}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Navigate to post detail
                  }}
                />
                {/* Overlay for post type indicators */}
                <View style={styles.postTypeOverlay}>
                  {post.id % 7 === 0 && (
                    <Ionicons name="play" size={20} color="#fff" style={styles.postTypeIcon} />
                  )}
                  {post.id % 5 === 0 && (
                    <Ionicons name="layers" size={20} color="#fff" style={styles.postTypeIcon} />
                  )}
                </View>
                <View style={styles.imageOverlay}>
                  <View style={styles.overlayContent}>
                    <View style={styles.overlayItem}>
                      <Ionicons name="heart" size={16} color="#fff" />
                      <Text style={styles.overlayText}>{post.likes}</Text>
                    </View>
                    <View style={styles.overlayItem}>
                      <Ionicons name="chatbubble" size={16} color="#fff" />
                      <Text style={styles.overlayText}>{post.comments}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
          
          {activeTab === 'reels' && (
            <View style={styles.gridContainer}>
              {userPosts.map((post) => (
                <TouchableOpacity key={post.id} style={styles.gridItem}>
                  <HDImage 
                  source={{ uri: post.uri }} 
                  style={styles.gridImage}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Navigate to post detail
                  }}
                />
                  <View style={styles.reelOverlay}>
                    <Ionicons name="play" size={24} color="#fff" />
                  </View>
                  <View style={styles.imageOverlay}>
                    <View style={styles.overlayContent}>
                      <View style={styles.overlayItem}>
                        <Ionicons name="heart" size={16} color="#fff" />
                        <Text style={styles.overlayText}>{post.likes}</Text>
                      </View>
                      <View style={styles.overlayItem}>
                        <Ionicons name="chatbubble" size={16} color="#fff" />
                        <Text style={styles.overlayText}>{post.comments}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {activeTab === 'tagged' && (
            <View style={styles.emptyState}>
              <Ionicons name="person-circle-outline" size={64} color="#999" />
              <Text style={styles.emptyStateText}>No Tagged Posts</Text>
              <Text style={styles.emptyStateSubtext}>When people tag you in photos, they'll appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageContainer: {
    position: 'relative',
    width: 90,
    height: 90,
    marginRight: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
  },
  profileInfo: {
    marginBottom: 15,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    marginLeft: 5,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  },
  bio: {
    fontSize: 14,
    lineHeight: 18,
    color: '#000',
    marginBottom: 5,
  },
  website: {
    fontSize: 14,
    color: '#405DE6',
    fontWeight: 'bold',
  },
  profileDetails: {
    marginTop: 5,
  },
  detailItem: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  secondaryActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  highlightsSection: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  addHighlight: {
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 10,
  },
  addHighlightCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e1e1e1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  highlight: {
    alignItems: 'center',
    marginRight: 15,
  },
  highlightImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e1e1e1',
    marginBottom: 5,
  },
  highlightText: {
    fontSize: 12,
    color: '#000',
  },
  tabNavigation: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'relative',
  },
  tabIconContainer: {
    alignItems: 'center',
  },
  activeTab: {
    // Removed as we're using tabIndicator now
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '100%',
    backgroundColor: 'transparent',
  },
  activeTabIndicator: {
    backgroundColor: '#000',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    marginBottom: 2,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  multipleIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  postTypeOverlay: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
  },
  postTypeIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 3,
    borderRadius: 10,
  },
  reelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    width: '100%',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
