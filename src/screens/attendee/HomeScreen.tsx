import {useMemo} from 'react';
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
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { useAuth } from '../../context/AuthContext';
import { fetchEvents, fetchMenusByEvent, fetchPopularVendors } from '../../api';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Event, MenuItem, Menu, Vendor } from '../../types';
import EventCard from '../../components/common/EventCard';
import FeaturedItemCard from '../../components/common/FeaturedItemCard';
import VendorCard from '../../components/common/VendorCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import { HOW_IT_WORKS_DATA } from '../../components/mockData';
import FeatureSlide from '../../components/common/FeatureSlide';
import Paginator from '../../components/common/Paginator';

type Props = NativeStackScreenProps<any, 'Home'>;

const HEADER_HEIGHT = 80;

// AnimatedFlatList ko yahan create karunga
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
type FeaturedMenuItem = MenuItem & { eventId: string };

const HomeScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width * 0.75 + SIZES.base * 2;

  // Animation ke liye shared values bana raha hoon
  const scrollY = useSharedValue(0); // Vertical scroll ke liye
  const scrollX = useSharedValue(0); // Horizontal scroll ke liye

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

  // --- Animation ka logic yahan likh raha hoon ---

  // Page ke vertical scroll ko handle karne ka logic
  const verticalScrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });
  // 'How it Works' section ke horizontal scroll ka logic
  const horizontalScrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x;
  });

  // Header ke liye animated style, jo scroll pe hide hoga
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 40], [1, 0], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 80], [0, -40], Extrapolate.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  // --- UI ke chote-chote parts render karne ke functions ---
  const renderHeader = () => (
    <Animated.View style={[styles.header, animatedHeaderStyle]}>
      <View>
        <Text style={styles.greetingText}>Welcome, {user?.name || 'Attendee'}</Text>
        <Text style={styles.greetingSubtext}>Let's find your conference meal</Text>
      </View>
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart' as any)}>
        <Icon name="cart-outline" size={26} color={COLORS.secondary} />
      </TouchableOpacity>
    </Animated.View>
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
      <Animated.ScrollView
        onScroll={verticalScrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + SIZES.padding, paddingBottom: 120 }}
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
                const vendor = popularVendors.find(v => v._id === item.vendorId);
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

        {/* Yahan mai apna naya animated carousel call kar raha hoon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <AnimatedFlatList
            data={HOW_IT_WORKS_DATA}
            renderItem={({ item, index }) => <FeatureSlide item={item} index={index} scrollX={scrollX} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={CARD_WIDTH}
            decelerationRate="fast"
            onScroll={horizontalScrollHandler} // Sahi handler yahan use karunga
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
          />
          <Paginator data={HOW_IT_WORKS_DATA} scrollX={scrollX} />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// Styles ko chhedne ki zaroorat nahi
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    height: HEADER_HEIGHT,
    backgroundColor: COLORS.background,
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
    marginBottom: SIZES.padding,
  },
  searchIcon: { marginRight: SIZES.base },
  searchInput: { flex: 1, ...FONTS.body3, color: COLORS.dark, height: 50 },
  section: {
    marginBottom: SIZES.padding * 1.5,
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