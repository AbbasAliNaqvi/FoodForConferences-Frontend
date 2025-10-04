import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchEventById } from '../../api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

interface Props {
  navigation: StackNavigationProp<any>;
  route: RouteProp<any, 'EventDetail'>;
}

const EventDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // yahan specific event ki details fetch ho rahi hain
    fetchEventById(eventId)
      .then(res => setEvent(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!event) return <Text>Event not found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text>{event.description}</Text>
      <Text>Start: {new Date(event.startDate).toLocaleString()}</Text>
      <Text>End: {new Date(event.endDate).toLocaleString()}</Text>

      <Button title="View Menu" onPress={() => navigation.navigate('Menu', { eventId })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default EventDetailScreen;
