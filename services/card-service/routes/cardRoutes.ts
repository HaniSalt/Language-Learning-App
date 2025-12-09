import { Router } from 'express';
import Card from '../models/cardModel';

const router = Router();

router.use((req, res, next) => {
  console.log('Card Service received:', req.method, req.url, req.path);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

const requireAuth = (req: any, res: any, next: any) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    console.log('Auth failed: no x-user-id header');
    return res.status(401).json({error: 'Unauthorized'});
  }
  console.log('Auth passed: userId =', userId);
  req.userId = userId;
  next();
};

router.use(requireAuth);

// GET /cards: Get all cards (with optional deckId filter)
router.get('/cards', async (req: any, res: any) => {
  try {
    console.log('=== GET /cards START ===');
    console.log('User ID:', req.userId);
    console.log('Query params:', req.query);
    
    const { deckId } = req.query;
    
    const filter: any = { userId: req.userId };
    if (deckId) {
      filter.deckId = parseInt(deckId);
    }
    
    console.log('Filtering cards with:', JSON.stringify(filter));
    
    const cards = await Card.find(filter).sort({ id: 1 });
    
    console.log(`Found ${cards.length} cards`);
    console.log('=== GET /cards END ===');
    
    res.json(cards);
  } catch (error) {
    console.error('=== GET /cards ERROR ===');
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch cards', details: errorMessage });
  }
});

// GET /cards/:id: Get a specific card
router.get('/cards/:id', async (req: any, res: any) => {
  try {
    console.log('=== GET /cards/:id START ===');
    console.log('User ID:', req.userId);
    console.log('Card ID:', req.params.id);
    
    const cardId = parseInt(req.params.id);
    
    const card = await Card.findOne({ 
      id: cardId, 
      userId: req.userId 
    });
    
    if (!card) {
      console.log('Card not found');
      return res.status(404).json({ error: 'Card not found' });
    }
    
    console.log('Card found:', JSON.stringify(card));
    console.log('=== GET /cards/:id END ===');
    
    res.json(card);
  } catch (error) {
    console.error('=== GET /cards/:id ERROR ===');
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch card', details: errorMessage });
  }
});

// POST /cards: Create card
router.post('/cards', async (req: any, res: any) => {
  try {
    console.log('=== POST /cards START ===');
    console.log('User ID:', req.userId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { deckId, front, back } = req.body;
    
    if (!deckId || !front || !back) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({ error: 'deckId, front, and back are required' });
    }
    
    console.log('Looking for last card...');
    const lastCard = await Card.findOne().sort({ id: -1 });
    const newId = lastCard ? lastCard.id + 1 : 1;
    console.log('Last card:', lastCard ? lastCard.id : 'none');
    console.log('New ID will be:', newId);
    
    const cardData = {
      id: newId,
      deckId: parseInt(deckId),
      front,
      back,
      userId: req.userId
    };
    
    console.log('Creating card with data:', JSON.stringify(cardData, null, 2));
    
    const card = new Card(cardData);
    await card.save();
    
    console.log('Card saved successfully!');
    console.log('Saved card:', JSON.stringify(card, null, 2));
    console.log('=== POST /cards END ===');
    
    res.status(201).json(card);
  } catch (error) {
    console.error('=== POST /cards ERROR ===');
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to create card', details: errorMessage });
  }
});

// PUT /cards/:id: Update a card
router.put('/cards/:id', async (req: any, res: any) => {
  try {
    console.log('=== PUT /cards/:id START ===');
    console.log('User ID:', req.userId);
    console.log('Card ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const cardId = parseInt(req.params.id);
    const { front, back, deckId } = req.body;
    
    const updateData: any = {};
    if (front !== undefined) updateData.front = front;
    if (back !== undefined) updateData.back = back;
    if (deckId !== undefined) updateData.deckId = parseInt(deckId);
    
    console.log('Update data:', JSON.stringify(updateData));
    
    const card = await Card.findOneAndUpdate(
      { id: cardId, userId: req.userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!card) {
      console.log('Card not found');
      return res.status(404).json({ error: 'Card not found' });
    }
    
    console.log('Card updated successfully:', JSON.stringify(card));
    console.log('=== PUT /cards/:id END ===');
    
    res.json(card);
  } catch (error) {
    console.error('=== PUT /cards/:id ERROR ===');
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to update card', details: errorMessage });
  }
});

// DELETE /cards/:id: Delete a card
router.delete('/cards/:id', async (req: any, res: any) => {
  try {
    console.log('=== DELETE /cards/:id START ===');
    console.log('User ID:', req.userId);
    console.log('Card ID:', req.params.id);
    
    const cardId = parseInt(req.params.id);
    
    const card = await Card.findOneAndDelete({ 
      id: cardId, 
      userId: req.userId 
    });
    
    if (!card) {
      console.log('Card not found');
      return res.status(404).json({ error: 'Card not found' });
    }
    
    console.log('Card deleted successfully');
    console.log('=== DELETE /cards/:id END ===');
    
    res.json({ message: 'Card deleted successfully', id: cardId });
  } catch (error) {
    console.error('=== DELETE /cards/:id ERROR ===');
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to delete card', details: errorMessage });
  }
});

// DELETE /cards/deck/:deckId: Delete all cards in a deck
router.delete('/cards/deck/:deckId', async (req: any, res: any) => {
  try {
    console.log('=== DELETE /cards/deck/:deckId START ===');
    console.log('User ID:', req.userId);
    console.log('Deck ID:', req.params.deckId);
    
    const deckId = parseInt(req.params.deckId);
    
    const result = await Card.deleteMany({ 
      deckId: deckId, 
      userId: req.userId 
    });
    
    console.log(`Deleted ${result.deletedCount} cards from deck ${deckId}`);
    console.log('=== DELETE /cards/deck/:deckId END ===');
    
    res.json({ 
      message: 'Cards deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('=== DELETE /cards/deck/:deckId ERROR ===');
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to delete cards', details: errorMessage });
  }
});

export default router;