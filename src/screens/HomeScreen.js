import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 775;
const isMediumDevice = width >= 775 && width < 768;
const isTablet = width >= 768;
const scale = Math.min(width / 775, 1.2); // Responsive scaling factor

// Enhanced mock data with 25+ people
const mockPosts = [
  {
    id: 1,
    username: 'sarah_travels',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    likes: 2457,
    caption: 'Golden hour in Santorini 🌅 Can\'t get enough of these views!',
    timeAgo: '2h',
    isLiked: false,
  },
  {
    id: 2,
    username: 'alex_creates',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=500&fit=crop',
    likes: 1892,
    caption: 'Handmade pasta night! Fresh basil and parmesan perfection 🍝',
    timeAgo: '4h',
    isLiked: true,
  },
  {
    id: 3,
    username: 'mountain_mike',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=500&fit=crop',
    likes: 5673,
    caption: 'Swiss Alps adventure continues! This view took my breath away 🏔️',
    timeAgo: '6h',
    isLiked: false,
  },
  {
    id: 4,
    username: 'emma_paints',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a126a?w=500&h=500&fit=crop',
    likes: 892,
    caption: 'My latest watercolor piece inspired by autumn leaves 🎨',
    timeAgo: '8h',
    isLiked: true,
  },
  {
    id: 5,
    username: 'fitness_with_jake',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
    likes: 445,
    caption: 'Morning workout complete! Never skip leg day 💪',
    timeAgo: '10h',
    isLiked: false,
  },
  {
    id: 6,
    username: 'fashion_forward',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop',
    likes: 3421,
    caption: 'Street style look for today! Loving this autumn weather 🍂',
    timeAgo: '12h',
    isLiked: true,
  },
  {
    id: 7,
    username: 'tech_tommy',
    userImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    postImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=500&fit=crop',
    likes: 1234,
    caption: 'Late night coding session! This new feature is 🔥',
    timeAgo: '14h',
    isLiked: false,
  },
];

// 25+ people with stories
const mockStories = [
  {
    id: 1,
    username: 'sarah_travels',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 2,
    username: 'alex_creates',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 3,
    username: 'mountain_mike',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 4,
    username: 'emma_paints',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 5,
    username: 'fitness_with_jake',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 6,
    username: 'fashion_forward',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 7,
    username: 'tech_tommy',
    userImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 8,
    username: 'music_mia',
    userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 9,
    username: 'pet_parent_luna',
    userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 10,
    username: 'coffee_connoisseur',
    userImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 11,
    username: 'bookworm_betty',
    userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 12,
    username: 'yoga_with_zoe',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 13,
    username: 'chef_marco',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 14,
    username: 'wanderlust_will',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 15,
    username: 'photo_master_max',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 16,
    username: 'makeup_queen',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 17,
    username: 'gamer_girl_ella',
    userImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 18,
    username: 'plant_mom',
    userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 19,
    username: 'dance_diva_diana',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 20,
    username: 'beach_bum_brian',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 21,
    username: 'urban_explorer_anna',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 22,
    username: 'foodie_frank',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 23,
    username: 'adventure_alice',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
        isOwnStory: false,
  },
  {
    id: 24,
    username: 'style_sam',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 25,
    username: 'creative_carl',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 26,
    username: 'surfing_sara',
    userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 27,
    username: 'coding_chris',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 28,
    username: 'baking_bella',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 29,
    username: 'photography_paul',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
  {
    id: 30,
    username: 'music_mike',
    userImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    isViewed: false,
    isOwnStory: false,
  },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState(mockPosts);
  const [stories, setStories] = useState(mockStories);

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

  const handleStoryPress = (storyId) => {
    setStories(stories.map(story =>
      story.id === storyId
        ? { ...story, isViewed: true }
        : story
    ));
  };

  const PostItem = ({ post }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.userImage }} style={styles.userImage} />
          <Text style={styles.username}>{post.username}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={40} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: post.postImage }} style={styles.postImage} />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={() => handleLike(post.id)} style={[styles.actionButton, isSmallDevice && styles.smallActionButton]}>
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={isSmallDevice ? 50 : 250}
              color={post.isLiked ? "#FF3040" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, isSmallDevice && styles.smallActionButton]}>
            <Ionicons name="chatbubble-outline" size={isSmallDevice ? 20 : 22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, isSmallDevice && styles.smallActionButton]}>
            <Ionicons name="paper-plane-outline" size={isSmallDevice ? 20 : 22} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Likes Count */}
      <Text style={styles.likesCount}>{post.likes} likes</Text>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.captionText}>
          <Text style={styles.username}>{post.username}</Text> {post.caption}
        </Text>
      </View>

      {/* Time */}
      <Text style={styles.timeAgo}>{post.timeAgo}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={[styles.headerIcon, isSmallDevice && styles.smallHeaderIcon]}>
            <Ionicons name="heart-outline" size={isSmallDevice ? 20 : 22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerIcon, isSmallDevice && styles.smallHeaderIcon]}>
            <Ionicons name="paper-plane-outline" size={isSmallDevice ? 20 : 22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories Section */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
        <View style={styles.storyItem}>
          <View style={styles.addStoryCircle}>
            <Ionicons name="add" size={24} color="#fff" />
          </View>
          <Text style={styles.storyText}>Your Story</Text>
        </View>
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem} onPress={() => handleStoryPress(story.id)}>
            <Image
              source={{ uri: story.userImage }}
              style={[styles.storyImage, story.isViewed && styles.viewedStory]}
            />
            <Text style={styles.storyText}>{story.username}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts Feed */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
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
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    height: isSmallDevice ? 50 : 56,
  },
  logo: {
    fontSize: isSmallDevice ? 40 : isMediumDevice ? 40 : 40 ,
    fontWeight: 'bold',
    fontFamily: 'serif',
    lineHeight: isSmallDevice ? 40 : 40,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: isSmallDevice ? 8 : 12,
    padding: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 16 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: isSmallDevice ? 32 : 36,
    minHeight: isSmallDevice ? 32 : 36,
  },
  smallHeaderIcon: {
    marginLeft: 6,
    padding: 4,
    borderRadius: 14,
    minWidth: 28,
    minHeight: 28,
  },
  storiesContainer: {
    paddingVertical: isSmallDevice ? 8 : 10,
    paddingHorizontal: isSmallDevice ? 8 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    maxHeight: isSmallDevice ? 100 : 110,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: isSmallDevice ? 6 : 8,
    marginLeft: isSmallDevice ? 8 : 12,
    minWidth: isSmallDevice ? 65 : 75,
  },
  addStoryCircle: {
    width: isSmallDevice ? 48 : isMediumDevice ? 56 : 60,
    height: isSmallDevice ? 48 : isMediumDevice ? 56 : 60,
    borderRadius: isSmallDevice ? 24 : isMediumDevice ? 28 : 30,
    backgroundColor: '#405DE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 3 : 4,
  },
  storyImage: {
    width: isSmallDevice ? 48 : isMediumDevice ? 56 : 60,
    height: isSmallDevice ? 48 : isMediumDevice ? 56 : 60,
    borderRadius: isSmallDevice ? 24 : isMediumDevice ? 28 : 30,
    borderWidth: 2,
    borderColor: '#405DE6',
    marginBottom: isSmallDevice ? 3 : 4,
  },
  storyText: {
    fontSize: isSmallDevice ? 10 : isMediumDevice ? 11 : 12,
    marginTop: isSmallDevice ? 2 : 3,
    textAlign: 'center',
    lineHeight: isSmallDevice ? 12 : 14,
    numberOfLines: 1,
  },
  feed: {
    flex: 1,
  },
  postContainer: {
    marginBottom: isSmallDevice ? 15 : 20,
    backgroundColor: '#fff',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    minHeight: isSmallDevice ? 48 : 52,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: isSmallDevice ? 30 : isMediumDevice ? 36 : 40,
    height: isSmallDevice ? 30 : isMediumDevice ? 36 : 40,
    borderRadius: isSmallDevice ? 15 : isMediumDevice ? 18 : 20,
    marginRight: isSmallDevice ? 8 : 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: isSmallDevice ? 13 : isMediumDevice ? 15 : 16,
    lineHeight: isSmallDevice ? 16 : 18,
  },
  postImage: {
    width: width,
    height: isSmallDevice ? width * 0.9 : isMediumDevice ? width * 0.95 : width,
    maxHeight: isSmallDevice ? 350 : 400,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    minHeight: isSmallDevice ? 44 : 48,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 16 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: isSmallDevice ? 36 : 40,
    minHeight: isSmallDevice ? 36 : 40,
  },
  smallActionButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 14,
    minWidth: 32,
    minHeight: 32,
  },
  likesCount: {
    fontWeight: 'bold',
    marginVertical: isSmallDevice ? 3 : 5,
    fontSize: isSmallDevice ? 13 : isMediumDevice ? 15 : 16,
    paddingHorizontal: isSmallDevice ? 12 : 15,
    lineHeight: isSmallDevice ? 16 : 18,
  },
  captionContainer: {
    paddingHorizontal: isSmallDevice ? 12 : 15,
    marginBottom: isSmallDevice ? 3 : 5,
    maxWidth: '100%',
  },
  captionText: {
    fontSize: isSmallDevice ? 12 : isMediumDevice ? 13 : 14,
    lineHeight: isSmallDevice ? 16 : isMediumDevice ? 17 : 18,
    flexWrap: 'wrap',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 15,
  },
});
