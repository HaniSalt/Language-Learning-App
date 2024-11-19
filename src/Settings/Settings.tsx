import { FunctionalComponent, h } from 'preact';
import { ThemeToggle } from './ThemeToggle';
import { FontSizeAdjuster } from './FontSizeAdjuster';

export const Settings: FunctionalComponent = () => {
  return (
    <div>
      <h2>Settings</h2>
      <ThemeToggle />
      <FontSizeAdjuster />
    </div>
  );
};
