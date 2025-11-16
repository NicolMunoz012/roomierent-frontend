const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/favorites`;

export async function getFavoriteIds(authToken: string): Promise<number[]> {
  const res = await fetch(`${API_URL}/ids`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export async function getFavorites(authToken: string): Promise<any[]> {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export async function isFavorite(propertyId: number, authToken: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/status/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return false;

  const data = await res.json();
  return Boolean(data?.favorite);
}

export async function addFavorite(propertyId: number, authToken: string): Promise<{ favoriteCount: number }> {
  const res = await fetch(`${API_URL}/${propertyId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo agregar a favoritos");
  return res.json();
}

export async function removeFavorite(propertyId: number, authToken: string): Promise<{ favoriteCount: number }> {
  const res = await fetch(`${API_URL}/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo eliminar de favoritos");
  return res.json();
}
