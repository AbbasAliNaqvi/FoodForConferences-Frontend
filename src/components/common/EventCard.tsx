import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Event, Vendor } from '../../types';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  event: Event;
  vendors: Vendor[];
  onPress: () => void;
}

const EventCard = ({ event, vendors, onPress }: Props) => {
  // Find the vendors participating in this specific event
  const participatingVendors = vendors.filter(v => event.vendorIds.includes(v._id));

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865' }} style={styles.image} />
      <View style={styles.infoBox}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.metaRow}>
          <Icon name="business-outline" size={16} color={COLORS.gray} />
          <Text style={styles.metaText}>{event.venue.name}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="calendar-outline" size={16} color={COLORS.gray} />
          <Text style={styles.metaText}>{new Date(event.startDate).toDateString()}</Text>
        </View>

        <View style={styles.vendorSection}>
          <Text style={styles.vendorTitle}>Featuring</Text>
          <FlatList
            data={participatingVendors}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item.logoUrl || `https://ui-avatars.com/api/?name=${item.name}&background=D8C9AE&color=575757`}} 
                style={styles.vendorAvatar}
              />
            )}
            ListEmptyComponent={<Text style={styles.metaText}>Vendors to be announced</Text>}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius * 1.5,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: SIZES.radius * 1.5,
    borderTopRightRadius: SIZES.radius * 1.5,
  },
  infoBox: {
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.dark,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  metaText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base,
  },
  vendorSection: {
    marginTop: SIZES.padding,
    paddingTop: SIZES.padding,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  vendorTitle: {
    ...FONTS.body4,
    color: COLORS.dark,
    fontWeight: '600',
    marginBottom: SIZES.base * 1.5,
  },
  vendorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.base,
    borderWidth: 2,
    borderColor: COLORS.light,
  },
});

export default EventCard;