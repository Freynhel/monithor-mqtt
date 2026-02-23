import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { headers } from "next/headers";
import { redirect } from "next/dist/client/components/navigation";

export const auth0 = new Auth0Client();

export async function setSession() {
	const session = await auth0.getSession();
	
	/* Get the current pathname from headers and skip redirect if 
	we're already inside an Auth0 route or login page */
	const currentPath = (await headers()).get("x-invoke-pathname") || "";
	const isAuthRoute =
		currentPath.startsWith("/auth") || currentPath.startsWith("/login");

	if (!session && !isAuthRoute) {
		redirect("/auth/login");
	}

	return session;
}