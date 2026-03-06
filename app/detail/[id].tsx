import FavoriteButton from "@/components/FavoriteButton";
import RatingBreakdown from "@/components/RatingBreakdown";
import StarRating from "@/components/StarRating";
import { AppColors, FontSize, Radius, Spacing } from "@/constants/appTheme";
import { useCustomImages } from "@/context/CustomImagesContext";
import { fetchHandbagById } from "@/services/api";
import { getFeedback } from "@/services/mockFeedback";
import { Feedback, Handbag } from "@/types/handbag";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [handbag, setHandbag] = useState<Handbag | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customUri, setLocalCustomUri] = useState<string | null>(null);
  const { getCustomUri, setCustomUri, removeCustomUri } = useCustomImages();

  // Sync local state from context on mount
  useEffect(() => {
    setLocalCustomUri(getCustomUri(id));
  }, [id]);

  const pickImage = useCallback(
    async (source: "camera" | "library") => {
      // Request permission first
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Cần quyền truy cập",
            "Vui lòng cấp quyền camera trong Cài đặt để sử dụng tính năng này.",
            [{ text: "OK" }],
          );
          return;
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Cần quyền truy cập",
            "Vui lòng cấp quyền thư viện ảnh trong Cài đặt để sử dụng tính năng này.",
            [{ text: "OK" }],
          );
          return;
        }
      }

      const fn =
        source === "camera"
          ? ImagePicker.launchCameraAsync
          : ImagePicker.launchImageLibraryAsync;

      const result = await fn({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const uri = result.assets[0].uri;
        setLocalCustomUri(uri);
        await setCustomUri(id, uri); // update context + AsyncStorage
      }
    },
    [id],
  );

  const handleImagePress = useCallback(() => {
    Alert.alert(
      "Đổi ảnh túi",
      "Chọn nguồn ảnh",
      [
        { text: "Chụp ảnh", onPress: () => pickImage("camera") },
        { text: "Thư viện ảnh", onPress: () => pickImage("library") },
        customUri
          ? {
              text: "Khôi phục ảnh gốc",
              style: "destructive",
              onPress: async () => {
                setLocalCustomUri(null);
                await removeCustomUri(id);
              },
            }
          : { text: "Hủy", style: "cancel" },
        ...(customUri ? [{ text: "Hủy", style: "cancel" as const }] : []),
      ],
      { cancelable: true },
    );
  }, [pickImage, customUri, id]);

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
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AppColors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !handbag) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
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
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
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
        <Pressable style={styles.imageBox} onPress={handleImagePress}>
          <Image
            source={{ uri: customUri ?? handbag.uri }}
            style={styles.image}
            contentFit="cover"
            transition={400}
          />
          {/* % Off badge */}
          <View style={styles.offBadge}>
            <Text style={styles.offText}>
              {Math.round(handbag.percentOff * 100)}% OFF
            </Text>
          </View>
          {/* Camera overlay hint */}
          <View style={styles.cameraHint}>
            <Ionicons name="camera" size={18} color={AppColors.white} />
            <Text style={styles.cameraHintText}>
              {customUri ? "Đổi ảnh" : "Thêm ảnh"}
            </Text>
          </View>
        </Pressable>

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
  cameraHint: {
    position: "absolute",
    bottom: Spacing.xxl,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
  },
  cameraHintText: {
    color: AppColors.white,
    fontSize: FontSize.xs,
    fontWeight: "700",
  },
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
