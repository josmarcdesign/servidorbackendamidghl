// Coloque este arquivo em /api/submit.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GHLFormData } from '../types';

const GHL_SUBMIT_URL = 'https://services.leadconnectorhq.com/forms/submit';
const GHL_FORM_ID = 'gsZE3Wx9bQd2nZRiyKo6';
const GHL_LOCATION_ID = 'gE11SUiKLGFRciiF0aiT';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Adiciona cabeçalhos CORS para permitir requisições de qualquer origem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // O navegador envia uma requisição "preflight" OPTIONS antes do POST
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const formData: GHLFormData = req.body;

    // Validação simples dos dados recebidos
    if (!formData.fullName || !formData.email || !formData.phone) {
        return res.status(400).json({ message: 'Missing required fields: fullName, email, phone.' });
    }

    const payload = new URLSearchParams();
    payload.append('formId', GHL_FORM_ID);
    payload.append('location_id', GHL_LOCATION_ID);
    payload.append('full_name', formData.fullName);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    
    const ghlResponse = await fetch(GHL_SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    // Tenta parsear a resposta como JSON. Se falhar, usa o texto puro dentro de um objeto.
    let responseData: any;
    try {
        responseData = await ghlResponse.json();
    } catch (jsonError) {
        // Se a resposta não for JSON, captura o corpo como texto para evitar o erro de 'unknown' type.
        const textResponse = await ghlResponse.text();
        responseData = { message: textResponse };
    }

    if (!ghlResponse.ok) {
      console.error('GHL API Error:', responseData);
      // Agora é seguro acessar .message, pois garantimos que responseData é um objeto.
      const errorMessage = responseData.message || (typeof responseData === 'string' ? responseData : 'Submission to GHL failed.');
      return res.status(ghlResponse.status).json({ message: errorMessage });
    }
    
    return res.status(200).json({ success: true, message: 'Form submitted successfully.', ghlResponse: responseData });

  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ message: 'An internal server error occurred.', error: error.message });
  }
}
