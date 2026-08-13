'use client';

import { useMemo, useState } from 'react';

import { postChat, resetFixtures } from '@/lib/api';
import { SCENARIOS } from '@/lib/scenarios';
import type {
  ChatMessage,
  ChatResponse,
  ChatTraceEntry,
  PipelineId,
} from '@/lib/types';

function newSessionId(): string {
  return crypto.randomUUID();
}

function visibleChatMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter(
    (message) =>
      (message.role === 'user' || message.role === 'assistant') &&
      message.content.trim().length > 0,
  );
}

function statusOf(entry: ChatTraceEntry): string {
  if (entry.policy) {
    return entry.policy;
  }
  if (entry.execution) {
    return entry.execution;
  }
  if (entry.integrity) {
    return entry.integrity;
  }
  if (entry.toolOutput) {
    const parts = [];
    if (entry.toolOutput.structuredKeys.length > 0) {
      parts.push('structured');
    }
    if (entry.toolOutput.untrustedText) {
      parts.push('untrusted text');
    }
    return parts.join(' + ');
  }
  return '';
}

function statusKind(entry: ChatTraceEntry): string {
  if (entry.policy) {
    return entry.policy;
  }
  if (entry.execution) {
    return entry.execution;
  }
  if (entry.integrity) {
    return entry.integrity;
  }
  if (entry.toolOutput) {
    return 'tool-output';
  }
  return '';
}

function TraceBody({
  result,
  showRaw,
}: {
  result: ChatResponse | null;
  showRaw: boolean;
}) {
  if (showRaw && result) {
    return (
      <pre className="raw-view">{JSON.stringify(result.messages, null, 2)}</pre>
    );
  }

  if (!result || result.trace.length === 0) {
    return <div className="trace-log" />;
  }

  return (
    <div className="trace-log">
      {result.trace.map((entry, index) => (
        <div className="trace-row" key={`${entry.label}-${index}`}>
          <div className="trace-label">{entry.label}</div>
          <div className="trace-status" data-kind={statusKind(entry)}>
            {statusOf(entry)}
          </div>
          {entry.toolOutput ? (
            <div className="trace-keys">
              {entry.toolOutput.structuredKeys.join(', ') ||
                'no structured keys'}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function DemoConsole() {
  const [pipeline, setPipeline] = useState<PipelineId>('vulnerable');
  const [prompt, setPrompt] = useState(SCENARIOS[0].prompt);
  const [activeScenario, setActiveScenario] = useState<string>(SCENARIOS[0].id);
  const [sessionId, setSessionId] = useState(newSessionId);
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [busy, setBusy] = useState<'chat' | 'reset' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const chatMessages = useMemo(
    () => (result ? visibleChatMessages(result.messages) : []),
    [result],
  );

  const pipelineLabel = result?.pipeline ?? pipeline;

  async function onSend() {
    const message = prompt.trim();
    if (!message || busy) {
      return;
    }

    setBusy('chat');
    setError(null);
    setNotice(null);
    setShowRaw(false);

    try {
      const response = await postChat({
        pipeline,
        message,
        sessionId,
      });
      setResult(response);
      if (response.sessionId) {
        setSessionId(response.sessionId);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Chat failed');
    } finally {
      setBusy(null);
    }
  }

  async function onReset() {
    if (busy) {
      return;
    }

    setBusy('reset');
    setError(null);
    setNotice(null);

    try {
      const reset = await resetFixtures();
      setSessionId(newSessionId());
      setResult(null);
      setNotice(
        `Fixtures restored. Tickets ${reset.tickets.map((ticket) => ticket.status).join(', ')}. Credits deleted: ${reset.creditsDeleted}.`,
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Reset failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <strong>SENTINEL</strong>
          <span>Demo projection · Chat + Trace</span>
        </div>

        <fieldset className="pipeline-toggle">
          <legend className="sr-only">Pipeline</legend>
          <button
            type="button"
            data-active={pipeline === 'vulnerable' ? 'vulnerable' : undefined}
            onClick={() => setPipeline('vulnerable')}
          >
            VULNERABLE
          </button>
          <button
            type="button"
            data-active={pipeline === 'secure' ? 'secure' : undefined}
            onClick={() => setPipeline('secure')}
          >
            SECURE
          </button>
        </fieldset>

        <div className="fixture-row">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className="chip"
              data-active={activeScenario === scenario.id}
              disabled={busy !== null}
              onClick={() => {
                setActiveScenario(scenario.id);
                setPrompt(scenario.prompt);
              }}
            >
              {scenario.owasp} {scenario.title}
            </button>
          ))}
          <button
            type="button"
            className="reset-btn"
            disabled={busy !== null}
            onClick={() => void onReset()}
          >
            {busy === 'reset' ? 'Resetting…' : 'Reset fixtures'}
          </button>
        </div>
      </header>

      <main className="workspace">
        <section className="panel" aria-label="Chat">
          <div className="panel-head">
            <span>Chat</span>
            <span>User / Sentinel</span>
          </div>
          {error ? (
            <p className="banner" data-kind="error">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="banner" data-kind="ok">
              {notice}
            </p>
          ) : null}
          <div className="chat-log">
            {chatMessages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className="bubble"
                data-role={message.role}
              >
                <div className="bubble-meta">
                  {message.role === 'user' ? 'User' : 'Sentinel'}
                </div>
                <p>{message.content}</p>
              </article>
            ))}
            {busy === 'chat' ? (
              <p className="empty">Running {pipeline} pipeline…</p>
            ) : null}
          </div>
          <div className="composer">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                  event.preventDefault();
                  void onSend();
                }
              }}
              aria-label="Prompt"
            />
            <button
              type="button"
              className="send-btn"
              disabled={busy !== null || prompt.trim().length === 0}
              onClick={() => void onSend()}
            >
              {busy === 'chat' ? 'Sending…' : 'Send'}
            </button>
          </div>
        </section>

        <section className="panel" aria-label="Security Trace">
          <div className="panel-head">
            <span>Security Trace</span>
            <span className="pipeline-label" data-pipeline={pipelineLabel}>
              {pipelineLabel} pipeline
            </span>
            <button
              type="button"
              className="raw-btn"
              data-active={showRaw}
              onClick={() => setShowRaw((value) => !value)}
              disabled={!result}
            >
              View raw
            </button>
          </div>
          <TraceBody result={result} showRaw={showRaw} />
        </section>
      </main>
    </div>
  );
}
