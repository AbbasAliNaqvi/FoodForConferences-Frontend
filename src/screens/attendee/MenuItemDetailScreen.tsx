import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';

type HomeStackParamList = {
  MenuItemDetail: { menuItem: any };
  // other screens...
};
type Props = NativeStackScreenProps<HomeStackParamList, 'MenuItemDetail'>;

const MenuItemDetailScreen = ({ route, navigation }: Props) => {
  const { menuItem } = route.params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(menuItem);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: menuItem.imageUrl || 'https://placehold.co/800x600' }}
          style={styles.image}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back-outline" size={24} color={COLORS.light} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{menuItem.name}</Text>
          <Text style={styles.price}>${menuItem.price.toFixed(2)}</Text>
          <Text style={styles.description}>{menuItem.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            onPress={() => setQuantity(q => Math.max(1, q - 1))}
            style={styles.quantityButton}
          >
            <Icon name="remove-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(q => q + 1)}
            style={styles.quantityButton}
          >
            <Icon name="add-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>
            Add To Cart (${(menuItem.price * quantity).toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  image: { width: '100%', height: 300 },
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
  content: { padding: SIZES.padding },
  title: { ...FONTS.h1, color: COLORS.dark },
  price: { ...FONTS.h2, color: COLORS.primary, marginVertical: SIZES.base },
  description: { ...FONTS.body3, color: COLORS.gray, lineHeight: 22 },
  footer: {
    flexDirection: 'row',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.radius,
  },
  quantityButton: { padding: 12 },
  quantityText: { ...FONTS.h3, color: COLORS.dark, paddingHorizontal: 16 },
  addButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginLeft: SIZES.padding,
  },
  addButtonText: { ...FONTS.h3, color: COLORS.light, fontWeight: 'bold' },
});

export default MenuItemDetailScreen;
