export async function apiFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000").trim();
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
