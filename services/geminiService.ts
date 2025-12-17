import { GoogleGenAI } from "@google/genai";
import { Expense, Flat, Payment, User } from "../types";

// Helper to format data for the prompt
const formatContext = (expenses: Expense[], payments: Payment[], flats: Flat[]) => {
  const totalIncome = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingCount = payments.filter(p => p.status === 'PENDING').length;
  const balance = totalIncome - totalExpense;

  return `
    Context Data:
    - Total Collected Maintenance: ₹${totalIncome}
    - Total Expenses: ₹${totalExpense}
    - Current Balance: ₹${balance}
    - Number of Pending Payments (Defaulters): ${pendingCount}
    - Total Units: ${flats.length}
    - Expense Breakdown: ${JSON.stringify(expenses.map(e => ({ cat: e.category, amt: e.amount })))}
  `;
};

export const askGeminiAssistant = async (question: string, contextData: { expenses: Expense[], payments: Payment[], flats: Flat[] }): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash';

  const systemPrompt = `
    You are an intelligent assistant for an Apartment Society Management System.
    You have access to the current financial snapshot of the society.
    Answer questions concisely and professionally.
    If asked to draft a notice, use a formal tone.
    
    ${formatContext(contextData.expenses, contextData.payments, contextData.flats)}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Question: " + question }] }
      ]
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am having trouble connecting to the AI service right now.";
  }
};