'use client'

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem } from "@tiptap/extension-task-item"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Underline } from "@tiptap/extension-underline"

// --- Custom Extensions ---
import { Selection } from "@/components/tiptap/tiptap-extension/selection-extension"
import { TrailingNode } from "@/components/tiptap/tiptap-extension/trailing-node-extension"

// --- UI Primitives ---
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import "@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { MarkButton } from "@/components/tiptap/tiptap-ui/mark-button"
import { UndoRedoButton } from "@/components/tiptap/tiptap-ui/undo-redo-button"


// --- Hooks ---
import { useMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Styles ---
import "@/components/tiptap/tiptap-templates/simple/simple-editor.scss"
import { ListButton } from "../../tiptap-ui/list-button"

const MainToolbarContent = () => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" className="cursor-pointer"/>
        <UndoRedoButton action="redo" className="cursor-pointer"/>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ListButton type="bulletList"/>
        <ListButton type="orderedList"/>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold"/>
        <MarkButton type="italic"/>
        <MarkButton type="strike"/>
        <MarkButton type="underline"/>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" className="cursor-pointer" />
        <MarkButton type="subscript" className="cursor-pointer"/>
      </ToolbarGroup>
    </>
  )
}


// MARK: Main Editor Component
interface ISimpleEditor { 
  value?: string | number | readonly string[] | undefined;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
}

export function SimpleEditor({ value, onChange }: ISimpleEditor) {

  const [editorValue, setEditorValue] = React.useState(value?.toString() ?? "")
  const [toolbarVisible, setToolbarVisible] = React.useState(false)

  React.useEffect(() => {
    if (value !== undefined) {
      setEditorValue(value.toString())
    }
  }, [value])

  const isMobile = useMobile()
  const windowSize = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit,
      Underline,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Superscript,
      Subscript,
      
      Selection,
      TrailingNode,
    ],
    content: editorValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setEditorValue(html)
      if (onChange) {
        onChange({
          target: {
            value: html,
          },
        } as React.ChangeEvent<HTMLTextAreaElement>)
      }
    },
    onFocus: () => {
      setToolbarVisible(true)
    },
    onBlur: () => {
      setToolbarVisible(false)
    }
  })

  React.useEffect(() => {
    if (editor && editorValue !== undefined && editor.getHTML() !== editorValue) {
      editor.commands.setContent(editorValue)
    }
  }, [editor, editorValue])

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className={`overflow-hidden ${toolbarVisible ? "max-h-13" : "max-h-0"} transition-all duration-300`}>
        <Toolbar
          onMouseDown={e => e.preventDefault()}
          variant="floating"
          ref={toolbarRef}
          style={
            isMobile
              ? {
                  bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
                }
              : {}
          }
        >
            <MainToolbarContent/>
        </Toolbar>
      </div>

      <div className="content-wrapper">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </div>
    </EditorContext.Provider>
  )
}
