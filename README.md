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

Databases
```

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