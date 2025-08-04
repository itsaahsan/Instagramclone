import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AnalyticsDashboard = ({ userId }) => {
  const [analytics, setAnalytics] = useState({
    postInsights: [],
    storyAnalytics: [],
    followerGrowth: [],
    engagementMetrics: {},
    demographics: {},
    topPosts: [],
    storyCompletion: 0,
    profileViews: 0,
    websiteClicks: 0,
    emailClicks: 0,
    callClicks: 0,
  });

  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [userId, timeRange]);

  const fetchAnalytics = async () => {
    // Mock analytics data - replace with Firebase queries
    const mockData = {
      postInsights: [
        { id: 1, likes: 245, comments: 32, shares: 18, saves: 67, reach: 1200, impressions: 3400 },
        { id: 2, likes: 189, comments: 28, shares: 12, saves: 45, reach: 980, impressions: 2800 },
        { id: 3, likes: 312, comments: 45, shares: 25, saves: 89, reach: 1500, impressions: 4200 },
      ],
      storyAnalytics: [
        { id: 1, views: 450, forwards: 120, backwards: 45, exits: 30, replies: 15 },
        { id: 2, views: 380, forwards: 95, backwards: 38, exits: 25, replies: 12 },
      ],
      followerGrowth: [
        { date: '2024-01-01', followers: 1200 },
        { date: '2024-01-08', followers: 1350 },
        { date: '2024-01-15', followers: 1500 },
        { date: '2024-01-22', followers: 1680 },
        { date: '2024-01-29', followers: 1850 },
      ],
      engagementMetrics: {
        engagementRate: 4.8,
        avgLikes: 249,
        avgComments: 35,
        avgShares: 18,
        avgSaves: 67,
      },
      demographics: {
        gender: { male: 45, female: 52, other: 3 },
        age: { '18-24': 35, '25-34': 40, '35-44': 20, '45+': 5 },
        location: { US: 60, UK: 15, CA: 10, AU: 8, Other: 7 },
      },
      topPosts: [
        { id: 3, engagement: 8.5, type: 'photo' },
        { id: 1, engagement: 7.2, type: 'video' },
        { id: 2, engagement: 6.8, type: 'carousel' },
      ],
      storyCompletion: 78,
      profileViews: 1234,
      websiteClicks: 89,
      emailClicks: 45,
      callClicks: 23,
    };

    setAnalytics(mockData);
  };

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Overview</Text>
      
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{analytics.engagementMetrics?.engagementRate || 0}%</Text>
          <Text style={styles.metricLabel}>Engagement Rate</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{analytics.profileViews || 0}</Text>
          <Text style={styles.metricLabel}>Profile Views</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{analytics.followerGrowth?.[analytics.followerGrowth.length - 1]?.followers || 0}</Text>
          <Text style={styles.metricLabel}>Total Followers</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Follower Growth</Text>
        <LineChart
          data={{
            labels: analytics.followerGrowth.map(item => item.date.slice(5, 10)),
            datasets: [{
              data: analytics.followerGrowth.map(item => item.followers),
            }],
          }}
          width={width - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(88, 101, 242, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );

  const renderPosts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Post Insights</Text>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Post Performance</Text>
        <BarChart
          data={{
            labels: ['Likes', 'Comments', 'Shares', 'Saves'],
            datasets: [{
              data: [
                analytics.engagementMetrics?.avgLikes || 0,
                analytics.engagementMetrics?.avgComments || 0,
                analytics.engagementMetrics?.avgShares || 0,
                analytics.engagementMetrics?.avgSaves || 0,
              ],
            }],
          }}
          width={width - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(88, 101, 242, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>

      <View style={styles.topPostsContainer}>
        <Text style={styles.subTitle}>Top Performing Posts</Text>
        {analytics.topPosts?.map((post, index) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postRank}>#{index + 1}</Text>
            <Text style={styles.postType}>{post.type}</Text>
            <Text style={styles.postEngagement}>{post.engagement}% engagement</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAudience = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Audience Insights</Text>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Demographics</Text>
        <PieChart
          data={[
            { name: 'Male', population: analytics.demographics?.gender?.male || 0, color: '#8884d8' },
            { name: 'Female', population: analytics.demographics?.gender?.female || 0, color: '#82ca9d' },
            { name: 'Other', population: analytics.demographics?.gender?.other || 0, color: '#ffc658' },
          ]}
          width={width - 40}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      <View style={styles.demographicsContainer}>
        <View style={styles.demographicItem}>
          <Text style={styles.demographicLabel}>Age Groups</Text>
          {Object.entries(analytics.demographics?.age || {}).map(([age, percentage]) => (
            <Text key={age} style={styles.demographicText}>{age}: {percentage}%</Text>
          ))}
        </View>
        
        <View style={styles.demographicItem}>
          <Text style={styles.demographicLabel}>Top Locations</Text>
          {Object.entries(analytics.demographics?.location || {}).map(([location, percentage]) => (
            <Text key={location} style={styles.demographicText}>{location}: {percentage}%</Text>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Story Analytics</Text>
      
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{analytics.storyCompletion || 0}%</Text>
          <Text style={styles.metricLabel}>Completion Rate</Text>
        </View>
        
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {analytics.storyAnalytics?.reduce((sum, story) => sum + story.views, 0) || 0}
          </Text>
          <Text style={styles.metricLabel}>Total Views</Text>
        </View>
      </View>

      <View style={styles.storyInsights}>
        <Text style={styles.subTitle}>Story Performance</Text>
        {analytics.storyAnalytics?.map((story, index) => (
          <View key={story.id} style={styles.storyCard}>
            <Text style={styles.storyNumber}>Story {index + 1}</Text>
            <Text style={styles.storyMetric}>Views: {story.views}</Text>
            <Text style={styles.storyMetric}>Forwards: {story.forwards}</Text>
            <Text style={styles.storyMetric}>Replies: {story.replies}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <View style={styles.timeRangeSelector}>
          {['7d', '30d', '90d', '1y'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.activeTimeRange
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text style={styles.timeRangeText}>{range}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: 'Overview', icon: 'stats-chart' },
          { key: 'posts', label: 'Posts', icon: 'image' },
          { key: 'audience', label: 'Audience', icon: 'people' },
          { key: 'stories', label: 'Stories', icon: 'book' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons name={tab.icon} size={20} color={activeTab === tab.key ? '#fff' : '#666'} />
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'posts' && renderPosts()}
      {activeTab === 'audience' && renderAudience()}
      {activeTab === 'stories' && renderStories()}
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
    marginBottom: 10,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeRangeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTimeRange: {
    backgroundColor: '#5865f2',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#5865f2',
  },
  tabText: {
    fontSize: 12,
    marginLeft: 5,
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5865f2',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  topPostsContainer: {
    marginTop: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5865f2',
  },
  postType: {
    fontSize: 14,
    color: '#666',
  },
  postEngagement: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
  },
  demographicsContainer: {
    marginTop: 20,
  },
  demographicItem: {
    marginBottom: 15,
  },
  demographicLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  demographicText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  storyInsights: {
    marginTop: 20,
  },
  storyCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  storyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  storyMetric: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});

export default AnalyticsDashboard;
