import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../../context/AuthContext';
import { fetchEvents, fetchMenusByEvent, fetchPopularVendors } from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Event, MenuItem, Menu, Vendor } from '../../types';
import EventCard from '../../components/common/EventCard';
import FeaturedItemCard from '../../components/common/FeaturedItemCard';
import VendorCard from '../../components/common/VendorCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import FeatureOrbiter from '../../components/common/FeatureOrbiter';

type Props = NativeStackScreenProps<any, 'Home'>;
type FeaturedMenuItem = MenuItem & { eventId: string };

const HomeScreen = ({ navigation }: Props) => {
  const { user } = useAuth();

  // --- API se data fetch karne ka logic ---
  const { data: eventsResponse, isLoading: eventsLoading } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const { data: vendorsResponse, isLoading: vendorsLoading } = useQuery({ queryKey: ['popularVendors'], queryFn: fetchPopularVendors });

  const events: Event[] = eventsResponse?.data || [];
  const popularVendors: Vendor[] = vendorsResponse?.data || [];
  const activeEvent = events?.[0];

  const { data: menusData, isLoading: menusLoading } = useQuery({
    queryKey: ['featuredMenus', activeEvent?._id],
    queryFn: () => fetchMenusByEvent(activeEvent!._id),
    enabled: !!activeEvent,
  });
  
  // Menu se items nikalne ka logic, eventId bhi add karna hai
  const featuredItems = useMemo((): FeaturedMenuItem[] => {
    if (!menusData?.data) return [];
    return (menusData.data as Menu[]).flatMap(menu => 
      menu.items.map(item => ({ ...item, eventId: menu.eventId }))
    ).slice(0, 5);
  }, [menusData]);

  // --- UI ke chote-chote parts render karne ke functions ---
  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greetingText}>Welcome, {user?.name || 'Attendee'}</Text>
        <Text style={styles.greetingSubtext}>Let's find your conference meal</Text>
      </View>
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart' as any)}>
        <Icon name="cart-outline" size={26} color={COLORS.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderSkeletonLoader = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: SIZES.padding }}>
      {[...Array(3)].map((_, index) => (
        <SkeletonCard key={index} width={SIZES.width * 0.55} height={180} />
      ))}
    </ScrollView>
  );

  // --- Final UI yahan se return hoga ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={22} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            placeholder="Search events or vendors"
            style={styles.searchInput}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Items</Text>
          {menusLoading ? (
            renderSkeletonLoader()
          ) : (
            <FlatList
              data={featuredItems}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item._id}
              contentContainerStyle={{ paddingLeft: SIZES.padding }}
              renderItem={({ item }) => {
                // ✅ FIX: popularVendors check lagaya hai crash se bachne ke liye
                const vendor = popularVendors ? popularVendors.find(v => v._id === item.vendorId) : undefined;
                return (
                  <FeaturedItemCard
                    item={item}
                    vendorName={vendor?.name}
                    onPress={() => navigation.navigate('EventDetail', { eventId: item.eventId })}
                  />
                );
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Vendors</Text>
          {vendorsLoading ? (
            renderSkeletonLoader()
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Conferences</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {eventsLoading ? (
            <View style={{ paddingHorizontal: SIZES.padding }}>
              <SkeletonCard width={SIZES.width - SIZES.padding * 2} height={250} />
            </View>
          ) : (
            <View>
              {events.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  vendors={popularVendors}
                  onPress={() => navigation.navigate('EventDetail', { eventId: event._id })}
                />
              ))}
            </View>
          )}
        </View>

        {/* Yahan mai apna naya 'FeatureOrbiter' animated component call kar raha hoon */}
        <FeatureOrbiter />

      </ScrollView>
    </SafeAreaView>
  );
};

// Styles ko chhedne ki zaroorat nahi
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: { ...FONTS.h2, color: COLORS.dark, fontWeight: 'bold' },
  greetingSubtext: { ...FONTS.body4, color: COLORS.gray, marginTop: 4 },
  cartButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    paddingHorizontal: SIZES.padding / 1.5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: SIZES.padding,
  },
  searchIcon: { marginRight: SIZES.base },
  searchInput: { flex: 1, ...FONTS.body3, color: COLORS.dark, height: 50 },
  section: {
    marginTop: SIZES.padding * 1.5,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.dark,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  seeAllText: {
    ...FONTS.body3,
    color: COLORS.accent,
    fontWeight: '700',
  },
});

export default HomeScreen;