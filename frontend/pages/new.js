import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NewForm() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [schema, setSchema] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("userToken"));
        }
    }, []);

    const GENERATE_API_URL = 'http://localhost:4000/api/forms';

    async function generate(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!token) {
            setError("User not logged in");
            router.push('/login');
            return;
        }

        try {
            const res = await axios.post(
                GENERATE_API_URL,
                { prompt },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSchema(res.data.schema);
            alert("Form generated!");
            router.push("/dashboard");

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Error generating form");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Create New Form</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={generate}>
                <label>Enter form prompt:</label>
                <textarea
                    style={{ width: "100%", height: "120px", marginTop: "10px" }}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                ></textarea>

                <button type="submit" disabled={loading} style={{ marginTop: "15px" }}>
                    {loading ? "Generating..." : "Generate Form"}
                </button>
            </form>

            {schema && (
                <pre style={{ background: "#eee", padding: "15px", marginTop: "20px" }}>
                    {JSON.stringify(schema, null, 2)}
                </pre>
            )}
        </div>
    );
}
