import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface TagProps {
  label: string;
  color: string;
}

const DietaryTag = ({ label, color }: TagProps) => (
  <View style={[styles.tag, { backgroundColor: `${color}20` }]}>
    <Text style={[styles.tagText, { color }]}>{label}</Text>
  </View>
);

interface MenuCardProps {
  item: {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    dietaryTags?: string[]; // e.g., ['vegan', 'gluten-free']
  };
  onPress: () => void;
}

const MenuCard = ({ item, onPress }: MenuCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.tagContainer}>
            {item.dietaryTags?.includes('vegan') && <DietaryTag label="Vegan" color={COLORS.success} />}
            {item.dietaryTags?.includes('gluten-free') && <DietaryTag label="GF" color={COLORS.primary} />}
        </View>
        {/* <Text style={styles.price}>${item.price.toFixed(2)}</Text> */}
      </View>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUrl || 'https://placehold.co/300x300' }} 
          style={styles.image} 
        />
        <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    marginBottom: SIZES.padding * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  contentContainer: {
    flex: 1,
    marginRight: SIZES.base,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.dark,
    marginBottom: 4,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radius,
  },
  addButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.light,
  },
  addButtonText: {
    color: COLORS.dark,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    borderRadius: SIZES.radius,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    ...FONTS.body4,
    fontSize: 12,
    fontWeight: '600',
  }
});

export default MenuCard;