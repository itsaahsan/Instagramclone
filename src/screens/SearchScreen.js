import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 475;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768;
const scale = Math.min(width / 375, 1.2);

const imageSize = (width - (isSmallDevice ? 4 : 6)) / (isSmallDevice ? 3 : 3);

// Mock data for search results
const mockImages = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  uri: `https://picsum.photos/400/400?random=${i + 1}`,
  likes: Math.floor(Math.random() * 1000) + 10,
  user: `user_${i + 1}`,
  caption: `Amazing post #${i + 1}`,
  tags: ['#nature', '#photography', '#travel', '#food', '#art'],
}));

const mockUsers = [
  { id: 1, username: 'john_doe', fullName: 'John Doe', image: 'https://picsum.photos/50/50?random=1', followers: '2.5M' },
  { id: 2, username: 'jane_smith', fullName: 'Jane Smith', image: 'https://picsum.photos/50/50?random=2', followers: '1.8M' },
  { id: 3, username: 'travel_lover', fullName: 'Alex Travel', image: 'https://picsum.photos/50/50?random=3', followers: '890K' },
  { id: 4, username: 'food_guru', fullName: 'Maria Food', image: 'https://picsum.photos/50/50?random=4', followers: '567K' },
  { id: 5, username: 'art_master', fullName: 'David Art', image: 'https://picsum.photos/50/50?random=5', followers: '234K' },
];

const trendingTags = ['#nature', '#photography', '#travel', '#food', '#art', '#love', '#instagood', '#fashion', '#beautiful', '#happy'];
const suggestedUsers = mockUsers.slice(0, 3);

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'people', 'tags'
  const [filteredImages, setFilteredImages] = useState(mockImages);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['#nature', 'john_doe', '#travel']);

  const handleSearch = useCallback(async (text) => {
    setSearchText(text);
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (text === '') {
      setFilteredImages(mockImages);
      setFilteredUsers(mockUsers);
    } else {
      // Filter based on search text
      const lowerText = text.toLowerCase();
      setFilteredImages(mockImages.filter(img => 
        img.caption.toLowerCase().includes(lowerText) ||
        img.tags.some(tag => tag.toLowerCase().includes(lowerText))
      ));
      setFilteredUsers(mockUsers.filter(user => 
        user.username.toLowerCase().includes(lowerText) ||
        user.fullName.toLowerCase().includes(lowerText)
      ));
    }
    
    setLoading(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText('');
    setFilteredImages(mockImages);
    setFilteredUsers(mockUsers);
  }, []);

  const addRecentSearch = useCallback((item) => {
    setRecentSearches(prev => [item, ...prev.filter(s => s !== item)].slice(0, 5));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={isSmallDevice ? 18 : 20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isSmallDevice && styles.smallSearchInput]}
            placeholder="Search users, posts, tags..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={isSmallDevice ? 18 : 20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'explore' && styles.activeTab]}
          onPress={() => setActiveTab('explore')}
        >
          <Text style={[styles.tabText, activeTab === 'explore' && styles.activeTabText]}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'people' && styles.activeTab]}
          onPress={() => setActiveTab('people')}
        >
          <Text style={[styles.tabText, activeTab === 'people' && styles.activeTabText]}>People</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tags' && styles.activeTab]}
          onPress={() => setActiveTab('tags')}
        >
          <Text style={[styles.tabText, activeTab === 'tags' && styles.activeTabText]}>Tags</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#405DE6" />
        </View>
      )}

      {!loading && (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {searchText === '' ? (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent</Text>
                    <TouchableOpacity>
                      <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {recentSearches.map((item, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.recentSearchItem}
                        onPress={() => handleSearch(item)}
                      >
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.recentSearchText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Trending Tags */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trending</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {trendingTags.map((tag, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.trendingTag}
                      onPress={() => handleSearch(tag)}
                    >
                      <Text style={styles.trendingTagText}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Suggested Users */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Suggested for you</Text>
                {suggestedUsers.map((user) => (
                  <TouchableOpacity key={user.id} style={styles.userResult}>
                    <Image source={{ uri: user.image }} style={styles.userImage} />
                    <View style={styles.userInfo}>
                      <Text style={styles.userUsername}>{user.username}</Text>
                      <Text style={styles.userFullName}>{user.fullName}</Text>
                      <Text style={styles.userFollowers}>{user.followers} followers</Text>
                    </View>
                    <TouchableOpacity style={styles.followButton}>
                      <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Explore Grid */}
              <View style={styles.gridContainer}>
                {filteredImages.map((image, index) => (
                  <TouchableOpacity key={image.id} style={styles.gridItem}>
                    <Image source={{ uri: image.uri }} style={styles.gridImage} />
                    {(index + 1) % 7 === 0 && (
                      <View style={styles.multipleIcon}>
                        <Ionicons name="copy-outline" size={isSmallDevice ? 12 : 14} color="#fff" />
                      </View>
                    )}
                    <View style={styles.imageOverlay}>
                      <View style={styles.overlayContent}>
                        <Ionicons name="heart" size={isSmallDevice ? 12 : 14} color="#fff" />
                        <Text style={styles.overlayText}>{image.likes}</Text>
                      </View>
                      <View style={styles.overlayContent}>
                        <Ionicons name="chatbubble" size={isSmallDevice ? 12 : 14} color="#fff" />
                        <Text style={styles.overlayText}>{Math.floor(Math.random() * 100)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Search Results Header */}
              <Text style={styles.resultsTitle}>Results for "{searchText}"</Text>
              
              {/* Users Results */}
              {activeTab === 'people' && filteredUsers.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>People</Text>
                  {filteredUsers.map((user) => (
                    <TouchableOpacity key={user.id} style={styles.userResult}>
                      <Image source={{ uri: user.image }} style={styles.userImage} />
                      <View style={styles.userInfo}>
                        <Text style={styles.userUsername}>{user.username}</Text>
                        <Text style={styles.userFullName}>{user.fullName}</Text>
                        <Text style={styles.userFollowers}>{user.followers} followers</Text>
                      </View>
                      <TouchableOpacity style={styles.followButton}>
                        <Text style={styles.followButtonText}>Follow</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Tags Results */}
              {activeTab === 'tags' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tags</Text>
                  {trendingTags.filter(tag => tag.includes(searchText.toLowerCase())).map((tag, index) => (
                    <TouchableOpacity key={index} style={styles.tagResult}>
                      <Ionicons name="pricetag" size={20} color="#405DE6" />
                      <View style={styles.tagInfo}>
                        <Text style={styles.tagName}>{tag}</Text>
                        <Text style={styles.tagCount}>{Math.floor(Math.random() * 1000)}K posts</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Posts Grid Results */}
              {(activeTab === 'explore' || activeTab === 'tags') && (
                <View style={styles.gridContainer}>
                  {filteredImages.map((image) => (
                    <TouchableOpacity key={image.id} style={styles.gridItem}>
                      <Image source={{ uri: image.uri }} style={styles.gridImage} />
                      <View style={styles.imageOverlay}>
                        <View style={styles.overlayContent}>
                          <Ionicons name="heart" size={isSmallDevice ? 12 : 14} color="#fff" />
                          <Text style={styles.overlayText}>{image.likes}</Text>
                        </View>
                        <View style={styles.overlayContent}>
                          <Ionicons name="chatbubble" size={isSmallDevice ? 12 : 14} color="#fff" />
                          <Text style={styles.overlayText}>{Math.floor(Math.random() * 100)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: isSmallDevice ? 8 : 10,
    paddingHorizontal: isSmallDevice ? 10 : 12,
    paddingVertical: isSmallDevice ? 6 : 8,
  },
  searchIcon: {
    marginRight: isSmallDevice ? 6 : 8,
  },
  searchInput: {
    flex: 1,
    fontSize: isSmallDevice ? 14 : 16,
    color: '#000',
  },
  smallSearchInput: {
    fontSize: 13,
  },
  clearButton: {
    padding: isSmallDevice ? 2 : 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: isSmallDevice ? 10 : 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#405DE6',
  },
  tabText: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#666',
  },
  activeTabText: {
    color: '#405DE6',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: isSmallDevice ? 15 : 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    marginBottom: isSmallDevice ? 8 : 10,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: 'bold',
    color: '#000',
  },
  clearAllText: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#405DE6',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: isSmallDevice ? 10 : 12,
    paddingVertical: isSmallDevice ? 6 : 8,
    borderRadius: 20,
    marginLeft: isSmallDevice ? 10 : 15,
    marginRight: isSmallDevice ? 5 : 8,
  },
  recentSearchText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#000',
    marginLeft: isSmallDevice ? 4 : 6,
  },
  trendingTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 6 : 8,
    borderRadius: 20,
    marginLeft: isSmallDevice ? 10 : 15,
    marginRight: isSmallDevice ? 5 : 8,
  },
  trendingTagText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#000',
  },
  userResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
  },
  userImage: {
    width: isSmallDevice ? 44 : 50,
    height: isSmallDevice ? 44 : 50,
    borderRadius: isSmallDevice ? 22 : 25,
    marginRight: isSmallDevice ? 10 : 15,
  },
  userInfo: {
    flex: 1,
  },
  userUsername: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userFullName: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#666',
  },
  userFollowers: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#999',
  },
  followButton: {
    backgroundColor: '#405DE6',
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingVertical: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 4 : 5,
  },
  followButtonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
  tagResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 12 : 15,
  },
  tagInfo: {
    flex: 1,
    marginLeft: isSmallDevice ? 10 : 12,
  },
  tagName: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    color: '#000',
  },
  tagCount: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#666',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallDevice ? 1 : 2,
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    marginBottom: isSmallDevice ? 1 : 2,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  multipleIcon: {
    position: 'absolute',
    top: isSmallDevice ? 4 : 6,
    right: isSmallDevice ? 4 : 6,
    zIndex: 1,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: isSmallDevice ? 2 : 3,
  },
  overlayText: {
    color: '#fff',
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: 'bold',
    marginLeft: isSmallDevice ? 3 : 4,
  },
  resultsTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    marginVertical: isSmallDevice ? 10 : 15,
    color: '#000',
  },
});
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  trendingTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 15,
    marginRight: 5,
  },
  trendingTagText: {
    fontSize: 14,
    color: '#000',
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
  overlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  searchResults: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  userResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userFullName: {
    fontSize: 14,
    color: '#999',
  },
  followButton: {
    backgroundColor: '#405DE6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
