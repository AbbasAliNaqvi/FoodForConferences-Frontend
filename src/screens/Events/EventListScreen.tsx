import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { fetchEvents } from '../../api';

const EventListScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEvents();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        Alert.alert('Error', 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleEventPress = (eventId: string) => {
    navigation.navigate('Menu', { eventId });
  };

  const keyExtractor = (item: any) => (item.id ? item.id.toString() : String(item));

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <Text>Events</Text>
      <FlatList
        data={events}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item.id)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default EventListScreen;
