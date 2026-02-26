import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatMessage, type Message } from './chat-message';
import { PromptInput } from './prompt-input';
import { ChatSuggestions } from './chat-suggestions';
import { useLazyStreamChatQuery } from '../../store/services/api';
import { ChatEmptyState } from '../ui/chat-empty-state';

const CHAT_SUGGESTIONS = [
  'Resuma os gastos da semana por categoria',
  'Me ajude a montar um orçamento mensal',
  'Como reduzir meus custos fixos em 10%?',
] as const;

function buildSuggestionsFromText(text?: string) {
  const raw = text?.trim();
  if (!raw) return [...CHAT_SUGGESTIONS];

  const normalized = raw.replace(/\s+/g, ' ');
  const topic =
    normalized.length > 64
      ? `${normalized.slice(0, 61).trimEnd()}...`
      : normalized;

  const lower = normalized.toLowerCase();
  if (/(gasto|despesa|cust|conta|fatura)/.test(lower)) {
    return [
      `Classifique por categoria: "${topic}"`,
      'Mostre os 3 maiores custos e como reduzir',
      'Crie um plano de corte para os proximos 30 dias',
    ];
  }

  if (/(receita|salario|renda|ganho|entrada)/.test(lower)) {
    return [
      `Projete a renda com base em: "${topic}"`,
      'Separe em renda fixa e variavel',
      'Sugira meta de reserva para os proximos 3 meses',
    ];
  }

  if (/(invest|aplica|reserva|poupan)/.test(lower)) {
    return [
      `Avalie risco e retorno de: "${topic}"`,
      'Monte uma alocacao inicial conservadora',
      'Explique o que priorizar no curto prazo',
    ];
  }

  return [
    `Aprofunde a analise sobre: "${topic}"`,
    'Quais acoes praticas devo seguir agora?',
    'Quais riscos e oportunidades existem nesses dados?',
  ];
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedSuggestionContext, setSelectedSuggestionContext] =
    useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const assistantIdRef = useRef<string | null>(null);
  const previousMessagesCountRef = useRef(0);

  const [triggerStream, { data: streamData }] = useLazyStreamChatQuery();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const currentCount = messages.length;
    const countChanged = currentCount !== previousMessagesCountRef.current;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: isStreaming ? 'auto' : countChanged ? 'smooth' : 'auto',
    });

    previousMessagesCountRef.current = currentCount;
  }, [messages, isStreaming]);

  useEffect(() => {
    const id = assistantIdRef.current;
    if (!id || !streamData) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              content: streamData.error
                ? `⚠️ Erro: ${streamData.error}`
                : streamData.content,
              reasoning: streamData.reasoning,
              isStreaming: !streamData.done,
            }
          : m,
      ),
    );

    if (streamData.done) {
      setIsStreaming(false);
      assistantIdRef.current = null;
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'auto',
      });
    }
  }, [streamData]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const assistantId = crypto.randomUUID();
    assistantIdRef.current = assistantId;

    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      reasoning: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsStreaming(true);

    triggerStream({ message: trimmed });
  }, [input, isStreaming, triggerStream]);

  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      if (isStreaming) return;
      setInput(suggestion);
      setSelectedSuggestionContext(suggestion);
    },
    [isStreaming],
  );

  const userMessages = messages.filter((message) => message.role === 'user');
  const isBlankChat = messages.length === 0;
  const hasCompletedAssistantReply = messages.some(
    (message) =>
      message.role === 'assistant' &&
      !message.isStreaming &&
      Boolean(message.content.trim()),
  );
  const shouldShowSuggestions =
    isBlankChat || (!isStreaming && hasCompletedAssistantReply);
  const typedContext = input.trim();
  const latestUserContext =
    userMessages[userMessages.length - 1]?.content ?? '';
  const suggestionContext =
    typedContext || selectedSuggestionContext || latestUserContext;
  const displayedSuggestions = !shouldShowSuggestions
    ? []
    : isBlankChat
      ? CHAT_SUGGESTIONS
      : buildSuggestionsFromText(suggestionContext);

  return (
    <div className="flex h-full flex-col gap-3">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto rounded-xl border border-border bg-background"
      >
        {messages.length === 0 ? (
          <ChatEmptyState
            title="Nenhuma conversa ainda"
            description="Clique no botão de chat para iniciar uma nova conversa."
          />
        ) : (
          <div className="flex flex-col gap-6 p-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatSuggestions
        suggestions={displayedSuggestions}
        onSelect={handleSuggestionSelect}
        disabled={isStreaming}
        horizontal={isBlankChat}
      />

      <PromptInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        disabled={isStreaming}
      />
    </div>
  );
}
