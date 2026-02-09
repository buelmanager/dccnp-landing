/**
 * Quote Cart Store
 * localStorage-based quote cart for signage shop
 * Dispatches 'quote-cart-updated' CustomEvent on changes
 */

export interface QuoteCartItem {
  id: string;           // unique item ID (generated)
  productId: string;    // product ID from products.json
  productSlug: string;  // product slug for linking
  productName: string;  // display name
  thumbnail: string;    // thumbnail URL
  categoryName: string; // category display name
  priceRange: string;   // price range string
  options: {
    size?: string;
    material?: string;
    finish?: string;
    lighting?: string;
  };
  quantity: number;
  memo: string;        // customer memo/notes
  addedAt: string;     // ISO date string
}

const STORAGE_KEY = 'quoteCart';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getCart(): QuoteCartItem[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCart(items: QuoteCartItem[]): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent('quote-cart-updated', {
        detail: { items, count: items.length },
      })
    );
  } catch {
    // localStorage might be full or unavailable
    console.warn('[QuoteCart] Failed to save cart to localStorage.');
  }
}

export function addToCart(item: Omit<QuoteCartItem, 'id' | 'addedAt'>): void {
  const cart = getCart();
  const newItem: QuoteCartItem = {
    ...item,
    id: generateId(),
    addedAt: new Date().toISOString(),
  };
  cart.push(newItem);
  saveCart(cart);
}

export function removeFromCart(id: string): void {
  const cart = getCart();
  const filtered = cart.filter((item) => item.id !== id);
  saveCart(filtered);
}

export function updateQuantity(id: string, quantity: number): void {
  const cart = getCart();
  if (quantity <= 0) {
    saveCart(cart.filter((item) => item.id !== id));
    return;
  }
  const updated = cart.map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
  saveCart(updated);
}

export function updateMemo(id: string, memo: string): void {
  const cart = getCart();
  const updated = cart.map((item) =>
    item.id === id ? { ...item, memo } : item
  );
  saveCart(updated);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartItems(): QuoteCartItem[] {
  return getCart();
}

export function getCartCount(): number {
  return getCart().length;
}
