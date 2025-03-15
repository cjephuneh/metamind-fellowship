
// Together AI API client for Qwen model
const TOGETHER_API_ENDPOINT = "https://api.together.xyz/v1/completions";

interface TogetherMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface TogetherRequestOptions {
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export const askQwenAI = async (
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<string> => {
  const { 
    model = "Qwen/Qwen1.5-7B-Chat", 
    temperature = 0.7, 
    max_tokens = 500 
  } = options;

  // Craft the prompt in the Together API format for chat
  const fullPrompt = `<|im_start|>system
${systemPrompt}
<|im_end|>
<|im_start|>user
${userMessage}
<|im_end|>
<|im_start|>assistant
`;

  const requestOptions: TogetherRequestOptions = {
    model,
    prompt: fullPrompt,
    max_tokens,
    temperature,
    top_p: 0.9,
    top_k: 40
  };

  try {
    console.log("Sending request to Together API with model:", model);
    
    const response = await fetch(TOGETHER_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestOptions),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated text from the response
    const generatedText = data.output?.choices?.[0]?.text || "";
    
    // Remove any trailing <|im_end|> tags if present
    return generatedText.replace(/<\|im_end\|>$/, "").trim();
  } catch (error) {
    console.error("Error calling Together API:", error);
    return "Sorry, I couldn't process your request at the moment. Please try again later.";
  }
};

// Store the default API key as a constant
export const DEFAULT_TOGETHER_API_KEY = "tgp_v1_JwGf-fiEAx26EuQyo4leroPNQmNbmYQqGXY38uOH7rE";
