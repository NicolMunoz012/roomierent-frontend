const BASE_URL = "http://localhost:8080/api/favorites";

export async function getFavoriteIds(authEmail: string): Promise<number[]> {
  const res = await fetch(`${BASE_URL}/ids`, {
    headers: { Authorization: authEmail },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getFavorites(authEmail: string): Promise<any[]> {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: authEmail },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function isFavorite(propertyId: number, authEmail: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/status/${propertyId}`, {
    headers: { Authorization: authEmail },
    cache: "no-store",
  });
  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data?.favorite);
}

export async function addFavorite(propertyId: number, authEmail: string): Promise<{ favoriteCount: number }> {
  const res = await fetch(`${BASE_URL}/${propertyId}`, {
    method: "POST",
    headers: { Authorization: authEmail },
  });
  if (!res.ok) throw new Error("No se pudo agregar a favoritos");
  return res.json();
}

export async function removeFavorite(propertyId: number, authEmail: string): Promise<{ favoriteCount: number }> {
  const res = await fetch(`${BASE_URL}/${propertyId}`, {
    method: "DELETE",
    headers: { Authorization: authEmail },
  });
  if (!res.ok) throw new Error("No se pudo eliminar de favoritos");
  return res.json();
}