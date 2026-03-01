import React from "react";
import { ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { AppColors, Radius, FontSize, Spacing } from "@/constants/appTheme";

const BRANDS = [
  "All",
  "Bvlgari",
  "Michael Kors",
  "Burberry",
  "Ferragamo",
  "Fendi",
];

interface Props {
  selected: string;
  onSelect: (brand: string) => void;
}

export default function BrandFilter({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {BRANDS.map((brand) => {
        const active = selected === brand;
        return (
          <Pressable
            key={brand}
            onPress={() => onSelect(brand)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {brand}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    backgroundColor: AppColors.chipInactive,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
  },
  chipActive: {
    backgroundColor: AppColors.chipActive,
    borderColor: AppColors.accent,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: AppColors.chipTextInactive,
    fontWeight: "600",
  },
  chipTextActive: {
    color: AppColors.chipTextActive,
  },
});
