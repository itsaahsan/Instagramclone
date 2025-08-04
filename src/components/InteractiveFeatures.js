import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InteractiveFeatures = ({ userId }) => {
  const [polls, setPolls] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [collabPosts, setCollabPosts] = useState([]);
  const [groupDMs, setGroupDMs] = useState([]);
  const [storyHighlights, setStoryHighlights] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    fetchInteractiveData();
  }, [userId]);

  const fetchInteractiveData = async () => {
    // Mock interactive data - replace with Firebase queries
    const mockData = {
      polls: [
        {
          id: 1,
          question: 'What\'s your favorite season?',
          options: ['Spring', 'Summer', 'Fall', 'Winter'],
          votes: [45, 120, 89, 34],
          totalVotes: 288,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          id: 2,
          question: 'Best travel destination?',
          options: ['Beach', 'Mountains', 'City', 'Countryside'],
          votes: [156, 78, 234, 45],
          totalVotes: 513,
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
        },
      ],
      quizzes: [
        {
          id: 1,
          question: 'Guess my favorite color',
          options: ['Blue', 'Green', 'Red', 'Purple'],
          correctAnswer: 0,
          participants: 89,
          correctGuesses: 23,
        },
        {
          id: 2,
          question: 'What year was this photo taken?',
          options: ['2020', '2021', '2022', '2023'],
          correctAnswer: 2,
          participants: 156,
          correctGuesses: 78,
        },
      ],
      liveStreams: [
        {
          id: 1,
          title: 'Q&A Session',
          viewers: 1234,
          duration: '45 min',
          isLive: true,
          host: 'currentUser',
        },
        {
          id: 2,
          title: 'Behind the Scenes',
          viewers: 567,
          duration: '30 min',
          isLive: false,
          host: 'friendUser',
        },
      ],
      collabPosts: [
        {
          id: 1,
          title: 'Summer Vibes',
          collaborators: ['friend1', 'friend2'],
          likes: 2345,
          comments: 123,
        },
        {
          id: 2,
          title: 'Travel Diaries',
          collaborators: ['friend3'],
          likes: 1567,
          comments: 89,
        },
      ],
      groupDMs: [
        {
          id: 1,
          name: 'Travel Buddies',
          members: ['user1', 'user2', 'user3'],
          lastMessage: 'Planning our next trip!',
          unreadCount: 3,
        },
        {
          id: 2,
          name: 'Photography Club',
          members: ['user4', 'user5', 'user6'],
          lastMessage: 'Check out these new shots',
          unreadCount: 0,
        },
      ],
      storyHighlights: [
        {
          id: 1,
          title: 'Travel',
          stories: [1, 2, 3],
          coverImage: 'https://example.com/travel.jpg',
          storyCount: 12,
        },
        {
          id: 2,
          title: 'Food',
          stories: [4, 5, 6],
          coverImage: 'https://example.com/food.jpg',
          storyCount: 8,
        },
      ],
      pinnedPosts: [
        {
          id: 1,
          title: 'Welcome Post',
          likes: 5678,
          comments: 234,
          isPinned: true,
        },
        {
          id: 2,
          title: 'About Me',
          likes: 3456,
          comments: 123,
          isPinned: true,
        },
      ],
      suggestedUsers: [
        {
          id: 1,
          username: 'photographer_pro',
          mutualFriends: 5,
          commonInterests: ['photography', 'travel'],
        },
        {
          id: 2,
          username: 'food_blogger',
          mutualFriends: 3,
          commonInterests: ['food', 'travel'],
        },
      ],
    };

    setPolls(mockData.polls);
    setQuizzes(mockData.quizzes);
    setLiveStreams(mockData.liveStreams);
    setCollabPosts(mockData.collabPosts);
    setGroupDMs(mockData.groupDMs);
    setStoryHighlights(mockData.storyHighlights);
    setPinnedPosts(mockData.pinnedPosts);
    setSuggestedUsers(mockData.suggestedUsers);
  };

  const PollCard = ({ poll }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = (optionIndex) => {
      if (!hasVoted) {
        setSelectedOption(optionIndex);
        setHasVoted(true);
        // Update vote count in Firebase
      }
    };

    const totalVotes = poll.votes.reduce((sum, votes) => sum + votes, 0);

    return (
      <View style={styles.pollCard}>
        <Text style={styles.pollQuestion}>{poll.question}</Text>
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? (poll.votes[index] / totalVotes) * 100 : 0;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.pollOption,
                selectedOption === index && styles.selectedPollOption,
                hasVoted && styles.votedPollOption
              ]}
              onPress={() => handleVote(index)}
              disabled={hasVoted}
            >
              <Text style={styles.pollOptionText}>{option}</Text>
              {hasVoted && (
                <View style={styles.pollResults}>
                  <View style={[styles.pollBar, { width: `${percentage}%` }]} />
                  <Text style={styles.pollPercentage}>{Math.round(percentage)}%</Text>
                  <Text style={styles.pollVotes}>{poll.votes[index]} votes</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <Text style={styles.pollTotal}>{poll.totalVotes} total votes</Text>
      </View>
    );
  };

  const QuizCard = ({ quiz }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (optionIndex) => {
      setSelectedAnswer(optionIndex);
      setShowResults(true);
    };

    return (
      <View style={styles.quizCard}>
        <Text style={styles.quizQuestion}>{quiz.question}</Text>
        {quiz.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.quizOption,
              selectedAnswer === index && styles.selectedQuizOption,
              showResults && index === quiz.correctAnswer && styles.correctQuizOption,
              showResults && selectedAnswer === index && index !== quiz.correctAnswer && styles.wrongQuizOption
            ]}
            onPress={() => handleAnswer(index)}
            disabled={showResults}
          >
            <Text style={styles.quizOptionText}>{option}</Text>
            {showResults && (
              <Ionicons 
                name={index === quiz.correctAnswer ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={index === quiz.correctAnswer ? "#28a745" : "#ff4757"} 
              />
            )}
          </TouchableOpacity>
        ))}
        {showResults && (
          <Text style={styles.quizResults}>
            {quiz.correctGuesses} out of {quiz.participants} guessed correctly
          </Text>
        )}
      </View>
    );
  };

  const LiveStreamCard = ({ stream }) => (
    <View style={styles.liveStreamCard}>
      <View style={styles.liveIndicator}>
        <View style={[styles.liveDot, stream.isLive && styles.activeLiveDot]} />
        <Text style={styles.liveText}>{stream.isLive ? 'LIVE' : 'ENDED'}</Text>
      </View>
      <Text style={styles.streamTitle}>{stream.title}</Text>
      <Text style={styles.streamStats}>
        {stream.viewers} viewers • {stream.duration}
      </Text>
      {stream.isLive && (
        <TouchableOpacity style={styles.joinStreamButton}>
          <Text style={styles.joinStreamText}>Join Stream</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const CollabPostCard = ({ post }) => (
    <View style={styles.collabPostCard}>
      <Text style={styles.collabTitle}>{post.title}</Text>
      <Text style={styles.collaborators}>
        with {post.collaborators.join(', ')}
      </Text>
      <View style={styles.collabStats}>
        <Ionicons name="heart" size={16} color="#ff4757" />
        <Text style={styles.statText}>{post.likes}</Text>
        <Ionicons name="chatbubble" size={16} color="#5865f2" />
        <Text style={styles.statText}>{post.comments}</Text>
      </View>
    </View>
  );

  const GroupDMItem = ({ group }) => (
    <TouchableOpacity style={styles.groupDMItem}>
      <View style={styles.groupAvatar}>
        <Text style={styles.groupInitial}>{group.name.charAt(0)}</Text>
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.groupLastMessage}>{group.lastMessage}</Text>
        <Text style={styles.groupMembers}>
          {group.members.length} members
        </Text>
      </View>
      {group.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{group.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const StoryHighlightCard = ({ highlight }) => (
    <TouchableOpacity style={styles.highlightCard}>
      <Image source={{ uri: highlight.coverImage }} style={styles.highlightCover} />
      <Text style={styles.highlightTitle}>{highlight.title}</Text>
      <Text style={styles.highlightCount}>{highlight.storyCount} stories</Text>
    </TouchableOpacity>
  );

  const PinnedPostCard = ({ post }) => (
    <View style={styles.pinnedPostCard}>
      <Text style={styles.pinnedLabel}>📌 PINNED</Text>
      <Text style={styles.pinnedTitle}>{post.title}</Text>
      <View style={styles.pinnedStats}>
        <Ionicons name="heart" size={16} color="#ff4757" />
        <Text style={styles.statText}>{post.likes}</Text>
        <Ionicons name="chatbubble" size={16} color="#5865f2" />
        <Text style={styles.statText}>{post.comments}</Text>
      </View>
    </View>
  );

  const SuggestedUserCard = ({ user }) => (
    <View style={styles.suggestedUserCard}>
      <Text style={styles.suggestedUsername}>{user.username}</Text>
      <Text style={styles.mutualFriends}>
        {user.mutualFriends} mutual friends
      </Text>
      <Text style={styles.commonInterests}>
        {user.commonInterests.join(', ')}
      </Text>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Interactive Features</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Polls & Quizzes</Text>
        
        <ScrollView horizontal>
          {polls.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </ScrollView>

        <ScrollView horizontal>
          {quizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Streams</Text>
        <ScrollView horizontal>
          {liveStreams.map(stream => (
            <LiveStreamCard key={stream.id} stream={stream} />
          ))}
        </ScrollView>

        {isLive && (
          <TouchableOpacity style={styles.goLiveButton}>
            <Ionicons name="radio" size={20} color="white" />
            <Text style={styles.goLiveText}>Go Live</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collaboration Posts</Text>
        <ScrollView horizontal>
          {collabPosts.map(post => (
            <CollabPostCard key={post.id} post={post} />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.createCollabButton}>
          <Ionicons name="people" size={20} color="white" />
          <Text style={styles.createCollabText}>Create Collab Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Group DMs</Text>
        {groupDMs.map(group => (
          <GroupDMItem key={group.id} group={group} />
        ))}

        <TouchableOpacity style={styles.createGroupButton}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createGroupText}>Create Group</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Story Highlights</Text>
        <ScrollView horizontal>
          {storyHighlights.map(highlight => (
            <StoryHighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.createHighlightButton}>
          <Ionicons name="bookmark" size={20} color="white" />
          <Text style={styles.createHighlightText}>Create Highlight</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pinned Posts</Text>
        {pinnedPosts.map(post => (
          <PinnedPostCard key={post.id} post={post} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested Users</Text>
        <ScrollView horizontal>
          {suggestedUsers.map(user => (
            <SuggestedUserCard key={user.id} user={user} />
          ))}
        </ScrollView>
      </View>
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
  pollCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pollOption: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedPollOption: {
    backgroundColor: '#5865f2',
  },
  votedPollOption: {
    backgroundColor: '#f0f0f0',
  },
  pollOptionText: {
    fontSize: 14,
  },
  pollResults: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  pollBar: {
    height: 4,
    backgroundColor: '#5865f2',
    borderRadius: 2,
    marginRight: 5,
  },
  pollPercentage: {
    fontSize: 12,
    color: '#5865f2',
    marginRight: 5,
  },
  pollVotes: {
    fontSize: 12,
    color: '#666',
  },
  pollTotal: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quizOption: {
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedQuizOption: {
    backgroundColor: '#5865f2',
  },
  correctQuizOption: {
    backgroundColor: '#28a745',
  },
  wrongQuizOption: {
    backgroundColor: '#ff4757',
  },
  quizOptionText: {
    fontSize: 14,
  },
  quizResults: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  liveStreamCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginRight: 5,
  },
  activeLiveDot: {
    backgroundColor: '#ff4757',
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff4757',
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  streamStats: {
    fontSize: 12,
    color: '#666',
  },
  joinStreamButton: {
    backgroundColor: '#ff4757',
    padding: 8,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  joinStreamText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  goLiveButton: {
    backgroundColor: '#ff4757',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  goLiveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  createCollabButton: {
    backgroundColor: '#5865f2',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  createCollabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  collabPostCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  collabTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  collaborators: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  collabStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    marginRight: 15,
  },
  groupDMItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5865f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  groupInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupLastMessage: {
    fontSize: 14,
    color: '#666',
  },
  groupMembers: {
    fontSize: 12,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#ff4757',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  createGroupButton: {
    backgroundColor: '#5865f2',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  createGroupText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  storyHighlightCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 15,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  highlightCover: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 10,
  },
  highlightCount: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  createHighlightButton: {
    backgroundColor: '#5865f2',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  createHighlightText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pinnedPostCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pinnedLabel: {
    fontSize: 12,
    color: '#5865f2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pinnedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  suggestedUserCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  suggestedUsername: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  mutualFriends: {
    fontSize: 12,
    color: '#666',
  },
  commonInterests: {
    fontSize: 12,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#5865f2',
    padding: 8,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default InteractiveFeatures;
