import type { VercelRequest, VercelResponse } from '@vercel/node';

// Helper function to convert a Blob to Base64
const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_KEY = process.env.VITE_API_KEY; // 从环境变量中获取 API 密钥

  if (!API_KEY) {
    return res.status(500).json({ error: 'API Key is missing' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Failed to fetch image: ${errorText}` });
    }

    const result = await response.blob();
    const base64Image = await blobToBase64(result);
    res.status(200).json({ image: base64Image });
  } catch (error) {
    res.status(500).json({ error: `Failed to generate image: ${error.message}` });
  }
}
