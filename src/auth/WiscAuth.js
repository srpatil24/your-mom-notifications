import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export const authenticateWithWisc = async () => {
  // Get the redirect URL for your app
  const redirectUrl = Linking.createURL('auth');
  
  try {
    // Open auth session with UW-Madison login
    const result = await WebBrowser.openAuthSessionAsync(
      'https://login.wisc.edu/idp/profile/SAML2/Redirect/SSO',
      redirectUrl,
      {
        preferEphemeralSession: true, // Don't persist cookies
        showTitle: true,
        enableDefaultShareMenuItem: false,
      }
    );

    if (result.type === 'success') {
      // Extract any tokens/cookies from the URL if needed
      const responseUrl = result.url;
      return {
        success: true,
        url: responseUrl
      };
    } else {
      // User cancelled or dismissed
      return {
        success: false,
        error: 'Authentication cancelled'
      };
    }

  } catch (error) {
    console.error('Auth error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};