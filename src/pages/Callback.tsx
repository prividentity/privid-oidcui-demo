import React, { useEffect } from 'react';
import { useAuth } from "../context/authContext";

const LoginCallback = () => {
  const { completeLogin, tokens, isAuthenticated } = useAuth();

//   useEffect(() => {
//     completeLogin();
//   }, [completeLogin]);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h2>Login Successful</h2>
          {/* Debug or development only: Display tokens */}
          <div>
            <strong>ID Token:</strong> {tokens.idToken}
          </div>
          <div>
            <strong>Access Token:</strong> {tokens.accessToken}
          </div>
          <button onClick={() => alert('Navigate to Dashboard')}>Continue to Dashboard</button>
        </>
      ) : (
        <p>Authenticating...</p>
      )}
    </div>
  );
};

export default LoginCallback;
