// ==========================================================================
// Fullstack Roadmap Data Definition
// ==========================================================================

const roadmapData = [
  {
    stageId: "foundations",
    stageTitle: "1. Foundations",
    nodes: [
      {
        id: "internet-basics",
        name: "Internet & Web Basics",
        icon: "🌐",
        desc: "Understand how the web works, DNS, HTTP/HTTPS protocols, domains, hosting, and browser rendering engines.",
        tags: ["HTTP", "DNS", "Browsers"],
        category: "Foundations",
        paths: ["all", "frontend", "backend"],
        prereqs: [],
        concepts: [
          { text: "How do web browsers communicate with servers?", checked: false },
          { text: "Understanding IP Addresses, Domain Names, and DNS resolution", checked: false },
          { text: "HTTP request/response lifecycle, methods (GET, POST, etc.), and status codes", checked: false },
          { text: "HTTPS, TLS/SSL certificates, and basic web encryption", checked: false }
        ],
        resources: [
          { type: "doc", name: "MDN: How the Web Works", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works" },
          { type: "video", name: "Crash Course: How the Internet Works", url: "https://www.youtube.com/watch?v=dxXXJZ-H-Kk" }
        ],
        project: {
          title: "HTTP Inspection Tool",
          desc: "Use your browser's network tab or curl to inspect request and response headers of three different websites. Document the headers, status codes, and content types.",
          requirements: [
            "Inspect and write down response headers (e.g. Cache-Control, Server, Content-Type)",
            "Identify the difference between HTTP/1.1, HTTP/2, and HTTP/3 usage on modern sites",
            "Perform manual HTTP requests using curl or Postman"
          ],
          tip: "Pay close attention to headers like 'Set-Cookie' and security-related headers like 'Content-Security-Policy'."
        },
        quiz: [
          {
            question: "Which HTTP status code category represents server-side errors?",
            options: ["2xx series", "3xx series", "4xx series", "5xx series"],
            answer: 3
          },
          {
            question: "What is the primary function of a DNS server?",
            options: ["To encrypt web traffic", "To translate domain names into IP addresses", "To serve HTML content to browsers", "To balance traffic load across servers"],
            answer: 1
          },
          {
            question: "Which HTTP method is designed to be idempotent and retrieve data?",
            options: ["POST", "PUT", "DELETE", "GET"],
            answer: 3
          }
        ]
      },
      {
        id: "git-github",
        name: "Git & Version Control",
        icon: "📁",
        desc: "Master version control fundamentals: committing, branching, merging, conflict resolution, and collaborative GitHub workflows.",
        tags: ["Git", "GitHub", "VCS"],
        category: "Foundations",
        paths: ["all", "frontend", "backend", "devops"],
        prereqs: ["internet-basics"],
        concepts: [
          { text: "Configuring Git, committing, and viewing logs", checked: false },
          { text: "Branching models (git flow, GitHub flow)", checked: false },
          { text: "Handling merge conflicts and rebasing", checked: false },
          { text: "Pull requests, issues, and collaborative workflows on GitHub", checked: false }
        ],
        resources: [
          { type: "doc", name: "Pro Git Book (Free)", url: "https://git-scm.com/book/en/v2" },
          { type: "video", name: "Git & GitHub Crash Course", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" }
        ],
        project: {
          title: "Collaborative Git Simulation",
          desc: "Create a GitHub repository, push initial code, create a feature branch, make modifications, create a pull request, simulate a merge conflict on another branch, resolve it, and merge.",
          requirements: [
            "Initialize a git repository and make at least 3 distinct commits",
            "Create a feature branch, edit a file, and merge it back using a pull request",
            "Create a conflict manually by editing the same line in two branches, resolve it, and commit the resolution"
          ],
          tip: "Use git graphical graphs in VS Code or running 'git log --graph --oneline --all' in terminal to visualize histories."
        },
        quiz: [
          {
            question: "Which command is used to save changes to the local staging area in Git?",
            options: ["git commit", "git push", "git add", "git save"],
            answer: 2
          },
          {
            question: "What is the difference between git merge and git rebase?",
            options: [
              "Merge preserves history timeline, Rebase rewrites history to align commits linearly",
              "Merge is only for remote repositories, Rebase is for local files",
              "Merge deletes branches automatically, Rebase keeps them active",
              "There is no difference; they are exact aliases"
            ],
            answer: 0
          },
          {
            question: "Which command fetches changes from a remote repository and immediately integrates them into the current branch?",
            options: ["git fetch", "git pull", "git merge", "git checkout"],
            answer: 1
          }
        ]
      },
      {
        id: "linux-cli",
        name: "Linux & CLI Foundations",
        icon: "💻",
        desc: "Get comfortable with command-line shells, directory navigation, file manipulation, environment variables, and scripting basics.",
        tags: ["Bash", "Linux", "CLI"],
        category: "Foundations",
        paths: ["all", "backend", "devops"],
        prereqs: ["internet-basics"],
        concepts: [
          { text: "Command-line navigation (cd, ls, pwd, mkdir, rm)", checked: false },
          { text: "File viewing and editing (cat, nano, vim, grep)", checked: false },
          { text: "Redirects and pipes (>, >>, |)", checked: false },
          { text: "Permissions (chmod, chown) and environment variables", checked: false }
        ],
        resources: [
          { type: "doc", name: "Linux Journey (Interactive Guide)", url: "https://linuxjourney.com/" },
          { type: "video", name: "Linux Terminal Bash Tutorial", url: "https://www.youtube.com/watch?v=oxuRxtrO2Ag" }
        ],
        project: {
          title: "System Diagnostic Script",
          desc: "Write a short bash script (or batch script on Windows) that prints directory listings, checks system uptime, creates a log file with the results, and moves it to a 'diagnostics' folder.",
          requirements: [
            "Create and execute a shell script using command line",
            "Redirect output of system commands into a log file with current date",
            "Check and modify file permissions so only the owner can read/write the log file"
          ],
          tip: "Explore pipes '|' combined with grep or awk to extract specific strings from command output."
        },
        quiz: [
          {
            question: "Which command is used to display the absolute path of the current directory in Linux?",
            options: ["pwd", "path", "cd", "whereami"],
            answer: 0
          },
          {
            question: "How do you redirect standard output of a command to append to an existing file?",
            options: [">", ">>", "|", "<"],
            answer: 1
          },
          {
            question: "What permission level does 'chmod 755 filename' grant to the group and others?",
            options: ["No access", "Read and write only", "Read and execute only", "Full read, write, and execute"],
            answer: 2
          }
        ]
      }
    ]
  },
  {
    stageId: "frontend",
    stageTitle: "2. Frontend Core",
    nodes: [
      {
        id: "html-css",
        name: "HTML & CSS Layouts",
        icon: "🎨",
        desc: "Learn structural semantic HTML tags, advanced layouts with Flexbox/Grid, and modern responsive media queries.",
        tags: ["HTML5", "Flexbox", "CSS Grid"],
        category: "Frontend",
        paths: ["all", "frontend"],
        prereqs: ["git-github"],
        concepts: [
          { text: "Semantic HTML5 tags (header, section, main, article, footer)", checked: false },
          { text: "CSS Box Model, margins, padding, and border positioning", checked: false },
          { text: "Responsive Web Design with Media Queries", checked: false },
          { text: "Advanced layout systems: CSS Flexbox and CSS Grid", checked: false }
        ],
        resources: [
          { type: "doc", name: "MDN: CSS Layouts Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout" },
          { type: "video", name: "CSS Grid vs Flexbox Tutorial", url: "https://www.youtube.com/watch?v=hs3piaN4b5I" }
        ],
        project: {
          title: "Responsive Landing Page",
          desc: "Build a multi-section, responsive product landing page using semantic HTML, Flexbox header navigation, and a CSS Grid card layout for pricing/features. Implement a dark/light visual style toggle.",
          requirements: [
            "Use at least 5 different semantic HTML elements",
            "Create a Grid section that adapts from 1 column on mobile to 3 columns on desktop",
            "Ensure responsive breakpoints look clean from 320px to 1440px viewport widths"
          ],
          tip: "Use CSS variables for colors to make implementing light/dark theme toggles extremely simple."
        },
        quiz: [
          {
            question: "Which CSS property controls the alignment of items along a Flexbox container's cross axis?",
            options: ["justify-content", "align-items", "flex-direction", "align-content"],
            answer: 1
          },
          {
            question: "Which element is considered semantic HTML?",
            options: ["<div>", "<span>", "<article>", "<font>"],
            answer: 2
          },
          {
            question: "In the CSS Box Model, what sits immediately outside the Content area?",
            options: ["Border", "Padding", "Margin", "Outline"],
            answer: 1
          }
        ]
      },
      {
        id: "javascript",
        name: "Modern JavaScript",
        icon: "⚡",
        desc: "Master ES6+ features, asynchronous operations (Promises & Async/Await), DOM manipulation, and fetching APIs.",
        tags: ["ES6+", "Async/Await", "DOM"],
        category: "Frontend",
        paths: ["all", "frontend"],
        prereqs: ["html-css"],
        concepts: [
          { text: "Variables (let, const), scope, and arrow functions", checked: false },
          { text: "Array methods (map, filter, reduce, find)", checked: false },
          { text: "Asynchronous patterns: Callbacks, Promises, and Async/Await", checked: false },
          { text: "Fetch API integration and DOM Event Handling", checked: false }
        ],
        resources: [
          { type: "doc", name: "Javascript.info (Deep Guide)", url: "https://javascript.info/" },
          { type: "video", name: "Async/Await JS Tutorial", url: "https://www.youtube.com/watch?v=VnQ4-oSOL3M" }
        ],
        project: {
          title: "Real-time Weather Dashboard",
          desc: "Create a simple dashboard that queries a free public weather API (like Open-Meteo), parses the JSON response, dynamically creates cards in the DOM, and displays local weather data.",
          requirements: [
            "Use Async/Await fetch pattern with full try/catch error handling",
            "Update the DOM dynamically without reloading the page",
            "Implement a search bar allowing users to enter latitude/longitude coordinates"
          ],
          tip: "Always check response.ok after running fetch() to catch HTTP error codes."
        },
        quiz: [
          {
            question: "Which array method creates a new array containing only elements that pass a specific test condition?",
            options: ["map()", "forEach()", "reduce()", "filter()"],
            answer: 3
          },
          {
            question: "What does a JavaScript function returning the 'async' keyword always return?",
            options: ["A Promise", "A string", "A JSON object", "undefined"],
            answer: 0
          },
          {
            question: "Which declaration is scoped block-level and CANNOT be reassigned?",
            options: ["var", "let", "const", "def"],
            answer: 2
          }
        ]
      },
      {
        id: "react",
        name: "React.js",
        icon: "⚛️",
        desc: "Learn component architecture, JSX, state & props management, standard Hooks (useState, useEffect), and custom hooks.",
        tags: ["Components", "Hooks", "Virtual DOM"],
        category: "Frontend",
        paths: ["all", "frontend"],
        prereqs: ["javascript"],
        concepts: [
          { text: "JSX syntax and rendering components", checked: false },
          { text: "Managing local state (useState) and side effects (useEffect)", checked: false },
          { text: "Unidirectional data flow, props, and lifting state up", checked: false },
          { text: "Creating custom hooks for reusable UI logic", checked: false }
        ],
        resources: [
          { type: "doc", name: "Official React Documentation", url: "https://react.dev/" },
          { type: "video", name: "React Beginner Course (2024)", url: "https://www.youtube.com/watch?v=SqcY0GlETPk" }
        ],
        project: {
          title: "Task Management Board",
          desc: "Build a Kanban-style Task Board with Columns (Todo, In-Progress, Completed) where users can add cards, move cards between columns, and persist states to localStorage.",
          requirements: [
            "Use useState to manage tasks arrays",
            "Use useEffect to sync the state with local storage on updates",
            "Extract TaskCard and Column into separate modular components"
          ],
          tip: "Keep state structured cleanly. Lifting state up to a parent component makes cross-column operations straightforward."
        },
        quiz: [
          {
            question: "What hook should you use in React to perform data fetching when a component mounts?",
            options: ["useState", "useEffect", "useContext", "useMemo"],
            answer: 1
          },
          {
            question: "In React, how is data passed from a parent component down to a child component?",
            options: ["Using state", "Using props", "Using functions", "Using refs"],
            answer: 1
          },
          {
            question: "Why should lists of components have a unique 'key' prop in React?",
            options: [
              "To apply CSS styles to elements",
              "To help React identify which items have changed, been added, or removed",
              "To automatically format strings in the child components",
              "Keys are optional and provide no functional performance benefits"
            ],
            answer: 1
          }
        ]
      },
      {
        id: "nextjs",
        name: "Next.js Framework",
        icon: "▲",
        desc: "Master production-grade React apps using Next.js. Implement App Router, Server Components, SSR, Static Generation, and Route Handlers.",
        tags: ["SSR/ISR", "App Router", "Server Components"],
        category: "Frontend",
        paths: ["all", "frontend", "backend"],
        prereqs: ["react"],
        concepts: [
          { text: "Server vs Client Components and hydrations", checked: false },
          { text: "File-system routing in the App Router (layout.js, page.js)", checked: false },
          { text: "Rendering strategies: Static Generation (SSG), SSR, and Incremental Static Regeneration (ISR)", checked: false },
          { text: "Optimizing images, fonts, and script loading", checked: false },
          { text: "Writing API Route Handlers", checked: false }
        ],
        resources: [
          { type: "doc", name: "Next.js Learn Course", url: "https://nextjs.org/learn" },
          { type: "video", name: "Next.js 14+ Complete Tutorial", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk" }
        ],
        project: {
          title: "Dynamic Blog with Next.js App Router",
          desc: "Create a blog that loads markdown files or fetches mock posts from an API. Implement static rendering for the home page, dynamic Server-Side Rendering (SSR) for individual posts, and API route handlers.",
          requirements: [
            "Use Next.js App Router with nested layouts",
            "Implement dynamic routes `/blog/[id]/page.js` that fetch details on the server",
            "Create a Server Action or Route Handler to handle user newsletter submissions"
          ],
          tip: "Use Server Components by default. Switch to 'use client' only when you need interactivity (onClick, useState, useEffect)."
        },
        quiz: [
          {
            question: "What directive is placed at the top of a file to declare a Client Component in the Next.js App Router?",
            options: ['"use client"', '"client component"', '"use react"', 'client()'],
            answer: 0
          },
          {
            question: "Which page.js file path resolves to the dynamic route '/products/123' in Next.js?",
            options: ["/products/[id]/page.js", "/products/id/page.js", "/products/[id].js", "/products/page-[id].js"],
            answer: 0
          },
          {
            question: "What is a major advantage of Next.js Server Components?",
            options: [
              "They render in the client browser, reducing server load",
              "They allow direct server-side data fetching and reduce JavaScript bundle sizes sent to the browser",
              "They force all components to use client-side hooks like useEffect",
              "They require no HTML structure"
            ],
            answer: 1
          }
        ]
      }
    ]
  },
  {
    stageId: "backend",
    stageTitle: "3. Backend Systems",
    nodes: [
      {
        id: "databases",
        name: "Databases (SQL & NoSQL)",
        icon: "💾",
        desc: "Learn relational database design, query writing (PostgreSQL), index optimization, and document stores (MongoDB).",
        tags: ["PostgreSQL", "Queries", "MongoDB"],
        category: "Backend",
        paths: ["all", "backend"],
        prereqs: ["git-github"],
        concepts: [
          { text: "SQL fundamentals: SELECT, JOINs, Indexes, and transactions", checked: false },
          { text: "Database normalization and schema design rules", checked: false },
          { text: "NoSQL document storage basics (collections, documents)", checked: false },
          { text: "Connection pooling and basic querying performance tuning", checked: false }
        ],
        resources: [
          { type: "doc", name: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" },
          { type: "video", name: "Database Design Course", url: "https://www.youtube.com/watch?v=ztHopE5Wubs" }
        ],
        project: {
          title: "Relational E-Commerce Schema",
          desc: "Design an Entity-Relationship (ER) diagram for an online store. Write SQL scripts to create tables for Users, Orders, Order_Items, and Products, including foreign key constraints and indexes.",
          requirements: [
            "Write SQL schema with proper Primary Keys and Foreign Keys",
            "Write a query using INNER JOIN to fetch orders with product details for a user",
            "Define an index on orders.user_id to optimize search queries"
          ],
          tip: "Foreign keys prevent orphan records and guarantee database consistency. Always design with constraints."
        },
        quiz: [
          {
            question: "Which SQL clause is used to merge rows from two or more tables based on a related column?",
            options: ["UNION", "JOIN", "MERGE", "GROUP BY"],
            answer: 1
          },
          {
            question: "What does the 'ACID' property ensure in databases?",
            options: [
              "Reliable transaction processing",
              "Automatic index compression",
              "Fast server connection speed",
              "Encrypted column data"
            ],
            answer: 0
          },
          {
            question: "Which database type is classified as a document store NoSQL database?",
            options: ["PostgreSQL", "SQLite", "MongoDB", "Redis"],
            answer: 2
          }
        ]
      },
      {
        id: "python-node",
        name: "Server-side Languages",
        icon: "🐍",
        desc: "Understand back-end environments. Compare execution runtimes (Node.js/V8) and server programming languages (Python).",
        tags: ["Python", "Node.js", "Express"],
        category: "Backend",
        paths: ["all", "backend"],
        prereqs: ["git-github"],
        concepts: [
          { text: "Python fundamentals: Pip, virtual environments, async functions", checked: false },
          { text: "Node.js runtime: Event loop, npm, module exports", checked: false },
          { text: "Handling file system access and stream structures", checked: false },
          { text: "Writing basic HTTP servers without heavy frameworks", checked: false }
        ],
        resources: [
          { type: "doc", name: "Node.js Documentation", url: "https://nodejs.org/en/docs" },
          { type: "video", name: "Python Backend Bootcamp", url: "https://www.youtube.com/watch?v=rfscVS0vtbw" }
        ],
        project: {
          title: "Multi-threaded Script Execution",
          desc: "Write a server script in Python or Node.js that reads a large CSV file of server records, filters rows asynchronously, and writes output into a clean JSON report.",
          requirements: [
            "Use native fs module (Node) or csv library (Python)",
            "Run operation asynchronously to prevent CPU blockages",
            "Handle process arguments and standard outputs"
          ],
          tip: "Use streaming readers instead of reading entire large files directly into memory to prevent server memory crashes."
        },
        quiz: [
          {
            question: "How does Node.js handle heavy concurrent connections efficiently?",
            options: [
              "By spawning a new operating system thread for every request",
              "By using a single-threaded non-blocking event loop",
              "By ignoring slow connections",
              "By requiring multiple CPU servers automatically"
            ],
            answer: 1
          },
          {
            question: "What utility is used to manage isolated environments in Python development?",
            options: ["npm", "pipenv or venv", "docker", "composer"],
            answer: 1
          },
          {
            question: "What is the primary package manager for Node.js?",
            options: ["pip", "brew", "npm", "cargo"],
            answer: 2
          }
        ]
      },
      {
        id: "fastapi",
        name: "FastAPI Development",
        icon: "⚡",
        desc: "Build high-performance, asynchronous REST APIs with Python using FastAPI. Utilize Pydantic models for validation and autogenerated OpenAPI documents.",
        tags: ["FastAPI", "Python", "Pydantic"],
        category: "Backend",
        paths: ["all", "backend"],
        prereqs: ["databases", "python-node"],
        concepts: [
          { text: "Creating FastAPI routers, paths, and query parameters", checked: false },
          { text: "Using Pydantic schemas for request validation and type casting", checked: false },
          { text: "Dependency Injection patterns in FastAPI", checked: false },
          { text: "Integrating relational ORMs (SQLAlchemy, SQLModel)", checked: false },
          { text: "Autogenerated API docs (Swagger UI / Redoc)", checked: false }
        ],
        resources: [
          { type: "doc", name: "FastAPI Tutorial User Guide", url: "https://fastapi.tiangolo.com/tutorial/" },
          { type: "video", name: "FastAPI Complete Tutorial with DB", url: "https://www.youtube.com/watch?v=tLKKmCOHHIo" }
        ],
        project: {
          title: "Book Inventory API with FastAPI",
          desc: "Create a fully functional REST API for managing a book inventory. Implement endpoints for CRUD operations, use Pydantic models for validation, support query filters for authors, and document the API using the built-in Swagger UI.",
          requirements: [
            "Implement POST, GET, PUT, and DELETE endpoints",
            "Use Pydantic schemas to validate request bodies and cast string inputs to typed formats",
            "Implement simple error responses using `HTTPException` (e.g. 404 Book Not Found)"
          ],
          tip: "Simply visit `/docs` on your local FastAPI server to interactively test all endpoints using the auto-generated Swagger UI."
        },
        quiz: [
          {
            question: "Which library does FastAPI use under the hood for data validation and serialization?",
            options: ["Flask", "Django", "Pydantic", "SQLAlchemy"],
            answer: 2
          },
          {
            question: "Which URL pathway exposes the autogenerated interactive Swagger UI in a default FastAPI setup?",
            options: ["/swagger", "/docs", "/api", "/redoc"],
            answer: 1
          },
          {
            question: "How do you define an asynchronous path operation function in FastAPI?",
            options: ["async def read_data():", "def async read_data():", "def read_data(async=True):", "async function read_data() {}"],
            answer: 0
          }
        ]
      },
      {
        id: "apis-rest",
        name: "API Architectures",
        icon: "🔌",
        desc: "Design robust APIs. Understand REST principles, CRUD operations, HTTP response status codes, and GraphQL routing structures.",
        tags: ["RESTful", "JSON", "CORS"],
        category: "Backend",
        paths: ["all", "backend"],
        prereqs: ["fastapi"],
        concepts: [
          { text: "RESTful principles (statelessness, resource identifiers, uniform interface)", checked: false },
          { text: "Managing headers, query params, and request payloads", checked: false },
          { text: "Understanding CORS (Cross-Origin Resource Sharing)", checked: false },
          { text: "Designing clean response formats and versioning strategies", checked: false }
        ],
        resources: [
          { type: "doc", name: "Microsoft: API Design Best Practices", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design" },
          { type: "video", name: "GraphQL vs REST vs gRPC Explained", url: "https://www.youtube.com/watch?v=I7X8D288Q3c" }
        ],
        project: {
          title: "Public API Wrapper",
          desc: "Build a middleware endpoint that calls a third-party API (like GitHub or Spotify), filters the keys of the JSON payload, aggregates response data, and returns a sanitized endpoint output.",
          requirements: [
            "Handle request headers, authorization tokens safely",
            "Support clean CORS setup enabling client apps to query your wrapper",
            "Respond with appropriate nested JSON structures"
          ],
          tip: "Always handle third-party API rate limits and timeouts to protect your middleware servers from hanging."
        },
        quiz: [
          {
            question: "What security mechanism prevents browsers from making requests to a different domain than the one that served the web page?",
            options: ["CORS", "HTTPS", "DNSSEC", "JWT"],
            answer: 0
          },
          {
            question: "Which URL design aligns with standard RESTful conventions for editing a specific user?",
            options: ["POST /update-user/123", "GET /user?id=123&action=edit", "PUT /users/123", "DELETE /users/123/edit"],
            answer: 2
          },
          {
            question: "What does statelessness imply in a REST API?",
            options: [
              "The server stores login sessions of client connections in memory",
              "Each client request must contain all information required to process it, and no session state is saved on the server",
              "The database has no schemas",
              "The client cannot update data on the server"
            ],
            answer: 1
          }
        ]
      }
    ]
  },
  {
    stageId: "devops",
    stageTitle: "4. Cloud & DevOps",
    nodes: [
      {
        id: "cicd",
        name: "CI/CD Pipelines",
        icon: "🔄",
        desc: "Implement continuous integration and delivery pipelines using GitHub Actions, validating code builds, running tests, and managing automated deployments.",
        tags: ["GitHub Actions", "Pipelines", "Linting"],
        category: "DevOps",
        paths: ["all", "devops"],
        prereqs: ["apis-rest"],
        concepts: [
          { text: "CI/CD core principles (fast feedback loops, test automation)", checked: false },
          { text: "Writing GitHub Actions workflows (.github/workflows/main.yml)", checked: false },
          { text: "Managing environments, secrets, and environment tokens safely", checked: false },
          { text: "Automated testing, linting, and formatting checks on pull requests", checked: false }
        ],
        resources: [
          { type: "doc", name: "GitHub Actions Quickstart Guide", url: "https://docs.github.com/en/actions/quickstart" },
          { type: "video", name: "CI/CD Pipelines Tutorial for Beginners", url: "https://www.youtube.com/watch?v=scEDHsr3APg" }
        ],
        project: {
          title: "Automated Build Pipeline",
          desc: "Create a GitHub Actions workflow in a test repository that triggers on pushes to the main branch. The pipeline should install dependencies, run a simple linter, and run unit tests. If tests fail, the build should fail and send a notification.",
          requirements: [
            "Create a valid YAML workflow file inside `.github/workflows/` folder",
            "Use GitHub Actions caching to speed up node_modules/pip installations",
            "Implement a test runner step that asserts a test suite successfully passes"
          ],
          tip: "Use actions/checkout and actions/setup-node (or setup-python) to quickly configure workflow steps."
        },
        quiz: [
          {
            question: "What directory path must workflow YAML files be saved in for GitHub to automatically execute them?",
            options: [".github/workflows/", "/pipelines/", "/workflows/", ".git/actions/"],
            answer: 0
          },
          {
            question: "What is the primary difference between Continuous Integration (CI) and Continuous Deployment (CD)?",
            options: [
              "CI is for frontend; CD is for backend",
              "CI focuses on automated building and testing; CD focuses on automated release and deployment to servers",
              "CI requires servers; CD is done locally",
              "There is no difference; they are interchangeable terms"
            ],
            answer: 1
          },
          {
            question: "How should API keys and database passwords be referenced in a GitHub Actions workflow?",
            options: [
              "Written directly as plain text in the YAML file",
              "Referenced using environment variables stored in GitHub Repository Secrets",
              "Saved in a public config.json file in the repo",
              "They should not be used in the build pipeline"
            ],
            answer: 1
          }
        ]
      },
      {
        id: "docker",
        name: "Docker Containers",
        icon: "🐳",
        desc: "Learn to containerize apps. Write Dockerfiles, manage multi-container systems with Docker Compose, and control volumes and ports.",
        tags: ["Docker", "Containers", "Compose"],
        category: "DevOps",
        paths: ["all", "backend", "devops"],
        prereqs: ["linux-cli", "apis-rest"],
        concepts: [
          { text: "Difference between Virtual Machines and Containers", checked: false },
          { text: "Writing custom Dockerfiles (FROM, RUN, COPY, CMD)", checked: false },
          { text: "Creating multi-container architectures with Docker Compose", checked: false },
          { text: "Managing port bindings, container networking, and volumes for storage persistence", checked: false }
        ],
        resources: [
          { type: "doc", name: "Docker Curriculum (Step-by-step)", url: "https://docker-curriculum.com/" },
          { type: "video", name: "Docker Crash Course for Web Developers", url: "https://www.youtube.com/watch?v=3c-iKankev4" }
        ],
        project: {
          title: "Containerized App Stack",
          desc: "Write a Dockerfile to containerize your FastAPI or Node.js web app. Create a `docker-compose.yml` file that spins up both the application container and a PostgreSQL database container, links them on a shared network, and mounts a persistent volume for database data.",
          requirements: [
            "Write a multi-stage Dockerfile that builds a lightweight production image",
            "Write a compose file detailing service dependencies, port mappings, and environmental configurations",
            "Validate that stopping and restarting the stack does not lose data stored in the database"
          ],
          tip: "Use `.dockerignore` to avoid copying node_modules or python virtual environments into the docker image build context."
        },
        quiz: [
          {
            question: "What instruction in a Dockerfile sets the default executing command when a container starts?",
            options: ["RUN", "EXPOSE", "CMD", "FROM"],
            answer: 2
          },
          {
            question: "In Docker, what is the primary purpose of a 'volume'?",
            options: [
              "To adjust the sound level of runtime outputs",
              "To persist data generated inside the container on the host machine",
              "To scale up the RAM allocated to a container",
              "To compile code faster"
            ],
            answer: 1
          },
          {
            question: "What command runs a multi-container environment in the background using Docker Compose?",
            options: ["docker up", "docker-compose up -d", "docker run compose", "docker-compose start background"],
            answer: 1
          }
        ]
      },
      {
        id: "kubernetes",
        name: "Kubernetes Orchestration",
        icon: "☸️",
        desc: "Learn container orchestration at scale. Understand Pods, Deployments, Services, ConfigMaps, and scaling applications.",
        tags: ["Kubernetes", "Pods", "Scaling"],
        category: "DevOps",
        paths: ["all", "devops"],
        prereqs: ["docker"],
        concepts: [
          { text: "Understanding Kubernetes control planes, nodes, and clusters", checked: false },
          { text: "Writing manifest files (YAML) for Pods, Deployments, and Services", checked: false },
          { text: "Exposing applications externally using Services and Ingress", checked: false },
          { text: "Scaling deployments up/down and managing rollouts/rollbacks", checked: false }
        ],
        resources: [
          { type: "doc", name: "Kubernetes Basics (Official Interactive Tutorial)", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
          { type: "video", name: "Kubernetes Course for Beginners", url: "https://www.youtube.com/watch?v=X48VuDVv0do" }
        ],
        project: {
          title: "Scale Deployments on Minikube",
          desc: "Install Minikube locally. Write deployment and service configuration manifests for your containerized web application. Deploy the stack, scale the deployment to 3 replica pods, simulate a pod crash, and observe how Kubernetes automatically schedules replacements.",
          requirements: [
            "Write a Deployment YAML file specifying 3 replicas",
            "Write a ClusterIP or NodePort Service YAML file to load-balance traffic",
            "Perform rolling updates of the application image using kubectl"
          ],
          tip: "Use the command `kubectl get pods -w` to watch pods transition state in real time."
        },
        quiz: [
          {
            question: "What is the smallest deployable unit of computing that you can create and manage in Kubernetes?",
            options: ["Container", "Pod", "Service", "Node"],
            answer: 1
          },
          {
            question: "Which Kubernetes resource type is used to load balance and expose a set of pods as a network service?",
            options: ["Deployment", "ConfigMap", "Service", "Namespace"],
            answer: 2
          },
          {
            question: "Which kubectl command changes the number of running replicas in a deployment dynamically?",
            options: ["kubectl scale", "kubectl replicas", "kubectl resize", "kubectl update"],
            answer: 0
          }
        ]
      }
    ]
  },
  {
    stageId: "security",
    stageTitle: "5. Security & Architecture",
    nodes: [
      {
        id: "security-basics",
        name: "Application & API Security",
        icon: "🔒",
        desc: "Secure your apps. Learn JWT/OAuth authorization, session handling, hashing passwords, CORS security, and protection against OWASP Top 10 vulnerabilities.",
        tags: ["JWT/OAuth", "Hashing", "OWASP"],
        category: "Security",
        paths: ["all", "backend", "devops"],
        prereqs: ["apis-rest"],
        concepts: [
          { text: "Password hashing using bcrypt or Argon2", checked: false },
          { text: "Token-based authentication (JWT) vs Session-based authentication", checked: false },
          { text: "Mitigating common vulnerabilities (SQL Injection, XSS, CSRF)", checked: false },
          { text: "Encrypting secrets in environment variables and using HTTPS", checked: false }
        ],
        resources: [
          { type: "doc", name: "OWASP Top 10 Security Risks", url: "https://owasp.org/www-project-top-ten/" },
          { type: "video", name: "Web Security & JWT Explained", url: "https://www.youtube.com/watch?v=soGRyuzAtAQ" }
        ],
        project: {
          title: "Secure Auth Gateway",
          desc: "Implement a secure sign-up and login API module. Store passwords in a database as hashed strings (using bcrypt), issue signed JWT access tokens upon successful login, and secure API routes with middleware that verifies the authorization header token.",
          requirements: [
            "Never store plain text passwords; validate hashing works on registration",
            "Generate JWT tokens with a signature secret and an expiration payload",
            "Create a protected route returning HTTP 401 Unauthorized for invalid/expired tokens"
          ],
          tip: "Always set the 'HttpOnly' flag on auth cookies to protect JWTs from being accessed by malicious client-side JavaScript."
        },
        quiz: [
          {
            question: "Which hash algorithm is recommended for securely storing user passwords in a database?",
            options: ["MD5", "SHA-1", "bcrypt", "Base64"],
            answer: 2
          },
          {
            question: "What security risk involves an attacker injecting malicious scripts into trusted websites to execute in a victim's browser?",
            options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Cross-Site Request Forgery (CSRF)", "Man-in-the-Middle (MITM)"],
            answer: 1
          },
          {
            question: "What does the signature part of a JSON Web Token (JWT) verify?",
            options: [
              "The speed of the network request",
              "That the token has not been altered or tampered with during transit",
              "The age of the user",
              "The location of the database"
            ],
            answer: 1
          }
        ]
      },
      {
        id: "system-design",
        name: "System Design & Architecture",
        icon: "🏗️",
        desc: "Design scalable backends. Study horizontal/vertical scaling, load balancing, caching tiers (Redis), and message brokers.",
        tags: ["Caching", "Load Balancers", "Scaling"],
        category: "Architecture",
        paths: ["all", "backend"],
        prereqs: ["kubernetes", "security-basics"],
        concepts: [
          { text: "Horizontal vs Vertical Scaling of servers", checked: false },
          { text: "Caching strategies using Redis (read-through, write-through)", checked: false },
          { text: "Load balancing algorithms (Round Robin, Least Connections)", checked: false },
          { text: "Asynchronous task execution using message queues (RabbitMQ, Celery)", checked: false }
        ],
        resources: [
          { type: "doc", name: "System Design Primer (GitHub Repository)", url: "https://github.com/donnemartin/system-design-primer" },
          { type: "video", name: "System Design Course for Beginners", url: "https://www.youtube.com/watch?v=m8I7eGvq5Zg" }
        ],
        project: {
          title: "Scalable Task Queue",
          desc: "Create an architectural blueprint or deploy a mock task runner where high-overhead data crunching tasks are pushed to a Redis queue, handled asynchronously by worker processes in the background, and report completion status back via polling.",
          requirements: [
            "Use Celery (Python) or BullMQ (Node) with Redis",
            "Return a task ID immediately to client, keeping HTTP thread open for under 50ms",
            "Monitor workers dynamically as tasks scale"
          ],
          tip: "Caching is highly efficient, but always define TTLs (Time To Live) to prevent stale database representations from lingering."
        },
        quiz: [
          {
            question: "What type of scaling involves adding more machines or servers to your resource pool rather than upgrading hardware resources on a single machine?",
            options: ["Vertical Scaling", "Horizontal Scaling", "Linear Scaling", "Diagonal Scaling"],
            answer: 1
          },
          {
            question: "Which system design component sits in front of backend servers to distribute incoming traffic evenly?",
            options: ["Reverse Proxy/Load Balancer", "Redis Cache", "Message Queue", "DNS Resolver"],
            answer: 0
          },
          {
            question: "In caching, what does a cache write-through strategy ensure?",
            options: [
              "Data is only written to database, never to cache",
              "Data is written to cache and database simultaneously, ensuring data consistency",
              "Data is deleted immediately after reading",
              "The cache is bypassed entirely"
            ],
            answer: 1
          }
        ]
      }
    ]
  }
];

// ==========================================================================
// Application State Management
// ==========================================================================

const DEFAULT_STATE = {
  theme: "dark",
  activePath: "all",
  nodes: {
    "internet-basics": "in-progress",
    "git-github": "locked",
    "linux-cli": "locked",
    "html-css": "locked",
    "javascript": "locked",
    "react": "locked",
    "nextjs": "locked",
    "databases": "locked",
    "python-node": "locked",
    "fastapi": "locked",
    "apis-rest": "locked",
    "cicd": "locked",
    "docker": "locked",
    "kubernetes": "locked",
    "security-basics": "locked",
    "system-design": "locked"
  },
  checklist: {}, // { node_id: [index, index] } (Completed checklist concept indices)
  quizzes: []   // [node_id] (Nodes where quiz was passed successfully)
};

let userState = { ...DEFAULT_STATE };

// ==========================================================================
// State Persist & Load
// ==========================================================================

const loadState = () => {
  const local = localStorage.getItem("devpath_roadmap_state");
  if (local) {
    try {
      userState = JSON.parse(local);
      // Backwards compatibility / data integrity checks
      if (!userState.checklist) userState.checklist = {};
      if (!userState.quizzes) userState.quizzes = [];
      if (!userState.nodes) userState.nodes = { ...DEFAULT_STATE.nodes };
      if (!userState.activePath) userState.activePath = "all";
      if (!userState.theme) userState.theme = "dark";
    } catch (e) {
      console.error("Error parsing user state, resetting to default", e);
      userState = { ...DEFAULT_STATE };
    }
  } else {
    userState = { ...DEFAULT_STATE };
  }
};

const saveState = () => {
  localStorage.setItem("devpath_roadmap_state", JSON.stringify(userState));
};

// ==========================================================================
// Rendering Logic
// ==========================================================================

const renderRoadmap = (searchQuery = "") => {
  const wrapper = document.getElementById("roadmap-stages-wrapper");
  if (!wrapper) return;
  wrapper.innerHTML = "";

  const query = searchQuery.trim().toLowerCase();

  roadmapData.forEach(stage => {
    // Create stage column
    const stageCol = document.createElement("div");
    stageCol.className = "roadmap-stage-col";

    // Filter nodes in stage based on active path and search query
    const filteredNodes = stage.nodes.map(node => {
      const matchesPath = userState.activePath === "all" || node.paths.includes(userState.activePath);
      const matchesSearch = !query || 
                            node.name.toLowerCase().includes(query) || 
                            node.desc.toLowerCase().includes(query) || 
                            node.tags.some(t => t.toLowerCase().includes(query));

      return {
        ...node,
        isFilteredOut: !matchesPath || !matchesSearch
      };
    });

    // Count matching nodes for header tag
    const totalActiveCount = filteredNodes.filter(n => !n.isFilteredOut).length;

    // Stage Header
    const headerDiv = document.createElement("div");
    headerDiv.className = "stage-header";
    headerDiv.innerHTML = `
      <span class="stage-title">${stage.stageTitle}</span>
      <span class="stage-badge-count">${totalActiveCount} Nodes</span>
    `;
    stageCol.appendChild(headerDiv);

    // Nodes List
    const nodesList = document.createElement("div");
    nodesList.className = "stage-nodes-list";

    filteredNodes.forEach(node => {
      const card = document.createElement("div");
      
      // Node classes based on status and path filters
      const status = userState.nodes[node.id] || "locked";
      card.className = `node-card ${status}`;
      card.setAttribute("data-node-id", node.id);
      
      if (node.isFilteredOut) {
        card.classList.add("filtered");
      }

      // Dynamic icons based on status
      let statusIcon = "🔒";
      if (status === "in-progress") statusIcon = "⚡";
      if (status === "completed") statusIcon = "✅";

      card.innerHTML = `
        <div class="node-card-top">
          <span class="node-icon-main">${node.icon}</span>
          <span class="node-icon-status">${statusIcon}</span>
        </div>
        <div class="node-card-name">${node.name}</div>
        <div class="node-card-desc">${node.desc}</div>
        <div class="node-tech-tags">
          ${node.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join("")}
        </div>
      `;

      card.addEventListener("click", () => {
        if (!node.isFilteredOut) {
          openDrawer(node.id);
        }
      });

      nodesList.appendChild(card);
    });

    stageCol.appendChild(nodesList);
    wrapper.appendChild(stageCol);
  });

  // Draw connector lines after nodes are placed
  setTimeout(drawConnections, 50);
};

// Draw dynamic lines
const drawConnections = () => {
  const container = document.getElementById("roadmap-container");
  const svg = document.getElementById("connectors-svg");
  if (!svg || !container) return;
  svg.innerHTML = "";

  svg.setAttribute("width", container.scrollWidth);
  svg.setAttribute("height", container.scrollHeight);

  const containerRect = container.getBoundingClientRect();

  roadmapData.forEach(stage => {
    stage.nodes.forEach(node => {
      if (node.prereqs) {
        node.prereqs.forEach(prereqId => {
          const startEl = document.querySelector(`[data-node-id="${prereqId}"]`);
          const endEl = document.querySelector(`[data-node-id="${node.id}"]`);

          if (startEl && endEl) {
            const isFiltered = startEl.classList.contains("filtered") || endEl.classList.contains("filtered");
            
            const startRect = startEl.getBoundingClientRect();
            const endRect = endEl.getBoundingClientRect();

            const x1 = startRect.right - containerRect.left + container.scrollLeft;
            const y1 = startRect.top + startRect.height / 2 - containerRect.top + container.scrollTop;

            const x2 = endRect.left - containerRect.left + container.scrollLeft;
            const y2 = endRect.top + endRect.height / 2 - containerRect.top + container.scrollTop;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            const controlOffset = Math.abs(x2 - x1) * 0.5;
            const d = `M ${x1} ${y1} C ${x1 + controlOffset} ${y1}, ${x2 - controlOffset} ${y2}, ${x2} ${y2}`;
            
            path.setAttribute("d", d);

            const startStatus = userState.nodes[prereqId] || "locked";
            const endStatus = userState.nodes[node.id] || "locked";

            if (isFiltered) {
              path.setAttribute("stroke", "rgba(255, 255, 255, 0.02)");
            } else if (startStatus === "completed" && endStatus === "completed") {
              path.setAttribute("stroke", "var(--color-completed)");
              path.setAttribute("stroke-width", "2.5");
              path.setAttribute("opacity", "0.7");
            } else if (startStatus === "completed" || endStatus === "in-progress") {
              path.setAttribute("stroke", "var(--color-primary)");
              path.setAttribute("stroke-width", "2");
              path.setAttribute("opacity", "0.5");
            } else {
              path.setAttribute("stroke", "var(--border-color)");
              path.setAttribute("stroke-width", "1.5");
              path.setAttribute("opacity", "0.3");
            }

            path.setAttribute("fill", "none");
            svg.appendChild(path);
          }
        });
      }
    });
  });
};

// ==========================================================================
// Dashboard Stats and Progress Circle Updates
// ==========================================================================

const updateDashboard = () => {
  // Count total nodes
  let totalNodes = 0;
  let completedNodes = 0;

  roadmapData.forEach(stage => {
    stage.nodes.forEach(node => {
      totalNodes++;
      if (userState.nodes[node.id] === "completed") {
        completedNodes++;
      }
    });
  });

  // Calculate percentage
  const percentage = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  // Update elements
  const percentageText = document.getElementById("global-progress-percentage");
  const nodesCompletedText = document.getElementById("stats-completed");
  const quizzesText = document.getElementById("stats-quizzes");
  
  if (percentageText) percentageText.innerText = `${percentage}%`;
  if (nodesCompletedText) nodesCompletedText.innerText = `${completedNodes}/${totalNodes}`;
  if (quizzesText) quizzesText.innerText = userState.quizzes.length;

  // Update SVG Progress Circle
  const circle = document.getElementById("global-progress-circle");
  if (circle) {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  // Auto unlock dependent nodes based on prerequisites completion
  let stateChanged = false;
  roadmapData.forEach(stage => {
    stage.nodes.forEach(node => {
      const currentStatus = userState.nodes[node.id] || "locked";
      
      if (currentStatus === "locked") {
        // Check if all prerequisites are completed
        const allPrereqsMet = !node.prereqs || node.prereqs.every(prereqId => userState.nodes[prereqId] === "completed");
        if (allPrereqsMet) {
          userState.nodes[node.id] = "in-progress"; // Automatically move to 'in-progress' (learning) once unlocked
          stateChanged = true;
        }
      }
    });
  });

  if (stateChanged) {
    saveState();
    renderRoadmap();
  }

  renderBadges();
};

const renderBadges = () => {
  const container = document.getElementById("badge-container");
  if (!container) return;
  container.innerHTML = "";

  const badges = [
    { id: "foundations", emoji: "🌱", title: "Foundations Master", desc: "Complete all level 1 Foundation nodes" },
    { id: "frontend", emoji: "🎨", title: "UI/UX Craftsman", desc: "Complete all level 2 Frontend nodes" },
    { id: "backend", emoji: "⚙️", title: "Server Wizard", desc: "Complete all level 3 Backend nodes" },
    { id: "devops", emoji: "🐳", title: "Cloud Commander", desc: "Complete all level 4 Cloud/DevOps nodes" },
    { id: "advanced", emoji: "🛡️", title: "Cyber Architect", desc: "Complete all level 5 Security/Architecture nodes" }
  ];

  badges.forEach(badge => {
    let unlocked = false;
    
    // Find stage and check node completions
    const targetStage = roadmapData.find(s => s.stageId === badge.id);
    if (targetStage) {
      unlocked = targetStage.nodes.every(node => userState.nodes[node.id] === "completed");
    }

    const badgeDiv = document.createElement("div");
    badgeDiv.className = `badge ${unlocked ? 'unlocked' : 'locked'}`;
    badgeDiv.innerText = badge.emoji;
    badgeDiv.setAttribute("data-tooltip", `${badge.title}: ${badge.desc} (${unlocked ? 'Unlocked' : 'Locked'})`);
    container.appendChild(badgeDiv);
  });
};

// ==========================================================================
// Slide-in Drawer Detail Interactions
// ==========================================================================

let activeNodeId = null;
let activeQuizState = {
  questionIndex: 0,
  score: 0,
  answers: [] // tracked answers
};

const openDrawer = (nodeId) => {
  let node = null;
  roadmapData.forEach(stage => {
    const found = stage.nodes.find(n => n.id === nodeId);
    if (found) node = found;
  });

  if (!node) return;

  activeNodeId = nodeId;

  // Set Title and Category
  document.getElementById("drawer-category").innerText = node.category;
  document.getElementById("drawer-node-title").innerText = node.name;

  // Toggle active class on Drawer Status Buttons
  const currentStatus = userState.nodes[nodeId] || "locked";
  updateDrawerStatusButtons(currentStatus);

  // Load Concept Checklists
  const conceptsContainer = document.getElementById("concepts-checklist");
  conceptsContainer.innerHTML = "";
  
  const savedChecks = userState.checklist[nodeId] || [];

  node.concepts.forEach((concept, index) => {
    const li = document.createElement("li");
    const isCompleted = savedChecks.includes(index);
    li.className = `concept-item ${isCompleted ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input type="checkbox" class="concept-checkbox" id="check-${nodeId}-${index}" ${isCompleted ? 'checked' : ''}>
      <label class="concept-label" for="check-${nodeId}-${index}">${concept.text}</label>
    `;

    // Handle check state updates
    li.querySelector("input").addEventListener("change", (e) => {
      let checks = userState.checklist[nodeId] || [];
      if (e.target.checked) {
        if (!checks.includes(index)) checks.push(index);
        li.classList.add("completed");
      } else {
        checks = checks.filter(idx => idx !== index);
        li.classList.remove("completed");
      }
      userState.checklist[nodeId] = checks;
      saveState();
    });

    conceptsContainer.appendChild(li);
  });

  // Curate references lists
  const resourcesList = document.getElementById("resources-list");
  resourcesList.innerHTML = "";
  
  node.resources.forEach(res => {
    const card = document.createElement("a");
    card.href = res.url;
    card.target = "_blank";
    card.className = "resource-card";
    
    let badgeClass = "doc";
    if (res.type === "video") badgeClass = "video";
    if (res.type === "article") badgeClass = "article";

    card.innerHTML = `
      <div class="resource-info">
        <span class="resource-name">
          <span class="res-type-badge ${badgeClass}">${res.type}</span>
          ${res.name}
        </span>
        <span class="resource-domain">${new URL(res.url).hostname}</span>
      </div>
      <div class="resource-link-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="7" y1="17" x2="17" y2="7"/>
          <polyline points="7 7 17 7 17 17"/>
        </svg>
      </div>
    `;
    resourcesList.appendChild(card);
  });

  // Practice Project specs loading
  document.getElementById("project-title").innerText = node.project.title;
  document.getElementById("project-desc").innerText = node.project.desc;
  
  const reqsList = document.getElementById("project-reqs-list");
  reqsList.innerHTML = "";
  node.project.requirements.forEach(req => {
    const li = document.createElement("li");
    li.innerText = req;
    reqsList.appendChild(li);
  });
  document.getElementById("project-pro-tip").innerText = node.project.tip;

  // Initialize Quiz View
  resetQuizUI(node);

  // Set default active tab
  switchTab("learn");

  // Open Drawer UI
  document.getElementById("details-drawer").classList.add("active");
  document.getElementById("drawer-overlay").classList.add("active");
};

const closeDrawer = () => {
  document.getElementById("details-drawer").classList.remove("active");
  document.getElementById("drawer-overlay").classList.remove("active");
  activeNodeId = null;
};

// Switch Tabs inside Drawer
const switchTab = (tabName) => {
  document.querySelectorAll(".drawer-tab").forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-tab") === tabName);
  });
  
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === `panel-${tabName}`);
  });
};

const updateDrawerStatusButtons = (status) => {
  document.querySelectorAll(".status-opt-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-status") === status);
  });
};

const updateNodeStatus = (nodeId, newStatus) => {
  // Disallow completing if prerequisites aren't met
  let node = null;
  roadmapData.forEach(stage => {
    const found = stage.nodes.find(n => n.id === nodeId);
    if (found) node = found;
  });

  if (newStatus === "completed" && node && node.prereqs) {
    const allMet = node.prereqs.every(pId => userState.nodes[pId] === "completed");
    if (!allMet) {
      alert("⚠️ You must complete all prerequisite nodes first before marking this node completed.");
      return;
    }
  }

  userState.nodes[nodeId] = newStatus;
  saveState();
  updateDrawerStatusButtons(newStatus);
  renderRoadmap();
  updateDashboard();
};

// ==========================================================================
// Quiz Logic
// ==========================================================================

const resetQuizUI = (node) => {
  const passed = userState.quizzes.includes(node.id);
  
  const intro = document.getElementById("quiz-intro");
  const qaBox = document.getElementById("quiz-qa-box");
  const results = document.getElementById("quiz-results");

  intro.style.display = "block";
  qaBox.style.display = "none";
  results.style.display = "none";

  if (passed) {
    intro.innerHTML = `
      <span class="quiz-badge-icon">🏆</span>
      <h4>Assessment Cleared!</h4>
      <p>You have successfully passed the mini-quiz for this topic and proved your validation. You can retake it to test yourself anytime.</p>
      <button class="primary-button" id="start-quiz-btn">Retake Quiz</button>
    `;
  } else {
    intro.innerHTML = `
      <span class="quiz-badge-icon">✏️</span>
      <h4>Verify Your Understanding</h4>
      <p>Pass this 3-question assessment with 100% accuracy to earn your status badge and complete this roadmap node!</p>
      <button class="primary-button" id="start-quiz-btn">Start Mini-Quiz</button>
    `;
  }

  // Add click listener
  document.getElementById("start-quiz-btn").addEventListener("click", () => startQuiz(node));
};

const startQuiz = (node) => {
  activeQuizState = {
    questionIndex: 0,
    score: 0,
    answers: []
  };

  document.getElementById("quiz-intro").style.display = "none";
  document.getElementById("quiz-qa-box").style.display = "flex";
  document.getElementById("quiz-results").style.display = "none";

  loadQuizQuestion(node);
};

const loadQuizQuestion = (node) => {
  const qData = node.quiz[activeQuizState.questionIndex];
  
  // Update progress metrics
  document.getElementById("quiz-q-index").innerText = `Question ${activeQuizState.questionIndex + 1} of ${node.quiz.length}`;
  const progressFill = (activeQuizState.questionIndex / node.quiz.length) * 100;
  document.getElementById("quiz-progress-fill").style.width = `${progressFill}%`;

  // Question Text
  document.getElementById("quiz-question-text").innerText = qData.question;

  // Options buttons list
  const optionsList = document.getElementById("quiz-options-list");
  optionsList.innerHTML = "";

  const continueBtn = document.getElementById("next-q-btn");
  continueBtn.style.display = "block";
  continueBtn.disabled = true;

  qData.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    
    btn.addEventListener("click", () => {
      // Prevent double answering
      if (!continueBtn.disabled) return;

      btn.classList.add("selected");
      continueBtn.disabled = false;
      
      const isCorrect = idx === qData.answer;
      activeQuizState.answers.push(isCorrect);
      
      if (isCorrect) {
        btn.classList.add("correct");
        activeQuizState.score++;
      } else {
        btn.classList.add("wrong");
        // Highlight correct option as well
        optionsList.children[qData.answer].classList.add("correct");
      }
    });

    optionsList.appendChild(btn);
  });

  // Clean transition to next question or complete
  continueBtn.onclick = () => {
    activeQuizState.questionIndex++;
    if (activeQuizState.questionIndex < node.quiz.length) {
      loadQuizQuestion(node);
    } else {
      finishQuiz(node);
    }
  };
};

const finishQuiz = (node) => {
  document.getElementById("quiz-qa-box").style.display = "none";
  const results = document.getElementById("quiz-results");
  results.style.display = "block";

  const total = node.quiz.length;
  const passed = activeQuizState.score === total;

  if (passed) {
    results.innerHTML = `
      <div class="results-box">
        <span class="results-icon">🎉</span>
        <h4 class="results-title">Perfect Score! (${activeQuizState.score}/${total})</h4>
        <p class="results-desc">Congratulations! You correctly answered all questions. This roadmap node is now completed.</p>
        <button class="primary-button" id="close-results-btn">Close Panel</button>
      </div>
    `;

    // Add quiz completion states
    if (!userState.quizzes.includes(node.id)) {
      userState.quizzes.push(node.id);
    }
    
    updateNodeStatus(node.id, "completed");

  } else {
    results.innerHTML = `
      <div class="results-box">
        <span class="results-icon">❌</span>
        <h4 class="results-title">Keep Reviewing! (${activeQuizState.score}/${total})</h4>
        <p class="results-desc">You got ${total - activeQuizState.score} question(s) incorrect. Check out the reference docs in the 'Learn' tab and try again!</p>
        <button class="primary-button" id="retry-quiz-btn">Try Again</button>
      </div>
    `;

    document.getElementById("retry-quiz-btn").addEventListener("click", () => startQuiz(node));
  }

  const closeResultsBtn = document.getElementById("close-results-btn");
  if (closeResultsBtn) {
    closeResultsBtn.addEventListener("click", closeDrawer);
  }
};

// ==========================================================================
// Theme Toggling Logic (Light / Dark)
// ==========================================================================

const initTheme = () => {
  const htmlEl = document.documentElement;
  const moonIcon = document.querySelector(".theme-icon.moon");
  const sunIcon = document.querySelector(".theme-icon.sun");
  
  if (userState.theme === "light") {
    htmlEl.setAttribute("data-theme", "light");
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
  } else {
    htmlEl.setAttribute("data-theme", "dark");
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
  }
};

const toggleTheme = () => {
  const htmlEl = document.documentElement;
  const moonIcon = document.querySelector(".theme-icon.moon");
  const sunIcon = document.querySelector(".theme-icon.sun");

  if (htmlEl.getAttribute("data-theme") === "dark") {
    htmlEl.setAttribute("data-theme", "light");
    userState.theme = "light";
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
  } else {
    htmlEl.setAttribute("data-theme", "dark");
    userState.theme = "dark";
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
  }
  
  saveState();
  // Redraw connections to update line colors
  drawConnections();
};

// ==========================================================================
// Setup Listeners & Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  initTheme();
  
  // Render views
  renderRoadmap();
  updateDashboard();

  // Theme Toggler
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  // Close Drawer Controllers
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);

  // Drawer Tabs switching
  document.querySelectorAll(".drawer-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      switchTab(tab.getAttribute("data-tab"));
    });
  });

  // Drawer status selection
  document.querySelectorAll(".status-opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (activeNodeId) {
        updateNodeStatus(activeNodeId, btn.getAttribute("data-status"));
      }
    });
  });

  // Filter Buttons event handlers
  document.querySelectorAll(".path-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".path-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      userState.activePath = btn.getAttribute("data-path");
      saveState();
      
      const searchVal = document.getElementById("search-input").value;
      renderRoadmap(searchVal);
    });
  });

  // Real-time Search Handler
  document.getElementById("search-input").addEventListener("input", (e) => {
    renderRoadmap(e.target.value);
  });

  // Global reset capability
  document.getElementById("reset-progress").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all learning progress, checklists, and quiz history? This cannot be undone.")) {
      userState = { ...DEFAULT_STATE };
      saveState();
      renderRoadmap();
      updateDashboard();
      closeDrawer();
    }
  });

  // Window resize connection updates
  window.addEventListener("resize", drawConnections);
  
  // Initial draw delay for fonts and nodes placement
  window.addEventListener("load", drawConnections);
});
