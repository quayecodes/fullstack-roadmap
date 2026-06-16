import { Lesson, Quiz, CodeFile } from "./types";

export const initialRoadmapLessons: Lesson[] = [
  {
    id: "lesson-intro",
    title: "1. Next.js Foundations",
    category: "Fundamentals",
    difficulty: "Beginner",
    shortDescription: "Understand Next.js, its core advantages over basic React, and its compilation/framework nature.",
    fullContent: `### What is Next.js?

Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js provides additional features and optimizations that make web experiences faster, more reliable, and SEO-friendly out of the box.

Under the hood, Next.js abstracts and configures tooling needed for React, such as bundling, compiling, transpiling, and server rendering. This enables you to build scalable applications without getting bogged down in Webpack or Babel configurations.

### Key Advantages of Next.js over Pure React SPA

1. **Flexible Rendering Strategies**: Rather than rendering everything on the client (browser-side), Next.js supports Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), and modern React Server Components (RSC) natively.
2. **Built-in Optimizations**: automatic image compression via \`<Image />\`, font loading via \`next/font\`, script loading optimizations via \`<Script />\`, and link prefetching via \`<Link />\`.
3. **App Router File-System Routing**: Easily define layout templates and subroutes by organizing folders inside the \`app/\` directory.
4. **API Routes & Web Standards**: Built-in full-stack capabilities, permitting route handlers (\`/api/...\`) and Server Actions to execute secure NodeJS logic without standing up a separate server.

### React Server Components (RSC) Core Philosophy
By default, all components in the Next.js **App Router** are React Server Components. This is a massive paradigm shift.
They are rendered on the server before the HTML is shipped to the client, meaning:
* **Zero Client Bundle Cost**: Large libraries used inside Server Components do not Bloat your browser's JS bundle size.
* **Direct Database Queries**: You can query databases directly inside the component because it runs on your server.
* **Superior SEO**: Search engines receive complete, well-formed HTML instantly on the initial request.`,
    completed: false,
    quizId: "quiz-foundations"
  },
  {
    id: "lesson-routing",
    title: "2. Pages, Layouts, and Shared Layouts",
    category: "Routing",
    difficulty: "Beginner",
    shortDescription: "Learn to build pages, nested layouts, and manage global layouts in the directory tree.",
    fullContent: `### App Router Folder Structure

In Next.js, routes are defined by standard matching folders under the \`app/\` directory.
* **Folders** define the URL path segments.
* **Files** (such as \`page.tsx\` or \`layout.tsx\`) define the actual UI rendered for that route segment.

For example, to configure a route at \`https://app.com/about\`, you create a folder named \`about\` and place a \`page.tsx\` file inside of it:
\`\`\`
app/
├── layout.tsx     <-- Root Shared Layout (Header/Footer)
├── page.tsx       <-- Home Page UI (maps to /)
└── about/
    └── page.tsx   <-- About Page UI (maps to /about)
\`\`\`

### Distinct File Roles in App Router

Next.js uses a set of reserved file names to build structured route behavior:
1. **\`page.tsx\`**: Defines the unique visual content of a route. The segment does not render anything without a matching \`page.tsx\`.
2. **\`layout.tsx\`**: Defines UI shared across multiple routes. It accepts a children prop, wrapping all child routes. It retains its state across link changes and does not re-render.
3. **\`loading.tsx\`**: Expresses an instant loading skeleton built on top of React Suspense, shown during navigation delays automatically.
4. **\`error.tsx\`**: Captures client or server errors within a route boundary and gives you a localized fallback view without crashing the entire app.

### Nested Layouts Visual Chain
When you navigate to a nested folder, say \`/dashboard/analytics\`, Next.js maps it into a structural component tree:
\`\`\`
<RootLayout>
  <DashboardLayout>
    <AnalyticsPage />
  </DashboardLayout>
</RootLayout>
\`\`\`
Only the content of \`<AnalyticsPage />\` changes, whereas existing layouts maintain scroll positions and state!`,
    completed: false,
    quizId: "quiz-routing"
  },
  {
    id: "lesson-rsc",
    title: "3. React Server vs. Client Components",
    category: "Fundamentals",
    difficulty: "Intermediate",
    shortDescription: "Understand the 'use client' boundary and when to choose Server or Client paradigms.",
    fullContent: `### Server vs. Client Components

Next.js simplifies full-stack development by offering two architectural models for React components:

| Capability / Attribute | React Server Components (Default) | Client Components ("use client") |
| :--- | :--- | :--- |
| **Execution Environment** | Executes exclusively on the **Server**. | Hydrates and runs interactive logic in the **Browser** (and initially prerenders HTML on the server). |
| **Database Queries** | Can fetch data directly from databases/external APIs. | Must query a public API endpoint. |
| **Interactive Triggers** | Cannot use hooks like \`useState\`, \`useEffect\`, or standard event handlers (\`onClick\`). | Supports all standard React hooks and event listeners. |
| **API Keys & Secrets** | Secrets are kept 100% secure; credentials never hit the client. | Exposed configuration; must rely on public backend Proxies. |
| **Bundle Impact** | Zero bundle impact on client weight. | Included in the Javascript loaded and hydrated by the browser. |

### Designing the "Client Boundary"

The keyword \`"use client"\` is not a magic compiler switch that shifts everything onto the browser. It defines the **boundary** between the server and the client components.
* Once a file declares \`"use client"\` at the top, **it and all files imported into it** are compiled as client-side components.
* Rule of thumb: keep client components at the leaves of your tree! For example, load static lists as Server Components, and import a tiny, localized Interactive Button that has \`"use client"\` inside to handle clicks.

### Best Practice Example

\`\`\`tsx
// ✅ SERVER COMPONENT (Default - parent)
import { fetchUsers } from "@/lib/db";
import FavoriteToggle from "./FavoriteToggle"; // Client component

export default async function UserList() {
  const users = await fetchUsers(); // Run directly on server DB!
  return (
    <div>
      {users.map(u => (
        <div key={u.id} className="flex justify-between items-center py-2 border-b">
          <span>{u.name}</span>
          <FavoriteToggle id={u.id} /> {/* Pass simple data across the boundary */}
        </div>
      ))}
    </div>
  );
}
\`\`\``,
    completed: false,
    quizId: "quiz-components"
  },
  {
    id: "lesson-dynamic",
    title: "4. Dynamic Routing & Segment Grabbing",
    category: "Routing",
    difficulty: "Intermediate",
    shortDescription: "Learn about [slug] syntax, searchParameters, Route Groups, and Catch-All paths.",
    fullContent: `### Dynamic Route Segments

Often, routes cannot be hardcoded (e.g., custom blog articles or profile portals). In Next.js, you translate parameter routes into brackets **\`[folderName]\`**:
* \`app/blog/[id]/page.tsx\` matches any route resembling \`/blog/123\` or \`/blog/nextjs-rules\`.
* Inside your page element, you retrieve these parameters via props:

\`\`\`tsx
export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;
  
  return <div className="p-4">Reading article #{postId}</div>;
}
\`\`\`

### Dynamic Segments Advanced Configurations

1. **Catch-all Segment (\`[...slug]\`)**:
   Matches nested layers. For example, \`app/shop/[...slug]/page.tsx\` matches \`/shop/clothes\`, \`/shop/clothes/shoes\`, etc. params represents an array of segments: \`{ slug: ['clothes', 'shoes'] }\`.
2. **Optional Catch-all (\`[[...slug]]\`)**:
   Matches even the base URL. For example, \`app/shop/[[...slug]]/page.tsx\` matches \`/shop\` as well, without needing a standalone index folder!

### Route Groups (\`(groupName)\`)

Sometimes you want to arrange files structurally for organizational neatness without injecting segments into the user's browser URL.
You achieve this using parentheses:
* \`app/(marketing)/about/page.tsx\` matches simply \`/about\`.
* This lets you isolate custom layouts. Routes in \`app/(marketing)/...\` can share a marketing header layout, while routes inside \`app/(dashboard)/...\` enjoy a completely different workspace control layout!`,
    completed: false,
    quizId: "quiz-dynamic"
  },
  {
    id: "lesson-rendering",
    title: "5. Static vs. Dynamic & Modern Caching",
    category: "Data Fetching",
    difficulty: "Advanced",
    shortDescription: "Dive deep into static site generation, dynamic rendering, revalidation, and PPR.",
    fullContent: `### Mastering Next.js Rendering Strategies

Next.js automatically determines if a page should be compiled statically (fast, pre-rendered at build time) or dynamically (built on-demand per incoming browser request).

### Static Rendering (Optimal Performance)

If a route uses static data files and doesn't read client headers or cookie arrays, Next.js builds the static HTML during production compile. This is served instantly from a global Content Delivery Network (CDN).

### Dynamic Rendering

A page is automatically forced into dynamic runtime rendering if Next.js detects:
1. **Dynamic APIs**: Calling \`cookies()\`, \`headers()\`, or checking dynamic \`searchParams\` on pages.
2. **Dynamic DB reads**: Querying a database with caching disabled.

### Incremental Static Regeneration (ISR)

ISR allows you to update static pages *without* rebuilds. You define a revalidation scale:
\`\`\`tsx
// Statically pre-rendered, checked for updates at most once every 60 seconds.
export const revalidate = 60; 

export default async function WeatherWidget() {
  const data = await fetch("https://api.weather.com");
  return <div>Weather: {data.temp}</div>;
}
\`\`\`

### Partial Prerendering (PPR) - Next.js 15 Spotlight

PPR is an exciting experimental feature. It merges the benefits of Static and Dynamic rendering on the companion route!
Next.js pre-renders the page skeleton statically (e.g. Navigation Header, product lists), and wraps dynamic components (e.g. personal shopping cart) in a React \`<Suspense>\` block.
The browser receives the static shells instantly, and the dynamic fragments stream in once their server tasks are completed!`,
    completed: false,
    quizId: "quiz-rendering"
  },
  {
    id: "lesson-serveractions",
    title: "6. Server Actions & Form Mutations",
    category: "Data Fetching",
    difficulty: "Advanced",
    shortDescription: "Submit data securely from the client UI using standard async server actions.",
    fullContent: `### Server Actions: Zero REST Endpoints Required!

Next.js Server Actions are asynchronous server-side functions that are invoked directly from client forms without composing a manual \`fetch('/api/...', { method: 'POST' })\` payload.

They are defined using the directive \`"use server"\` either at the head of the function or inside separate files.

### Standard Server Action Flow

1. Defining the server mutation file:
\`\`\`ts
// app/actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitComment(formData: FormData) {
  const message = formData.get("message") as string;
  if (!message) return { error: "Message cannot be empty." };
  
  await db.insertComment({ text: message }); // Write securely to SQL/Firestore!
  
  revalidatePath("/"); // Force Next.js to dynamically purge cache and render new comments!
  return { success: true };
}
\`\`\`

2. Hooking it to a Client Form with state helpers:
\`\`\`tsx
// app/CommentForm.tsx
"use client";

import { submitComment } from "./actions";
import { useActionState } from "react";

export default function CommentForm() {
  // useActionState handles server action pending states and return details beautifully!
  const [state, formAction, isPending] = useActionState(submitComment, null);

  return (
    <form action={formAction} className="flex gap-2">
      <input name="message" className="border p-2 rounded" required />
      <button type="submit" disabled={isPending} className="bg-blue-600 text-white p-2 text-sm rounded">
        {isPending ? "Submitting..." : "Send Message"}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
\`\`\`

### Progressive Enhancement

Because Server Actions hook into standard HTML \`form action\`, **they execute even if the client has disabled JavaScript!** The form will fall back to full-page POSTs gracefully.`,
    completed: false,
    quizId: "quiz-serveractions"
  }
];

export const quizzes: Quiz[] = [
  {
    id: "quiz-foundations",
    title: "Foundations Challenge",
    questions: [
      {
        id: "f1",
        text: "What makes all React components in Next.js App Router default to of zero runtime bundle weight?",
        options: [
          "They are automatically packaged as Web Web-Workers",
          "They are React Server Components (RSC) rendered exclusively on the server",
          "They use inline standard styles exclusively",
          "Next.js utilizes special browser compression algorithms in dynamic routers"
        ],
        correctAnswerIndex: 1,
        explanation: "By default, the Next.js App Router utilizes React Server Components which compile and run purely on your hosting server. Because they render prior to transmission, none of their dependencies are shipped to the user's browser, enabling extremely fast loading speeds."
      },
      {
        id: "f2",
        text: "Which variable prefix must be set for environment variables to be visible in the client browser?",
        options: [
          "NEXT_PUBLIC_",
          "VITE_",
          "CLIENT_SECRET_",
          "PROCESS_ENV_"
        ],
        correctAnswerIndex: 0,
        explanation: "In Next.js, environment variables are securely hidden from standard clients unless you prefix them with 'NEXT_PUBLIC_'. (Note: In Vite client apps, we use VITE_ prefix, but Next.js relies on NEXT_PUBLIC_!)"
      }
    ]
  },
  {
    id: "quiz-routing",
    title: "Routing Blueprint Challenge",
    questions: [
      {
        id: "r1",
        text: "Which structural Next.js file is persistent across page switches and retains scroll states?",
        options: [
          "page.tsx",
          "template.tsx",
          "layout.tsx",
          "loading.tsx"
        ],
        correctAnswerIndex: 2,
        explanation: "The 'layout.tsx' file is specifically built to create shared layouts that do not re-render or lose client scroll states. In contrast, 'template.tsx' re-instantiates and runs transitions every time you switch pages."
      },
      {
        id: "r2",
        text: "If you want to render localized loading skeletons for specific folder segment transitions, what file do you create?",
        options: [
          "spinner.tsx",
          "loading.tsx",
          "suspense.tsx",
          "layout.tsx"
        ],
        correctAnswerIndex: 1,
        explanation: "Place a 'loading.tsx' file inside the specific subfolder. Next.js will automatically wraps your segment's 'page.tsx' inside a <React.Suspense> fallback component with this loading shell!"
      }
    ]
  },
  {
    id: "quiz-components",
    title: "Server vs Client Boundary Challenge",
    questions: [
      {
        id: "sc1",
        text: "What occurs if you place a 'useState' count logic directly in a default, non-decorated component file under App Router?",
        options: [
          "It compiles but outputs warning logs inside developer console",
          "Next.js switches the component to dynamic on the client instantly",
          "A crash occurs during build/runtime because default components are RSC and do not support browser hooks",
          "The state compiles into localized cookies securely"
        ],
        correctAnswerIndex: 2,
        explanation: "Because default files compile as React Server Components (RSC), they execute on the host machine. Server Components do not have client states or hooks, resulting in a build-time crash. To fix this, you must write 'use client' at the top of the file."
      }
    ]
  },
  {
    id: "quiz-dynamic",
    title: "Grabbing Slugs & segments Quiz",
    questions: [
      {
        id: "d1",
        text: "If you configure an app router segment as app/product/[[...slug]]/page.tsx, which routes will match standard pages?",
        options: [
          "Only /product/sub/nested/items",
          "Any routes inside /product, including the parent '/product' directly",
          "Only /product/123",
          "It only matches queries ending with a standard file extension (.html)"
        ],
        correctAnswerIndex: 1,
        explanation: "Double bracket folder structures indicate 'Optional Catch-all' segments. It will match absolute sub-depths and even the container path itself ('/product') without crashing with Page Not Found."
      }
    ]
  },
  {
    id: "quiz-rendering",
    title: "Static vs Dynamic Rendering Challenge",
    questions: [
      {
        id: "g1",
        text: "Which of the following triggers changes the compilation strategy of a page from Static to Dynamic?",
        options: [
          "Exporting a custom interface",
          "Using standard React Context inside Client trees",
          "Calling dynamic functions like cookies() or reading request headers()",
          "Adding comments or documenting your API models"
        ],
        correctAnswerIndex: 2,
        explanation: "Next.js tracks page references. When you invoke dynamic request-specific items (like cookies(), headers() or dynamic searchParams), the system must dynamically render the page segment for that specific client request."
      }
    ]
  },
  {
    id: "quiz-serveractions",
    title: "Actions and Mutations Test",
    questions: [
      {
        id: "a1",
        text: "Explain a key advantage of leveraging Server Actions over common REST hook APIs.",
        options: [
          "Actions require CORS policies to execute globally",
          "Actions can perform mutations even when the browser has JavaScript disabled",
          "Actions are saved directly inside of modern CDN server registries",
          "Actions can only trigger SQL tables and ignore standard memory parameters"
        ],
        correctAnswerIndex: 1,
        explanation: "Next.js Server Actions leverage progressive enhancement. Since they are standard HTML action handlers under the hood, the client's browser can securely post form payloads back to our host node, running actions without relying on javascript loaders."
      }
    ]
  }
];

export const initialFiles: CodeFile[] = [
  {
    id: "root-app",
    name: "app",
    path: "app",
    isFolder: true
  },
  {
    id: "app-layout",
    name: "layout.tsx",
    path: "app/layout.tsx",
    isFolder: false,
    parentId: "root-app",
    language: "tsx",
    code: `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Custom App Router Site',
  description: 'Built with Next.js 15 Foundations',
};

// All App Router segments require a Root Layout to render.
// Next.js automatically injects standard <html> and <body> tags here!
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-indigo-900 text-white py-4 px-6 flex justify-between">
          <span className="font-bold tracking-tight">NextJS Learner Workspace</span>
          <nav className="flex gap-4 text-sm">
            <a href="/" className="hover:underline">Home</a>
            <a href="/about" className="hover:underline">About</a>
            <a href="/dashboard" className="hover:underline">Dashboard</a>
          </nav>
        </header>
        
        <main className="min-h-screen bg-slate-50 p-6">
          {children}
        </main>
        
        <footer className="bg-slate-800 text-slate-400 text-center py-6 text-xs">
          © 2026 NextJS Learning Playground
        </footer>
      </body>
    </html>
  );
}`,
    explanation: "This is the Root Layout of your application. It contains the standard HTML wrappers and serves shared layout interfaces such as default Navigation Bars or theme suppliers worldwide.",
    associatedRoute: "/"
  },
  {
    id: "app-page",
    name: "page.tsx",
    path: "app/page.tsx",
    isFolder: false,
    parentId: "root-app",
    language: "tsx",
    code: `import Link from "next/link";

// Default Page for our home route (/)
// Since this is a default component, it executes entirely on the server.
export default async function HomePage() {
  const trendingTopics = ["Layouts", "RSCs", "Server Actions", "PPR Caching"];
  
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">
        Welcome to Next.js 15 App Router!
      </h1>
      
      <p className="text-slate-600">
        You are looking at a server-side pre-rendered component list. Since this component 
        requires no client states, it costs 0 bytes of dynamic bundle size!
      </p>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="font-semibold text-slate-800">Learn What is Trending Today:</h2>
        <ul className="divide-y divide-slate-100">
          {trendingTopics.map((topic, i) => (
            <li key={i} className="py-2 text-sm text-slate-700 flex justify-between">
              <span>🚀 {topic}</span>
              <span className="text-xs text-indigo-600 font-mono">Completed</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/about" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm text-center">
          Go To About
        </Link>
        <Link href="/dashboard" className="border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg px-4 py-2 text-sm text-center">
          Open Demo Dashboard
        </Link>
      </div>
    </div>
  );
}`,
    explanation: "This default server component acts as your Root Index Route (/). It pre-renders on the server, injecting high-speed static or on-demand markup for visitors.",
    associatedRoute: "/"
  },
  {
    id: "about-folder",
    name: "about",
    path: "app/about",
    isFolder: true,
    parentId: "root-app"
  },
  {
    id: "about-page",
    name: "page.tsx",
    path: "app/about/page.tsx",
    isFolder: false,
    parentId: "about-folder",
    language: "tsx",
    code: `export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">About Next.js Routing</h1>
      <p className="text-slate-600 leading-relaxed">
        Next.js uses folder directories as segement matchers. Because this file name resides inside 
        the folder <code className="bg-slate-100 p-1 rounded font-mono font-bold">about/</code>, 
        Next.js maps this segment directly onto URL route structure at <strong>/about</strong>.
      </p>
      
      <div className="mt-6 p-4 bg-amber-50 rounded-lg text-amber-800 text-sm border border-amber-200">
        💡 <strong>Quick Fact:</strong> You don't need any complex React Routers or Switch configurations. Just make the folder and name your file page.tsx. Let Next.js handle the bundle parsing!
      </div>
    </div>
  );
}`,
    explanation: "This represents a simple static content route at /about. It resolves automatically during compilation and is heavily cached globally on CDNs.",
    associatedRoute: "/about"
  },
  {
    id: "blog-folder",
    name: "blog",
    path: "app/blog",
    isFolder: true,
    parentId: "root-app"
  },
  {
    id: "blog-slug-folder",
    name: "[id]",
    path: "app/blog/[id]",
    isFolder: true,
    parentId: "blog-folder"
  },
  {
    id: "blog-slug-page",
    name: "page.tsx",
    path: "app/blog/[id]/page.tsx",
    isFolder: false,
    parentId: "blog-slug-folder",
    language: "tsx",
    code: `interface BlogPostProps {
  params: Promise<{ id: string }>;
}

// NextJS 15 parses route variables into an async promise params
export default async function BlogPost({ params }: BlogPostProps) {
  const { id } = await params;
  
  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs bg-indigo-100 text-indigo-800 font-bold uppercase tracking-widest px-2.5 py-1 rounded">
          Dynamic Route Segment
        </span>
        <span className="text-xs text-slate-500 font-mono">app/blog/[id]/page.tsx</span>
      </div>
      
      <h1 className="text-2xl font-black text-slate-900 leading-tight">
        Viewing Blog Post: "{id.replace(/-/g, ' ')}"
      </h1>
      
      <p className="text-slate-600 mt-4 leading-relaxed">
        Because this route path segment file resides inside brackets <code>[id]/</code>, Next.js interprets this segment as a variable parameter container!
      </p>

      <div className="bg-slate-50 p-4 border rounded-lg mt-6 space-y-2">
        <p className="text-xs text-slate-500 font-bold">RESCUED PARAM DATA:</p>
        <code className="text-sm font-mono text-indigo-600 block">
          {"{"} id: "{id}" {"}"}
        </code>
      </div>
    </div>
  );
}`,
    explanation: "This represents a high-speed Parameter Route at /blog/[id]. It receives arguments inside props, query databases and render content specifically per slug dynamically.",
    associatedRoute: "/blog/1"
  },
  {
    id: "dashboard-folder",
    name: "dashboard",
    path: "app/dashboard",
    isFolder: true,
    parentId: "root-app"
  },
  {
    id: "dashboard-layout",
    name: "layout.tsx",
    path: "app/dashboard/layout.tsx",
    isFolder: false,
    parentId: "dashboard-folder",
    language: "tsx",
    code: `import Link from 'next/link';

// Nested Dashboard Layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden flex min-h-[300px]">
      {/* Sidebar specific for dashboard workspace */}
      <div className="w-56 bg-slate-900 text-slate-300 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-4">
          <p className="text-xs font-bold text-indigo-400 tracking-wider">WORKSPACE RAIL</p>
          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white">
              📊 Core Stats
            </Link>
            <Link href="/dashboard/analytics" className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white">
              📈 Analytics Graph
            </Link>
          </nav>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-2">
          Workspace v15.0
        </div>
      </div>
      
      {/* Workspace Display Area */}
      <div className="flex-1 bg-slate-50 p-6">
        {children}
      </div>
    </div>
  );
}`,
    explanation: "This represents a nested structural layout specifically for the /dashboard subtree. Any children route (like /dashboard/analytics) shares this nested sidebar automatically.",
    associatedRoute: "/dashboard"
  },
  {
    id: "dashboard-page",
    name: "page.tsx",
    path: "app/dashboard/page.tsx",
    isFolder: false,
    parentId: "dashboard-folder",
    language: "tsx",
    code: `import React from 'react';

// Main dashboard index sub-page
export default function DashboardIndex() {
  const stats = [
    { label: "Active Learners", val: "12,401", change: "+14.2%" },
    { label: "Completion Rate", val: "84.3%", change: "+2.1%" },
    { label: "Server ResponseTime", val: "48ms", change: "Optimal" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Dashboard Workspace</h2>
        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
          Live Tracker
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 uppercase">{s.label}</p>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-800">{s.val}</span>
              <span className="text-xs font-semibold text-emerald-600">{s.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    explanation: "This defines the main index subpage inside the dashboard segment (/dashboard). It is dynamic, and renders nested within the DashboardLayout container.",
    associatedRoute: "/dashboard"
  },
  {
    id: "dashboard-analytics-folder",
    name: "analytics",
    path: "app/dashboard/analytics",
    isFolder: true,
    parentId: "dashboard-folder"
  },
  {
    id: "dashboard-analytics-page",
    name: "page.tsx",
    path: "app/dashboard/analytics/page.tsx",
    isFolder: false,
    parentId: "dashboard-analytics-folder",
    language: "tsx",
    code: `export default function AnalyticsSubpage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Workspace Detailed Analytics</h2>
      <p className="text-sm text-slate-600">
        This view represents subpage routing. Notice how the Dashboard Sidebar layout persists unchanged 
        upon swapping URLs, but this area updates instantly!
      </p>

      {/* Simulated analytics graph */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-48 flex flex-col justify-between">
        <div className="flex gap-2 items-end justify-between h-32 pt-4">
          <div className="w-1/6 bg-indigo-200 hover:bg-indigo-500 h-[40%] rounded-t-md transition-all"></div>
          <div className="w-1/6 bg-indigo-200 hover:bg-indigo-500 h-[65%] rounded-t-md transition-all"></div>
          <div className="w-1/6 bg-indigo-200 hover:bg-indigo-500 h-[50%] rounded-t-md transition-all"></div>
          <div className="w-1/6 bg-indigo-300 hover:bg-indigo-500 h-[80%] rounded-t-md transition-all"></div>
          <div className="w-1/6 bg-indigo-400 hover:bg-indigo-500 h-[95%] rounded-t-md transition-all"></div>
          <div className="w-1/6 bg-indigo-500 h-[75%] rounded-t-md"></div>
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-wider font-mono text-slate-400 mt-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Weekend</span>
        </div>
      </div>
    </div>
  );
}`,
    explanation: "This is a nested sibling subroute at /dashboard/analytics. It showcases how routing structures can build dynamic multi-tiered workspaces cleanly.",
    associatedRoute: "/dashboard/analytics"
  },
  {
    id: "api-folder",
    name: "api",
    path: "app/api",
    isFolder: true,
    parentId: "root-app"
  },
  {
    id: "api-subfolder",
    name: "hello",
    path: "app/api/hello",
    isFolder: true,
    parentId: "api-folder"
  },
  {
    id: "api-route-file",
    name: "route.ts",
    path: "app/api/hello/route.ts",
    isFolder: false,
    parentId: "api-subfolder",
    language: "typescript",
    code: `import { NextResponse } from 'next/server';

// Match requests for GET at /api/hello
export async function GET() {
  const serverTime = new Date().toISOString();
  
  // Return standard JSON response securely using standard web headers
  return NextResponse.json({
    status: "success",
    message: "Greetings from Next.js server-side Route Handler!",
    timestamp: serverTime,
    data: {
      framework: "Next.js 15.0",
      nodeVersion: process.version,
      purpose: "Provide lightweight backend services natively"
    }
  });
}`,
    explanation: "This is a Route Handler inside an api directory (/api/hello). Renders pure standardized JSON payloads on demand. Excellent for integration proxies, background callbacks or stripe webhooks.",
    associatedRoute: "/api/hello"
  }
];
