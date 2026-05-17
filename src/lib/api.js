export async function apiFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const baseUrl = "http://localhost:5000";
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
