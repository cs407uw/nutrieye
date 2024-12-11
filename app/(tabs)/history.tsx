import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { fetchItems, fetchTotalCount, deleteItem } from "@/database";
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

const ITEMS_PER_PAGE = 10;

export default function HistoryScreen() {
    const [items, setItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);

    const loadData = async () => {
        try {
            const count = await fetchTotalCount();
            console.log("total count is", count);
            setTotalCount(count);
            const offset = page * ITEMS_PER_PAGE;
            const data = await fetchItems(ITEMS_PER_PAGE, offset);
            setItems(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [page])
    );

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const handleDelete = async (id) => {
        try {
            await deleteItem(id);
            loadData();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const renderRightActions = (progress, dragX, itemId) => {
        return (
            <View style={styles.deleteContainer}>
                <TouchableOpacity onPress={() => handleDelete(itemId)}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderItem = ({ item }) => (
        <Swipeable
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
        >
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>Name: {item.name}</Text>
                <Text style={styles.itemText}>Calories: {item.calories}</Text>
                <Text style={styles.itemText}>Barcode: {item.barcodeData}</Text>
                <Text style={styles.timestamp}>Scanned At: {new Date(item.scannedAt).toLocaleString()}</Text>
            </View>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Scanned Items History</Text>
            {items.length > 0 ? (
                <>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />
                    <View style={styles.paginationContainer}>
                        <Button title="Previous" onPress={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0} />
                        <Text style={styles.pageIndicator}>{page + 1} / {totalPages || 1}</Text>
                        <Button title="Next" onPress={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))} disabled={page + 1 >= totalPages} />
                    </View>
                </>
            ) : (
                <Text style={styles.noItems}>No history yet.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        paddingTop: 50,
    },
    header: {
        fontSize: 26,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold'
    },
    itemContainer: {
        backgroundColor: '#1E1E1E',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    itemText: {
        color: '#ffffff',
        fontSize: 18,
        marginBottom: 5,
    },
    timestamp: {
        color: '#aaaaaa',
        fontSize: 14,
        marginTop: 5,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    pageIndicator: {
        color: '#ffffff',
        fontSize: 16,
    },
    noItems: {
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
    },
    deleteContainer: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        paddingHorizontal: 20,
        marginBottom: 10,
        borderRadius: 8,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
