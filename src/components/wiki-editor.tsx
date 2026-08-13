"use client";

import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createArticle, updateArticle } from "@/app/actions/articles";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WikiEditorProps {
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
  articleId?: string;
}

interface FormErrors {
  title?: string;
  content?: string;
}

export default function WikiEditor({
  initialTitle = "",
  initialContent = "",
  isEditing = false,
  articleId,
}: WikiEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);

    return Object
      .keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        title: title.trim(),
        content: content.trim(),
      };

      if (isEditing && articleId) {
        await updateArticle(articleId, data);

        router.push(`/wiki/${articleId}`);
        router.refresh();

        return;
      }

      const result = await createArticle(data);

      if (result.id) {
        router.push(`/wiki/${result.id}`);
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to save article:", error);
      alert("Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const shouldLeave = window.confirm(
      "Are you sure? Unsaved changes will be lost.",
    );

    if (shouldLeave) {
      router.back();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Article" : "Create New Article"}
        </h1>

        {isEditing && articleId && (
          <p className="mt-2 text-muted-foreground">
            Editing article ID: {articleId}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Article Title</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>

              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter article title..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />

              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown) *</Label>

              <div
                className={`rounded-md border ${
                  errors.content ? "border-destructive" : ""
                }`}
              >
                <MDEditor
                  value={content}
                  onChange={(value) => setContent(value ?? "")}
                  preview="edit"
                  visibleDragbar={false}
                  textareaProps={{
                    name: "content",
                    placeholder: "Write your article content in Markdown...",
                    autoComplete: "off",
                    spellCheck: false,
                  }}
                />
              </div>

              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Article"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
