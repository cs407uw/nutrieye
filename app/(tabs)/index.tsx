import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, Text, ActivityIndicator, Button} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import {insertItem} from "@/database";

export default function HomeScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const {barcodeData, photo} = route.params || {};
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(route.params);
    }, [route]);

    useEffect(() => {

        if (!photo && !barcodeData) {
            navigation.navigate('capture');
            return;
        }

        const fetchData = async () => {
            setLoading(true);

            try {
                let base64Image = null;

                if (photo) {
                    base64Image = await FileSystem.readAsStringAsync(photo.uri, {encoding: FileSystem?.EncodingType?.Base64});
                }

                const barcodes = barcodeData ? [barcodeData] : [];
                const requestBody = {
                    image: base64Image,
                    barcodes: barcodes,
                };

                const response = await fetch(
                    'https://nutrieye-backend-production.up.railway.app/analyze',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    },
                );

                if (!response.ok) {
                    console.log(await response.text());
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data && data.result && data.result.items) {
                    const fetchedItems = data.result.items;
                    setItems(fetchedItems);

                    for (const item of fetchedItems) {
                        await insertItem(item.name, item.calories, barcodeData || '');
                    }
                } else {
                    setItems([]);
                }

                setLoading(false);
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
            <Button title="View History" onPress={() => navigation.navigate('history')}/>
            {items.length > 0 ? (
                <>
                    {items.map((item, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <Text style={styles.itemName}>Item Name: {item.name}</Text>
                            <Text style={styles.itemCalories}>
                                Calories: {item.calories}
                            </Text>
                        </View>
                    ))}
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
    itemContainer: {
        marginBottom: 16,
    },
    itemName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    itemCalories: {
        fontSize: 18,
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
