import HandbagCard from "@/components/HandbagCard";
import { AppColors, FontSize, Radius, Spacing } from "@/constants/appTheme";
import { fetchHandbags } from "@/services/api";
import { Handbag } from "@/types/handbag";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SearchScreen() {
  const [all, setAll] = useState<Handbag[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHandbags()
      .then((data) => setAll(data.sort((a, b) => b.cost - a.cost)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(
      (h) =>
        h.handbagName.toLowerCase().includes(q) ||
        h.brand.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q),
    );
  }, [all, query]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={AppColors.background}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find your perfect bag</Text>
      </View>

      {/* Search Input */}
      <View style={styles.inputWrapper}>
        <Ionicons
          name="search"
          size={18}
          color={AppColors.textMuted}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by name, brand, category..."
          placeholderTextColor={AppColors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <ActivityIndicator color={AppColors.accent} style={{ marginTop: 40 }} />
      ) : (
        <>
          {query.trim().length > 0 && (
            <Text style={styles.resultCount}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
              &quot;{query}&quot;
            </Text>
          )}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyText}>
                  No bags match &quot;{query}&quot;
                </Text>
              </View>
            }
            renderItem={({ item }) => <HandbagCard handbag={item} />}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.surface,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    paddingHorizontal: Spacing.md,
  },
  icon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    color: AppColors.textPrimary,
    fontSize: FontSize.md,
    paddingVertical: Spacing.md - 2,
  },
  resultCount: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    fontSize: FontSize.sm,
    color: AppColors.textSecondary,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  row: { justifyContent: "space-between" },
  empty: { flex: 1, alignItems: "center", paddingTop: 60, gap: Spacing.md },
  emptyEmoji: { fontSize: 48 },
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: FontSize.md,
    textAlign: "center",
  },
});
