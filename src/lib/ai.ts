import { fetchRepositoryContext } from './github';

export async function generateReadmeData(
  projectName: string,
  techStack: string[],
  apiKey: string,
  modelId: string = 'meta/llama-3.1-405b-instruct',
  githubContext?: any,
  githubToken?: string
): Promise<{
  description: string;
  features: string[];
  installation: string;
  usage: string;
  contributing: string;
}> {
  let promptContext = '';
  
  if (githubContext && githubToken) {
    try {
      const repoData = await fetchRepositoryContext(
        githubToken, 
        githubContext.owner.login, 
        githubContext.name
      );
      if (repoData) {
        promptContext = `\nRepository Context:\n${repoData}\n`;
      }
    } catch (e) {
      console.warn('Failed to fetch deep repo context for AI prompt', e);
    }
  }

  const prompt = `You are an expert developer. Based on the provided context, generate the core content for a GitHub README.md file. 

Project Name: ${projectName || 'Untitled Project'}
Tech Stack: ${techStack.length > 0 ? techStack.join(', ') : 'Not specified'}${promptContext}

Return the output strictly as a JSON object matching this exact schema:
{
  "description": "A professional, punchy, 2-to-3 sentence description.",
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "installation": "Markdown code block showing installation steps or bash commands.",
  "usage": "Markdown code block or explanation showing how to use the project.",
  "contributing": "A short paragraph on how others can contribute."
}

Do NOT include markdown formatting outside the JSON object. Output ONLY valid JSON.`;

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
      model: modelId,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('NVIDIA API Error:', response.status, errorText);
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '{}';
  
  try {
    // Strip markdown JSON wrappers if the model included them
    const cleanJson = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Failed to parse AI JSON response:', content);
    throw new Error('AI returned malformed JSON');
  }
}
