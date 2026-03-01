import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors, FontSize, Spacing } from '@/constants/appTheme';

interface Props {
  rating: number; // e.g. 4.5
  size?: number;
  showLabel?: boolean;
}

export default function StarRating({ rating, size = 16, showLabel = false }: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map(star => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <Text key={star} style={[styles.star, { fontSize: size }]}>
            {filled ? '★' : half ? '⭑' : '☆'}
          </Text>
        );
      })}
      {showLabel && (
        <Text style={[styles.label, { fontSize: size - 2 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  star: {
    color: AppColors.star,
  },
  label: {
    color: AppColors.textSecondary,
    marginLeft: Spacing.xs,
    fontWeight: '600',
  },
});
