export const AI_MODEL = 'meta/llama-3.1-405b-instruct'; // Upgraded to requested 405B model

export async function generateDescription(
  projectName: string,
  techStack: string[],
  apiKey: string
): Promise<string> {
  const prompt = `You are an expert developer. Write a professional, punchy, 2-to-3 sentence GitHub README description for a project.

Project Name: ${projectName || 'Untitled Project'}
Tech Stack: ${techStack.length > 0 ? techStack.join(', ') : 'Not specified'}

Do not include any pleasantries, markdown formatting like bolding the project name, or conversational text. Output ONLY the description paragraph.`;

  // We use a raw fetch call here because the OpenAI SDK sometimes struggles
  // with browser CORS proxies and adds extra headers that corsproxy.io rejects.
  const baseURL = import.meta.env.DEV 
    ? '/nvidia-api' 
    : 'https://corsproxy.io/?url=https://integrate.api.nvidia.com/v1';

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('NVIDIA API Error:', response.status, errorText);
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}
