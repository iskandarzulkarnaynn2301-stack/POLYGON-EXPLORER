import { useState } from 'react';
import type { GameStage, GameState, TestResult, WorkshopShape } from './types/game';
import { Navbar } from './components/Navbar';
import { Stage1NameEntry } from './components/Stage1NameEntry';
import { Stage2Home } from './components/Stage2Home';
import { Stage3PreTest } from './components/Stage3PreTest';
import { Stage4LearningVideo } from './components/Stage4LearningVideo';
import { Stage5MeetPolygons } from './components/Stage5MeetPolygons';
import { Stage6DiscoveryLab } from './components/Stage6DiscoveryLab';
import { Stage7PatternWorkshop } from './components/Stage7PatternWorkshop';
import { Stage8PostTest } from './components/Stage8PostTest';
import { Stage9Results } from './components/Stage9Results';
import { TeacherGuideModal } from './components/TeacherGuideModal';

export function App() {
  const [gameState, setGameState] = useState<GameState>({
    studentName: '',
    currentStage: 'name_entry',
    completedStages: [],
    preTestResult: null,
    postTestResult: null,
    exploredPolygons: [],
    workshopShapes: [],
    isTeacherGuideOpen: false
  });

  const navigateTo = (stage: GameStage) => {
    setGameState((prev) => ({
      ...prev,
      currentStage: stage
    }));
  };

  const markStageCompleted = (stage: GameStage) => {
    setGameState((prev) => ({
      ...prev,
      completedStages: prev.completedStages.includes(stage)
        ? prev.completedStages
        : [...prev.completedStages, stage]
    }));
  };

  const handleSetStudentName = (name: string) => {
    setGameState((prev) => ({
      ...prev,
      studentName: name,
      completedStages: prev.completedStages.includes('name_entry')
        ? prev.completedStages
        : [...prev.completedStages, 'name_entry'],
      currentStage: 'home'
    }));
  };

  const handleStartAdventure = () => {
    markStageCompleted('home');
    navigateTo('pre_test');
  };

  const handleCompletePreTest = (result: TestResult) => {
    markStageCompleted('pre_test');
    setGameState((prev) => ({
      ...prev,
      preTestResult: result,
      currentStage: 'video'
    }));
  };

  const handleCompleteVideo = () => {
    markStageCompleted('video');
    navigateTo('meet');
  };

  const handlePolygonExplored = (key: string) => {
    setGameState((prev) => ({
      ...prev,
      exploredPolygons: prev.exploredPolygons.includes(key)
        ? prev.exploredPolygons
        : [...prev.exploredPolygons, key]
    }));
  };

  const handleCompleteMeetStage = () => {
    markStageCompleted('meet');
    navigateTo('explore');
  };

  const handleCompleteDiscovery = () => {
    markStageCompleted('explore');
    navigateTo('workshop');
  };

  const handleUpdateWorkshopShapes = (shapes: WorkshopShape[]) => {
    setGameState((prev) => ({
      ...prev,
      workshopShapes: shapes
    }));
  };

  const handleCompleteWorkshop = () => {
    markStageCompleted('workshop');
    navigateTo('post_test');
  };

  const handleCompletePostTest = (result: TestResult) => {
    markStageCompleted('post_test');
    markStageCompleted('results');
    setGameState((prev) => ({
      ...prev,
      postTestResult: result,
      currentStage: 'results'
    }));
  };

  const handleRestartGame = () => {
    setGameState({
      studentName: '',
      currentStage: 'name_entry',
      completedStages: [],
      preTestResult: null,
      postTestResult: null,
      exploredPolygons: [],
      workshopShapes: [],
      isTeacherGuideOpen: false
    });
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-200">
      {/* Navigation Header bar with journey progress map */}
      <Navbar
        studentName={gameState.studentName}
        currentStage={gameState.currentStage}
        completedStages={gameState.completedStages}
        onNavigate={navigateTo}
        onOpenTeacherGuide={() => setGameState((prev) => ({ ...prev, isTeacherGuideOpen: true }))}
        onChangeName={() => navigateTo('name_entry')}
      />

      {/* Stage Router Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 transition-all duration-300">
        {gameState.currentStage === 'name_entry' && (
          <Stage1NameEntry
            initialName={gameState.studentName}
            onSubmitName={handleSetStudentName}
          />
        )}

        {gameState.currentStage === 'home' && (
          <Stage2Home
            studentName={gameState.studentName}
            onStartAdventure={handleStartAdventure}
            onChangeName={() => navigateTo('name_entry')}
          />
        )}

        {gameState.currentStage === 'pre_test' && (
          <Stage3PreTest
            studentName={gameState.studentName}
            onCompletePreTest={handleCompletePreTest}
          />
        )}

        {gameState.currentStage === 'video' && (
          <Stage4LearningVideo onCompleteVideo={handleCompleteVideo} />
        )}

        {gameState.currentStage === 'meet' && (
          <Stage5MeetPolygons
            exploredPolygons={gameState.exploredPolygons}
            onPolygonExplored={handlePolygonExplored}
            onCompleteMeetStage={handleCompleteMeetStage}
          />
        )}

        {gameState.currentStage === 'explore' && (
          <Stage6DiscoveryLab onCompleteDiscovery={handleCompleteDiscovery} />
        )}

        {gameState.currentStage === 'workshop' && (
          <Stage7PatternWorkshop
            shapes={gameState.workshopShapes}
            onUpdateShapes={handleUpdateWorkshopShapes}
            onCompleteWorkshop={handleCompleteWorkshop}
          />
        )}

        {gameState.currentStage === 'post_test' && (
          <Stage8PostTest
            studentName={gameState.studentName}
            onCompletePostTest={handleCompletePostTest}
          />
        )}

        {gameState.currentStage === 'results' && (
          <Stage9Results
            studentName={gameState.studentName}
            preTestResult={gameState.preTestResult}
            postTestResult={gameState.postTestResult}
            onRevisitActivities={(stage) => navigateTo(stage)}
            onReturnHome={() => navigateTo('home')}
            onRestartGame={handleRestartGame}
            onOpenTeacherGuide={() => setGameState((prev) => ({ ...prev, isTeacherGuideOpen: true }))}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-200 py-4 px-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>POLYGON EXPLORER: THE ADVENTURE OF POLYGONIA © Malaysian Year 3 Mathematics</span>
          <button
            onClick={() => setGameState((prev) => ({ ...prev, isTeacherGuideOpen: true }))}
            className="text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            Teacher Guide & Curriculum Alignment
          </button>
        </div>
      </footer>

      {/* Teacher Guide Modal */}
      <TeacherGuideModal
        isOpen={gameState.isTeacherGuideOpen}
        onClose={() => setGameState((prev) => ({ ...prev, isTeacherGuideOpen: false }))}
      />
    </div>
  );
}

export default App;
