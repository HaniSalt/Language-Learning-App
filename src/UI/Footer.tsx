import { FunctionalComponent } from 'preact';
import './footerStyles.less';

// Footer component definition
export const Footer: FunctionalComponent = () => {
  return (
    <footer class="footer">
      {/* Navigation links in the footer */}
      <div class="footer-nav">
        {/* Link to scroll back to the top of the page */}
        <a href="#" onClick={() => window.scrollTo(0, 0)}>
          Back to Top
        </a>
        {/* Contact link that triggers an alert with contact info */}
        <a href="#" onClick={() => alert('Contact us at support@example.com')}>
          Contact
        </a>
        {/* Terms link that triggers an alert with terms and conditions */}
        <a href="#" onClick={() => alert('Terms and Conditions')}>
          Terms
        </a>
      </div>
      {/* Social media icons */}
      <div class="social-media">
        {/* Twitter link opening in a new tab */}
        <a href="https://twitter.com" target="_blank" rel="noopener">
          <i class="fab fa-twitter"></i>
        </a>
        {/* Facebook link opening in a new tab */}
        <a href="https://facebook.com" target="_blank" rel="noopener">
          <i class="fab fa-facebook"></i>
        </a>
        {/* Instagram link opening in a new tab */}
        <a href="https://instagram.com" target="_blank" rel="noopener">
          <i class="fab fa-instagram"></i>
        </a>
      </div>
      {/* Footer copyright text */}
      <p>&copy; 2024 My Language Learning App</p>
    </footer>
  );
};
