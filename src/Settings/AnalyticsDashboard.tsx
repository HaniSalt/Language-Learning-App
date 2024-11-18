import { FunctionalComponent, h } from 'preact';

export const AnalyticsDashboard: FunctionalComponent = () => {
  const stats = {
    cardsStudied: 50,
    decksCompleted: 3,
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p>Cards Studied: {stats.cardsStudied}</p>
      <p>Decks Completed: {stats.decksCompleted}</p>
    </div>
  );
};
