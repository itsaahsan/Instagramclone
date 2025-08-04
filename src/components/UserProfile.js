import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile, followUser, unfollowUser } from '../firebase/firestore';
import { signOutUser } from '../firebase/auth';

const { width: screenWidth } = Dimensions.get('window');
const isSmallDevice = screenWidth < 375;

const UserProfile = ({ user, isOwnProfile = true, onSignOut, onShowAnalytics, onToggleTheme, isDarkTheme }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // posts, tagged, saved

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (user) {
      const result = await getUserProfile(user.uid);
      if (result.success) {
        setUserProfile(result.data);
      }
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !userProfile) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.uid, userProfile.uid);
        setIsFollowing(false);
        setUserProfile(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await followUser(user.uid, userProfile.uid);
        setIsFollowing(true);
        setUserProfile(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update follow status');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await signOutUser();
            if (result.success) {
              onSignOut();
            } else {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const mockPosts = [
    { id: 1, image: 'https://picsum.photos/400/400?random=1', likes: 245, comments: 12 },
    { id: 2, image: 'https://picsum.photos/400/400?random=2', likes: 189, comments: 8 },
    { id: 3, image: 'https://picsum.photos/400/400?random=3', likes: 567, comments: 23 },
    { id: 4, image: 'https://picsum.photos/400/400?random=4', likes: 324, comments: 15 },
    { id: 5, image: 'https://picsum.photos/400/400?random=5', likes: 456, comments: 19 },
    { id: 6, image: 'https://picsum.photos/400/400?random=6', likes: 678, comments: 31 },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const profile = userProfile || {
    username: user?.displayName || user?.email?.split('@')[0] || 'User',
    bio: 'Welcome to Instagram Clone! 📸',
    followers: 1234,
    following: 567,
    posts: 42,
    photoURL: user?.photoURL || `https://picsum.photos/100/100?random=${user?.uid}`,
    isVerified: false,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profile.photoURL }} style={styles.profileImage} />
          {profile.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.profileStats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{profile.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{profile.followers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{profile.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{profile.username}</Text>
        <Text style={styles.profileBio}>{profile.bio}</Text>
        
        {/* Website/Link */}
        <TouchableOpacity style={styles.websiteLink}>
          <Text style={styles.websiteLinkText}>www.instagram-clone.com</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {isOwnProfile ? (
          <>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.insightsButton} onPress={onShowAnalytics}>
              <Text style={styles.insightsButtonText}>Insights</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeButton} onPress={onToggleTheme}>
              <Ionicons 
                name={isDarkTheme ? 'sunny' : 'moon'} 
                size={16} 
                color="#262626" 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={handleSignOut}>
              <Ionicons name="menu" size={16} color="#262626" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={handleFollowToggle}
              disabled={loading}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="person-add" size={16} color="#262626" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Story Highlights */}
      <ScrollView horizontal style={styles.highlights} showsHorizontalScrollIndicator={false}>
        <View style={styles.highlightItem}>
          <View style={styles.highlightCircle}>
            <Ionicons name="add" size={24} color="#999" />
          </View>
          <Text style={styles.highlightText}>New</Text>
        </View>
        {['Travel', 'Food', 'Fitness', 'Art'].map((highlight, index) => (
          <View key={index} style={styles.highlightItem}>
            <Image 
              source={{ uri: `https://picsum.photos/60/60?random=${index + 10}` }} 
              style={styles.highlightImage} 
            />
            <Text style={styles.highlightText}>{highlight}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Ionicons 
            name="grid" 
            size={20} 
            color={activeTab === 'posts' ? '#262626' : '#999'} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tagged' && styles.activeTab]}
          onPress={() => setActiveTab('tagged')}
        >
          <Ionicons 
            name="person-outline" 
            size={20} 
            color={activeTab === 'tagged' ? '#262626' : '#999'} 
          />
        </TouchableOpacity>
        {isOwnProfile && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Ionicons 
              name="bookmark-outline" 
              size={20} 
              color={activeTab === 'saved' ? '#262626' : '#999'} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Posts Grid */}
      <View style={styles.postsGrid}>
        {mockPosts.map((post, index) => (
          <TouchableOpacity key={post.id} style={styles.postItem}>
            <Image source={{ uri: post.image }} style={styles.postImage} />
            <View style={styles.postOverlay}>
              <View style={styles.postStats}>
                <Ionicons name="heart" size={16} color="#fff" />
                <Text style={styles.postStatsText}>{post.likes}</Text>
                <Ionicons name="chatbubble" size={16} color="#fff" style={{ marginLeft: 12 }} />
                <Text style={styles.postStatsText}>{post.comments}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty State */}
      {mockPosts.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="camera-outline" size={64} color="#999" />
          <Text style={styles.emptyStateTitle}>No Posts Yet</Text>
          <Text style={styles.emptyStateText}>When you share photos and videos, they'll appear on your profile.</Text>
          <TouchableOpacity style={styles.shareFirstPostButton}>
            <Text style={styles.shareFirstPostButtonText}>Share your first post</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImage: {
    width: isSmallDevice ? 80 : 90,
    height: isSmallDevice ? 80 : 90,
    borderRadius: isSmallDevice ? 40 : 45,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#405DE6',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  statLabel: {
    fontSize: isSmallDevice ? 12 : 14,
    color: '#8e8e8e',
    marginTop: 2,
  },
  profileInfo: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  profileName: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#262626',
    lineHeight: 18,
    marginBottom: 4,
  },
  websiteLink: {
    marginTop: 4,
  },
  websiteLinkText: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#405DE6',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#efefef',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#262626',
  },
  insightsButton: {
    flex: 1,
    backgroundColor: '#efefef',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  insightsButtonText: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#262626',
  },
  themeButton: {
    backgroundColor: '#efefef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    backgroundColor: '#efefef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#405DE6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#efefef',
  },
  followButtonText: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#fff',
  },
  followingButtonText: {
    color: '#262626',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#efefef',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  messageButtonText: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#262626',
  },
  moreButton: {
    backgroundColor: '#efefef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlights: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  highlightCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 12,
    color: '#262626',
  },
  tabNavigation: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#efefef',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#262626',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postItem: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#262626',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8e8e8e',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  shareFirstPostButton: {
    backgroundColor: '#405DE6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  shareFirstPostButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UserProfile;
