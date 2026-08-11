# Sentinel AI

Enterprise AI Support Agent built to explore production AI architectures,
security boundaries, and OWASP Top 10 for LLM Applications.

## Overview

Sentinel AI simulates an enterprise support platform where an AI agent
interacts with business capabilities through APIs.

The goal is not to build a chatbot, but to explore how AI systems behave
inside real software architectures.

## Architecture

```text
User
 |
 v
Web Application
 |
 v
AI Gateway
 |
 v
AI Agent Runtime
 |
 +----------------+
 |                |
 v                v

Customer API   Billing API   Ticket API

 |
 v

Databases (customer:5436 / ticket:5437 / billing:5438)
```

Bounded autonomy (LLM06): the secure pipeline evaluates tool **arguments**
via per-tool security policies (e.g. `apply_credit` autonomous limit) before
execution. See `apps/ai-gateway/src/scenarios/excessive-agency/`.

Prompt injection (LLM01): untrusted tool data (e.g. contaminated
`ticket.description`) can influence agent reasoning; the secure pipeline
projects tool-result **provenance** and keeps **execution authority** in
capability policies. See `apps/ai-gateway/src/scenarios/prompt-injection/`.

## Repository Structure

```text
apps/

├── web
│   Frontend application
│
├── ai-gateway
│   AI orchestration layer
│
└── services
    ├── customer
    ├── billing
    └── ticket


packages/

├── contracts
├── ai-core
├── observability
└── config
```

## Technology Stack

- TypeScript
- pnpm workspaces
- Turborepo
- Next.js
- NestJS
- PostgreSQL
- Vector Database
- OpenAI API

## Development

Install dependencies:

```bash
pnpm install
```

Local databases (one Postgres per service; credentials in `infra/.env`):

```bash
pnpm infra:up        # customer:5436, ticket:5437, billing:5438
pnpm infra:migrate   # schema + demo seeds
# or from scratch:
pnpm infra:fresh
```

Run development:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Type check:

```bash
pnpm typecheck
```

## Goals

This project explores:

- AI Agent architectures
- Tool calling patterns
- RAG systems
- AI security risks
- OWASP Top 10 for LLM Applications
- Production hardening patterns

## Status

🚧 Early development
