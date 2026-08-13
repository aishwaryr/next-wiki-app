"use client";

import { Calendar, ChevronRight, Edit, Home, Trash, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { deleteArticle } from "@/app/actions/articles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ViewerArticle {
  id: number;
  title: string;
  content: string;
  author: string | null;
  createdAt: string;
  imageUrl?: string | null;
}

interface WikiArticleViewerProps {
  article: ViewerArticle;
  canEdit?: boolean;
}

export default function WikiArticleViewer({
  article,
  canEdit = false,
}: WikiArticleViewerProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteArticle(String(article.id));

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete article:", error);
      alert("Failed to delete article");
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="flex items-center hover:text-foreground">
          <Home className="mr-1 h-4 w-4" />
          Home
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-foreground">{article.title}</span>
      </nav>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />

              <span>By {article.author ?? "Unknown"}</span>
            </div>

            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />

              <span>{formatDate(article.createdAt)}</span>
            </div>

            <Badge variant="secondary">Article</Badge>
          </div>
        </div>

        {canEdit && (
          <div className="ml-4 flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/wiki/edit/${article.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="mr-2 h-4 w-4" />

              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-stone max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-4 mt-8 text-3xl font-bold">{children}</h1>
                ),

                h2: ({ children }) => (
                  <h2 className="mb-3 mt-6 text-2xl font-semibold">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="mb-2 mt-4 text-xl font-semibold">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="mb-4 leading-7">{children}</p>
                ),

                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc">{children}</ul>
                ),

                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal">{children}</ol>
                ),

                li: ({ children }) => <li className="mb-1">{children}</li>,

                code: ({ children, className }) => {
                  const isBlock = Boolean(className);

                  if (isBlock) {
                    return <code className={className}>{children}</code>;
                  }

                  return (
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                      {children}
                    </code>
                  );
                },

                pre: ({ children }) => (
                  <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                    {children}
                  </pre>
                ),

                blockquote: ({ children }) => (
                  <blockquote className="my-4 border-l-4 pl-4 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),

                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/">← Back to Articles</Link>
        </Button>
      </div>
    </div>
  );
}
