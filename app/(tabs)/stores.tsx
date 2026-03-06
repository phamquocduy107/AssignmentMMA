import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { AppColors, Spacing, FontSize, Radius } from '@/constants/appTheme';

interface Store {
  id: string;
  brand: string;
  name: string;
  city: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
  phone: string;
}

const STORES: Store[] = [
  // Ho Chi Minh City
  {
    id: 's1',
    brand: 'Bvlgari',
    name: 'Bulgari Boutique Saigon Centre',
    city: 'Hồ Chí Minh',
    address: '65 Lê Lợi, Q.1, TP.HCM',
    coordinate: { latitude: 10.7732, longitude: 106.7016 },
    phone: '+84 28 3822 9999',
  },
  {
    id: 's2',
    brand: 'Fendi',
    name: 'Fendi Vincom Center',
    city: 'Hồ Chí Minh',
    address: '72 Lê Thánh Tôn, Q.1, TP.HCM',
    coordinate: { latitude: 10.7790, longitude: 106.7009 },
    phone: '+84 28 3911 8888',
  },
  {
    id: 's3',
    brand: 'Burberry',
    name: 'Burberry Union Square',
    city: 'Hồ Chí Minh',
    address: '171 Đồng Khởi, Q.1, TP.HCM',
    coordinate: { latitude: 10.7770, longitude: 106.7031 },
    phone: '+84 28 3827 7777',
  },
  {
    id: 's4',
    brand: 'Michael Kors',
    name: 'Michael Kors Diamond Plaza',
    city: 'Hồ Chí Minh',
    address: '34 Lê Duẩn, Q.1, TP.HCM',
    coordinate: { latitude: 10.7820, longitude: 106.6982 },
    phone: '+84 28 3822 6666',
  },
  {
    id: 's5',
    brand: 'Ferragamo',
    name: 'Salvatore Ferragamo Saigon',
    city: 'Hồ Chí Minh',
    address: '132 Đồng Khởi, Q.1, TP.HCM',
    coordinate: { latitude: 10.7758, longitude: 106.7025 },
    phone: '+84 28 3829 5555',
  },
  // Hanoi
  {
    id: 's6',
    brand: 'Bvlgari',
    name: 'Bulgari Vincom Bà Triệu',
    city: 'Hà Nội',
    address: '191 Bà Triệu, Hai Bà Trưng, HN',
    coordinate: { latitude: 21.0182, longitude: 105.8468 },
    phone: '+84 24 3974 9999',
  },
  {
    id: 's7',
    brand: 'Fendi',
    name: 'Fendi Tràng Tiền Plaza',
    city: 'Hà Nội',
    address: '24 Hai Bà Trưng, Hoàn Kiếm, HN',
    coordinate: { latitude: 21.0278, longitude: 105.8560 },
    phone: '+84 24 3936 8888',
  },
  {
    id: 's8',
    brand: 'Burberry',
    name: 'Burberry Lotte Center',
    city: 'Hà Nội',
    address: '54 Liễu Giai, Ba Đình, HN',
    coordinate: { latitude: 21.0358, longitude: 105.8162 },
    phone: '+84 24 3332 7777',
  },
  {
    id: 's9',
    brand: 'Michael Kors',
    name: 'Michael Kors Parkson Landmark',
    city: 'Hà Nội',
    address: '772 Đường Láng, Đống Đa, HN',
    coordinate: { latitude: 21.0127, longitude: 105.8199 },
    phone: '+84 24 3776 6666',
  },
  {
    id: 's10',
    brand: 'Ferragamo',
    name: 'Ferragamo Tràng Tiền',
    city: 'Hà Nội',
    address: '7 Đinh Tiên Hoàng, Hoàn Kiếm, HN',
    coordinate: { latitude: 21.0294, longitude: 105.8566 },
    phone: '+84 24 3825 5555',
  },
];

const BRAND_COLORS: Record<string, string> = {
  Bvlgari: '#E91E8C',
  Fendi: '#FF9800',
  Burberry: '#4FC3F7',
  'Michael Kors': '#4CAF50',
  Ferragamo: '#9C27B0',
};

const ALL_BRANDS = ['All', 'Bvlgari', 'Fendi', 'Burberry', 'Michael Kors', 'Ferragamo'];
const CITIES = ['All', 'Hồ Chí Minh', 'Hà Nội'];

const REGION_HCM = { latitude: 10.778, longitude: 106.702, latitudeDelta: 0.04, longitudeDelta: 0.04 };
const REGION_HN = { latitude: 21.025, longitude: 105.835, latitudeDelta: 0.06, longitudeDelta: 0.06 };

export default function StoresScreen() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [mapRef, setMapRef] = useState<MapView | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const filtered = STORES.filter(
    (s) =>
      (selectedBrand === 'All' || s.brand === selectedBrand) &&
      (selectedCity === 'All' || s.city === selectedCity)
  );

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (city === 'Hồ Chí Minh') mapRef?.animateToRegion(REGION_HCM, 600);
    else if (city === 'Hà Nội') mapRef?.animateToRegion(REGION_HN, 600);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={AppColors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Store Locator</Text>
          <Text style={styles.subtitle}>{filtered.length} stores found</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="location" size={22} color={AppColors.accent} />
        </View>
      </View>

      {/* City Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {CITIES.map((city) => (
          <Pressable
            key={city}
            style={[styles.chip, selectedCity === city && styles.chipActive]}
            onPress={() => handleCityChange(city)}
          >
            <Text style={[styles.chipText, selectedCity === city && styles.chipTextActive]}>
              {city === 'All' ? '🌏 Tất cả' : city === 'Hồ Chí Minh' ? '🏙 HCM' : '🏛 Hà Nội'}
            </Text>
          </Pressable>
        ))}
        <View style={styles.dividerV} />
        {ALL_BRANDS.slice(1).map((brand) => (
          <Pressable
            key={brand}
            style={[
              styles.chip,
              selectedBrand === brand && { backgroundColor: BRAND_COLORS[brand] + '33', borderColor: BRAND_COLORS[brand] },
            ]}
            onPress={() => setSelectedBrand(selectedBrand === brand ? 'All' : brand)}
          >
            <Text style={[styles.chipText, selectedBrand === brand && { color: BRAND_COLORS[brand] }]}>
              {brand}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={(ref) => setMapRef(ref)}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_DEFAULT}
          initialRegion={REGION_HCM}
          showsUserLocation={false}
        >
          {filtered.map((store) => (
            <Marker
              key={store.id}
              coordinate={store.coordinate}
              pinColor={BRAND_COLORS[store.brand]}
              onPress={() => setSelectedStore(store)}
            >
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutBrand}>{store.brand}</Text>
                  <Text style={styles.calloutName}>{store.name}</Text>
                  <Text style={styles.calloutAddress}>{store.address}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Selected Store Card */}
      {selectedStore && (
        <View style={styles.storeCard}>
          <View style={[styles.brandDot, { backgroundColor: BRAND_COLORS[selectedStore.brand] }]} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeBrand}>{selectedStore.brand}</Text>
            <Text style={styles.storeName}>{selectedStore.name}</Text>
            <Text style={styles.storeAddress}>{selectedStore.address}</Text>
            <Text style={styles.storePhone}>{selectedStore.phone}</Text>
          </View>
          <Pressable onPress={() => setSelectedStore(null)} hitSlop={12}>
            <Ionicons name="close-circle" size={22} color={AppColors.textMuted} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.hero, fontWeight: '900', color: AppColors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: FontSize.sm, color: AppColors.textSecondary, marginTop: 2 },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    alignItems: 'center',
    height: 48,
  },
  dividerV: { width: 1, height: 24, backgroundColor: AppColors.cardBorder, marginHorizontal: 4 },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    backgroundColor: AppColors.chipInactive,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
  },
  chipActive: { backgroundColor: AppColors.chipActive, borderColor: AppColors.accent },
  chipText: { fontSize: FontSize.xs, color: AppColors.chipTextInactive, fontWeight: '600' },
  chipTextActive: { color: AppColors.chipTextActive },
  mapContainer: { flex: 1 },
  callout: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    width: 200,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    gap: 3,
  },
  calloutBrand: { fontSize: FontSize.xs, color: AppColors.accent, fontWeight: '700', textTransform: 'uppercase' },
  calloutName: { fontSize: FontSize.sm, color: AppColors.textPrimary, fontWeight: '700' },
  calloutAddress: { fontSize: FontSize.xs, color: AppColors.textSecondary },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderTopWidth: 1,
    borderTopColor: AppColors.cardBorder,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  brandDot: { width: 12, height: 12, borderRadius: 6, flexShrink: 0 },
  storeInfo: { flex: 1, gap: 2 },
  storeBrand: { fontSize: FontSize.xs, color: AppColors.accent, fontWeight: '700', textTransform: 'uppercase' },
  storeName: { fontSize: FontSize.sm, fontWeight: '700', color: AppColors.textPrimary },
  storeAddress: { fontSize: FontSize.xs, color: AppColors.textSecondary },
  storePhone: { fontSize: FontSize.xs, color: AppColors.textMuted, marginTop: 2 },
});
