Flashcards App
A Preact-based flashcard application designed for language learning, featuring deck management, card editing, and support for images/audio. The application leverages Material-UI (MUI) for a consistent look and feel, and incorporates a dark theme option. Data is persisted in localStorage for offline use and can be imported/exported via JSON files.

Table of Contents
Features
Installation
Usage
Project Structure
Technologies & APIs Used
Contributing
License
Features
Deck Management

Create, edit, and delete decks.
Add new cards with front/back text, images, and audio.
Persist data in localStorage.
Card Viewer

Flip cards to reveal the back.
Attached images and audio playback within each card.
Edit individual cards at any time.
Import/Export Decks

Import existing decks from a JSON file.
Export all decks to a JSON file for backup or sharing.
Dark Theme

Switch between light and dark themes.
Respects custom CSS variables and MUI theming.
Material-UI Integration

Consistent UI components, including buttons, text fields, and icons.
Responsive design using MUI’s grid system.
Analytics (Optional)

(If enabled) Provide an overview of total decks, total cards, and more.
Installation
Clone the Repository:
bash
Copy code
git clone https://github.com/YourUsername/flashcards-app.git
Install Dependencies:
bash
Copy code
cd flashcards-app
npm install
Start the Development Server:
bash
Copy code
npm run dev
Usage
Creating a New Deck:

Navigate to Your Decks and click Add New Deck.
Enter a name for your deck and confirm.
Adding Cards:

Open a deck and click Add New Card.
Fill in the front/back text, upload an optional image or audio file, then save.
Editing a Deck:

Click Edit Deck Name to rename a deck.
Or edit individual cards from the card viewer.
Import/Export:

Use Import to load decks from a JSON file.
Use Export to download all decks as a JSON file for backup or sharing.
Theme Toggle:

Switch between light/dark mode in the settings or via the theme toggle button.
Refresh the page if needed (depending on your implementation) to fully apply the theme.
Project Structure
lua
Copy code
flashcards-app/
├── src/
│   ├── Card/
│   │   ├── CardViewer.tsx
│   │   ├── CardEditor.tsx
│   │   └── cardViewerStyles.less
│   ├── Deck/
│   │   ├── DeckList.tsx
│   │   ├── DeckDetail.tsx
│   │   ├── DeckItem.tsx
│   │   └── deckListStyles.less
│   ├── Settings/
│   │   └── ThemeToggle.tsx
│   ├── utils/
│   │   └── storage.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── styles/
│       ├── variables.less
│       └── globalStyles.less
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
Technologies & APIs Used
Preact: Core library for building performant, lightweight UI components.
TypeScript: Provides type safety and improved developer experience.
Material-UI (MUI): Offers a consistent and responsive UI, including icon sets.
LocalStorage: Persists decks and cards offline.
FileReader & Blob APIs: Enables importing/exporting JSON files and reading media files for cards.
CSS/LESS: Custom styling with variables for theming, plus MUI theming for UI consistency.
Contributing
Fork the repository and create a new branch.
Implement your feature or bug fix.
Open a Pull Request describing your changes.
Please adhere to the style and structure where possible, and add testing for your features when relevant.