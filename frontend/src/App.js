import React, { useState } from 'react';
import { View, Button, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const App = () => {
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response.assets[0].uri);
        setResult(null); // Reset result when a new image is selected
        setError(''); // Reset error message
      }
    });
  };

  const uploadImage = async () => {
    if (!imageUri) return; // Prevent upload if no image is selected
    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust according to your image type
      name: 'photo.jpg', // You can change the name here
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      console.error(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Potato Leaf Disease Prediction</Text>
      <Button title="Select Image" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Upload Image" onPress={uploadImage} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {result && (
        <Text style={styles.result}>
          Disease: {result.class} - Confidence: {result.confidence}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loading: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default App;
