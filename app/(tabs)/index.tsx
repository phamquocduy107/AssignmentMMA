import BrandFilter from "@/components/BrandFilter";
import HandbagCard from "@/components/HandbagCard";
import { AppColors, FontSize, Spacing } from "@/constants/appTheme";
import { fetchHandbags } from "@/services/api";
import { Handbag } from "@/types/handbag";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const [handbags, setHandbags] = useState<Handbag[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [error, setError] = useState<string | null>(null);

  const loadHandbags = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchHandbags();
      const sorted = [...data].sort((a, b) => b.cost - a.cost);
      setHandbags(sorted);
    } catch (e) {
      setError("Failed to load handbags. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHandbags();
  }, [loadHandbags]);

  const filtered = useMemo(() => {
    if (selectedBrand === "All") return handbags;
    return handbags.filter((h) => h.brand === selectedBrand);
  }, [handbags, selectedBrand]);

  const renderItem = useCallback(
    ({ item }: { item: Handbag }) => <HandbagCard handbag={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Handbag) => item.id, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={AppColors.background}
      />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Luxury Bags</Text>
        <Text style={styles.subtitle}>
          {filtered.length} {selectedBrand !== "All" ? selectedBrand : ""}{" "}
          {filtered.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {/* Brand Filter */}
      <BrandFilter selected={selectedBrand} onSelect={setSelectedBrand} />

      {/* Content */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={AppColors.accent} />
            <Text style={styles.loadingText}>Loading luxury bags...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadHandbags();
                }}
                tintColor={AppColors.accent}
              />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.errorEmoji}>🛍</Text>
                <Text style={styles.errorText}>
                  No bags found for {selectedBrand}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.hero,
    fontWeight: "900",
    color: AppColors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: AppColors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  row: {
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxl,
    gap: Spacing.md,
  },
  loadingText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
  },
  errorEmoji: {
    fontSize: 48,
  },
  errorText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    textAlign: "center",
  },
  contentContainer: {
    flex: 100,
  },
});
