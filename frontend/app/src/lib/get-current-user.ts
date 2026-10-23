import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCurrentUser() {
  const cookieStore = await cookies();

  console.log("SERVER COOKIES:", cookieStore.getAll());

  const accessToken = cookieStore.get("accessToken")?.value;


  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });



  if (!response.ok) {
    console.log("ME ERROR:", await response.text());
    return null;
  }

  const user = await response.json();

  return user;
}
