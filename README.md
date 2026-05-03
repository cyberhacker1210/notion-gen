# notion-gen — Notion Page Generator

An automation tool that connects to the Notion API to generate structured pages and content programmatically from templates or user input.

## Tech Stack

| Technology | Usage |
|---|---|
| TypeScript | Main language |
| Notion API | Page creation & management |
| Node.js | Runtime environment |
| OpenAI API | AI content generation (optional) |
| dotenv | Environment variable management |

## How it works

```
User Input / Template
        ↓
notion-gen processes the request
        ↓
Calls Notion API with structured data
        ↓
New page created inside your Notion workspace
```

## Features

- Auto-generate Notion pages from templates
- Populate databases with structured content
- Supports rich text, headers, lists, and blocks
- Configurable via environment variables

## Project Structure

```
notion-gen/
├── src/
│   ├── index.ts          # Entry point
│   ├── notionClient.ts   # Notion API connection
│   ├── generator.ts      # Page generation logic
│   └── templates/        # Page templates
├── .env.example
├── package.json
└── tsconfig.json
```

## Getting Started

**Prerequisites:** Node.js 18+, a Notion account with API access

```bash
git clone https://github.com/cyberhacker1210/notion-gen
cd notion-gen
npm install
cp .env.example .env
```

### Environment Variables

```env
NOTION_API_KEY=your_notion_integration_token
NOTION_PAGE_ID=your_target_page_id
OPENAI_API_KEY=your_openai_key  # optional
```

```bash
npm run start
```

### Getting your Notion API Key

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new integration and copy the token into your `.env`
3. Share your Notion page with the integration

## Author

**cyberhacker1210** — [GitHub](https://github.com/cyberhacker1210)
