// Login.tsx
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Define an interface for your decoded Google user data.
interface GoogleUser {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    // Add additional fields as needed.
}

const GoogleButton = () => {
    const navigate = useNavigate();
    const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            try {
                const decoded: GoogleUser = jwtDecode(credentialResponse.credential);
                console.log("Decoded user info:", decoded);
                // You can now send the token or decoded user info to your backend if needed.
            } catch (error) {
                console.error("Error decoding token:", error);
            }
            finally {
                navigate("/home");
            }
        } else {
            console.error("No credential received");
        }
    };

    const handleLoginError = () => {
        console.error("Login Failed");
    };

    return (
        <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} theme="filled_black"/>
    );
};

export default GoogleButton;
