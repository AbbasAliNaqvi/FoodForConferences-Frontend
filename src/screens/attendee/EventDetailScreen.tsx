import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchEventById } from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { Event } from '../../types';

// --- Types ---
type RootStackParamList = {
  EventDetail: { eventId: string };
};
type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;
const formatDate = (date?: Date | string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
const formatDateRange = (
  startDate?: Date | string,
  endDate?: Date | string,
) => {
  if (!startDate) return 'Date not available';
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (!endDate || start === end) return start;
  return `${start} - ${end}`;
};

// --- Sub-Components ---

const EventHeader = React.memo(
  ({
    imageUrl,
    title,
    onBack,
  }: {
    imageUrl?: string;
    title?: string;
    onBack: () => void;
  }) => (
    <View style={styles.headerContainer}>
      <Image
        source={{
          uri:
            imageUrl ||
            'https://img.freepik.com/free-photo/people-taking-part-high-protocol-event_23-2150951409.jpg?semt=ais_hybrid&w=740&q=80',
        }}
        style={styles.headerImage}
      />
      <View style={styles.headerOverlay} />
      <SafeAreaView style={styles.headerContent}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back-outline" size={24} color={COLORS.light} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
      </SafeAreaView>
    </View>
  ),
);

const EventTimeline = React.memo(
  ({
    mealSlots,
    onPressMenu,
  }: {
    mealSlots?: Event['mealSlots'];
    onPressMenu: () => void;
  }) => {
    if (!mealSlots || mealSlots.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.ctaButton} onPress={onPressMenu}>
          <Icon name="fast-food" size={20} color={COLORS.light} />{' '}
          <Text style={styles.ctaButtonText}> MENU</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Event Timeline</Text>
        <View style={styles.timeline}>
          {mealSlots.map((slot, index) => (
            <View key={slot.id || index} style={styles.timelineNode}>
              <View style={styles.timelineIconContainer}>
                <View style={styles.timelineIcon} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTime}>
                  {new Date(slot.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.timelineTitle}>{slot.name}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  },
);

const FeaturingVendors = React.memo(
  ({ vendorIds }: { vendorIds?: string[] }) => {
    if (!vendorIds || vendorIds.length === 0) return null;
    const vendors = vendorIds.map(id => ({
      _id: id,
      name: 'Vendor',
      logoUrl: '',
    }));
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Featuring</Text>
        <FlatList
          data={vendors}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => (
            <Image
              source={{
                uri: item.logoUrl || `https://i.pravatar.cc/150?u=${item._id}`,
              }}
              style={[
                styles.vendorAvatar,
                { marginLeft: index === 0 ? 0 : -10 },
              ]}
            />
          )}
        />
      </View>
    );
  },
);

// --- Main Screen Component ---
const EventDetailScreen = ({ route, navigation }: Props) => {
  const { eventId } = route.params;

  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId),
    select: response => response.data as Event,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load event.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SIZES.padding * 2 }}
      >
        <EventHeader
          imageUrl={event.imageUrl}
          title={event.title}
          onBack={() => navigation.goBack()}
        />

        <View style={styles.contentSheet}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle1}>{event.title}</Text>
            <Text style={styles.dateText}>
              {formatDateRange(event.startDate, event.endDate)}
            </Text>
            <Text style={styles.sectionTitle}>About this Event</Text>
            <Text style={styles.description}>{event.description}</Text>
            {event.venue?.capacity && (
              <View style={styles.capacityContainer}>
                <Icon name="people-outline" size={20} color={COLORS.gray} />
                <Text style={styles.capacityText}>
                  Up to {event.venue.capacity.toLocaleString()} attendees
                </Text>
              </View>
            )}
          </View>

          <EventTimeline
            mealSlots={event.mealSlots}
            onPressMenu={() =>
              navigation.navigate('EventMenu', {
                eventId: event._id,
                eventTitle: event.title,
              })
            }
          />

          <FeaturingVendors vendorIds={event.vendorIds} />
        </View>
      </ScrollView>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: { ...FONTS.h3, color: COLORS.danger },
  headerContainer: { height: 300, backgroundColor: COLORS.dark },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  headerTitle: {
    ...FONTS.largeTitle,
    color: COLORS.light,
    fontWeight: 'bold',
    width: '90%',
  },
  contentSheet: {
    backgroundColor: COLORS.background || '#F8F9FA',
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    marginTop: -SIZES.padding * 2,
    paddingTop: SIZES.padding * 1.5,
  },
  sectionContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  sectionTitle1: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: -20,
    fontWeight: 700,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.dark,
    marginBottom: 10,
  },
  description: { ...FONTS.body3, color: COLORS.gray, lineHeight: 24 },
  dateText: {
    ...FONTS.body4,
    color: COLORS.gray,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding,
    padding: SIZES.base,
    backgroundColor: '#F7F7F7',
    borderRadius: SIZES.radius,
  },
  capacityText: { ...FONTS.body4, color: COLORS.dark, marginLeft: SIZES.base },
  timeline: {
    borderLeftWidth: 3,
    borderColor: COLORS.border,
    paddingTop: 10,
    marginLeft: SIZES.padding,
  },
  timelineNode: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding * 1.5,
    position: 'relative',
  },
  timelineIconContainer: {
    position: 'absolute',
    left: -14,
    top: 0,
    backgroundColor: COLORS.background,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: COLORS.light,
  },
  timelineContent: { marginLeft: SIZES.padding * 1.5, paddingTop: 2, flex: 1 },
  timelineTime: {
    ...FONTS.body4,
    color: COLORS.gray,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  timelineTitle: { ...FONTS.h4, color: COLORS.dark },
  vendorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginHorizontal: SIZES.padding,
    marginTop: -SIZES.padding * 1,
    marginBottom: SIZES.padding * 1.5,
  },
  ctaButtonText: { ...FONTS.h3, color: COLORS.light, fontWeight: 'bold' },
});

export default EventDetailScreen;
