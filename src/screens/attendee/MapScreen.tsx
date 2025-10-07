import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, FONTS, SIZES } from '../../constants/theme';

const MAP_IMAGE = require('../../assets/conference_map_4k.png');

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = NativeStackScreenProps<any, 'Map'>;

const MapScreen = ({ navigation }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filterActive, setFilterActive] = useState(false);

  const POIs = useMemo(() => [
    'Main Entrance', 'Event Hall 2', 'Cafeteria West', 
    'Hotel Grand A', 'Food Vendor Zone B', 'Keynote Stage',
    'Restrooms East', 'Info Desk'
  ], []);

  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1200);
  };

  const handleFilterPress = () => {
    console.log('Opening Map Filters...');
    setFilterActive(!filterActive);
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
        <Icon name="arrow-back" size={26} color={COLORS.dark} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Venue Layout</Text>
      <TouchableOpacity onPress={handleFilterPress} style={styles.iconButton}>
        <Icon 
            name={filterActive ? "options" : "options-outline"} 
            size={26} 
            color={filterActive ? COLORS.secondary : COLORS.primary} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderSearchAndStatus = () => (
    <View style={styles.searchContainer}>
        <Icon
            name="search-outline"
            size={22}
            color={COLORS.gray}
            style={styles.searchIcon}
        />
        <TextInput
            placeholder="Find Hall, Vendor, or Room..."
            style={styles.searchInput}
            placeholderTextColor={COLORS.gray}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
        />
        {isSearching && (
            <ActivityIndicator size="small" color={COLORS.primary} style={styles.searchActivity} />
        )}
    </View>
  );
  
//   const renderPOIsPanel = () => (
//     <View style={styles.poiPanel}>
//         <Text style={styles.panelHeader}>Quick Jumps</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {POIs.map((poi, index) => (
//             <TouchableOpacity key={index} style={styles.locationChip} onPress={() => console.log(`Jumping to: ${poi}`)}>
//               <Text style={styles.chipText}>{poi}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//     </View>
//   );

  return (
    <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        {renderSearchAndStatus()}

        <View style={styles.mapView}>
          <ScrollView
            maximumZoomScale={3}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mapScrollContent}
            centerContent={true}
          >
            <Image
                source={MAP_IMAGE}
                style={styles.mapImage}
                resizeMode="contain"
            />
          </ScrollView>
        </View>

        {/* {renderPOIsPanel()} */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 1.5,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.dark,
    fontWeight: '700',
  },
  iconButton: {
    padding: SIZES.base / 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    marginHorizontal: SIZES.padding,
    paddingHorizontal: SIZES.padding1,
    borderWidth: 1,
    borderColor: COLORS.light,
    marginBottom: SIZES.padding * 0.75,
  },
  searchIcon: { marginRight: SIZES.base },
  searchInput: { 
      flex: 1, 
      ...FONTS.body3, 
      color: COLORS.dark, 
      height: 48,
  },
  searchActivity: { 
      marginRight: SIZES.base / 2 
  },
  
  mapView: {
    flex: 1, 
    // backgroundColor: COLORS.white,
    // marginHorizontal: SIZES.padding,
    // borderRadius: SIZES.radius,
    // overflow: 'hidden',
    borderWidth: 1,
    marginTop:-80,
    borderColor: '#EFEFEF',
  },
  mapScrollContent: {
    minWidth: screenWidth - SIZES.padding * 2,
    minHeight: screenHeight * 0.7, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    width: "100%", 
    height: "100%",
  },

  poiPanel: {
    paddingVertical: SIZES.padding1,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.background, 
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,

  },
  panelHeader: {
    ...FONTS.h3,
    color: COLORS.dark,
    marginBottom: -120,
    fontWeight: 'bold',

  },
  locationChip: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding1,
    borderRadius: 20,
    marginRight: SIZES.base,
    opacity: 0.95,
  },
  chipText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '700',
  },
});

export default MapScreen;
