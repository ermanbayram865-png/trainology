"use client";

import { useMemo, useState } from "react";

import { initialConversations } from "@/features/ai-coach/mock-data";
import { getMockCoachAnswer } from "@/services/ai/mock-ai";
import type { AICoachMode, ChatMessage, Conversation, PromptRequest } from "@/types/chat";

const createId = () => crypto.randomUUID();

type UseChatOptions = Omit<PromptRequest, "mode" | "memory"> & {
  mode: AICoachMode;
};

export function useChat({ mode, ...options }: UseChatOptions) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(initialConversations[0].id);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0],
    [activeConversationId, conversations],
  );
  const messages = activeConversation?.messages ?? [];
  const visibleConversations = conversations.filter((conversation) =>
    conversation.title.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR")),
  );

  function createConversation() {
    const conversation: Conversation = {
      id: createId(),
      title: "Yeni konuşma",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((current) => [conversation, ...current]);
    setActiveConversationId(conversation.id);
    setError(null);
  }

  function updateActiveConversation(update: (conversation: Conversation) => Conversation) {
    setConversations((current) => current.map((conversation) =>
      conversation.id === activeConversationId ? update(conversation) : conversation,
    ));
  }

  async function sendMessage(content: string) {
    const trimmedContent = content.trim();
    if (!trimmedContent || !activeConversation || isStreaming) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };
    const request: PromptRequest = {
      ...options,
      mode,
      memory: [...messages, userMessage],
    };

    setError(null);
    setIsStreaming(true);
    updateActiveConversation((conversation) => ({
      ...conversation,
      title: conversation.title === "Yeni konuşma" ? trimmedContent.slice(0, 42) : conversation.title,
      updatedAt: userMessage.createdAt,
      messages: [...conversation.messages, userMessage],
    }));

    try {
      const answer = await getMockCoachAnswer(trimmedContent, request);
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: answer.summary,
        answer,
        createdAt: new Date().toISOString(),
        status: "complete",
      };
      updateActiveConversation((conversation) => ({
        ...conversation,
        updatedAt: assistantMessage.createdAt,
        messages: [...conversation.messages, assistantMessage],
      }));
    } catch {
      setError("Yanıt oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsStreaming(false);
    }
  }

  function renameConversation(id: string, title: string) {
    const nextTitle = title.trim();
    if (!nextTitle) return;
    setConversations((current) => current.map((conversation) =>
      conversation.id === id ? { ...conversation, title: nextTitle } : conversation,
    ));
  }

  function deleteConversation(id: string) {
    setConversations((current) => {
      const next = current.filter((conversation) => conversation.id !== id);
      if (activeConversationId === id && next[0]) setActiveConversationId(next[0].id);
      return next.length > 0 ? next : initialConversations.slice(0, 1);
    });
  }

  function togglePinned(id: string) {
    setConversations((current) => current.map((conversation) =>
      conversation.id === id ? { ...conversation, pinned: !conversation.pinned } : conversation,
    ));
  }

  function editMessage(messageId: string, content: string) {
    updateActiveConversation((conversation) => ({
      ...conversation,
      messages: conversation.messages.map((message) =>
        message.id === messageId ? { ...message, content } : message,
      ),
    }));
  }

  async function regenerateMessage(messageId: string) {
    const messageIndex = messages.findIndex((message) => message.id === messageId);
    const previousUserMessage = [...messages.slice(0, messageIndex)].reverse().find((message) => message.role === "user");
    if (previousUserMessage) await sendMessage(previousUserMessage.content);
  }

  async function retryLastMessage() {
    const previousUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    if (previousUserMessage) await sendMessage(previousUserMessage.content);
  }

  return {
    activeConversation,
    conversations: visibleConversations,
    activeConversationId,
    messages,
    isStreaming,
    error,
    search,
    setSearch,
    setActiveConversationId,
    createConversation,
    sendMessage,
    renameConversation,
    deleteConversation,
    togglePinned,
    editMessage,
    regenerateMessage,
    retryLastMessage,
  };
}
