export const corsConfig = {
    origin: ['http://localhost:5173', 'https://datagaze-front.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };