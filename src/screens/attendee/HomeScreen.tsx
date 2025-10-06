// src/screens/attendee/HomeScreen.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TextInput,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import AnimatedSection from '../../components/common/AnimatedSection';
import { useAuth } from '../../context/AuthContext';
import { fetchEvents, fetchPopularVendors } from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Event, Vendor } from '../../types';
import VendorCard from '../../components/common/VendorCard';

// --- Mock Data for a Richer UI ---
const specialsData = [
  {
    id: '1',
    dish: 'Artisanal Wood-Fired Pizza',
    vendor: 'Gourmet Slice',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65',
  },
  {
    id: '2',
    dish: 'Fresh Vegan Buddha Bowl',
    vendor: 'Green Bites',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  },
  {
    id: '3',
    dish: 'Handcrafted Gourmet Burger',
    vendor: 'The Patty Shack',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
  },
];

type Props = NativeStackScreenProps<any, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const { user } = useAuth();

  const { data: eventsResponse, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
  const events: Event[] = eventsResponse?.data || [];

  const { data: vendorsResponse, isLoading: vendorsLoading } = useQuery({
    queryKey: ['popularVendors'],
    queryFn: fetchPopularVendors,
  });
  const popularVendors: Vendor[] = vendorsResponse?.data || [];

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greetingText}>Hi, {user?.name || 'There'}! 👋</Text>
        <Text style={styles.greetingSubtext}>
          Ready for a culinary adventure?
        </Text>
      </View>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart' as any)}
      >
        <Icon name="cart-outline" size={26} color={COLORS.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Icon
        name="search-outline"
        size={22}
        color={COLORS.gray}
        style={styles.searchIcon}
      />
      <TextInput
        placeholder="Find a dish or vendor..."
        style={styles.searchInput}
        placeholderTextColor={COLORS.gray}
      />
    </View>
  );

  const renderSpecialItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.specialCard}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.specialImage}
        imageStyle={{ borderRadius: SIZES.radius * 1.5 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.specialOverlay}
        >
          <Text style={styles.specialDish}>{item.dish}</Text>
          <Text style={styles.specialVendor}>{item.vendor}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderEventCard = (event: Event, index: number) => {
    const hasBreakfast = event.mealSlots.some(slot =>
      slot.name.toLowerCase().includes('breakfast'),
    );
    const hasLunch = event.mealSlots.some(slot =>
      slot.name.toLowerCase().includes('lunch'),
    );

    return (
      <AnimatedSection key={event._id} delay={index * 150}>
        <TouchableOpacity
          style={styles.eventCard}
          onPress={() =>
            navigation.navigate('EventDetail', { eventId: event._id })
          }
        >
          <ImageBackground
            source={{
              uri:
                event.imageUrl ||
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
            }}
            style={styles.eventImage}
            imageStyle={{ borderRadius: SIZES.radius * 1.5 }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']}
              style={styles.eventOverlay}
            >
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventMetaRow}>
                <View style={styles.eventMeta}>
                  <Icon
                    name="calendar-outline"
                    size={16}
                    color={COLORS.light}
                  />
                  <Text style={styles.eventMetaText}>
                    {new Date(event.startDate).toDateString()}
                  </Text>
                </View>
                <View style={styles.eventMeta}>
                  <Icon name="people-outline" size={16} color={COLORS.light} />
                  <Text style={styles.eventMetaText}>
                    {event.vendorIds.length}+ Vendors
                  </Text>
                </View>
              </View>
              <View style={styles.eventSlots}>
                {hasBreakfast && (
                  <Icon
                    name="cafe-outline"
                    size={20}
                    color={COLORS.light}
                    style={{ marginRight: 8 }}
                  />
                )}
                {hasLunch && (
                  <Icon
                    name="restaurant-outline"
                    size={20}
                    color={COLORS.light}
                  />
                )}
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </AnimatedSection>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {renderHeader()}
        {renderSearchBar()}

        <AnimatedSection>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Don't Miss Out</Text>
            <FlatList
              data={specialsData}
              renderItem={renderSpecialItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: SIZES.padding }}
            />
          </View>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Vendors</Text>
            {vendorsLoading ? (
              <ActivityIndicator
                color={COLORS.primary}
                style={{ marginLeft: SIZES.padding }}
              />
            ) : (
              <FlatList
                data={popularVendors}
                renderItem={({ item }) => <VendorCard vendor={item} />}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: SIZES.padding }}
              />
            )}
          </View>
        </AnimatedSection>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {eventsLoading ? (
            <ActivityIndicator
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            events.map(renderEventCard)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 1.5,
  },
  greetingText: { ...FONTS.h2, color: COLORS.secondary, fontWeight: '700' },
  greetingSubtext: { ...FONTS.body4, color: COLORS.gray },
  cartButton: {
    padding: SIZES.base,
    backgroundColor: `${COLORS.primary}40`,
    borderRadius: SIZES.radius,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    margin: SIZES.padding,
    paddingHorizontal: SIZES.padding / 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: { marginRight: SIZES.base },
  searchInput: { flex: 1, ...FONTS.body3, color: COLORS.dark, height: 50 },
  section: { marginBottom: SIZES.padding * 1.5 },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.dark,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding / 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding / 1.5,
  },
  seeAllText: { ...FONTS.body4, color: COLORS.accent, fontWeight: '700' },
  specialCard: {
    width: SIZES.width * 0.7,
    height: 180,
    marginRight: SIZES.padding,
  },
  specialImage: { flex: 1, justifyContent: 'flex-end' },
  specialOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SIZES.padding,
    borderRadius: SIZES.radius * 1.5,
  },
  specialDish: {
    ...FONTS.h3,
    color: COLORS.light,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  specialVendor: { ...FONTS.body4, color: `${COLORS.light}90` },
  eventCard: {
    height: 220,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  eventImage: { flex: 1 },
  eventOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SIZES.padding,
    borderRadius: SIZES.radius * 1.5,
  },
  eventTitle: {
    ...FONTS.h2,
    color: COLORS.light,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  eventMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.base,
    width: '100%',
  },
  eventMeta: { flexDirection: 'row', alignItems: 'center' },
  eventMetaText: {
    ...FONTS.body4,
    color: COLORS.light,
    marginLeft: SIZES.base,
    fontWeight: '600',
  },
  eventSlots: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    flexDirection: 'row',
  },
});

export default HomeScreen;
