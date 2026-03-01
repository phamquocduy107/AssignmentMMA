import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppColors, FontSize, Spacing, Radius } from "@/constants/appTheme";
import { Feedback } from "@/types/handbag";

interface Props {
  feedback: Feedback;
}

export default function RatingBreakdown({ feedback }: Props) {
  const { breakdown, totalReviews, averageRating } = feedback;
  const sorted = [...breakdown].sort((a, b) => b.stars - a.stars);

  return (
    <View style={styles.container}>
      {/* Average */}
      <View style={styles.avgBlock}>
        <Text style={styles.avgNumber}>{averageRating.toFixed(1)}</Text>
        <Text style={styles.avgStar}>★</Text>
        <Text style={styles.avgCount}>{totalReviews} reviews</Text>
      </View>
      {/* Bars */}
      <View style={styles.barsBlock}>
        {sorted.map(({ stars, count }) => {
          const pct = totalReviews > 0 ? count / totalReviews : 0;
          return (
            <View key={stars} style={styles.barRow}>
              <Text style={styles.barLabel}>{stars}★</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { flex: pct }]} />
                <View style={{ flex: 1 - pct }} />
              </View>
              <Text style={styles.barCount}>{count}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: Spacing.md,
  },
  avgBlock: {
    alignItems: "center",
    minWidth: 70,
  },
  avgNumber: {
    fontSize: 36,
    fontWeight: "800",
    color: AppColors.textPrimary,
    lineHeight: 40,
  },
  avgStar: {
    fontSize: 22,
    color: AppColors.star,
  },
  avgCount: {
    fontSize: FontSize.xs,
    color: AppColors.textMuted,
    marginTop: 2,
  },
  barsBlock: {
    flex: 1,
    gap: 5,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  barLabel: {
    fontSize: FontSize.xs,
    color: AppColors.textSecondary,
    width: 22,
  },
  barTrack: {
    flex: 1,
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: AppColors.starEmpty,
    flexDirection: "row",
    overflow: "hidden",
  },
  barFill: {
    backgroundColor: AppColors.star,
    borderRadius: Radius.full,
  },
  barCount: {
    fontSize: FontSize.xs,
    color: AppColors.textMuted,
    width: 20,
    textAlign: "right",
  },
});
