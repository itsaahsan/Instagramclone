import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView, Animated } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

const AdvancedCamera = ({ onClose, onCapture }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const cameraRef = useRef(null);
  const [filters] = useState([
    { name: 'Normal', value: null },
    { name: 'Vintage', value: 'vintage' },
    { name: 'Black & White', value: 'bw' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Cool', value: 'cool' },
    { name: 'Warm', value: 'warm' },
    { name: 'Retro', value: 'retro' },
    { name: 'Vivid', value: 'vivid' }
  ]);

  const [multiPhotoMode, setMultiPhotoMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [gifMode, setGifMode] = useState(false);
  const [gifFrames, setGifFrames] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const applyFilter = async (photo) => {
    if (!selectedFilter || selectedFilter === 'Normal') return photo;

    const manipulations = [];
    switch (selectedFilter) {
      case 'vintage':
        manipulations.push({ sepia: 0.3 }, { contrast: 1.2 });
        break;
      case 'bw':
        manipulations.push({ sepia: 1 });
        break;
      case 'sepia':
        manipulations.push({ sepia: 0.8 });
        break;
      case 'cool':
        manipulations.push({ temperature: -50 });
        break;
      case 'warm':
        manipulations.push({ temperature: 50 });
        break;
      case 'retro':
        manipulations.push({ contrast: 1.5 }, { saturation: 0.8 });
        break;
      case 'vivid':
        manipulations.push({ saturation: 1.5 }, { contrast: 1.2 });
        break;
    }

    const manipulated = await ImageManipulator.manipulateAsync(
      photo.uri,
      manipulations,
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    return manipulated;
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      const processedPhoto = await applyFilter(photo);
      
      if (multiPhotoMode) {
        setSelectedPhotos(prev => [...prev, processedPhoto]);
        if (selectedPhotos.length >= 9) {
          onCapture(selectedPhotos);
        }
      } else {
        onCapture(processedPhoto);
      }
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync();
      onCapture(video);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const createBoomerang = async () => {
    const frames = [];
    for (let i = 0; i < 10; i++) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      frames.push(photo);
    }
    
    // Create boomerang effect by reversing frames
    const boomerangFrames = [...frames, ...frames.reverse()];
    setGifFrames(boomerangFrames);
    onCapture({ type: 'boomerang', frames: boomerangFrames });
  };

  const ARFilters = [
    { name: 'Dog Ears', type: 'ears' },
    { name: 'Heart Eyes', type: 'hearts' },
    { name: 'Crown', type: 'crown' },
    { name: 'Flower Crown', type: 'flowers' },
    { name: 'Glasses', type: 'glasses' },
    { name: 'Mustache', type: 'mustache' }
  ];

  const [arFilter, setARFilter] = useState(null);

  const applyARFilter = (filter) => {
    setARFilter(filter);
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={cameraType}
        flashMode={flashMode}
        ref={cameraRef}
      >
        <View style={styles.topControls}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setFlashMode(
              flashMode === Camera.Constants.FlashMode.off 
                ? Camera.Constants.FlashMode.on 
                : Camera.Constants.FlashMode.off
            )}
            style={styles.controlButton}
          >
            <Ionicons 
              name={flashMode === Camera.Constants.FlashMode.off ? "flash-off" : "flash"} 
              size={25} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.name}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.value && styles.selectedFilter
                ]}
                onPress={() => setSelectedFilter(filter.value)}
              >
                <Text style={styles.filterText}>{filter.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.arFilterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {ARFilters.map((filter) => (
              <TouchableOpacity
                key={filter.name}
                style={[
                  styles.arFilterButton,
                  arFilter === filter.type && styles.selectedARFilter
                ]}
                onPress={() => applyARFilter(filter.type)}
              >
                <Text style={styles.arFilterText}>{filter.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomControls}>
          <TouchableOpacity 
            onPress={() => setCameraType(
              cameraType === Camera.Constants.Type.back 
                ? Camera.Constants.Type.front 
                : Camera.Constants.Type.back
            )}
            style={styles.controlButton}
          >
            <Ionicons name="camera-reverse" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={takePhoto} 
            style={styles.captureButton}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={isRecording ? stopRecording : startRecording}
            style={[styles.recordButton, isRecording && styles.recordingButton]}
          >
            <Ionicons name={isRecording ? "stop" : "videocam"} size={25} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={createBoomerang} style={styles.boomerangButton}>
            <Ionicons name="infinite" size={25} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setMultiPhotoMode(!multiPhotoMode)}
            style={[styles.multiButton, multiPhotoMode && styles.activeMulti]}
          >
            <Text style={styles.multiText}>
              {multiPhotoMode ? `${selectedPhotos.length}/9` : "Multi"}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 40,
  },
  closeButton: {
    padding: 10,
  },
  controlButton: {
    padding: 10,
  },
  filterContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  selectedFilter: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  filterText: {
    color: 'white',
    fontSize: 12,
  },
  arFilterContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
  },
  arFilterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  selectedARFilter: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  arFilterText: {
    color: 'white',
    fontSize: 12,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: 'black',
  },
  recordButton: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255,0,0,0.7)',
  },
  recordingButton: {
    backgroundColor: 'red',
  },
  boomerangButton: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(0,255,0,0.7)',
  },
  multiButton: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,255,0.7)',
  },
  activeMulti: {
    backgroundColor: 'blue',
  },
  multiText: {
    color: 'white',
    fontSize: 12,
  },
});

export default AdvancedCamera;
