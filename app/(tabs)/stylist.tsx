import { AppColors, FontSize, Radius, Spacing } from "@/constants/appTheme";
import { Message, sendMessage } from "@/services/ollamaService";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUGGESTIONS = [
  "🎀 Túi nào phù hợp cho cô gái đi làm?",
  "💰 Gợi ý túi dưới $300",
  "🔴 Có túi màu đỏ không?",
  "🏆 Túi cao cấp nhất hiện có?",
];

let msgCounter = 0;
const newId = () => `msg-${++msgCounter}-${Date.now()}`;

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "👜 Xin chào! Tôi là AI Stylist của Luxury Bags.\n\nTôi có thể giúp bạn tìm chiếc túi hoàn hảo, so sánh thương hiệu, hay tư vấn phong cách. Hỏi tôi bất cứ điều gì!",
};

export default function StylistScreen() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { id: newId(), role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      scrollToEnd();

      try {
        // Pass history (excluding welcome) to Ollama
        const history = messages.filter((m) => m.id !== "welcome");
        const reply = await sendMessage(history, trimmed);
        const botMsg: Message = {
          id: newId(),
          role: "assistant",
          content: reply,
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (e) {
        const errMsg: Message = {
          id: newId(),
          role: "assistant",
          content: "⚠️ Không thể kết nối đến AI. Vui lòng thử lại sau.",
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setLoading(false);
        scrollToEnd();
      }
    },
    [loading, messages, scrollToEnd],
  );

  const renderItem = useCallback(({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.row, isUser && styles.rowUser]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👜</Text>
          </View>
        )}
        <View
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}
        >
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={AppColors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiDot} />
          <View>
            <Text style={styles.title}>AI Stylist</Text>
            <Text style={styles.subtitle}>Powered by Qwen 2.5</Text>
          </View>
        </View>
        <Pressable
          onPress={() => setMessages([WELCOME])}
          hitSlop={12}
          style={styles.clearBtn}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color={AppColors.textMuted}
          />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
        />

        {/* Loading indicator */}
        {loading && (
          <View style={styles.typingRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👜</Text>
            </View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color={AppColors.accent} />
              <Text style={styles.typingText}>Đang suy nghĩ...</Text>
            </View>
          </View>
        )}

        {/* Suggestions (only when 1 message = welcome) */}
        {messages.length === 1 && !loading && (
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <Pressable
                key={s}
                style={styles.chip}
                onPress={() => handleSend(s)}
              >
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Hỏi tôi về túi..."
            placeholderTextColor={AppColors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={300}
            returnKeyType="send"
            onSubmitEditing={() => handleSend(input)}
          />
          <Pressable
            style={[
              styles.sendBtn,
              (!input.trim() || loading) && styles.sendBtnDisabled,
            ]}
            onPress={() => handleSend(input)}
            disabled={!input.trim() || loading}
          >
            <Ionicons
              name="send"
              size={18}
              color={
                !input.trim() || loading ? AppColors.textMuted : AppColors.white
              }
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.cardBorder,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  aiDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AppColors.success,
    marginRight: 4,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "800",
    color: AppColors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: AppColors.textMuted,
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  rowUser: { flexDirection: "row-reverse" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.accentDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 16 },
  bubble: {
    maxWidth: "75%",
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  bubbleBot: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: AppColors.accent,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: FontSize.sm,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextUser: { color: AppColors.white },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: AppColors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    padding: Spacing.md,
  },
  typingText: { fontSize: FontSize.sm, color: AppColors.textMuted },
  suggestions: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: AppColors.surface,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
  },
  chipText: {
    fontSize: FontSize.xs,
    color: AppColors.textSecondary,
    fontWeight: "600",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppColors.cardBorder,
    backgroundColor: AppColors.surface,
  },
  input: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: AppColors.textPrimary,
    fontSize: FontSize.sm,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: AppColors.surface,
    borderWidth: 1,
    borderColor: AppColors.cardBorder,
  },
});
