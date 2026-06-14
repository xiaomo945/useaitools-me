import TemplateEditor from '../../TemplateEditor';

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  return <TemplateEditor templateId={params.id} />;
}
