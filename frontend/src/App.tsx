import React, { useState, useEffect } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { HypKraftNavbar } from './components/HypKraftNavbar';
import { HypKraftSidebar } from './components/HypKraftSidebar';
import { HypKraftCreateWithAI } from './components/Panels/HypKraftCreateWithAI';
import { HypKraftMediaGallery } from './components/Panels/HypKraftMediaGallery';
import { HypKraftPlayer } from './components/Viewport/HypKraftPlayer';
import { HypKraftTimeline } from './components/Timeline/HypKraftTimeline';
import { HypKraftRightSidebar } from './components/Panels/HypKraftRightSidebar';
import { ModelSettingsModal } from './components/Modals/ModelSettingsModal';
import { ExportModal } from './components/Modals/ExportModal';
import { MCPModal } from './components/Modals/MCPModal';
import { AnimatedInstaller } from './components/Installer/AnimatedInstaller';
import { useEditorStore } from './hooks/useEditorStore';
import { api } from './services/api';

export function App() {
  const {
    project,
    currentTime,
    isPlaying,
    selectedClipId,
    selectedClip,
    zoom,
    seek,
    togglePlay,
    selectClip,
    updateClip,
    addClip,
    removeClip,
    splitClipAtTime,
    setAspectRatio,
    setProjectData,
    undo,
    redo
  } = useEditorStore();

  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [isModelSettingsOpen, setIsModelSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMCPOpen, setIsMCPOpen] = useState(false);
  const [isInstallerOpen, setIsInstallerOpen] = useState(false);

  // Starter media check
  useEffect(() => {
    api.getStarterMedia().catch(() => {});
  }, []);

  // Listen to Electron native menu actions
  useEffect(() => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.onMenuAction((action: string) => {
        if (action === 'open-models') setIsModelSettingsOpen(true);
        else if (action === 'export-video') setIsExportOpen(true);
        else if (action === 'open-mcp' || action === 'copy-mcp-config') setIsMCPOpen(true);
        else if (action === 'undo') undo();
        else if (action === 'redo') redo();
        else if (action === 'split-clip' && selectedClipId) splitClipAtTime(selectedClipId, currentTime);
        else if (action === 'delete-clip' && selectedClipId) removeClip(selectedClipId);
      });
    }
  }, [selectedClipId, currentTime, undo, redo, splitClipAtTime, removeClip]);

  const handleSaveProject = async () => {
    try {
      await api.saveProject(project.id, project.name, project);
      alert('HypKraft Project saved successfully!');
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const res = await api.uploadMedia(file);
      addClip('track_video_1', {
        id: `clip_${Date.now()}`,
        name: res.name,
        type: res.type,
        src: res.url,
        start: currentTime,
        duration: Math.min(res.metadata?.duration || 10, 15),
        inPoint: 0
      });
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#f1f4fb] text-slate-800 overflow-hidden select-none">
      {/* Top Header Navbar */}
      <HypKraftNavbar
        projectName={project.name}
        onProjectNameChange={(name) => setProjectData({ ...project, name })}
        onOpenModelSettings={() => setIsModelSettingsOpen(true)}
        onOpenMCPModal={() => setIsMCPOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onSave={handleSaveProject}
        onMenuAction={(action) => {
          if (action === 'new-project') setIsInstallerOpen(true);
        }}
      />

      {/* Main Resizable, Scalable, Dockable Panel Layout */}
      <div className="flex-1 flex overflow-hidden p-2 gap-1.5">
        <Group orientation="horizontal">
          {/* Left Navigation Sidebar Panel */}
          <Panel defaultSize="15%" minSize="12%" maxSize="22%" className="flex flex-col">
            <HypKraftSidebar
              activeTab={activeNavTab}
              onTabChange={(tab) => {
                setActiveNavTab(tab);
                if (tab === 'settings') setIsModelSettingsOpen(true);
              }}
            />
          </Panel>

          {/* Draggable Vertical Divider Handle */}
          <Separator className="w-1.5 hover:bg-violet-400 active:bg-violet-600 transition-colors cursor-col-resize rounded-full mx-0.5" />

          {/* Center Workspace Area */}
          <Panel defaultSize="62%" minSize="45%" className="flex flex-col">
            <Group orientation="vertical">
              {/* Center Top: Create with AI Prompt Panel */}
              <Panel defaultSize="22%" minSize="15%" maxSize="32%">
                <HypKraftCreateWithAI
                  project={project}
                  currentTime={currentTime}
                  onApplyPlan={(updated) => setProjectData(updated)}
                  onOpenModelSettings={() => setIsModelSettingsOpen(true)}
                />
              </Panel>

              {/* Draggable Horizontal Divider Handle */}
              <Separator className="h-1.5 hover:bg-violet-400 active:bg-violet-600 transition-colors cursor-row-resize rounded-full my-0.5" />

              {/* Center Middle: Media Library & Main Video Player Viewport */}
              <Panel defaultSize="48%" minSize="30%">
                <Group orientation="horizontal">
                  {/* Media Gallery Thumbnails Panel */}
                  <Panel defaultSize="32%" minSize="20%" maxSize="45%">
                    <HypKraftMediaGallery
                      currentTime={currentTime}
                      onAddClip={addClip}
                      onFileUpload={handleFileUpload}
                    />
                  </Panel>

                  {/* Draggable Divider Handle */}
                  <Separator className="w-1.5 hover:bg-violet-400 active:bg-violet-600 transition-colors cursor-col-resize rounded-full mx-0.5" />

                  {/* Main Video Preview Player */}
                  <Panel defaultSize="68%" minSize="45%">
                    <HypKraftPlayer
                      project={project}
                      currentTime={currentTime}
                      isPlaying={isPlaying}
                      selectedClip={selectedClip}
                      onTogglePlay={togglePlay}
                      onSeek={seek}
                      onAspectRatioChange={setAspectRatio}
                    />
                  </Panel>
                </Group>
              </Panel>

              {/* Draggable Horizontal Divider Handle */}
              <Separator className="h-1.5 hover:bg-violet-400 active:bg-violet-600 transition-colors cursor-row-resize rounded-full my-0.5" />

              {/* Center Bottom: Multi-Track NLE Timeline */}
              <Panel defaultSize="30%" minSize="22%" maxSize="45%">
                <HypKraftTimeline
                  project={project}
                  currentTime={currentTime}
                  zoom={zoom}
                  selectedClipId={selectedClipId}
                  onSeek={seek}
                  onSelectClip={selectClip}
                  onUpdateClip={updateClip}
                  onSplitClip={splitClipAtTime}
                  onRemoveClip={removeClip}
                  onUndo={undo}
                  onRedo={redo}
                />
              </Panel>
            </Group>
          </Panel>

          {/* Draggable Vertical Divider Handle */}
          <Separator className="w-1.5 hover:bg-violet-400 active:bg-violet-600 transition-colors cursor-col-resize rounded-full mx-0.5" />

          {/* Right Sidebar: AI Generator & Model Selector Panel */}
          <Panel defaultSize="23%" minSize="18%" maxSize="35%">
            <HypKraftRightSidebar
              selectedClip={selectedClip}
              onUpdateClip={updateClip}
              onDeleteClip={removeClip}
              onAddClip={addClip}
              currentTime={currentTime}
            />
          </Panel>
        </Group>
      </div>

      {/* Model Selector Hub Modal */}
      <ModelSettingsModal
        isOpen={isModelSettingsOpen}
        onClose={() => setIsModelSettingsOpen(false)}
      />

      {/* Export Render Modal */}
      <ExportModal
        isOpen={isExportOpen}
        project={project}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Model Context Protocol (MCP) Modal */}
      <MCPModal
        isOpen={isMCPOpen}
        onClose={() => setIsMCPOpen(false)}
      />

      {/* Animated Installer Wizard Modal */}
      <AnimatedInstaller
        isOpen={isInstallerOpen}
        onClose={() => setIsInstallerOpen(false)}
        onLaunchStudio={() => setIsInstallerOpen(false)}
      />
    </div>
  );
}

export default App;
