// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || req.cookies.get('auth-token');

  console.log('Requested Path:', req.nextUrl.pathname);
  console.log('Token:', token);

  // Permitir acesso à página de login sem autenticação
  if (req.nextUrl.pathname === '/login') {
    console.log('Rota login permitida');
    return NextResponse.next();
  }

  // Proteger todas as outras rotas
  if (!token) {
    console.log('Não tem Token!');
    // Redirecionar para a página de login se o token não estiver presente
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Permitir acesso às outras rotas se o token estiver presente
  console.log('Token encontrado. Acesso permitido.');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\.).*)'], // Aplica a lógica a todas as rotas, exceto arquivos estáticos e outras páginas especificadas
};
