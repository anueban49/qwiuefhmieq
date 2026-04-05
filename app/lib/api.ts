const API = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // ← Always attached!
      ...options.headers,
    },
  });


  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
    throw new Error("Unauthorized");
  }

  return res;
}