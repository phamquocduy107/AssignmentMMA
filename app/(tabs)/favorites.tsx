import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useFavorites } from '@/context/FavoritesContext';
import { Handbag } from '@/types/handbag';
import { Image } from 'expo-image';
import { AppColors, Spacing, FontSize, Radius } from '@/constants/appTheme';
import FavoriteButton from '@/components/FavoriteButton';

export default function FavoritesScreen() {
  const { favorites, clearFavorites } = useFavorites();
  const router = useRouter();

  const handleClearAll = () => {
    if (favorites.length === 0) return;
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearFavorites },
      ]
    );
  };

  const renderItem = useCallback(({ item }: { item: Handbag }) => {
    const discounted = item.cost * (1 - item.percentOff);
    return (
      <Pressable
        style={({ pressed }) => [styles.item, pressed && { opacity: 0.8 }]}
        onPress={() => router.push(`/detail/${item.id}` as Href)}
      >
        <Image source={{ uri: item.uri }} style={styles.img} contentFit="cover" transition={200} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemBrand}>{item.brand}</Text>
          <Text style={styles.itemName} numberOfLines={2}>{item.handbagName}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>${discounted.toFixed(2)}</Text>
            <Text style={styles.itemOriginal}>${item.cost.toFixed(2)}</Text>
          </View>
          <View style={styles.pctBadge}>
            <Text style={styles.pctText}>{Math.round(item.percentOff * 100)}% OFF</Text>
          </View>
        </View>
        {/* Remove button */}
        <View style={styles.removeBtn}>
          <FavoriteButton handbag={item} size={22} />
        </View>
      </Pressable>
    );
  }, [router]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.background} />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>{favorites.length} saved {favorites.length === 1 ? 'item' : 'items'}</Text>
        </View>
        {favorites.length > 0 && (
          <Pressable onPress={handleClearAll} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={16} color={AppColors.danger} />
            <Text style={styles.clearText}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>Tap the heart on any bag to save it here</Text>
          <Pressable style={styles.browseBtn} onPress={() => router.push('/')}>
            <Text style={styles.browseBtnText}>Browse Bags</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { fontSize: FontSize.hero, fontWeight: '900', color: AppColors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: FontSize.sm, color: AppColors.textSecondary, marginTop: 2 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239,83,80,0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(239,83,80,0.3)',
  },
  clearText: { color: AppColors.danger, fontSize: FontSize.sm, fontWeight: '700' },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  item: {
    flexDirection: 'row',
    backgroundColor: AppColors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    alignItems: 'center',
  },
  img: { width: 90, height: 90 },
  itemInfo: { flex: 1, padding: Spacing.md, gap: 3 },
  itemBrand: { fontSize: FontSize.xs, color: AppColors.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  itemName: { fontSize: FontSize.sm, color: AppColors.textPrimary, fontWeight: '600', lineHeight: 18 },
  priceRow: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 2 },
  itemPrice: { fontSize: FontSize.sm, fontWeight: '800', color: AppColors.textPrimary },
  itemOriginal: { fontSize: FontSize.xs, color: AppColors.textMuted, textDecorationLine: 'line-through' },
  pctBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.tagBackground,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  pctText: { fontSize: 10, color: AppColors.accent, fontWeight: '700' },
  removeBtn: { paddingRight: Spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxl, gap: Spacing.md },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: AppColors.textPrimary },
  emptySubtitle: { fontSize: FontSize.md, color: AppColors.textSecondary, textAlign: 'center', lineHeight: 22 },
  browseBtn: {
    marginTop: Spacing.sm,
    backgroundColor: AppColors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  browseBtnText: { color: AppColors.white, fontWeight: '800', fontSize: FontSize.md },
});
