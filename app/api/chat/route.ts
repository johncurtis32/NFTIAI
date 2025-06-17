import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      console.error("OpenAI API key not found in environment variables")
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please add your API key to environment variables.",
          success: false,
        },
        { status: 500 },
      )
    }

    // Validate API key format
    if (!openaiApiKey.startsWith("sk-") || openaiApiKey.length < 20) {
      console.error("Invalid OpenAI API key format")
      return NextResponse.json(
        {
          error: "Invalid OpenAI API key format. Please check your API key.",
          success: false,
        },
        { status: 500 },
      )
    }

    // Enhanced system message for NFT expertise
    const systemMessage = {
      role: "system",
      content: `You are an expert NFT advisor and blockchain specialist for NFTCONNECT, a decentralized NFT exchange platform. You help users understand NFTs, digital art, blockchain technology, cryptocurrency, and the NFT marketplace.

Key areas you excel in:
- NFT fundamentals and how they work on blockchain
- Creating, minting, buying, and selling NFTs
- Blockchain technology (Ethereum, Polygon, Solana)
- Cryptocurrency and wallet management
- Digital art and collectibles market
- NFT marketplace strategies and best practices
- Gas fees, transactions, and optimization
- Wallet setup, security, and best practices
- NFT trends, market analysis, and investment advice
- Smart contracts and royalties
- IPFS and metadata storage
- Community building and NFT marketing

Always provide helpful, accurate, and up-to-date information. Be friendly, educational, and encouraging. If you're unsure about current market prices or very recent developments, acknowledge it and suggest where users might find the most current information.

Keep responses concise but comprehensive, and always relate advice back to practical steps users can take on NFT platforms.`,
    }

    console.log("Making request to OpenAI API...")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [systemMessage, ...messages],
        max_tokens: 800,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: "Invalid OpenAI API key. Please check your API key at https://platform.openai.com/account/api-keys",
            success: false,
          },
          { status: 401 },
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again in a moment.",
            success: false,
          },
          { status: 429 },
        )
      } else if (response.status === 403) {
        return NextResponse.json(
          {
            error: "Access denied. Please check your OpenAI account status and billing.",
            success: false,
          },
          { status: 403 },
        )
      } else {
        return NextResponse.json(
          {
            error: `OpenAI API error: ${response.status}. Please try again later.`,
            success: false,
          },
          { status: 500 },
        )
      }
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid response structure from OpenAI:", data)
      return NextResponse.json(
        {
          error: "Invalid response from AI service",
          success: false,
        },
        { status: 500 },
      )
    }

    const assistantMessage = data.choices[0].message

    console.log("OpenAI API call successful")

    return NextResponse.json({
      message: assistantMessage,
      success: true,
      usage: data.usage, // Optional: track token usage
    })
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to process chat message. Please try again.",
        success: false,
      },
      { status: 500 },
    )
  }
}
