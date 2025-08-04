import React from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';

const HDImage = ({ source, style, ...props }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  // Helper function to get HD version of the image URL if it's from Unsplash
  const getHDSource = (imgSource) => {
    if (!imgSource || !imgSource.uri) return imgSource;
    
    // If it's an Unsplash image, modify the URL to get higher quality
    if (imgSource.uri.includes('unsplash.com') && !imgSource.uri.includes('?ixlib=rb-')) {
      return {
        ...imgSource,
        uri: `${imgSource.uri}?auto=format&fit=crop&w=1080&q=80`,
      };
    }
    
    return imgSource;
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={getHDSource(source)}
        style={[styles.image, style]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setError(true)}
        resizeMode="cover"
        {...props}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});

export default HDImage;
