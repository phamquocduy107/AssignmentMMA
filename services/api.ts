import axios from 'axios';
import { Handbag } from '@/types/handbag';

// Loaded from .env → EXPO_PUBLIC_MOCKAPI_BASE_URL
const MOCKAPI_BASE_URL = process.env.EXPO_PUBLIC_MOCKAPI_BASE_URL ?? '';

if (!MOCKAPI_BASE_URL) {
  console.warn('[api] EXPO_PUBLIC_MOCKAPI_BASE_URL is not set. Check your .env file.');
}

const api = axios.create({
  baseURL: MOCKAPI_BASE_URL,
  timeout: 10000,
});

export async function fetchHandbags(): Promise<Handbag[]> {
  const response = await api.get<Handbag[]>('/');
  return response.data;
}

export async function fetchHandbagById(id: string): Promise<Handbag> {
  const response = await api.get<Handbag>(`/${id}`);
  return response.data;
}
