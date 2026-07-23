"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** One service line in the bag — Amazon-style cart item */
export type CartItem = {
  id: string;
  name: string;
  categoryId: string;
  categoryTitle: string;
  price: string;
  time: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  hasItem: (name: string, categoryId: string) => boolean;
};

const CART_KEY = "lunara-service-cart";

const CartContext = createContext<CartContextValue | null>(null);

function itemId(name: string, categoryId: string) {
  return `${categoryId}::${name}`;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const id = itemId(item.name, item.categoryId);
    setItems((prev) => {
      if (prev.some((p) => p.id === id)) return prev; // already in bag
      return [...prev, { ...item, id }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const hasItem = useCallback(
    (name: string, categoryId: string) =>
      items.some((p) => p.id === itemId(name, categoryId)),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addItem,
      removeItem,
      clearCart,
      hasItem,
    }),
    [items, addItem, removeItem, clearCart, hasItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}

/** Shopping bag next to each service — add to cart like Amazon */
export function AddToBagButton({
  name,
  categoryId,
  categoryTitle,
  price,
  time,
}: {
  name: string;
  categoryId: string;
  categoryTitle: string;
  price: string;
  time: string;
}) {
  const { addItem, hasItem } = useCart();
  const inBag = hasItem(name, categoryId);

  return (
    <button
      type="button"
      className={`service-bag-btn${inBag ? " service-bag-btn--in" : ""}`}
      aria-label={inBag ? `${name} is in your bag` : `Add ${name} to bag`}
      title={inBag ? "In your bag" : "Add to bag"}
      onClick={() => {
        if (inBag) return;
        addItem({ name, categoryId, categoryTitle, price, time });
      }}
    >
      <span aria-hidden className="service-bag-icon">
        {inBag ? "✓" : "+"}
      </span>
    </button>
  );
}

/** Header Book with bag count */
export function BookNowWithBag() {
  const { count } = useCart();
  return (
    <Link href="/book" className="button-primary book-header-btn">
      Book
      {count > 0 ? (
        <span className="cart-badge" aria-label={`${count} in bag`}>
          {count}
        </span>
      ) : null}
    </Link>
  );
}

/** Amazon-style bag list on the book / checkout page */
export function CartCheckoutList() {
  const { items, removeItem, clearCart, count } = useCart();

  if (count === 0) {
    return (
      <div className="cart-empty">
        Bag is empty.{" "}
        <Link href="/#services">Add services</Link> with +, then come back.
      </div>
    );
  }

  return (
    <div className="cart-checkout">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--text)]">
          Your bag ({count})
        </p>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--accent-dark)]"
        >
          Clear bag
        </button>
      </div>
      <ul className="cart-checkout-list">
        {items.map((item) => (
          <li key={item.id} className="cart-checkout-row">
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)]">{item.name}</p>
              <p className="text-xs text-[var(--text-soft)]">
                {item.categoryTitle} · {item.time}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <p className="text-sm font-semibold text-[var(--accent-dark)]">
                {item.price}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent-dark)]"
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
