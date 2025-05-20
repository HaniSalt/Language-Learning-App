import { FunctionalComponent } from 'preact';
import { doSignOut } from '../firebase/auth';
import './Profile.less';
import { User as FirebaseUser } from 'firebase/auth';

export interface ProfileProps {
  currentUser: FirebaseUser | null; // Accept currentUser as a prop
}

const Profile: FunctionalComponent<ProfileProps> = ({ currentUser }) => {
  const handleSignOut = async () => {
    try {
      await doSignOut();
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      alert(`Error signing out: ${error.message}`);
    }
  };

  // App.tsx's ensureLoggedIn should prevent this component from rendering if currentUser is null
  if (!currentUser) {
    return <div>Loading profile or not logged in...</div>;
  }

  return (
    <div class="profile-container">
      <h2>User Profile</h2>
      <div class="profile-info">
        <p><strong>Email:</strong> {currentUser.email}</p>
        {currentUser.displayName && <p><strong>Display Name:</strong> {currentUser.displayName}</p>}
      </div>
      <div class="profile-actions">
        <button onClick={handleSignOut} class="sign-out-btn">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;