import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { AppColors, Radius, FontSize, Spacing } from '@/constants/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '@/context/FavoritesContext';
import { Handbag } from '@/types/handbag';

interface Props {
  handbag: Handbag;
  size?: number;
  style?: object;
}

export default function FavoriteButton({ handbag, size = 22, style }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(handbag.id);
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePress = async () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.4, useNativeDriver: true, speed: 30 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    if (fav) {
      await removeFavorite(handbag.id);
    } else {
      await addFavorite(handbag);
    }
  };

  return (
    <Pressable onPress={handlePress} style={[styles.btn, style]} hitSlop={10}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={fav ? 'heart' : 'heart-outline'}
          size={size}
          color={fav ? AppColors.accent : AppColors.textSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: Spacing.xs,
    borderRadius: Radius.full,
  },
});
