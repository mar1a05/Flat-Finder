import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

const Homepage = () => {
    const { user } = useAuth();
    console.log(user)

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Link to="/">Products</Link><br/>
            <Link to="/update-password">Update password</Link><br/>
            <Link to="/update-profile">Update profile</Link><br/>
            <Link to="/delete-profile">Delete profile</Link><br/>
            {user.data.role === "admin" ? <Link to="/all-users">All Users</Link> : null}
            <div>Hello, {user?.data?.name || "Guest"}</div>
        </div>
    );
};

export default Homepage;