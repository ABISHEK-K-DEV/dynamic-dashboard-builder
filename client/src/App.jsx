import { useState } from 'react';
import { EditorShell } from './editor/EditorShell';
import { ProjectsList } from './editor/ProjectsList';
import { useEditorStore } from './store/editorStore';

export function App() {
  const [view, setView] = useState('projects');
  const setSelection = useEditorStore((s) => s.setSelection);

  return (
    <>
      {view === 'projects' ? (
        <ProjectsList
          onOpened={() => {
            setSelection([]);
            setView('editor');
          }}
        />
      ) : (
        <EditorShell onBackToProjects={() => setView('projects')} />
      )}
    </>
  );
}
