import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { invoke } from "@tauri-apps/api/core";
import "./GoogleButton.scss";

const GoogleButton = () => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log("Token response:", tokenResponse);
            // Fetch the user's info with the access token
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                },
            })
                .then((res) => res.json())
                .then((userData) => {
                    console.log("Fetched user data:", userData);
                    // Save the user data to the backend
                    const googleUser = {
                        name: userData.name,
                        email: userData.email,
                    }
                    console.log(invoke("greet", { user: googleUser }));
                    navigate("/home");
                })
                .catch((error) => {
                    console.error("Failed to fetch user info:", error);
                });
        },
        onError: () => {
            console.error("Login Failed");
        },
    });

    return (
        <div className="google-button" onClick={() => login()}>
            <span>Continue with Google</span>
            <FaGoogle />
        </div>
    );
};

export default GoogleButton;