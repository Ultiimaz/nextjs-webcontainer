import { FileSystemTree } from '@webcontainer/api';

export const files: FileSystemTree = {
  components: {
    directory: {
      ui:{
        directory: {
              'background-beams-with-collision.tsx': {
                file: {
                  contents: `"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
children,
className,
}: {
children: React.ReactNode;
className?: string;
}) => {
const containerRef = useRef<HTMLDivElement>(null);
const parentRef = useRef<HTMLDivElement>(null);

const beams = [
{
  initialX: 10,
  translateX: 10,
  duration: 7,
  repeatDelay: 3,
  delay: 2,
},
{
  initialX: 600,
  translateX: 600,
  duration: 3,
  repeatDelay: 3,
  delay: 4,
},
{
  initialX: 100,
  translateX: 100,
  duration: 7,
  repeatDelay: 7,
  className: "h-6",
},
{
  initialX: 400,
  translateX: 400,
  duration: 5,
  repeatDelay: 14,
  delay: 4,
},
{
  initialX: 800,
  translateX: 800,
  duration: 11,
  repeatDelay: 2,
  className: "h-20",
},
{
  initialX: 1000,
  translateX: 1000,
  duration: 4,
  repeatDelay: 2,
  className: "h-12",
},
{
  initialX: 1200,
  translateX: 1200,
  duration: 6,
  repeatDelay: 4,
  delay: 2,
  className: "h-6",
},
];

return (
<div
  ref={parentRef}
  className={cn(
    "h-96 md:h-[40rem] bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-950 dark:to-neutral-800 relative flex items-center w-full justify-center overflow-hidden",
    // h-screen if you want bigger
    className
  )}
>
  {beams.map((beam) => (
    <CollisionMechanism
      key={beam.initialX + "beam-idx"}
      beamOptions={beam}
      containerRef={containerRef}
      parentRef={parentRef}
    />
  ))}

  {children}
  <div
    ref={containerRef}
    className="absolute bottom-0 bg-neutral-100 w-full inset-x-0 pointer-events-none"
    style={{
      boxShadow:
        "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
    }}
  ></div>
</div>
);
};

const CollisionMechanism = React.forwardRef<
HTMLDivElement,
{
containerRef: React.RefObject<HTMLDivElement>;
parentRef: React.RefObject<HTMLDivElement>;
beamOptions?: {
  initialX?: number;
  translateX?: number;
  initialY?: number;
  translateY?: number;
  rotate?: number;
  className?: string;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
};
}
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
const beamRef = useRef<HTMLDivElement>(null);
const [collision, setCollision] = useState<{
detected: boolean;
coordinates: { x: number; y: number } | null;
}>({
detected: false,
coordinates: null,
});
const [beamKey, setBeamKey] = useState(0);
const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

useEffect(() => {
const checkCollision = () => {
  if (
    beamRef.current &&
    containerRef.current &&
    parentRef.current &&
    !cycleCollisionDetected
  ) {
    const beamRect = beamRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const parentRect = parentRef.current.getBoundingClientRect();

    if (beamRect.bottom >= containerRect.top) {
      const relativeX =
        beamRect.left - parentRect.left + beamRect.width / 2;
      const relativeY = beamRect.bottom - parentRect.top;

      setCollision({
        detected: true,
        coordinates: {
          x: relativeX,
          y: relativeY,
        },
      });
      setCycleCollisionDetected(true);
    }
  }
};

const animationInterval = setInterval(checkCollision, 50);

return () => clearInterval(animationInterval);
}, [cycleCollisionDetected, containerRef]);

useEffect(() => {
if (collision.detected && collision.coordinates) {
  setTimeout(() => {
    setCollision({ detected: false, coordinates: null });
    setCycleCollisionDetected(false);
  }, 2000);

  setTimeout(() => {
    setBeamKey((prevKey) => prevKey + 1);
  }, 2000);
}
}, [collision]);

return (
<>
  <motion.div
    key={beamKey}
    ref={beamRef}
    animate="animate"
    initial={{
      translateY: beamOptions.initialY || "-200px",
      translateX: beamOptions.initialX || "0px",
      rotate: beamOptions.rotate || 0,
    }}
    variants={{
      animate: {
        translateY: beamOptions.translateY || "1800px",
        translateX: beamOptions.translateX || "0px",
        rotate: beamOptions.rotate || 0,
      },
    }}
    transition={{
      duration: beamOptions.duration || 8,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
      delay: beamOptions.delay || 0,
      repeatDelay: beamOptions.repeatDelay || 0,
    }}
    className={cn(
      "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent",
      beamOptions.className
    )}
  />
  <AnimatePresence>
    {collision.detected && collision.coordinates && (
      <Explosion
        key={\`\${collision.coordinates.x}-\${collision.coordinates.y}\`}
        className=""
        style={{
          left: \`\${collision.coordinates.x}px\`,
          top: \`\${collision.coordinates.y}px\`,
          transform: "translate(-50%, -50%)",
        }}
      />
    )}
  </AnimatePresence>
</>
);
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
const spans = Array.from({ length: 20 }, (_, index) => ({
id: index,
initialX: 0,
initialY: 0,
directionX: Math.floor(Math.random() * 80 - 40),
directionY: Math.floor(Math.random() * -50 - 10),
}));

return (
<div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
  ></motion.div>
  {spans.map((span) => (
    <motion.span
      key={span.id}
      initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
      animate={{
        x: span.directionX,
        y: span.directionY,
        opacity: 0,
      }}
      transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
      className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"
    />
  ))}
</div>
);
};
`
            }
          }
        }
      },
      "page-wrapper.tsx": {
        file: {
          contents: `"use client";

import React, { PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { settings } from "@/blocksweb.config";
import { BlockswebProvider } from "@blocksweb/core/editor";
import { initializeCollections } from "@/lib/initialize-collections";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

initializeCollections(queryClient);

function InnerWrapper({ children }: PropsWithChildren<{}>) {
  const queryClient = useQueryClient();

  useEffect(() => {
    initializeCollections(queryClient);
  }, [queryClient]);

  return (
    <BlockswebProvider settings={settings}>{children as any}</BlockswebProvider>
  );
}

export default function PageWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerWrapper>{children as any}</InnerWrapper>
    </QueryClientProvider>
  );
}`
        }
      }
    }
  },
  lib: {
    directory: {
      "utils.ts": {
        file: {
          contents: `import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`
        }
      },
      "initialize-collections.ts": {
        file: {
          contents: `import { QueryClient } from "@tanstack/react-query";

export function initializeCollections(queryClient: QueryClient) {
  // Collections initialization logic would go here
  // This is a placeholder for the BlocksWeb collections system
  console.log("Collections initialized with query client");
}`
        }
      },
      "mcp-client.ts": {
        file: {
          contents: `/**
 * MCP Client for BlocksWeb
 * Provides methods to interact with the BlocksWeb MCP Server
 */

export interface MCPRequest {
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse<T = unknown> {
  data?: T;
  error?: string;
}

class MCPClient {
  private baseUrl = "/api/mcp";

  async call<T = unknown>(method: string, params?: Record<string, unknown>): Promise<MCPResponse<T>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method, params }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { error: error.error || "MCP request failed" };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error("MCP Client Error:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Convenience methods
  async getPages() {
    return this.call("get_pages");
  }

  async getPage(slug: string) {
    return this.call("get_page", { slug });
  }

  async updatePage(slug: string, data: Record<string, unknown>) {
    return this.call("update_page", { slug, data });
  }

  async createComponent(componentData: Record<string, unknown>) {
    return this.call("create_component", componentData);
  }

  async getServerInfo() {
    try {
      const response = await fetch(this.baseUrl, {
        method: "GET",
      });
      return response.json();
    } catch (error) {
      console.error("Failed to get MCP server info:", error);
      return null;
    }
  }
}

export const mcpClient = new MCPClient();`
        }
      }
    }
  },
  settings: {
    directory: {
      "schema-registry.ts": {
        file: {
          contents: `import { ComponentData } from "@blocksweb/core/editor";

export const componentSchemas: ComponentData[] = [
  {
    displayName: "Hero Section",
    options: [
      {
        name: "title",
        type: "text",
        label: "Hero Title",
        defaultValue: "Welcome to BlocksWeb",
      },
      {
        name: "subtitle",
        type: "text",
        label: "Hero Subtitle",
        defaultValue: "Build amazing websites with ease",
      },
    ],
  },
  {
    displayName: "Featured Content",
    options: [
      {
        name: "heading",
        type: "text",
        label: "Section Heading",
        defaultValue: "Featured Content",
      },
    ],
  },
];

export function getSchemaByDisplayName(displayName: string): ComponentData | undefined {
  return componentSchemas.find(
    (schema) => schema.displayName?.toLowerCase() === displayName.toLowerCase()
  );
}`
        }
      },
      components: {
        directory: {
          homepage: {
            directory: {
              "hero.tsx": {
                file: {
                      contents: `"use client";

import React from "react";
import { IBlockswebComponent } from "@blocksweb/core/editor";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Welcome to BlocksWeb",
  subtitle = "Build amazing websites with ease"
}) => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="container-custom text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button className="btn-primary">Get Started</button>
          <button className="btn-accent">Learn More</button>
        </div>
      </div>
    </section>
  );
};

const HeroSectionConfig: IBlockswebComponent = {
  component: HeroSection,
  displayName: "Hero Section",
  options: [
    {
      name: "title",
      type: "text",
      label: "Hero Title",
      defaultValue: "Welcome to BlocksWeb",
    },
    {
      name: "subtitle",
      type: "text",
      label: "Hero Subtitle",
      defaultValue: "Build amazing websites with ease",
    },
  ],
};

export default HeroSectionConfig;`
                }
              },
              "featured.tsx": {
                file: {
                  contents: `"use client";

import React from "react";
import { IBlockswebComponent } from "@blocksweb/core/editor";

interface FeaturedProps {
  heading?: string;
}

const Featured: React.FC<FeaturedProps> = ({
  heading = "Featured Content"
}) => {
  return (
    <section className="py-20 bg-background">
      <div className="container-custom">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">
          {heading}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">Feature {i}</h3>
              <p className="text-muted-foreground">
                This is a sample featured content card built with BlocksWeb CMS.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedConfig: IBlockswebComponent = {
  component: Featured,
  displayName: "Featured Content",
  options: [
    {
      name: "heading",
      type: "text",
      label: "Section Heading",
      defaultValue: "Featured Content",
    },
  ],
};

export default FeaturedConfig;`
                }
              }
            }
          }
        }
      }
    }
  },
  app: {
    directory: {
      api: {
        directory: {
          blocksweb: {
            directory: {
              '[...slug]': {
                directory: {
                  'route.ts': {
                    file: {
                          contents: `import { NextResponse } from "next/server";

async function handler(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const { slug } = params;

  if (!slug || slug.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const uri = slug.join("/");
  const baseUrl = "https://cloud.blocksweb.nl/api/";
  const url = new URL(\`v1/\${uri}\`, baseUrl);

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BLOCKSWEB_API_KEY || "",
    },
  };

  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    try {
      const body = await req.json();
      init.body = JSON.stringify(body);
    } catch (error) {
      console.error("Error parsing request body:", error);
    }
  }

  try {
    const response = await fetch(url.toString(), init);
    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Proxy request failed" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, { params });
}

export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, { params });
}

export async function PUT(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, { params });
}

export async function PATCH(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, { params });
}

export async function DELETE(req: Request, { params }: { params: { slug: string[] } }) {
  return handler(req, { params });
}`
                    }
                  }
                }
              }
            }
          },
          mcp: {
            directory: {
              'route.ts': {
                file: {
                  contents: `import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params } = body;

    // Here you can implement MCP server calls
    // For now, we'll create a simple proxy to BlocksWeb API
    const baseUrl = process.env.BLOCKSWEB_URL || "https://cloud.blocksweb.nl";
    const apiKey = process.env.BLOCKSWEB_API_KEY || "";

    // Map MCP methods to BlocksWeb API endpoints
    let endpoint = "";
    let requestBody = {};

    switch (method) {
      case "get_pages":
        endpoint = "/api/v1/pages";
        break;
      case "get_page":
        endpoint = \`/api/v1/pages/\${params?.slug || "index"}\`;
        break;
      case "update_page":
        endpoint = \`/api/v1/pages/\${params?.slug}\`;
        requestBody = params?.data || {};
        break;
      case "create_component":
        endpoint = "/api/v1/components";
        requestBody = params || {};
        break;
      default:
        return NextResponse.json(
          { error: \`Unknown method: \${method}\` },
          { status: 400 }
        );
    }

    const response = await fetch(\`\${baseUrl}\${endpoint}\`, {
      method: method.startsWith("get") ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: Object.keys(requestBody).length > 0 ? JSON.stringify(requestBody) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("MCP Error:", error);
    return NextResponse.json(
      { error: "MCP request failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return MCP server info
  return NextResponse.json({
    name: "blocksweb-mcp-server",
    version: "1.0.0",
    description: "BlocksWeb MCP Server for WebContainer",
    methods: [
      "get_pages",
      "get_page",
      "update_page",
      "create_component"
    ]
  });
}`
                }
              }
            }
          }
        }
      },
      '[[...slug]]': {
        directory: {
          'page.tsx': {
            file: {
                  contents: `import { getServerPage, BlockswebPageServer } from "@blocksweb/core/server";
import { settings } from "@/blocksweb.config";
import { componentSchemas } from "@/settings/schema-registry";
import PageWrapper from "@/components/page-wrapper";

type HomeProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Home({ params }: HomeProps) {
  let slug = (await params)?.slug?.join("/");

  if (!slug) {
    slug = "index";
  }

  try {
    const page = await getServerPage(slug);

    const blockswebPage = {
      ...page,
      createdAt: page.created_at,
      updatedAt: page.updated_at,
      has_draft: page.has_draft ?? false,
      has_published: page.has_published ?? true,
      draft_version: page.draft_version ? {
        ...page.draft_version,
        id: String(page.draft_version.id),
      } : undefined,
      published_version: page.published_version ? {
        ...page.published_version,
        id: String(page.published_version.id),
      } : undefined,
    };

    return (
      <PageWrapper>
        <BlockswebPageServer
          page={blockswebPage}
          settings={settings}
          schemaRegistry={componentSchemas}
          fallback={
            (<div className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700">Page Not Found</h2>
              <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
            </div>) as any
          }
        />
      </PageWrapper>
    );
  } catch (error) {
    const err = error as Error;
    return (
      <PageWrapper>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Error Loading Page</h1>
          <p className="text-red-600">Failed to load page: {slug}</p>
          <p className="text-gray-600 mt-2">{err.message}</p>
        </div>
      </PageWrapper>
    );
  }
}`
            }
          }
        }
      },
      'layout.tsx': {
        file: {
              contents: `import './globals.css'

export const metadata = {
  title: 'BlocksWeb App',
  description: 'A BlocksWeb CMS application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`
        }
      },
      'globals.css': {
        file: {
              contents: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 217 55% 26%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 14 94% 56%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 217 55% 30%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 14 94% 50%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .container-custom {
    @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .btn-primary {
    @apply bg-primary text-white hover:bg-primary/80 transition-colors px-6 py-3 rounded-md font-semibold;
  }

  .btn-accent {
    @apply bg-accent text-white hover:bg-accent/90 transition-colors px-6 py-3 rounded-md font-semibold;
  }
}`
        }
      }
    }
  },
  'blocksweb.config.ts': {
    file: {
      contents: `import { IBlockswebComponent } from "@blocksweb/core/editor";
import HeroSection from "./settings/components/homepage/hero";
import Featured from "./settings/components/homepage/featured";

export const editorComponents = [HeroSection, Featured];

export const settings = {
  editorComponents: editorComponents as IBlockswebComponent[],
  scripts: [],
  styles: [
    \`/_next/static/css/app/[[...slug]]/layout.css\`,
    "_next/static/css/app/[[...slug]]/layout.css",
  ],
};`
    }
  },
  '.env.example': {
    file: {
      contents: `BLOCKSWEB_API_KEY=your_api_key_here`
    }
  },
  '.env': {
    file: {
      contents: `BLOCKSWEB_API_KEY=wsk_RDKObwHqPjLcuKfY2yJOPLm93bcS5WZW9MAn14ixOykwlHE4
BLOCKSWEB_URL=https://cloud.blocksweb.nl`
    }
  },
  'mcp-config.json': {
    file: {
      contents: JSON.stringify({
        "mcpServers": {
          "blocksweb": {
            "command": "npx",
            "args": [
              "-y",
              "@blocksweb/mcp-server"
            ],
            "env": {
              "BLOCKSWEB_API_KEY": "wsk_RDKObwHqPjLcuKfY2yJOPLm93bcS5WZW9MAn14ixOykwlHE4",
              "BLOCKSWEB_URL": "https://cloud.blocksweb.nl"
            }
          }
        }
      }, null, 2)
    }
  },
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: "my-blocksweb-app",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint"
        },
        dependencies: {
          "@blocksweb/core": "2.0.28-beta.0",
          "@blocksweb/mcp-server": "^1.0.0",
          "@hookform/resolvers": "^3.9.0",
          "@tanstack/react-query": "^5.74.4",
          "class-variance-authority": "^0.7.0",
          "clsx": "^2.1.1",
          "date-fns": "^3.6.0",
          "framer-motion": "^11.11.1",
          "lucide-react": "^0.446.0",
          "next": "13.5.1",
          "next-themes": "^0.3.0",
          "react": "18.2.0",
          "react-dom": "18.2.0",
          "react-hook-form": "^7.53.0",
          "tailwind-merge": "^2.5.2",
          "tailwindcss-animate": "^1.0.7",
          "zod": "^3.23.8"
        },
        devDependencies: {
          "@types/node": "20.6.2",
          "@types/react": "18.2.22",
          "@types/react-dom": "18.2.7",
          "autoprefixer": "10.4.15",
          "eslint": "8.49.0",
          "eslint-config-next": "13.5.1",
          "postcss": "8.4.30",
          "tailwindcss": "3.3.3",
          "typescript": "5.2.2"
        }
      }, null, 2)
    }
  },
  'tsconfig.json': {
    file: {
      contents: JSON.stringify({
        compilerOptions: {
          "lib": ["dom", "dom.iterable", "esnext"],
          "allowJs": true,
          "skipLibCheck": true,
          "strict": true,
          "noEmit": true,
          "esModuleInterop": true,
          "module": "esnext",
          "moduleResolution": "node",
          "resolveJsonModule": true,
          "isolatedModules": true,
          "jsx": "preserve",
          "incremental": true,
          "plugins": [
            {
              "name": "next"
            }
          ],
          "paths": {
            "@/*": ["./*"]
          }
        },
        "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "src/custom.d.ts"],
        "exclude": ["node_modules"]
      }, null, 2)
    }
  },
  'next.config.js': {
    file: {
      contents: `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`
    }
  },
  'postcss.config.js': {
    file: {
      contents: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
    }
  },
  'tailwind.config.js': {
    file: {
      contents: `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './settings/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F3A66",
          foreground: "#FFFFFF",
          light: "#2A4E8C",
          dark: "#18304F",
        },
        accent: {
          DEFAULT: "#F95A25",
          foreground: "#FFFFFF",
          light: "#FA7A4F",
          dark: "#E5401D",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`
    }
  },
  'README.md': {
    file: {
      contents: `# BlocksWeb WebContainer with MCP Server

This is a Next.js application with BlocksWeb CMS integration and MCP (Model Context Protocol) server support.

## Features

- **BlocksWeb CMS**: Headless CMS with visual editor
- **MCP Server**: Integrated BlocksWeb MCP server for AI-powered content management
- **Dynamic Routing**: Catch-all routes for flexible page rendering
- **Component System**: Modular component architecture with schema registry

## Environment Variables

Create a \`.env\` file with the following variables:

\`\`\`env
BLOCKSWEB_API_KEY=wsk_RDKObwHqPjLcuKfY2yJOPLm93bcS5WZW9MAn14ixOykwlHE4
BLOCKSWEB_URL=https://cloud.blocksweb.nl
\`\`\`

## MCP Server

The MCP server is available at \`/api/mcp\` and supports the following methods:

### Available Methods

- **get_pages**: Retrieve all pages
- **get_page**: Get a specific page by slug
- **update_page**: Update a page's content
- **create_component**: Create a new component

### Usage Example

\`\`\`typescript
import { mcpClient } from "@/lib/mcp-client";

// Get all pages
const { data, error } = await mcpClient.getPages();

// Get specific page
const page = await mcpClient.getPage("index");

// Update page
await mcpClient.updatePage("about", {
  title: "New Title",
  content: "Updated content"
});

// Get server info
const info = await mcpClient.getServerInfo();
\`\`\`

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Routes

- \`/api/blocksweb/[...slug]\` - BlocksWeb API proxy
- \`/api/mcp\` - MCP server endpoint

## Component Structure

- \`components/\` - React components and UI elements
- \`settings/\` - BlocksWeb configuration and component schemas
- \`app/\` - Next.js app router pages and layouts
- \`lib/\` - Utility functions and MCP client

## Configuration Files

- \`blocksweb.config.ts\` - BlocksWeb editor configuration
- \`mcp-config.json\` - MCP server configuration
- \`tailwind.config.js\` - Tailwind CSS configuration
`
    }
  },
  'next-env.d.ts': {
    file: {
      contents: `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.`
    }
  }
};