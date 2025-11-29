import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL = "http://localhost:4000/api/forms/user";

    async function loadForms() {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("userToken");

            if (!token) {
                setError("User not logged in.");
                setLoading(false);
                return;
            }

            const res = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setForms(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch forms.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadForms();
    }, []);

    return (
        <div style={{ padding: 30 }}>
            <h1>Your Forms</h1>

            {loading && <p>Loading...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && forms.length === 0 && <p>No forms found.</p>}

            <ul>
                {forms.map((f) => (
                    <li key={f._id} style={{ marginBottom: 8 }}>
                        <b>{f.summary}</b> — {new Date(f.createdAt).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
