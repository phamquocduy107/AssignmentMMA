import { AppColors, Spacing } from "@/constants/appTheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  rating: number; // e.g. 4.5
  size?: number;
  showLabel?: boolean;
}

function Star({
  filled,
  half,
  size,
}: {
  filled: boolean;
  half: boolean;
  size: number;
}) {
  if (filled) {
    return (
      <Text style={[styles.star, { fontSize: size, color: AppColors.star }]}>
        ★
      </Text>
    );
  }
  if (half) {
    // Overlay: empty star ở dưới, half star vàng clip 50% ở trên
    return (
      <View
        style={{ width: size * 0.9, height: size, justifyContent: "center" }}
      >
        {/* Nền xám */}
        <Text
          style={[
            styles.star,
            {
              fontSize: size,
              color: AppColors.starEmpty,
              position: "absolute",
            },
          ]}
        >
          ★
        </Text>
        {/* Nửa vàng, clip bằng overflow hidden + width 50% */}
        <View
          style={{ width: "50%", overflow: "hidden", position: "absolute" }}
        >
          <Text
            style={[styles.star, { fontSize: size, color: AppColors.star }]}
          >
            ★
          </Text>
        </View>
      </View>
    );
  }
  return (
    <Text style={[styles.star, { fontSize: size, color: AppColors.starEmpty }]}>
      ★
    </Text>
  );
}

export default function StarRating({
  rating,
  size = 16,
  showLabel = false,
}: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return <Star key={star} filled={filled} half={half} size={size} />;
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
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  star: {
    includeFontPadding: false,
  },
  label: {
    color: AppColors.textSecondary,
    marginLeft: Spacing.xs,
    fontWeight: "600",
  },
});
