async function askGemini() {
  const userInput = document.getElementById("prompt").value.trim();
  if (!userInput) {
    alert("Please type something!");
    return;
  }

  document.getElementById("output").textContent = "Loading...";

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userInput })
    });

    const data = await res.json();

    if (data.error) {
      document.getElementById("output").textContent = "Error: " + data.error;
      return;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    document.getElementById("output").textContent = text;

  } catch (err) {
    document.getElementById("output").textContent = "Request failed: " + err.message;
  }
}
