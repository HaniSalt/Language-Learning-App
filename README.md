# <Flashcards App>
A Preact-based flashcard application designed for language learning, featuring deck management, card editing, and support for images/audio. The application leverages Material-UI (MUI) for a consistent look and feel, and incorporates a dark theme option. Data is persisted in localStorage for offline use and can be imported/exported via JSON files.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies & APIs Used](#tech&Api)

## Features
### Deck Management
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
Analytics
Provide an overview of total decks, total cards, and more.

## Installation
### Clone the Repository: git clone https://github.com/HaniSalt/Language-Learning-App.git
### Install Dependencies:
cd C:\location-where-installed
npm install

### Start the Development Server:
npm run dev

## Usage
Creating a New Deck: Navigate to Your Decks and click Add New Deck.
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
Switch between light/dark mode in the settings.

Technologies & APIs Used
Preact: Core library for building performant, lightweight UI components.
TypeScript: Because it provides type safety and improved developer experience.
Material-UI (MUI): Offers a consistent and responsive UI, including icon sets.
LocalStorage: Persists decks and cards offline.
FileReader & Blob APIs: Enables importing/exporting JSON files and reading media files for cards.
CSS/LESS: Custom styling with variables for theming, plus MUI theming for UI consistency.