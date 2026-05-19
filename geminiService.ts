
import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, Info } from 'lucide-react';

const BotLogicPreview: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const pythonCode = `
import asyncio
import hashlib
from telethon import TelegramClient, events
from bs4 import BeautifulSoup
import httpx
from google import genai
from datetime import datetime

# --- CONFIGURATION (config.py) ---
API_ID = 'YOUR_TELEGRAM_API_ID'
API_HASH = 'YOUR_TELEGRAM_API_HASH'
BOT_TOKEN = 'YOUR_BOT_TOKEN'
CHANNEL_ID = '@your_target_channel'
SOURCE_CHANNELS = ['@tech_news', '@durov_updates']
SOURCE_WEBSITES = ['https://techcrunch.com', 'https://verge.com']
GEMINI_KEY = 'YOUR_GEMINI_API_KEY'

# --- DATABASE / STATE ---
sent_hashes = set()

# --- GEMINI CLIENT ---
ai = genai.GoogleGenAI(api_key=GEMINI_KEY)

async def process_with_ai(title, text):
    """2026 Rewrite Engine using Gemini 3"""
    prompt = f"Summarize and rewrite for Telegram: {title}\\n\\n{text}"
    response = await ai.models.generate_content(
        model="gemini-3-flash-preview", 
        contents=prompt
    )
    return response.text

async def scrape_websites():
    async with httpx.AsyncClient() as client:
        for url in SOURCE_WEBSITES:
            try:
                resp = await client.get(url)
                soup = BeautifulSoup(resp.text, 'html.parser')
                # Simplistic logic - better extraction needed per site
                articles = soup.find_all('h2')
                for art in articles[:3]:
                    title = art.get_text()
                    content_hash = hashlib.md5(title.encode()).hexdigest()
                    
                    if content_hash not in sent_hashes:
                        new_text = await process_with_ai(title, "Extracted content placeholder")
                        # Send to channel logic...
                        sent_hashes.add(content_hash)
            except Exception as e:
                print(f"Error scraping {url}: {e}")

async def main():
    # Telegram Client Initialization
    client = TelegramClient('news_bot_session', API_ID, API_HASH)
    await client.start(bot_token=BOT_TOKEN)

    print("--- 2026 Aggregator Active ---")

    # Listen to Source Channels
    @client.on(events.NewMessage(chats=SOURCE_CHANNELS))
    async def handler(event):
        text = event.message.message
        # Deduplication and Filtering logic
        if len(text) > 100:
            rewritten = await process_with_ai("Update", text)
            await client.send_message(CHANNEL_ID, rewritten)

    # Periodic Website Scraping
    while True:
        await scrape_websites()
        await asyncio.sleep(900) # Sync every 15 mins

if __name__ == '__main__':
    asyncio.run(main())
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-8 h-8 text-blue-500" />
            Backend Engine logic
          </h2>
          <p className="text-slate-400 mt-2">The Python core powering this dashboard</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export Scripts
          </button>
        </div>
      </header>

      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800/50 px-6 py-3 flex justify-between items-center border-b border-slate-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-xs font-mono">aggregator_v2026.py</span>
            <button 
              onClick={handleCopy}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="p-6 overflow-x-auto max-h-[600px] scrollbar-thin">
          <pre className="text-sm font-mono text-slate-300 leading-relaxed">
            <code>{pythonCode}</code>
          </pre>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex gap-4">
        <Info className="w-6 h-6 text-blue-400 shrink-0" />
        <div className="text-sm text-slate-300">
          <p className="font-bold text-blue-400 mb-1">Architecture Note:</p>
          This script uses <span className="text-white font-semibold">Telethon</span> for high-speed Telegram interaction and <span className="text-white font-semibold">Gemini 3</span> for human-like rewriting. To deploy, run this as a service on your Linux server while the dashboard provides the oversight UI.
        </div>
      </div>
    </div>
  );
};

export default BotLogicPreview;
