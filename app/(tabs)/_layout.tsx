import {Tabs} from 'expo-router';
import React from 'react';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Search',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="capture"
                options={{
                    title: 'Capture',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'camera' : 'camera-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color}/>
                    ),
                }}
            />

        </Tabs>
    );
}
