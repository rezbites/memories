// App.js
import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import PreviewScreen from './screens/PreviewScreen';

// Import utils
import { MediaManager } from './utils/media_manager';
import { DuplicateFilter } from './utils/duplicatefilter';
import { VideoCompiler } from './utils/videoCompiler';

// Create a context to share selected media across screens
export const MediaContext = createContext();

const Stack = createNativeStackNavigator();
const mediaManager = new MediaManager();

const App = () => {
  const [selectedMedia, setSelectedMedia] = useState([]);

  // Load media once when app starts
  React.useEffect(() => {
    const loadMedia = async () => {
      try {
        await mediaManager.loadMedia();
        const filteredMedia = await DuplicateFilter.filterDuplicates(mediaManager.media);
        mediaManager.media = filteredMedia;
      } catch (error) {
        console.error('Error loading media:', error);
      }
    };
    loadMedia();
  }, []);

  // Compile video with selected media when navigating to preview screen
  const compileVideo = async () => {
    try {
      const videoPath = await VideoCompiler.compileVideo(selectedMedia, { duration: 30 });
      return videoPath;
    } catch (error) {
      console.error('Error compiling video:', error);
    }
  };

  return (
    <MediaContext.Provider value={{ selectedMedia, setSelectedMedia, compileVideo }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Year in Review' }}
          />
          <Stack.Screen 
            name="Gallery" 
            component={GalleryScreen} 
            options={{ title: 'Select Media' }}
          />
          <Stack.Screen 
            name="Preview" 
            component={PreviewScreen} 
            options={{ title: 'Preview Video' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MediaContext.Provider>
  );
};

export default App;
