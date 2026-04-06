import "dotenv/config"; 
import OpenAI from "openai";
import productModel from "../models/product.model.js";

// Initialize OpenAI client with Groq configuration
const openai = new OpenAI({ 
  baseURL: "https://api.groq.com/openai/v1", 
  apiKey: process.env.GROQ_API_KEY 
}); 

/**
 * Handle AI Chat logic for E-commerce Assistant
 * Fetches products from DB and uses them as context for the AI
 */
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate if the user sent a message
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Fetch all products from the database with specific fields
    const products = await productModel.find({}).select("name description price category brand stock rating");
    
    // Convert the product array into a single string to serve as AI context
    const productsContext = products.length > 0 
      ? products.map((p) => 
          `- ${p.name} (Brand: ${p.brand}, Category: ${p.category}): $${p.price}. ` +
          `Stock: ${p.stock > 0 ? p.stock + " items" : 'Out of stock'}. ` +
          `Rating: ${p.rating}/5. Description: ${p.description}`
        ).join("\n")
      : "No products currently available in the database.";

    // Define strict instructions for the AI behavior
   const systemPrompt = `
      You are Flexra AI Assistant, the official voice of Flexra e-commerce store. 
      Store Owner: Morshed Khondokkar.

      STRICT OPERATING RULES:
      1. GREETINGS: If a user says "Hi", "Hello", "Assalamu Alaikum", "Salam", or "Ki obostha", reply warmly. 
         - Example: if user says "Assalamu Alaikum" you reply "Walaikum Assalam!" otherwise reply "Assalamu Alaikum! Flexra shop-e apnake shagoto. Ami apnake kivabe help korte pari?"
      2. SCOPE: ONLY answer questions related to products, prices, stock, or the store owner.
      3. SPECIFICITY: If a user asks about "price", "discount", "stock", or "details" WITHOUT mentioning a specific product name or category, ask them to clarify.
         - Example: "Dukkhi to, apni ki bolte paren kon product-ti niye kotha bolchen? Product-er nam bolle ami apnake valo bhabe help korte parbo."
      4. REJECTION: For general knowledge, politics, sports, coding, or anything NOT related to the store, politely refuse.
         - Example: "Dukkhi to, ami sudhu Flexra shop er product niye kotha bolte pari."
      5. TONE: Always use "Amader" (Our) or "Flexra" instead of "Amar" (My). 
      6. NO HALLUCINATION: If a product is NOT in the list, reply: "Dukkhi to, amader kase ei product-ti ekhon nei."
      7. LANGUAGE: Respond in "Banglish" (Bengali language in English script).

      Database Context:
      ${productsContext}
    `;

    // Send the request to Groq/OpenAI
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Low temperature ensures factual accuracy and reduces hallucination
      max_tokens: 500,
    });

    // Extract the AI's reply
    const reply = chatCompletion.choices[0]?.message?.content || "Dukkhi to, ekhon response dite parchi na.";

    // Send successful response back to frontend
    res.status(200).json({ success: true, reply });

  } catch (error) {
    // Log errors for debugging and send failure response
    console.error("AI Chatbot Error:", error);
    res.status(500).json({ success: false, message: "Failed to communicate with AI service" });
  }
};


