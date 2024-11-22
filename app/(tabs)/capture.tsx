import React, { useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import {useCameraPermissions, Camera, CameraView} from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function TabTwoScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const [isScanned, setIsScanned] = useState(false);

  useFocusEffect(
      React.useCallback(() => {
        setIsScanned(false);
      }, [])
  );

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!isScanned) {
      setIsScanned(true);
      console.log(type, data);

      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true };
        const photo = await cameraRef.current.takePictureAsync(options);
        navigation.navigate('index', { photo, type, barcodeData: data });
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);
      navigation.navigate('index', { photo });
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionMessage}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <CameraView
            ref={cameraRef}
            style={styles.camera}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                'aztec',
                'ean13',
                'ean8',
                'qr',
                'pdf417',
                'upc_e',
                'datamatrix',
                'code39',
                'code93',
                'itf14',
                'codabar',
                'code128',
                'upc_a',
              ],
            }}
        >
          {/* Floating UI Overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Ionicons
                name="scan-outline"
                size={80}
                color="white"
                style={styles.scanIcon}
            />
            <Text style={styles.overlayText}>Scan an item or food</Text>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Ionicons name="camera-outline" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionMessage: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  scanIcon: {
    position: 'absolute',
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 280,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
});
