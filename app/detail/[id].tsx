import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchHandbagById } from "@/services/api";
import { getFeedback } from "@/services/mockFeedback";
import { Handbag, Feedback } from "@/types/handbag";
import StarRating from "@/components/StarRating";
import RatingBreakdown from "@/components/RatingBreakdown";
import FavoriteButton from "@/components/FavoriteButton";
import { AppColors, Spacing, FontSize, Radius } from "@/constants/appTheme";

const { width } = Dimensions.get("window");

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [handbag, setHandbag] = useState<Handbag | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHandbagById(id);
        setHandbag(data);
        setFeedback(getFeedback(id));
      } catch {
        setError("Failed to load handbag.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AppColors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !handbag) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={{ color: AppColors.textSecondary }}>
            {error ?? "Not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const discounted = handbag.cost * (1 - handbag.percentOff);
  const savings = handbag.cost - discounted;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={AppColors.background}
      />

      {/* Top Nav */}
      <View style={styles.topNav}>
        <Pressable
          onPress={() => router.back()}
          style={styles.navBtn}
          hitSlop={12}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={AppColors.textPrimary}
          />
        </Pressable>
        <Text style={styles.navTitle} numberOfLines={1}>
          {handbag.brand}
        </Text>
        <FavoriteButton handbag={handbag} size={24} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero Image */}
        <View style={styles.imageBox}>
          <Image
            source={{ uri: handbag.uri }}
            style={styles.image}
            contentFit="cover"
            transition={400}
          />
          {/* Off badge */}
          <View style={styles.offBadge}>
            <Text style={styles.offText}>
              {Math.round(handbag.percentOff * 100)}% OFF
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailCard}>
          {/* Brand + Gender */}
          <View style={styles.row}>
            <Text style={styles.brandLabel}>{handbag.brand}</Text>
            <View
              style={[
                styles.genderPill,
                {
                  backgroundColor: handbag.gender
                    ? "rgba(79,195,247,0.15)"
                    : "rgba(244,143,177,0.15)",
                },
              ]}
            >
              <Ionicons
                name={handbag.gender ? "male" : "female"}
                size={14}
                color={handbag.gender ? AppColors.male : AppColors.female}
              />
              <Text
                style={[
                  styles.genderText,
                  { color: handbag.gender ? AppColors.male : AppColors.female },
                ]}
              >
                {handbag.gender ? "Men" : "Women"}
              </Text>
            </View>
          </View>

          {/* Name */}
          <Text style={styles.name}>{handbag.handbagName}</Text>

          {/* Price */}
          <View style={styles.priceBlock}>
            <Text style={styles.priceMain}>${discounted.toFixed(2)}</Text>
            <View style={styles.priceRight}>
              <Text style={styles.priceOriginal}>
                ${handbag.cost.toFixed(2)}
              </Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>
                  Save ${savings.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Grid */}
          <View style={styles.grid}>
            <InfoTile
              icon="grid-outline"
              label="Category"
              value={handbag.category}
            />
            <InfoTile
              icon="color-palette-outline"
              label="Colors"
              value={handbag.color.join(", ")}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Ratings Section */}
          {feedback && (
            <>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <View style={styles.ratingRow}>
                <StarRating
                  rating={feedback.averageRating}
                  size={20}
                  showLabel
                />
                <Text style={styles.reviewCount}>
                  {feedback.totalReviews} reviews
                </Text>
              </View>
              <RatingBreakdown feedback={feedback} />

              {/* Divider */}
              <View style={styles.divider} />

              {/* Comments */}
              <Text style={styles.sectionTitle}>Comments</Text>
              <View style={styles.commentsBlock}>
                {feedback.comments.map((c) => (
                  <View key={c.id} style={styles.comment}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{c.avatar}</Text>
                    </View>
                    <View style={styles.commentBody}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>{c.author}</Text>
                        <StarRating rating={c.rating} size={12} />
                      </View>
                      <Text style={styles.commentText}>{c.text}</Text>
                      <Text style={styles.commentDate}>{c.date}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.cta}>
        <FavoriteButton handbag={handbag} size={26} style={styles.ctaHeart} />
        <Pressable style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>Add to Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={infoStyles.tile}>
      <Ionicons name={icon} size={16} color={AppColors.accent} />
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: AppColors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
  },
  label: {
    fontSize: FontSize.xs,
    color: AppColors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: FontSize.sm,
    color: AppColors.textPrimary,
    fontWeight: "600",
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    justifyContent: "space-between",
  },
  navBtn: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.full,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: AppColors.textPrimary,
    marginHorizontal: Spacing.md,
  },
  content: { paddingBottom: 100 },
  imageBox: {
    width,
    height: width,
    position: "relative",
    backgroundColor: "#0D0D1A",
  },
  image: { width: "100%", height: "100%" },
  offBadge: {
    position: "absolute",
    bottom: Spacing.xxl,
    left: Spacing.md,
    backgroundColor: AppColors.accent,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
  },
  offText: { color: AppColors.white, fontWeight: "800", fontSize: FontSize.sm },
  detailCard: {
    backgroundColor: AppColors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    minHeight: 400,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLabel: {
    fontSize: FontSize.sm,
    color: AppColors.accent,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  genderPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  genderText: { fontSize: FontSize.sm, fontWeight: "700" },
  name: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: AppColors.textPrimary,
    lineHeight: 28,
  },
  priceBlock: { flexDirection: "row", alignItems: "flex-end", gap: Spacing.md },
  priceMain: { fontSize: 32, fontWeight: "900", color: AppColors.textPrimary },
  priceRight: { gap: 4, paddingBottom: 4 },
  priceOriginal: {
    fontSize: FontSize.md,
    color: AppColors.textMuted,
    textDecorationLine: "line-through",
  },
  savingsBadge: {
    backgroundColor: "rgba(76,175,80,0.15)",
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  savingsText: {
    fontSize: FontSize.xs,
    color: AppColors.success,
    fontWeight: "700",
  },
  grid: { flexDirection: "row", gap: Spacing.sm },
  divider: {
    height: 1,
    backgroundColor: AppColors.cardBorder,
    marginVertical: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "800",
    color: AppColors.textPrimary,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  reviewCount: { fontSize: FontSize.sm, color: AppColors.textMuted },
  commentsBlock: { gap: Spacing.md },
  comment: { flexDirection: "row", gap: Spacing.md, alignItems: "flex-start" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: AppColors.accentDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: AppColors.white,
    fontSize: FontSize.xs,
    fontWeight: "800",
  },
  commentBody: { flex: 1, gap: 4 },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentAuthor: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: AppColors.textPrimary,
  },
  commentText: {
    fontSize: FontSize.sm,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  commentDate: { fontSize: FontSize.xs, color: AppColors.textMuted },
  cta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: AppColors.surface,
    borderTopWidth: 1,
    borderTopColor: AppColors.cardBorder,
  },
  ctaHeart: {
    backgroundColor: AppColors.card,
    borderRadius: Radius.full,
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
  },
  ctaBtn: {
    flex: 1,
    backgroundColor: AppColors.accent,
    borderRadius: Radius.full,
    padding: Spacing.md,
    alignItems: "center",
  },
  ctaBtnText: {
    color: AppColors.white,
    fontSize: FontSize.md,
    fontWeight: "800",
  },
});
