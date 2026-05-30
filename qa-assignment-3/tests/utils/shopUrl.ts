import { readFileSync } from 'fs';
import { resolve } from 'path';

let cached: string | null = null;

export function getShopUrl(): string {
  if (cached) return cached;
  // Workers read from the file written by globalSetup
  try {
    cached = readFileSync(resolve(__dirname, '../../.shopurl'), 'utf-8').trim();
  } catch {
    cached = process.env.SHOP_BASE_URL ?? 'https://demo.prestashop.com';
  }
  return cached;
}
