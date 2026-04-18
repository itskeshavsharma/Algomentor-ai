export default async function handler(req, res) {
    const { prompt } = req.body;
    
    const API_KEY = process.env.AIzaSyDW-FEIX7B6AeTJaNsrWVRpwFIYCnjW7FY; 
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent";

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch AI" });
    }
}