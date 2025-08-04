import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768;

// Mock chat data
const mockChats = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      username: 'sarah_j',
      avatar: 'https://picsum.photos/50/50?random=1',
      isOnline: true,
    },
    lastMessage: 'Hey! How are you doing?',
    lastMessageTime: '2m',
    unreadCount: 3,
    isTyping: false,
  },
  {
    id: 2,
    user: {
      name: 'Mike Chen',
      username: 'mike_chen',
      avatar: 'https://picsum.photos/50/50?random=2',
      isOnline: false,
    },
    lastMessage: 'That photo looks amazing! 🔥',
    lastMessageTime: '15m',
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 3,
    user: {
      name: 'Emma Wilson',
      username: 'emma_w',
      avatar: 'https://picsum.photos/50/50?random=3',
      isOnline: true,
    },
    lastMessage: 'Can we meet tomorrow?',
    lastMessageTime: '1h',
    unreadCount: 1,
    isTyping: true,
  },
  {
    id: 4,
    user: {
      name: 'David Lee',
      username: 'david_lee',
      avatar: 'https://picsum.photos/50/50?random=4',
      isOnline: false,
    },
    lastMessage: 'Thanks for the follow!',
    lastMessageTime: '2h',
    unreadCount: 0,
    isTyping: false,
  },
  {
    id: 5,
    user: {
      name: 'Lisa Park',
      username: 'lisa_p',
      avatar: 'https://picsum.photos/50/50?random=5',
      isOnline: true,
    },
    lastMessage: 'Love your new posts!',
    lastMessageTime: '3h',
    unreadCount: 2,
    isTyping: false,
  },
];

// Mock messages for chat detail
const mockMessages = [
  {
    id: 1,
    text: 'Hey! How are you doing?',
    sender: 'other',
    time: '2:30 PM',
    isRead: true,
  },
  {
    id: 2,
    text: 'I\'m doing great! Just posted some new photos.',
    sender: 'me',
    time: '2:32 PM',
    isRead: true,
  },
  {
    id: 3,
    text: 'They look amazing! I especially love the sunset one.',
    sender: 'other',
    time: '2:35 PM',
    isRead: true,
  },
  {
    id: 4,
    text: 'Thanks! That was taken at Malibu beach.',
    sender: 'me',
    time: '2:37 PM',
    isRead: true,
  },
];

export default function MessageScreen() {
  const [activeTab, setActiveTab] = useState('chats'); // 'chats', 'requests'
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState(mockChats);
  const scrollViewRef = useRef(null);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => setSelectedChat(item)}
    >
      <View style={styles.chatLeft}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.chatAvatar} />
          {item.user.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.chatContent}>
          <Text style={styles.chatName}>{item.user.name}</Text>
          <Text style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]}>
            {item.isTyping ? 'Typing...' : item.lastMessage}
          </Text>
        </View>
      </View>

      <View style={styles.chatRight}>
        <Text style={styles.lastMessageTime}>{item.lastMessageTime}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.chatContainer}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            onPress={() => setSelectedChat(null)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <View style={styles.chatHeaderContent}>
            <Image 
              source={{ uri: selectedChat.user.avatar }} 
              style={styles.chatHeaderAvatar} 
            />
            <View>
              <Text style={styles.chatHeaderName}>{selectedChat.user.name}</Text>
              <Text style={styles.chatHeaderStatus}>
                {selectedChat.user.isOnline ? 'Active now' : 'Active 2h ago'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={22} color="#405DE6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.videoCallButton}>
            <Ionicons name="videocam" size={22} color="#405DE6" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView
          style={styles.messagesContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScroll}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View key={message.id} style={[
                styles.messageContainer,
                message.sender === 'me' ? styles.myMessage : styles.otherMessage
              ]}>
                <View style={[
                  styles.messageBubble,
                  message.sender === 'me' ? styles.myBubble : styles.otherBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    message.sender === 'me' ? styles.myMessageText : styles.otherMessageText
                  ]}>
                    {message.text}
                  </Text>
                </View>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={22} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={styles.messageInput}
              placeholder="Message..."
              placeholderTextColor="#999"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.galleryButton}>
              <Ionicons name="image" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendButton, newMessage.trim() && styles.sendButtonActive]} 
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? "#fff" : "#999"} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{activeTab === 'chats' ? 'Chats' : 'Requests'}</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons name="create" size={22} color="#405DE6" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>
            Chats
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests (2)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chats List */}
      <FlatList
        data={chats}
        renderItem={renderChatItem}
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
  newMessageButton: {
    padding: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 16 : 20,
    backgroundColor: '#f0f0f0',
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
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 12 : 15,
  },
  chatLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: isSmallDevice ? 10 : 12,
  },
  chatAvatar: {
    width: isSmallDevice ? 50 : 56,
    height: isSmallDevice ? 50 : 56,
    borderRadius: isSmallDevice ? 25 : 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: isSmallDevice ? 14 : 16,
    height: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 7 : 8,
    backgroundColor: '#27AE60',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '600',
    color: '#000',
  },
  lastMessage: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#666',
    marginTop: isSmallDevice ? 1 : 2,
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '600',
  },
  chatRight: {
    alignItems: 'flex-end',
  },
  lastMessageTime: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#666',
    marginBottom: isSmallDevice ? 3 : 4,
  },
  unreadBadge: {
    backgroundColor: '#405DE6',
    borderRadius: isSmallDevice ? 9 : 10,
    paddingHorizontal: isSmallDevice ? 6 : 7,
    paddingVertical: isSmallDevice ? 1 : 2,
    minWidth: isSmallDevice ? 16 : 18,
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: isSmallDevice ? 12 : 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: isSmallDevice ? 6 : 8,
    marginRight: isSmallDevice ? 8 : 10,
  },
  chatHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderAvatar: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    borderRadius: isSmallDevice ? 18 : 20,
    marginRight: isSmallDevice ? 8 : 10,
  },
  chatHeaderName: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '600',
    color: '#000',
  },
  chatHeaderStatus: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#666',
  },
  callButton: {
    padding: isSmallDevice ? 6 : 8,
    marginRight: isSmallDevice ? 6 : 8,
  },
  videoCallButton: {
    padding: isSmallDevice ? 6 : 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 10 : 15,
  },
  messageContainer: {
    marginBottom: isSmallDevice ? 8 : 10,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 16 : 20,
  },
  myBubble: {
    backgroundColor: '#405DE6',
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: isSmallDevice ? 14 : 15,
    lineHeight: isSmallDevice ? 18 : 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#666',
    marginTop: isSmallDevice ? 2 : 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 8 : 10,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  cameraButton: {
    padding: isSmallDevice ? 6 : 8,
    marginRight: isSmallDevice ? 6 : 8,
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    backgroundColor: '#f0f0f0',
    borderRadius: isSmallDevice ? 20 : 25,
    fontSize: isSmallDevice ? 14 : 15,
    color: '#000',
  },
  galleryButton: {
    padding: isSmallDevice ? 6 : 8,
    marginHorizontal: isSmallDevice ? 4 : 6,
  },
  sendButton: {
    padding: isSmallDevice ? 8 : 10,
    backgroundColor: '#e1e1e1',
    borderRadius: isSmallDevice ? 18 : 20,
  },
  sendButtonActive: {
    backgroundColor: '#405DE6',
  },
});
