import { FunctionalComponent} from 'preact';
import './homeStyles.less';

export const Home: FunctionalComponent = () => {
  // Displays the basic information on the home page
  // Things such as welcomming the user and informing them about features.
  return (
    <main class="home">
      <h1>Welcome to the Language Learning App</h1>
      <p>Start creating and studying your flashcards today!</p>
      <div class="features">
        <div class="feature">
          <h3>Create Custom Decks</h3>
          <p>Build personalized flashcards with text, images, and audio.</p>
        </div>
        <div class="feature">
          <h3>Track Your Progress</h3>
          <p>Monitor your learning journey with detailed analytics.</p>
        </div>
        <div class="feature">
          <h3>Community Sharing</h3>
          <p>Share decks with others and learn collaboratively.</p>
        </div>
      </div>
    </main>
  );
};
