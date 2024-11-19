import { FunctionalComponent, h } from 'preact';
import './footerStyles.less';

export const Footer: FunctionalComponent = () => {
  return (
    <footer class="footer">
      <div class="footer-nav">
        <a href="#" onClick={() => window.scrollTo(0, 0)}>
          Back to Top
        </a>
        |
        <a href="#" onClick={() => alert('Contact us at support@example.com')}>
          Contact
        </a>
        |
        <a href="#" onClick={() => alert('Terms and Conditions')}>
          Terms
        </a>
      </div>
      <div class="social-media">
        <a href="https://twitter.com" target="_blank" rel="noopener">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener">
          <i class="fab fa-facebook"></i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener">
          <i class="fab fa-instagram"></i>
        </a>
      </div>
      <p>&copy; 2023 My Language Learning App</p>
    </footer>
  );
};
