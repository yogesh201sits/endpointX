import 'dotenv/config';
import { ChatGroq } from '@langchain/groq';

export const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b", 
  temperature: 0.5,
});
export const llm2 = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", 
  temperature: 0.5,
});