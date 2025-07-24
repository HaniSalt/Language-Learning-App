# Language Learning App - Express.js Implementation

A modern, full-stack flashcard application designed for language learning, featuring a Preact frontend with Material-UI components and a Express.js backend for end-to-end type-safe API communication.

## ✨ Features

### 🎯 Core Functionality
- **Deck Management**: Create, edit, and delete flashcard decks
- **Interactive Cards**: Add front/back text, images, and audio to cards
- **Card Viewer**: Flip cards to reveal answers with smooth animations
- **Import/Export**: Backup and share decks via JSON files
- **User Authentication**: Secure login and registration with Firebase
- **Cross-Device Sync**: Access your decks from any device

### 🎨 User Experience
- **Dark Theme**: Toggle between light and dark modes
- **Material-UI Integration**: Consistent, responsive design
- **Persistent Storage**: Data synced across devices via MongoDB
- **Analytics Dashboard**: Overview of decks, cards, and learning progress
- **Media Support**: Upload images and audio files to enhance learning

### 🔧 Technical Features
- **Type-Safe APIs**: End-to-end type safety with Express.js
- **Modern Frontend**: Built with Preact and TypeScript
- **Robust Backend**: Node.js with Express and MongoDB
- **Authentication**: Firebase Authentication integration
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Tech Stack

### Frontend
- **Preact** - Lightweight React alternative for optimal performance
- **TypeScript** - Type safety and enhanced developer experience
- **Material-UI (MUI)** - Consistent UI components and theming
- **CSS/LESS** - Custom styling with CSS variables
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Full-stack type safety
- **Mongoose** - MongoDB object modeling

### Database & Authentication
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Firebase Authentication** - Secure user authentication
- **Mongoose ODM** - Schema validation and database operations

### Development & Testing
- **Jest** - Testing framework
- **Supertest** - HTTP testing library

## 🏗️ Backend Architecture

- **Routers**: Domain-organized routers (deck, card, user, auth)
- **Procedures**: Type-safe API endpoints with Zod validation
- **Middleware**: Authentication, error handling, and logging
- **Context**: Request context with user information and database connections
- **Type Safety**: Shared types between client and server

### API Architecture
- **RESTful Design**: Intuitive endpoint structure
- **Error Handling**: Consistent error responses and logging
- **Input Validation**: Zod schemas for runtime type checking
- **Authentication Middleware**: Firebase token verification
- **CORS Configuration**: Secure cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB Atlas account
- Firebase project setup

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/HaniSalt/Language-Learning-App.git
   cd Language-Learning-App
   git checkout userFetching-Change
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   
   Create `server/config.env`:
   ```env
   ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=5000
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your-firebase-project-id
   ```

   Create `client/.env`:

### Development Server

```bash
# Start backend server (from server directory)
cd server
npm run dev

# Start frontend development server (from client directory)
cd client
npm run dev
```

Access the application at `http://localhost:3000`

## 🎯 Usage Guide

### Getting Started

1. **User Registration**
   - Navigate to the registration page
   - Create account with email and password
   - Verify email if required
   - Automatic default decks are created

2. **Creating Your First Deck**
   - Navigate to "Your Decks" from the main menu
   - Click "Add New Deck"
   - Enter a descriptive name for your deck
   - Confirm creation

3. **Adding Flashcards**
   - Open your newly created deck
   - Click "Add New Card"
   - Fill in the front text (question/prompt)
   - Fill in the back text (answer/translation)
   - Optionally upload an image or audio file
   - Save your card

### Advanced Features

4. **Studying Mode**
   - Open any deck to start studying
   - Click cards to flip and reveal answers
   - Use keyboard shortcuts for navigation
   - Track your progress in real-time

5. **Data Management**
   - **Import Decks**: Load existing decks from JSON files
   - **Export Decks**: Download all decks for backup or sharing
   - **Edit Cards**: Modify existing cards at any time
   - **Bulk Operations**: Select multiple cards for batch actions

6. **Customization**
   - **Theme Toggle**: Switch between light and dark modes
   - **Deck Organization**: Create categories and tags
   - **Media Integration**: Add images and audio for better retention

## 🧪 Testing

### Backend Testing
The server includes comprehensive test suites using Jest and Supertest:

- **Unit Tests**: Individual function and method testing
- **Integration Tests**: API endpoint testing with mock database
- **Authentication Tests**: Firebase token validation testing
- **Database Tests**: Mongoose model and schema validation

### Frontend Testing
Client-side testing focuses on component behavior and API integration:

- **Component Tests**: UI component rendering and interaction
- **API Integration Tests**: express.js procedure calling and data flow
- **User Flow Tests**: Complete user journey testing
- **Mock Implementation**: Isolated component testing with mocked APIs

## 🔒 Security Features

- **Firebase Authentication**: Industry-standard user authentication
- **Token Validation**: Server-side Firebase token verification
- **User Authorization**: User-specific data access controls
- **Input Validation**: Zod schema validation on all inputs
- **CORS Protection**: Configured cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## 🔮 Future Enhancements

### Planned Features
- [ ] **Spaced Repetition Algorithm**: Implement SRS for optimized learning
- [ ] **Community Marketplace**: Share and discover decks from other users
- [ ] **Advanced Analytics**: Detailed learning progress and statistics
- [ ] **Offline Support**: Progressive Web App with offline capabilities

**Happy Learning!** 🎓✨
