import type { IncomingMessage, ServerResponse } from 'http';

// Helper function to convert a Blob to Base64
const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const API_KEY = process.env.VITE_API_KEY; // 从环境变量中获取 API 密钥

  if (!API_KEY) {
    return res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'API Key is missing' }));
  }

  try {
    const body = await new Promise<string>((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });

    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.writeHead(response.status, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: `Failed to fetch image: ${errorText}` }));
    }

    const result = await response.blob();
    const base64Image = await blobToBase64(result);
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ image: base64Image }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: `Failed to generate image: ${error.message}` }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'An unknown error occurred' }));
    }
  }
}
