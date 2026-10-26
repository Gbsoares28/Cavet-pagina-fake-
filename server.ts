import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent feedback storage file
const DATA_DIR = path.join(__dirname, 'data');
const FEEDBACKS_FILE = path.join(DATA_DIR, 'feedbacks.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface FeedbackRecord {
  id: string;
  rating: number | null;
  comment: string;
  clientName?: string;
  contact?: string;
  contactConsent: boolean;
  petName?: string;
  createdAt: string;
  userAgent?: string;
}

// Initial seed if empty
function getStoredFeedbacks(): FeedbackRecord[] {
  try {
    if (fs.existsSync(FEEDBACKS_FILE)) {
      const data = fs.readFileSync(FEEDBACKS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading feedback file:', err);
  }
  return [];
}

function saveFeedbacks(feedbacks: FeedbackRecord[]): void {
  try {
    fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(feedbacks, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing feedback file:', err);
  }
}

// In-memory cache synced with disk
let feedbacks: FeedbackRecord[] = getStoredFeedbacks();

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CAVET Tijuca - API de Feedback',
    timestamp: new Date().toISOString(),
    totalFeedbacks: feedbacks.length,
  });
});

// GET /api/feedback - List registered private feedbacks for internal team
app.get('/api/feedback', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: feedbacks,
    count: feedbacks.length,
  });
});

// POST /api/feedback - Submit private feedback
app.post('/api/feedback', (req: Request, res: Response) => {
  try {
    const { rating, comment, clientName, contact, contactConsent, petName } = req.body;

    // Validate that either rating or comment is present
    if (!comment && (rating === null || rating === undefined)) {
      res.status(400).json({
        success: false,
        message: 'Por favor, informe ao menos uma nota ou um comentário para enviar seu feedback.',
      });
      return;
    }

    if (rating !== null && rating !== undefined) {
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        res.status(400).json({
          success: false,
          message: 'Classificação inválida. O valor deve ser de 1 a 5 estrelas.',
        });
        return;
      }
    }

    if (comment && typeof comment === 'string' && comment.length > 2000) {
      res.status(400).json({
        success: false,
        message: 'O comentário excede o limite máximo permitido de 2000 caracteres.',
      });
      return;
    }

    const newRecord: FeedbackRecord = {
      id: `cavet-fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      rating: rating ? Number(rating) : null,
      comment: typeof comment === 'string' ? comment.trim() : '',
      clientName: typeof clientName === 'string' ? clientName.trim() : '',
      contact: typeof contact === 'string' ? contact.trim() : '',
      contactConsent: Boolean(contactConsent),
      petName: typeof petName === 'string' ? petName.trim() : '',
      createdAt: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || '',
    };

    feedbacks.unshift(newRecord);
    saveFeedbacks(feedbacks);

    res.status(201).json({
      success: true,
      message: 'Feedback privado recebido com sucesso pela equipe do CAVET Tijuca!',
      record: newRecord,
    });
  } catch (err: unknown) {
    console.error('Erro ao processar feedback:', err);
    res.status(500).json({
      success: false,
      message: 'Ocorreu um erro interno ao processar o seu feedback. Por favor, tente novamente.',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CAVET Tijuca] Servidor ativo em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
