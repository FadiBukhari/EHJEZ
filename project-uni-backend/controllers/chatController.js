const Groq = require("groq-sdk");

// Initialize Groq AI - reads GROQ_API_KEY from environment automatically
const groq = new Groq();

// System context about the EHJEZ platform
const SYSTEM_CONTEXT = `You are a helpful assistant for EHJEZ (احجز), a study room booking platform in Saudi Arabia. 
Your role is to help users understand and navigate the platform.

About EHJEZ:
- EHJEZ means "Book" in Arabic
- It's a platform for booking study rooms in study houses/cafes across Saudi Arabia
- Users can find nearby study houses on a map, view available rooms, and book them

User Roles:
1. Regular Users (Students): Can browse study houses, view rooms, make bookings, and manage their reservations
2. Clients (Study House Owners): Can list their study house, add rooms, set prices, and manage bookings
3. Admins: Manage the platform and approve client registrations

Key Features:
- Interactive Map: Shows all study houses with their locations
- Room Booking: View room details, pricing, and availability
- My Bookings: Track current and past reservations
- Profile Management: Update personal information

How to Use:
1. Sign Up: Create an account as a regular user
2. Find Study Houses: Use the map to find nearby locations
3. Browse Rooms: View available rooms, prices, and amenities
4. Book a Room: Select date/time and confirm your booking
5. Manage Bookings: View, modify, or cancel your reservations

For Study House Owners:
1. Contact admin to become a client
2. Add your study house details and location
3. Create rooms with pricing and descriptions
4. Manage incoming booking requests

Pricing: Each room has its own hourly rate set by the study house owner.

Support: For issues, users can use this chat or contact the admin through the platform.

Keep responses concise, friendly, and helpful. Answer in the same language the user writes in (Arabic or English).
If asked about something unrelated to the platform, politely redirect to EHJEZ-related topics.`;

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build messages array with system context and history
    const messages = [
      {
        role: "system",
        content: SYSTEM_CONTEXT,
      },
      ...history.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    // Call Groq API with llama model
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    res.json({ 
      reply: response,
      success: true 
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    
    // Handle specific API errors
    if (error.message?.includes("API") || error.message?.includes("api_key")) {
      return res.status(500).json({ 
        error: "AI service configuration error",
        reply: "I'm having trouble connecting right now. Please try again later."
      });
    }

    // Handle rate limiting
    if (error.status === 429 || error.message?.includes("rate_limit")) {
      return res.status(429).json({ 
        error: "Rate limit exceeded",
        reply: "عذراً، الخدمة مشغولة حالياً. حاول مرة أخرى بعد قليل.\n\nSorry, the AI service is busy right now. Please try again in a few minutes."
      });
    }

    // Handle model not found
    if (error.status === 404 || error.message?.includes("not found")) {
      return res.status(500).json({ 
        error: "Model not available",
        reply: "عذراً، خدمة الذكاء الاصطناعي غير متوفرة حالياً.\n\nSorry, the AI service is temporarily unavailable."
      });
    }

    res.status(500).json({ 
      error: "Failed to get response",
      reply: "عذراً، حدث خطأ. حاول مرة أخرى.\n\nSorry, an error occurred. Please try again."
    });
  }
};
