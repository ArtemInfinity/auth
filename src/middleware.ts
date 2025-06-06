import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes

} from "@/routes";

const {auth} = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const {nextUrl} = req;
  

  /**
   * console.log(nextUrl)
   * {
  href: 'http://localhost:3000/auth/login',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/auth/login',
  search: '',
  searchParams: URLSearchParams {  },
  hash: ''
}
   */

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if(isApiAuthRoute){
    return null;
  }

  if(isAuthRoute){
    if(isLoggedIn){
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
  }

  if(!isLoggedIn || !isPublicRoute){
    return Response.redirect(new URL("/auth/login", nextUrl))
  }

  return null;
});



export const config = { 
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
