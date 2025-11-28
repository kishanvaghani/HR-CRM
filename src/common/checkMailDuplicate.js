const checkEmail = async (email) => {
  if (!email) return setEmailUsed(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interviews/check-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

    const data = await res.json();
    setEmailUsed(data.exists);
  } catch (err) {
    console.log("Email check error:", err);
  }
};
