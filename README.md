# TechPulse: Premium AI News Aggregator

TechPulse is a high-performance tech news feed designed for visual excellence and information density. It aggregates stories from Hacker News and NewsAPI, providing a beautiful, unified interface with AI-powered on-demand summarization.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see [API Setup](#-api-setup) below)
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔑 API Setup

This project requires two API keys. Create a `.env` file in the root directory (using `.env.example` as a template):

| Variable | Source | Purpose |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) | AI summarization |
| `VITE_NEWS_API_KEY` | [NewsAPI.org](https://newsapi.org/) | Mainstream tech news |

## 🛠️ Technical Approach

### Architecture
- **Data Layer**: Centralized `aggregator.js` fetcher that parallelizes requests to Algolia (Hacker News) and NewsAPI. It normalizes disparate schemas into a unified internal model.
- **Visual Priority Logic**: Articles are scored dynamically. Articles with native images receive a significant priority boost (+5000), ensuring the feed is visually rich.
- **AI Integration**: On-demand summarization using `gemini-3-flash-preview` to keep performance high and API costs low. 

### Design Philosophy
- **Information Density**: A condensed rails based layout that maximizes visible headlines while maintaining readability.

## ⚖️ Tradeoffs & Decisions

### 1. Deterministic Fallbacks vs. Unsplash Search
I implemented a **deterministic hashing algorithm** (salted with article titles) to select fallback images from a curated local library.
- **Tradeoff**: Better reliability and speed than fetching a random Unsplash image for every story (since not every article provides a usable image)

### 2. Client-Side Aggregation
Currently, aggregation happens in the browser.
- **Tradeoff**: Simplifies deployment (no backend needed), but exposes API keys via standard Vite env bundling rules. For production, these should be proxied through a lightweight serverless function.

### 3. On-Demand vs. Pre-Summarized
Summaries are generated only when the user clicks an article.
- **Tradeoff**: Reduces initial load time and API quota usage significantly, though users must wait ~1s for the AI to summarize article contents when opening a modal.

### 4. Mathematical vs. Semantic Ranking
Articles are ranked based on a weighted mathematical score (balancing time and native image availability) rather than a deep LLM-based semantic analysis of content relevance.
- **Tradeoff**: Provides near-instant sorting and grouping for hundreds of items. While semantic AI ranking would be more "intelligent," it would introduce 5-10 seconds of latency to the initial load.

## AI tools used
I used copilot and chatgpt at various steps to aid with design and implementation, and gemini is being used for the summarization of articles.
