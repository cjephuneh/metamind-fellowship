
// Simple OpenAI API wrapper for the chat completions endpoint
const API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIRequestOptions {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const askOpenAI = async (
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<string> => {
  const { model = "gpt-3.5-turbo", temperature = 0.7, max_tokens = 500 } = options;

  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  const requestOptions: OpenAIRequestOptions = {
    model,
    messages,
    temperature,
    max_tokens,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestOptions),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to get response from OpenAI");
    }

    const data = await response.json() as OpenAIResponse;
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Sorry, I couldn't process your request at the moment. Please try again later.";
  }
};
