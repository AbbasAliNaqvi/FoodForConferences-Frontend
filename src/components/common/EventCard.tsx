import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Event, Vendor } from '../../types';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  event: Event;
  vendors: Vendor[];
  onPress: () => void;
}

const formatDateBadge = (date: string): { month: string; day: string } => {
  const d = new Date(date);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate().toString(),
  };
};

const EventCard = ({ event, vendors, onPress }: Props) => {
  const vendorIdStrings = event.vendorIds as string[];
  const participatingVendors = vendors.filter(v =>
    vendorIdStrings.includes(v._id),
  );
  const dateBadge = formatDateBadge(event.startDate);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Event Image */}
      <Image
        source={{
          uri:
            event.imageUrl ||
            'https://images.unsplash.com/photo-1511578314322-379afb476865',
        }}
        style={styles.image}
      />

      {/* White Content Box */}
      <View style={styles.contentBox}>
        {/* Date Badge and Location Row */}
        <View style={styles.topRow}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateMonth}>{dateBadge.month}</Text>
            <Text style={styles.dateDay}>{dateBadge.day}</Text>
          </View>

          <View style={styles.separator} />

          {/* <View style={styles.locationContainer}>
            <Icon name="location" size={16} color={COLORS.dark} />
            <Text style={styles.locationText}>{event.venue.address.split(',')[0]}</Text>
          </View> */}
        </View>

        {/* Event Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {event.description || 'Experience an unforgettable event'}
        </Text>

        {/* Price Tag */}
        <View style={styles.priceTag}>
          {/* <Icon name="pricetag" size={14} color={COLORS.gray} /> */}
          {/* <Text style={styles.priceText}>Starts from NGN 5000</Text> */}
          <Icon name="location" size={16} color={COLORS.dark} />

          <Text style={styles.locationText}>
            {event.venue?.name?.split(',')[0] || 'Venue To Be Announced'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 1.5,
    overflow: 'hidden',

    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    borderBottomWidth:10,
    shadowRadius: 0.2,
    elevation: 0.01,
  },

  image: {
    width: '100%',
    height: 280,
  },

  contentBox: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.2,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 1.5,
  },

  dateContainer: {
    alignItems: 'flex-start',
  },

  dateMonth: {
    ...FONTS.body4,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dark,
    letterSpacing: 1,
    marginBottom: -2,
  },

  dateDay: {
    ...FONTS.h1,
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.dark,
    lineHeight: 40,
  },

  separator: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray + '30',
    marginHorizontal: SIZES.padding,
  },

  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    ...FONTS.body3,
    fontSize: 15,
    color: COLORS.dark,
    fontWeight: '600',
    marginLeft: 6,
  },

  title: {
    ...FONTS.h2,
    fontSize: 24,
    color: COLORS.dark,
    fontWeight: '700',
    marginBottom: SIZES.base * 0.8,
    lineHeight: 30,
  },

  description: {
    ...FONTS.body3,
    fontSize: 15,
    color: COLORS.gray,
    lineHeight: 22,
    marginBottom: SIZES.padding,
  },

  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priceText: {
    ...FONTS.body3,
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 6,
  },
});

export default EventCard;
