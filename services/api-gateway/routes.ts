const axios = require('axios');

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:8081';
const DECK_SERVICE = process.env.DECK_SERVICE_URL || 'http://localhost:8082';
const CARD_SERVICE = process.env.CARD_SERVICE_URL || 'http://localhost:8083';
const activeInitializations = new Map();
async function validateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const response = await axios.post(`${USER_SERVICE}/validate-token`, {
      token: authHeader.replace('Bearer ', '')
    });
    
    req.userId = response.data.uid;
    req.isNewUser = response.data.isNewUser || false;
    next();
  } catch (error) {
    console.error('Token validation error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

async function ensureUserHasDecks(userId) {
  if (activeInitializations.has(userId)) return activeInitializations.get(userId);

  const task = (async () => {
    try {
      const auth = { headers: { 'x-user-id': userId } };
      const { data: decks } = await axios.get(`${DECK_SERVICE}/api/decks`, auth);
      if (decks.length > 0) return;

      const { data: templates } = await axios.get(`${DECK_SERVICE}/api/templates`);
      
      for (const t of templates || []) {
        const tId = t.id || t._id;
        const { data: newDeck } = await axios.post(`${DECK_SERVICE}/api/decks`, 
          { name: t.name, templateId: tId }, auth
        );

        const { data: cards } = await axios.get(`${CARD_SERVICE}/api/cards?deckId=${tId}`, 
          { headers: { 'x-user-id': 'TEMPLATE' } }
        );

        for (const c of cards) {
          await axios.post(`${CARD_SERVICE}/api/cards`, 
            { deckId: newDeck.id, front: c.front, back: c.back }, auth
          );
        }
      }
    } catch (e) { console.error('[Init] Failed:', e.message); }
  })();

  activeInitializations.set(userId, task);
  return task.finally(() => activeInitializations.delete(userId));
}
export function setupRoutes(app) {
  // AUTH
  app.post('/api/validate-token', async (req, res) => {
    try {
      console.log('Gateway: Forwarding token validation to user service');
      
      const response = await axios.post(`${USER_SERVICE}/validate-token`, req.body);
      res.json(response.data);
    } catch (error) {
      console.error('Token validation failed:', error.response?.data || error.message);
      
      res.status(error.response?.status || 500).json({ 
        error: 'Service error',
        details: error.response?.data || error.message 
      });
    }
  });

  // DECKS
  
  app.get('/api/decks', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Fetching decks for user ${req.userId}`);
      
      await ensureUserHasDecks(req.userId);
      
      const decksResponse = await axios.get(`${DECK_SERVICE}/api/decks`, {
        headers: { 'x-user-id': req.userId }
      });
      
      const decks = decksResponse.data;
      console.log(`Gateway: Found ${decks.length} decks`);
      
      decks.forEach(deck => {
        if (!deck.id) {
          console.warn(`Deck missing id field: name="${deck.name}", _id=${deck._id}`);
        }
      });
      
      const decksWithCards = await Promise.all(
        decks.map(async (deck) => {
          if (!deck.id) {
            console.error(`Skipping cards fetch for deck without id: ${deck.name}`);
            return { ...deck, cards: [] };
          }
          
          try {
            console.log(`Gateway: Fetching cards for deck ${deck.id} (${deck.name})`);
            const cardsResponse = await axios.get(
              `${CARD_SERVICE}/api/cards?deckId=${deck.id}`,
              { headers: { 'x-user-id': req.userId } }
            );
            console.log(`Gateway: Deck ${deck.id} has ${cardsResponse.data.length} cards`);
            return { ...deck, cards: cardsResponse.data };
          } catch (error) {
            console.error(`Failed to fetch cards for deck ${deck.id}:`, error.message);
            return { ...deck, cards: [] };
          }
        })
      );
      
      res.json(decksWithCards);
    } catch (error) {
      console.error('Error in GET /api/decks:', error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch decks',
        details: error.response?.data || error.message 
      });
    }
  });

  app.get('/api/decks/:id', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Fetching deck ${req.params.id} for user ${req.userId}`);
      
      const deckResponse = await axios.get(`${DECK_SERVICE}/api/decks/${req.params.id}`, {
        headers: { 'x-user-id': req.userId }
      });
      
      const deck = deckResponse.data;
      console.log(`Gateway: Got deck "${deck.name}" with id ${deck.id}`);
      
      const cardsResponse = await axios.get(
        `${CARD_SERVICE}/api/cards?deckId=${deck.id}`,
        { headers: { 'x-user-id': req.userId } }
      );
      
      const deckWithCards = { ...deck, cards: cardsResponse.data };
      console.log(`Gateway: Deck has ${cardsResponse.data.length} cards`);
      
      res.json(deckWithCards);
    } catch (error) {
      console.error(`Error fetching deck ${req.params.id}:`, error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch deck',
        details: error.response?.data || error.message 
      });
    }
  });

  app.post('/api/decks', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Creating deck "${req.body.name}" for user ${req.userId}`);
      
      const response = await axios.post(`${DECK_SERVICE}/api/decks`, req.body, {
        headers: { 'x-user-id': req.userId }
      });
      
      console.log(`Gateway: Deck created with id ${response.data.id}`);
      res.status(201).json(response.data);
    } catch (error) {
      console.error('Error creating deck:', error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to create deck',
        details: error.response?.data || error.message 
      });
    }
  });

  app.put('/api/decks/:id', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Updating deck ${req.params.id}`);
      
      const response = await axios.put(`${DECK_SERVICE}/api/decks/${req.params.id}`, req.body, {
        headers: { 'x-user-id': req.userId }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error(`Error updating deck ${req.params.id}:`, error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to update deck',
        details: error.response?.data || error.message 
      });
    }
  });

  app.delete('/api/decks/:id', validateToken, async (req, res) => {
    try {
      const deckId = req.params.id;
      console.log(`Gateway: Deleting deck ${deckId} and its cards`);
      
      try {
        await axios.delete(`${CARD_SERVICE}/api/cards/deck/${deckId}`, {
          headers: { 'x-user-id': req.userId }
        });
        console.log(`Gateway: Cards deleted for deck ${deckId}`);
      } catch (error) {
        console.error(`Warning: Failed to delete cards for deck ${deckId}:`, error.message);
      }
      
      const response = await axios.delete(`${DECK_SERVICE}/api/decks/${deckId}`, {
        headers: { 'x-user-id': req.userId }
      });
      
      console.log(`Gateway: Deck ${deckId} deleted successfully`);
      res.json(response.data);
    } catch (error) {
      console.error(`Error deleting deck ${req.params.id}:`, error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to delete deck',
        details: error.response?.data || error.message 
      });
    }
  });

  // CARDS
  
  app.get('/api/cards', validateToken, async (req, res) => {
    try {
      const { deckId } = req.query;
      console.log(`Gateway: Fetching cards for deck ${deckId}`);
      
      const response = await axios.get(`${CARD_SERVICE}/api/cards?deckId=${deckId}`, {
        headers: { 'x-user-id': req.userId }
      });
      
      console.log(`Gateway: Found ${response.data.length} cards for deck ${deckId}`);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch cards',
        details: error.response?.data || error.message 
      });
    }
  });

  app.get('/api/cards/:id', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Fetching card ${req.params.id}`);
      
      const response = await axios.get(`${CARD_SERVICE}/api/cards/${req.params.id}`, {
        headers: { 'x-user-id': req.userId }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error(`Error fetching card ${req.params.id}:`, error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch card',
        details: error.response?.data || error.message 
      });
    }
  });

  app.post('/api/cards', validateToken, async (req, res) => {
    try {
      console.log('=== GATEWAY POST /api/cards START ===');
      console.log('User ID:', req.userId);
      console.log('Request body:', JSON.stringify(req.body));
      
      const response = await axios.post(`${CARD_SERVICE}/api/cards`, req.body, {
        headers: { 
          'x-user-id': req.userId,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Card created:', JSON.stringify(response.data));
      console.log('=== GATEWAY POST /api/cards SUCCESS ===');
      res.status(201).json(response.data);
    } catch (error) {
      console.error('=== GATEWAY POST /api/cards ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to create card',
        details: error.response?.data || error.message 
      });
    }
  });

  app.put('/api/cards/:id', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Updating card ${req.params.id}`);
      
      const response = await axios.put(`${CARD_SERVICE}/api/cards/${req.params.id}`, req.body, {
        headers: { 'x-user-id': req.userId }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error(`Error updating card ${req.params.id}:`, error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to update card',
        details: error.response?.data || error.message 
      });
    }
  });

  app.delete('/api/cards/:id', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Deleting card ${req.params.id}`);
      
      const response = await axios.delete(`${CARD_SERVICE}/api/cards/${req.params.id}`, {
        headers: { 'x-user-id': req.userId }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error(`Error deleting card ${req.params.id}:`, error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to delete card',
        details: error.response?.data || error.message 
      });
    }
  });

  // TEMPLATES
  
  app.get('/api/templates', async (req, res) => {
    try {
      console.log('Gateway: Fetching template decks');
      
      const response = await axios.get(`${DECK_SERVICE}/api/templates`);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch templates',
        details: error.response?.data || error.message 
      });
    }
  });

  // IMPORT
  
  app.post('/api/decks/import', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Importing ${req.body.decks?.length || 0} decks`);
      
      const response = await axios.post(`${DECK_SERVICE}/api/decks/import`, req.body, {
        headers: { 'x-user-id': req.userId }
      });
      
      res.status(201).json(response.data);
    } catch (error) {
      console.error('Error importing decks:', error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to import decks',
        details: error.response?.data || error.message 
      });
    }
  });

  app.post('/api/cards/import', validateToken, async (req, res) => {
    try {
      console.log(`Gateway: Importing ${req.body.cards?.length || 0} cards`);
      
      const response = await axios.post(`${CARD_SERVICE}/api/cards/import`, req.body, {
        headers: { 'x-user-id': req.userId }
      });
      
      res.status(201).json(response.data);
    } catch (error) {
      console.error('Error importing cards:', error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to import cards',
        details: error.response?.data || error.message 
      });
    }
  });
}

module.exports = { setupRoutes, validateToken };