import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768;
const scale = Math.min(width / 375, 1.2);

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: 'like',
    user: {
      name: 'Sarah Johnson',
      username: 'sarah_j',
      avatar: 'https://picsum.photos/50/50?random=1',
    },
    postImage: 'https://picsum.photos/100/100?random=101',
    message: 'liked your photo',
    timeAgo: '2m',
    isRead: false,
  },
  {
    id: 2,
    type: 'comment',
    user: {
      name: 'Mike Chen',
      username: 'mike_chen',
      avatar: 'https://picsum.photos/50/50?random=2',
    },
    message: 'commented: "This looks amazing! 🔥"',
    timeAgo: '15m',
    isRead: false,
  },
  {
    id: 3,
    type: 'follow',
    user: {
      name: 'Emma Wilson',
      username: 'emma_w',
      avatar: 'https://picsum.photos/50/50?random=3',
    },
    message: 'started following you',
    timeAgo: '1h',
    isRead: true,
  },
  {
    id: 4,
    type: 'mention',
    user: {
      name: 'David Lee',
      username: 'david_lee',
      avatar: 'https://picsum.photos/50/50?random=4',
    },
    message: 'mentioned you in a comment',
    timeAgo: '2h',
    isRead: true,
  },
  {
    id: 5,
    type: 'tag',
    user: {
      name: 'Lisa Park',
      username: 'lisa_p',
      avatar: 'https://picsum.photos/50/50?random=5',
    },
    postImage: 'https://picsum.photos/100/100?random=105',
    message: 'tagged you in a photo',
    timeAgo: '3h',
    isRead: false,
  },
  {
    id: 6,
    type: 'story',
    user: {
      name: 'Alex Rivera',
      username: 'alex_r',
      avatar: 'https://picsum.photos/50/50?random=6',
    },
    message: 'added to their story',
    timeAgo: '4h',
    isRead: true,
  },
  {
    id: 7,
    type: 'like',
    user: {
      name: 'Jessica Brown',
      username: 'jess_b',
      avatar: 'https://picsum.photos/50/50?random=7',
    },
    postImage: 'https://picsum.photos/100/100?random=107',
    message: 'liked your photo',
    timeAgo: '5h',
    isRead: true,
  },
  {
    id: 8,
    type: 'follow_request',
    user: {
      name: 'Tom Anderson',
      username: 'tom_a',
      avatar: 'https://picsum.photos/50/50?random=8',
    },
    message: 'requested to follow you',
    timeAgo: '6h',
    isRead: false,
  },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case 'like':
      return 'heart';
    case 'comment':
      return 'chatbubble';
    case 'follow':
      return 'person-add';
    case 'mention':
      return 'at';
    case 'tag':
      return 'pricetag';
    case 'story':
      return 'camera';
    case 'follow_request':
      return 'person-add';
    default:
      return 'notifications';
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'like':
      return '#FF3040';
    case 'comment':
      return '#405DE6';
    case 'follow':
      return '#8E44AD';
    case 'mention':
      return '#F39C12';
    case 'tag':
      return '#27AE60';
    case 'story':
      return '#E74C3C';
    case 'follow_request':
      return '#9B59B6';
    default:
      return '#999';
  }
};

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'mentions', 'likes'

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mentions') return ['mention', 'tag'].includes(notif.type);
    if (activeTab === 'likes') return ['like', 'comment'].includes(notif.type);
    return true;
  });

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationLeft}>
        <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
        <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(item.type) }]}>
          <Ionicons 
            name={getNotificationIcon(item.type)} 
            size={isSmallDevice ? 14 : 16} 
            color="#fff" 
          />
        </View>
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          <Text style={styles.username}>{item.user.name}</Text> {item.message}
        </Text>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>

      {item.postImage && (
        <Image source={{ uri: item.postImage }} style={styles.postThumbnail} />
      )}

      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mentions' && styles.activeTab]}
          onPress={() => setActiveTab('mentions')}
        >
          <Text style={[styles.tabText, activeTab === 'mentions' && styles.activeTabText]}>
            Mentions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
          onPress={() => setActiveTab('likes')}
        >
          <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>
            Likes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
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
    paddingVertical: isSmallDevice ? 10 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: 'bold',
    color: '#000',
  },
  markAllButton: {
    paddingHorizontal: isSmallDevice ? 10 : 12,
    paddingVertical: isSmallDevice ? 4 : 6,
  },
  markAllText: {
    fontSize: isSmallDevice ? 12 : 14,
    color: '#405DE6',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: isSmallDevice ? 12 : 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#405DE6',
  },
  tabText: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#666',
  },
  activeTabText: {
    color: '#405DE6',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 12 : 15,
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#f8f9fa',
  },
  notificationLeft: {
    position: 'relative',
    marginRight: isSmallDevice ? 10 : 12,
  },
  userAvatar: {
    width: isSmallDevice ? 44 : 48,
    height: isSmallDevice ? 44 : 48,
    borderRadius: isSmallDevice ? 22 : 24,
  },
  notificationIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: isSmallDevice ? 20 : 22,
    height: isSmallDevice ? 20 : 22,
    borderRadius: isSmallDevice ? 10 : 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  notificationContent: {
    flex: 1,
    marginRight: isSmallDevice ? 8 : 10,
  },
  notificationText: {
    fontSize: isSmallDevice ? 13 : 15,
    lineHeight: isSmallDevice ? 18 : 20,
    color: '#000',
  },
  username: {
    fontWeight: 'bold',
    color: '#000',
  },
  timeAgo: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#666',
    marginTop: isSmallDevice ? 2 : 3,
  },
  postThumbnail: {
    width: isSmallDevice ? 40 : 44,
    height: isSmallDevice ? 40 : 44,
    borderRadius: isSmallDevice ? 4 : 6,
  },
  unreadDot: {
    position: 'absolute',
    top: isSmallDevice ? 18 : 20,
    right: isSmallDevice ? 18 : 20,
    width: isSmallDevice ? 8 : 10,
    height: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 4 : 5,
    backgroundColor: '#405DE6',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: isSmallDevice ? 12 : 15,
  },
});
