import { SimpleEditor } from "@/components/tiptap/tiptap-templates/simple/simple-editor";

export function TextEditor({ ...props  } : React.ComponentProps<"textarea">) {

    const { value, onChange } = props;

  return (
    <SimpleEditor value={value} onChange={onChange} />
  );
}