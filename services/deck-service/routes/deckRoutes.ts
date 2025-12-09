import { Router } from 'express';
import Deck from '../models/deckModel';

const router = Router();
router.use((req, res, next) => {
  console.log('Deck Service received:', req.method, req.url, req.path);
  console.log('Headers:', req.headers);
  next();
});

//(move auth to middleware file)
const requireAuth = (req: any, res: any, next: any) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = userId;
  next();
};

router.get('/templates', async (req, res) => {
  try {
    console.log('Fetching templates...');
    const templates = await Deck.find({ isTemplate: true });
    console.log(`Found ${templates.length} templates`);
    res.json(templates);
  } catch (error) { 
    console.error('Failed to fetch templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.use(requireAuth);

// GET /decks: List all user's decks
router.get('/decks', async (req: any, res: any) => {
  try {
    const decks = await Deck.find({ userId: req.userId });
    res.json(decks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// GET /decks/:id: Get single deck
router.get('/decks/:id', async (req: any, res: any) => {
  try {
    const deck = await Deck.findOne({ 
      id: parseInt(req.params.id), 
      userId: req.userId 
    });
    if (!deck) return res.status(404).json({error: 'Deck not found'})
    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deck' });
  }
});

// POST /decks: Create deck
router.post('/decks', async (req: any, res: any) => {
  try {
    // console.log('POST /decks: Raw body:', JSON.stringify(req.body));
    // console.log('POST /decks: User ID:', req.userId);
    // console.log('POST /decks: Body keys:', Object.keys(req.body));
    
    const { name, isTemplate = false, templateId } = req.body;
    
    console.log('Extracted values: name:', name, 'isTemplate:', isTemplate, 'templateId:', templateId);
    
    // Generate next ID
    const lastDeck = await Deck.findOne().sort({ id: -1 });
    const newId = lastDeck ? lastDeck.id + 1 : 1;
    
    console.log('Generated ID:', newId)
    
    const deck = new Deck({
      id: newId,
      name,
      userId: isTemplate ? 'TEMPLATE' : req.userId,
      isTemplate,
      templateId
    });
    
    await deck.save();
    
    console.log('Deck saved successfully!');
    
    res.status(201).json(deck);
  } catch (error) {
    console.error('POST /decks: Error:', error);
    res.status(500).json({ error: 'Failed to create deck' });
  }
});

// PUT /decks/:id: Rename deck
router.put('/decks/:id', async (req: any, res: any) => {
  try {
    const { name } = req.body;
    const deck = await Deck.findOneAndUpdate(
      { id: parseInt(req.params.id), userId: req.userId },
      { name, updatedAt: new Date() },
      { new: true }
    );
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deck' });
  }
});

// DELETE /decks/:id: Delete deck
router.delete('/decks/:id', async (req: any, res: any) => {
  try {
    const deck = await Deck.findOneAndDelete({ 
      id: parseInt(req.params.id), 
      userId: req.userId 
    });
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    res.json({ message: 'Deck deleted', id: parseInt(req.params.id) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deck' });
  }
});

// GET /templates: Get template decks
router.get('/templates', async (req, res) => {
  try {
    const templates = await Deck.find({ isTemplate: true })
    res.json(templates);
  } catch (error) { 
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// POST /decks/import: Import decks
router.post('/decks/import', async (req: any, res: any) => {
  try {
    const { decks } = req.body;
    if (!decks || !Array.isArray(decks)) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    const decksWithUserId = decks.map(deck => ({ 
      ...deck, 
      userId: req.userId 
    }));
    await Deck.insertMany(decksWithUserId);
    res.status(201).json({ message: 'Decks imported' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import decks' });
  }
});

export default router;