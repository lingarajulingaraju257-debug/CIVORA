import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', civora: 'Build Smarter. Manage Better.' });
});

// Initialize server-side Gemini client if a real key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.startsWith('MY_')) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.error('Failed to initialize GoogleGenAI:', e);
  }
}

// Multilingual Construction Assistant API endpoint
app.post('/api/ai/voice-assistant', async (req, res) => {
  console.log('Received /api/ai/voice-assistant request:', req.body);
  try {
    const { prompt, language = 'English', role = 'Customer', projectContext } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // If Gemini API is available on server, attempt it
    if (ai) {
      console.log('Attempting Gemini generation for prompt:', prompt);
      try {
        const systemInstruction = `You are CIVORA AI Copilot, a professional multilingual construction intelligence assistant for the CIVORA platform (Tagline: Build Smarter. Manage Better).
You assist users in their chosen language: ${language}. Supported languages include English, Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Tamil (தமிழ்), and Telugu (తెలుగు).
The current user role is: ${role}.
Context: ${JSON.stringify(projectContext || {})}
Guidelines:
1. Provide accurate, professional construction engineering and project management answers in the requested language (${language}).
2. If the user asks in Kannada, answer in clear Kannada script. If Hindi, answer in Hindi script. If Tamil, answer in Tamil script. If Telugu, answer in Telugu script. If English, answer in English.
3. Keep the response concise, actionable, and formatted in 2-4 sentences or short bullet points suitable for audio text-to-speech.
4. If asked about safety defects, emphasize strict engineering protocols (IS 456, OSHA, NBC 2016).
5. Respect role boundaries (do not leak internal contractor profit margins to customers).`;

        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out after 3500ms')), 3500)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
          },
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        if (response && response.text) {
          return res.json({
            reply: response.text,
            language,
            role,
            source: 'gemini',
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API error/timeout, using domain engine fallback:', geminiError?.message || geminiError);
      }
    }

    // Domain-grounded fallback response if API key is not configured
    const fallbackResponses: Record<string, Record<string, string>> = {
      English: {
        progress: 'Project Skyline Azure is currently at 68% overall completion. The RCC superstructure is 100% complete, and brickwork on the 12th floor is on schedule with zero critical structural defects.',
        materials: 'Inventory report: 540 bags of UltraTech 53-grade OPC cement and 18.4 metric tons of Fe550D TMT steel are on site. Reorder threshold is scheduled for next Tuesday.',
        defects: 'Inspection log: 2 active non-critical punch items recorded on 8th-floor ducting. Remediation work order #WO-104 has been issued to the MEP contractor.',
        payments: 'Next milestone payment for "14th Floor Slab Pour" ($28,500) will be due upon engineer structural QA sign-off.',
        default: `CIVORA AI Copilot received your query for role [${role}]. All site logs, engineering drawings, and safety checklists are synchronized in real-time.`,
      },
      Kannada: {
        progress: 'ಸ್ಕೈಲೈನ್ ಅಜೂರ್ ಯೋಜನೆಯು ಪ್ರಸ್ತುತ 68% ಪೂರ್ಣಗೊಂಡಿದೆ. RCC ರಚನಾತ್ಮಕ ಕಾಮಗಾರಿ ಸಂಪೂರ್ಣಗೊಂಡಿದ್ದು, 12ನೇ ಮಹಡಿಯ ಇಟ್ಟಿಗೆ ಕೆಲಸ ಮುಂದುವರಿಯುತ್ತಿದೆ.',
        materials: 'ದಾಸ್ತಾನು ವರದಿ: 540 ಚೀಲ ಸಿಮೆಂಟ್ ಮತ್ತು 18.4 ಮೆಟ್ರಿಕ್ ಟನ್ TMT ಸ್ಟೀಲ್ ಸೈಟ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ.',
        defects: 'ತಪಾಸಣಾ ವರದಿ: ಯಾವುದೇ ಗಂಭೀರ ರಚನಾತ್ಮಕ ದೋಷಗಳಿಲ್ಲ. ಸಣ್ಣ ಎಲೆಕ್ಟ್ರಿಕಲ್ ಪೈಪ್ ಕೆಲಸ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ.',
        payments: 'ಮುಂದಿನ ಪಾವತಿ 14ನೇ ಮಹಡಿಯ ಸ್ಲ್ಯಾಬ್ ಕಾಸ್ಟಿಂಗ್ ನಂತರ ಎಂಜಿನಿಯರ್ ಅನುಮೋದನೆ ಪಡೆದು ಪಾವತಿಸಬೇಕಾಗುತ್ತದೆ.',
        default: `ಸಿವೋರಾ AI ಸಹಾಯಕ: ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ನವೀಕರಣಗಳು ಮತ್ತು ಸೈಟ್ ಡೇಟಾ ಸುರಕ್ಷಿತವಾಗಿವೆ.`,
      },
      Hindi: {
        progress: 'स्काईलाइन एज़्योर परियोजना वर्तमान में 68% पूर्ण है। आरसीसी सुपरस्ट्रक्चर पूरी तरह तैयार है और 12वीं मंजिल की चिनाई का काम समय पर चल रहा है।',
        materials: 'सामग्री स्थिति: 540 बोरी सीमेंट और 18.4 टन टीएमटी स्टील साइट पर उपलब्ध है।',
        defects: 'साइट निरीक्षण: कोई गंभीर सुरक्षा दोष नहीं मिला। सामान्य गुणवत्ता जांच पास हो चुकी है।',
        payments: 'अगली किस्त 14वीं मंजिल की छत ढलाई के बाद इंजीनियर सत्यापन पर देय होगी।',
        default: `सिवोरा एआई सहायक: आपकी परियोजना के सभी निर्माण विवरण और सुरक्षा रिपोर्ट अपडेटेड हैं।`,
      },
      Tamil: {
        progress: 'ஸ்கைலைன் அஸூர் திட்டம் தற்போது 68% நிறைவடைந்துள்ளது. ஆர்சிசி கட்டமைப்பு பணிகள் முழுமையடைந்துள்ளன.',
        materials: 'பொருட்கள் இருப்பு: 540 சிமெண்ட் மூட்டைகள் மற்றும் 18.4 டன் டிஎம்டி ஸ்டீல் தளத்தில் உள்ளன.',
        defects: 'தள ஆய்வு: தீவிர குறைபாடுகள் எதுவும் இல்லை. பாதுகாப்பு விதிமுறைகள் முறையாக பின்பற்றப்படுகின்றன.',
        payments: 'அடுத்த தவணைத் தொகை 14வது தள கான்கிரீட் பணி முடிந்த பிறகு பொறியாளர் ஒப்புதலுடன் செலுத்தப்படும்.',
        default: `சிவோரா AI உதவியாளர்: உங்கள் கட்டுமான தள விபரங்கள் அனைத்தும் தயார் நிலையில் உள்ளன.`,
      },
      Telugu: {
        progress: 'స్కైలైన్ అజూర్ ప్రాజెక్ట్ ప్రస్తుతం 68% పూర్తయింది. RCC సూపర్ స్ట్రక్చర్ పూర్తి కాగా, ఇటుకల నిర్మాణం షెడ్యూల్ ప్రకారం సాగుతోంది.',
        materials: 'మెటీరియల్ నిల్వ: 540 సిమెంట్ బస్తాలు మరియు 18.4 మెట్రిక్ టన్నుల స్టీల్ సైట్‌లో సిద్ధంగా ఉన్నాయి.',
        defects: 'నాణ్యతా తనిఖీ: ఎటువంటి తీవ్రమైన లోపాలు లేవు. భద్రతా ప్రమాణాలు పాటించబడుతున్నాయి.',
        payments: 'తదుపరి పేమెంట్ 14వ అంతస్తు స్లాబ్ పూర్తి కాగానే ఇంజనీర్ ఆమోదంతో చెల్లించాల్సి ఉంటుంది.',
        default: `సివోరా AI అసిస్టెంట్: మీ ప్రాజెక్ట్ డాక్యుమెంట్లు మరియు పనులు సజావుగా సాగుతున్నాయి.`,
      },
    };

    const langResponses = fallbackResponses[language] || fallbackResponses.English;
    const lowerPrompt = prompt.toLowerCase();
    let reply = langResponses.default;
    if (lowerPrompt.includes('progress') || lowerPrompt.includes('status') || lowerPrompt.includes('completion') || lowerPrompt.includes('ಕೆಲಸ') || lowerPrompt.includes('काम') || lowerPrompt.includes('வேலை') || lowerPrompt.includes('పని')) {
      reply = langResponses.progress;
    } else if (lowerPrompt.includes('material') || lowerPrompt.includes('cement') || lowerPrompt.includes('steel') || lowerPrompt.includes('ಸಿಮೆಂಟ್') || lowerPrompt.includes('सीमेंट') || lowerPrompt.includes('சிமெண்ட்') || lowerPrompt.includes('సిమెంట్')) {
      reply = langResponses.materials;
    } else if (lowerPrompt.includes('defect') || lowerPrompt.includes('issue') || lowerPrompt.includes('safety') || lowerPrompt.includes('inspection') || lowerPrompt.includes('ದೋಷ') || lowerPrompt.includes('दोष') || lowerPrompt.includes('குறைபாடு') || lowerPrompt.includes('లోపం')) {
      reply = langResponses.defects;
    } else if (lowerPrompt.includes('payment') || lowerPrompt.includes('milestone') || lowerPrompt.includes('invoice') || lowerPrompt.includes('ಹಣ') || lowerPrompt.includes('भुगतान') || lowerPrompt.includes('கட்டணம்') || lowerPrompt.includes('పేమెంట్')) {
      reply = langResponses.payments;
    }

    return res.json({
      reply,
      language,
      role,
      source: 'domain-engine',
    });
  } catch (error: any) {
    console.error('CIVORA AI Voice Assistant Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Mount Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CIVORA Construction Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
