import { notFound } from "next/navigation";

import WikiArticleViewer from "@/components/wiki-article-viewer";
import { authorizeUserToEditArticle } from "@/db/authz";
import { getArticleById } from "@/lib/data/articles";
import { hexclaveServerApp } from "@/hexclave/server";

interface ViewArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewArticlePage({
  params,
}: ViewArticlePageProps) {
  const { id } = await params;

  const article = await getArticleById(+id);

  if (!article) {
    notFound();
  }

  const user = await hexclaveServerApp.getUser();

  const canEdit = user ? await authorizeUserToEditArticle(user.id, +id) : false;

  return <WikiArticleViewer article={article} canEdit={canEdit} />;
}
