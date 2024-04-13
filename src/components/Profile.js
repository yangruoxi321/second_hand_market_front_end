// Profile.js
import React from "react";
import { useLocation } from "react-router-dom";

function Profile() {
    const location = useLocation();
    const profile = location.state?.profile;

    if (!profile) {
        return <div>No profile data available</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>ID: {profile.id}</p>
            <p>Email: {profile.email}</p>
            <p>Username: {profile.userName}</p>
            <p>Seller Rate: {profile.sellerRate}</p>
        </div>
    );
}

export default Profile;