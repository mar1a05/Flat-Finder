import { useState } from "react";
import Cookies from "js-cookie";

const UpdatePassword = () => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null); 

        const token = Cookies.get("token");
        try {
            const response = await fetch("http://localhost:3000/updatePassword", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer ${token}`,
                },
                body: JSON.stringify({ password, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update password");
            }

            setMessage({ type: "success", text: "Password updated successfully!" });
            setPassword("");
            setNewPassword("");
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="password"
                    placeholder="Current Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={!password || !newPassword || loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
            {message && (
                <p style={{ color: message.type === "error" ? "red" : "green" }}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default UpdatePassword;
