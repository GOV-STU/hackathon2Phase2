# Next.js Development Skill

## Overview
Expert guidance for building modern web applications with Next.js 14+ using the App Router, TypeScript, and React Server Components.

## Core Principles

### 1. App Router Architecture
- Use the `app/` directory for all routes
- Leverage file-based routing with folders and `page.tsx` files
- Implement layouts with `layout.tsx` for shared UI
- Use `loading.tsx` for loading states and `error.tsx` for error boundaries
- Create route groups with `(folder)` for organization without affecting URL structure

### 2. Server vs Client Components
**Default to Server Components** for better performance:
- Server Components (default): No `"use client"` directive needed
- Fetch data directly in components
- Access backend resources securely
- Reduce JavaScript bundle size
- Better SEO and initial page load

**Use Client Components when you need**:
- Interactive event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, useContext, etc.)
- Browser-only APIs (localStorage, window, etc.)
- Third-party libraries that depend on client-side features

```typescript
// Server Component (default)
async function ProductList() {
  const products = await fetchProducts(); // Direct data fetching
  return <div>{products.map(p => <ProductCard key={p.id} {...p} />)}</div>;
}

// Client Component
"use client";
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 3. Data Fetching Patterns

**Server Components (Recommended)**:
```typescript
// Direct async/await in Server Components
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // Static (default)
    // cache: 'no-store', // Dynamic
    // next: { revalidate: 3600 } // ISR (revalidate every hour)
  });
  const json = await data.json();
  return <div>{json.title}</div>;
}
```

**Client Components**:
```typescript
"use client";
import { useEffect, useState } from 'react';

function ClientData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
}
```

**Server Actions** (for mutations):
```typescript
// app/actions.ts
"use server";

export async function createTodo(formData: FormData) {
  const title = formData.get('title');
  // Database operation
  await db.todos.create({ title });
  revalidatePath('/todos');
}

// In component
import { createTodo } from './actions';

function TodoForm() {
  return (
    <form action={createTodo}>
      <input name="title" />
      <button type="submit">Add</button>
    </form>
  );
}
```

### 4. Routing & Navigation

**File Structure**:
```
app/
├── page.tsx              # / route
├── layout.tsx            # Root layout
├── about/
│   └── page.tsx          # /about route
├── blog/
│   ├── page.tsx          # /blog route
│   └── [slug]/
│       └── page.tsx      # /blog/[slug] dynamic route
└── dashboard/
    ├── layout.tsx        # Nested layout
    ├── page.tsx          # /dashboard route
    └── settings/
        └── page.tsx      # /dashboard/settings route
```

**Navigation**:
```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Declarative navigation
<Link href="/about">About</Link>
<Link href={`/blog/${post.slug}`}>Read More</Link>

// Programmatic navigation (Client Component only)
"use client";
function NavigateButton() {
  const router = useRouter();
  return <button onClick={() => router.push('/dashboard')}>Go</button>;
}
```

**Dynamic Routes**:
```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}

// Generate static params at build time
export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

### 5. Layouts and Templates

**Root Layout** (required):
```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>My App</header>
        {children}
        <footer>© 2024</footer>
      </body>
    </html>
  );
}
```

**Nested Layouts**:
```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}
```

### 6. API Routes

```typescript
// app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const todos = await fetchTodos();
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const todo = await createTodo(body);
  return NextResponse.json(todo, { status: 201 });
}

// Dynamic route: app/api/todos/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const todo = await fetchTodo(params.id);
  return NextResponse.json(todo);
}
```

### 7. Metadata & SEO

```typescript
// Static metadata
export const metadata = {
  title: 'My App',
  description: 'App description',
};

// Dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```

### 8. Image Optimization

```typescript
import Image from 'next/image';

// Local images
import logo from './logo.png';
<Image src={logo} alt="Logo" />

// Remote images (configure in next.config.js)
<Image
  src="https://example.com/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For LCP images
/>
```

### 9. Environment Variables

```typescript
// Server-side only (secure)
const apiKey = process.env.API_KEY;

// Client-side (must prefix with NEXT_PUBLIC_)
const publicKey = process.env.NEXT_PUBLIC_API_URL;
```

### 10. TypeScript Best Practices

```typescript
// Page props
type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page({ params, searchParams }: PageProps) {
  // ...
}

// Layout props
type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function Layout({ children, params }: LayoutProps) {
  // ...
}
```

## Common Patterns

### Loading States
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

### Error Handling
```typescript
// app/dashboard/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Not Found
```typescript
// app/not-found.tsx
export default function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

// Trigger programmatically
import { notFound } from 'next/navigation';

async function Page({ params }: { params: { id: string } }) {
  const data = await fetchData(params.id);
  if (!data) notFound();
  return <div>{data.title}</div>;
}
```

### Parallel Routes & Intercepting Routes
```typescript
// app/@modal/(.)photo/[id]/page.tsx - Intercept route
// app/@modal/default.tsx - Default slot
// app/layout.tsx - Consume slots
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

## Performance Optimization

1. **Use Server Components by default** - Reduce client-side JavaScript
2. **Implement streaming with Suspense** - Progressive rendering
3. **Optimize images** - Use Next.js Image component
4. **Code splitting** - Automatic with dynamic imports
5. **Font optimization** - Use next/font
6. **Caching strategies** - Configure fetch cache options

```typescript
// Streaming with Suspense
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

## Common Pitfalls to Avoid

1. **Don't use "use client" unnecessarily** - Keep components as Server Components when possible
2. **Don't fetch data in Client Components** - Use Server Components or API routes
3. **Don't forget to handle loading and error states**
4. **Don't use useEffect for data fetching in Server Components** - Use async/await directly
5. **Don't mix Server and Client Component patterns incorrectly** - Can't pass functions as props to Client Components

## Quick Reference

| Task | Solution |
|------|----------|
| Create a page | Add `page.tsx` in app directory |
| Add navigation | Use `<Link>` from `next/link` |
| Fetch data | Use async/await in Server Components |
| Handle forms | Use Server Actions with `"use server"` |
| Add interactivity | Use Client Components with `"use client"` |
| Create API endpoint | Add `route.ts` in `app/api` directory |
| Add metadata | Export `metadata` object or `generateMetadata` |
| Show loading state | Add `loading.tsx` file |
| Handle errors | Add `error.tsx` file |
| 404 page | Add `not-found.tsx` file |

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
