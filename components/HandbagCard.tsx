import FavoriteButton from "@/components/FavoriteButton";
import { AppColors, FontSize, Radius, Spacing } from "@/constants/appTheme";
import { useCustomImages } from "@/context/CustomImagesContext";
import { Handbag } from "@/types/handbag";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  handbag: Handbag;
}

const CARD_WIDTH = (Dimensions.get("window").width - Spacing.lg * 3) / 2;

export default function HandbagCard({ handbag }: Props) {
  const router = useRouter();
  const { getCustomUri } = useCustomImages();
  const imageUri = getCustomUri(handbag.id) ?? handbag.uri;
  const discounted = handbag.cost * (1 - handbag.percentOff);
  const pctLabel = `${Math.round(handbag.percentOff * 100)}% OFF`;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/detail/${handbag.id}` as Href)}
    >
      {/* Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        {/* % Off badge */}
        <View style={styles.pctBadge}>
          <Text style={styles.pctText}>{pctLabel}</Text>
        </View>
        {/* Favorite button */}
        <View style={styles.heartWrapper}>
          <FavoriteButton handbag={handbag} size={20} />
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        {/* Brand */}
        <Text style={styles.brand}>{handbag.brand}</Text>
        {/* Name */}
        <Text style={styles.name} numberOfLines={2}>
          {handbag.handbagName}
        </Text>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${discounted.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>${handbag.cost.toFixed(2)}</Text>
        </View>

        {/* Gender & Category */}
        <View style={styles.tagRow}>
          <View style={styles.genderTag}>
            <Ionicons
              name={handbag.gender ? "male" : "female"}
              size={12}
              color={handbag.gender ? AppColors.male : AppColors.female}
            />
            <Text
              style={[
                styles.genderText,
                { color: handbag.gender ? AppColors.male : AppColors.female },
              ]}
            >
              {handbag.gender ? "Male" : "Female"}
            </Text>
          </View>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{handbag.category}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: AppColors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    marginBottom: Spacing.lg,
    overflow: "hidden",
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    backgroundColor: "#0D0D1A",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pctBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: AppColors.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  pctText: {
    color: AppColors.white,
    fontSize: FontSize.xs,
    fontWeight: "800",
  },
  heartWrapper: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: "rgba(15,15,26,0.75)",
    borderRadius: Radius.full,
  },
  info: {
    padding: Spacing.sm,
    gap: 4,
  },
  brand: {
    fontSize: FontSize.xs,
    color: AppColors.accent,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  name: {
    fontSize: FontSize.sm,
    color: AppColors.textPrimary,
    fontWeight: "600",
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: FontSize.sm,
    fontWeight: "800",
    color: AppColors.textPrimary,
  },
  originalPrice: {
    fontSize: FontSize.xs,
    color: AppColors.textMuted,
    textDecorationLine: "line-through",
  },
  tagRow: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    marginTop: 4,
  },
  genderTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  genderText: {
    fontSize: 10,
    fontWeight: "700",
  },
  categoryTag: {
    backgroundColor: AppColors.tagBackground,
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: 10,
    color: AppColors.tagText,
    fontWeight: "600",
  },
});
