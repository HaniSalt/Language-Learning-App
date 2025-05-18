import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { doSignOut } from '../firebase/auth';
import { auth } from '../firebase/firebase'; // Adjust this import to match your Firebase setup
import './Profile.less'; // Create this file for styling

interface ProfileProps {
  // Add any props if needed
}

const Profile: FunctionalComponent<ProfileProps> = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user data
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
    setIsLoading(false);
  }, []);

  const handleSignOut = async () => {
    try {
      await doSignOut();
      console.log('Signed out successfully');
      // No need to redirect - the auth state listener in App will handle this
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div class="profile-container">
      <h2>User Profile</h2>
      <div class="profile-info">
        <p><strong>Email:</strong> {userEmail}</p>
        {/* Add more user information here as needed */}
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