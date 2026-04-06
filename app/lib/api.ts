

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
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