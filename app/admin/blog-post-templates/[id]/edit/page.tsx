import BlogPostTemplateEditor from '../../TemplateEditor';

export const metadata = {
  title: '编辑博客文章模板 - Use AI Tools',
  description: '编辑博客文章模板',
};

export default async function EditBlogPostTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BlogPostTemplateEditor templateId={id} />;
}
