import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {useRoute} from '@react-navigation/native';

export default function HomeScreen() {
  const route = useRoute();
  const {barcodeData, photo} = route.params || {};
  const [itemName, setItemName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(route.params);
  }, [route]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const formData = new FormData();

        if (barcodeData) {
          formData.append('barcode', barcodeData);
        }

        if (photo) {
          formData.append('image', {
            uri: photo.uri,
            type: 'image/jpeg',
            name: 'photo.jpg',
          });
        }

        setTimeout(() => {
          const mockResult = {
            itemName: 'Sample Item Name',
          };
          setItemName(mockResult.itemName);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error fetching item data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [barcodeData, photo]);

  if (loading) {
    return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#ffffff"/>
          <Text style={styles.loadingText}>Fetching item data...</Text>
        </View>
    );
  }

  return (
      <View style={styles.centeredContainer}>
        {itemName ? (
            <>
              <Text style={styles.itemName}>Item Name: {itemName}</Text>
              {photo && (
                  <Image source={{uri: photo.uri}} style={styles.capturedImage}/>
              )}
              {barcodeData && (
                  <Text style={styles.barcodeData}>Barcode Data: {barcodeData}</Text>
              )}
            </>
        ) : (
            <Text style={styles.errorText}>Item not found.</Text>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  barcodeData: {
    fontSize: 18,
    marginTop: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  capturedImage: {
    width: '80%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
