import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   BUILD WITH AI - Content Generator (Groq FREE)       ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('API Key configured:', process.env.GROQ_API_KEY ? 'Yes ✓' : 'No ✗');
  console.log('');
  
  // Business-focused prompt for content generation
  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    prompt: `You are a professional content writer for BUILD WITH AI, a futuristic AI-driven domain registrar and infrastructure hub.
    
Task: Write a compelling product description for a new premium domain name: "AIStartupHub.com"

Include:
- Catchy headline
- 3 key benefits for startups
- Pricing suggestion
- Call-to-action

Keep it under 200 words, professional yet exciting tone.`,
  });

  console.log('━━━ Generated Content ━━━\n');
  
  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  const usage = await result.usage;
  console.log('\n\n━━━ Usage Stats ━━━');
  console.log(`Total Tokens: ${usage.totalTokens}`);
  console.log(`Input: ${usage.inputTokens} | Output: ${usage.outputTokens}`);
  console.log('');
}

main().catch((error) => {
  console.error('❌ Error:', error.message);
  console.error('\n💡 Troubleshooting:');
  console.error('1. Check GROQ_API_KEY in .env.local');
  console.error('2. Get FREE key: https://console.groq.com/keys');
  console.error('3. Free tier: 30 req/min, 14,400 req/day');
});
