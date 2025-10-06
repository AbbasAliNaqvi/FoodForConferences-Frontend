import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchEventById, fetchMenusByEvent } from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import MenuCard from '../../components/common/MenuCard';
import Icon from 'react-native-vector-icons/Ionicons';

// const BackIcon = require('../../assets/icons/back.png');
// const LocationIcon = require('../../assets/icons/location.png');
// const CalendarIcon = require('../../assets/icons/calendar.png');

type RootStackParamList = {
  EventDetail: { eventId: string };
};
type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

const EventDetailScreen = ({ route, navigation }: Props) => {
  const { eventId } = route.params;

  const { data: eventData, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEventById(eventId),
  });

  const { data: menusData, isLoading: isLoadingMenus } = useQuery({
    queryKey: ['menus', eventId],
    queryFn: () => fetchMenusByEvent(eventId),
    enabled: !!eventData,
  });

  const event = eventData?.data;
  const menus = menusData?.data || [];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Image
        source={{ uri: event?.imageUrl || 'https://placehold.co/800x400' }}
        style={styles.headerImage}
      />
      <View style={styles.headerOverlay} />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        {/* --- 3. Replace the Image component with the Icon component --- */}
        <Icon name="arrow-back-outline" size={24} color={COLORS.light} />
      </TouchableOpacity>
    </View>
  );

  const renderEventInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.title}>{event?.name}</Text>
      <Text style={styles.description}>{event?.description}</Text>

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          {/* --- 3. Replace the Image component with the Icon component --- */}
          <Icon
            name="calendar-outline"
            size={20}
            color={COLORS.primary}
            style={styles.metaIcon}
          />
          <Text style={styles.metaText}>
            {new Date(event?.date).toDateString()}
          </Text>
        </View>
        <View style={styles.metaItem}>
          {/* --- 3. Replace the Image component with the Icon component --- */}
          <Icon
            name="location-outline"
            size={20}
            color={COLORS.primary}
            style={styles.metaIcon}
          />
          <Text style={styles.metaText}>{event?.location}</Text>
        </View>
      </View>
    </View>
  );

  const renderMenus = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Menus Available</Text>
      {isLoadingMenus ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : menus.length > 0 ? (
        menus.map((menu: any) => (
          <MenuCard
            key={menu._id}
            item={menu}
            onPress={() => {
              /* Navigate to MenuItemDetailScreen */
            }}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>
          No menus have been added for this event yet.
        </Text>
      )}
    </View>
  );

  if (isLoadingEvent) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderEventInfo()}
        {renderMenus()}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles (no major changes needed) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerContainer: { height: 280, width: '100%' },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: SIZES.padding * 1.5,
    left: SIZES.padding,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  title: { ...FONTS.h1, color: COLORS.dark, marginBottom: SIZES.base },
  description: {
    ...FONTS.body3,
    color: COLORS.gray,
    lineHeight: 24,
    marginBottom: SIZES.padding,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  metaIcon: { marginRight: 10 },
  metaText: { ...FONTS.body4, color: COLORS.dark, fontWeight: '500' },
  menuSection: { padding: SIZES.padding },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EventDetailScreen;
