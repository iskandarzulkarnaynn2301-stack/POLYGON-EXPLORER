import { useState } from 'react';
import type { GameStage, GameState, TestResult, WorkshopShape } from './types/game';
import { Navbar } from './components/Navbar';
import { Stage1NameEntry } from './components/Stage1NameEntry';
import { Stage2Home } from './components/Stage2Home';
import { Stage3PreTest } from './components/Stage3PreTest';
import { Stage4LearningVideo } from './components/Stage4LearningVideo';
import { Stage5MeetPolygons } from './components/Stage5MeetPolygons';
import { Stage7MemoryCorner } from './components/Stage7MemoryCorner';
import { Stage6DiscoveryLab } from './components/Stage6DiscoveryLab';
import { Stage7PatternWorkshop } from './components/Stage7PatternWorkshop';
import { Stage8PostTest } from './components/Stage8PostTest';
import { Stage9Results } from './components/Stage9Results';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { Trophy, ArrowRight } from 'lucide-react';
import { PikoMascot } from './components/PikoMascot';

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
    // Stage sequence for lock checks (10 stages)
    const stageSequence: GameStage[] = [
      'name_entry', 'home', 'pre_test',
      'video', 'meet', 'memory', 'explore', 'workshop', 'post_test', 'results'
    ];
    const targetIdx = stageSequence.indexOf(stage === 'pre_test_results' ? 'pre_test' : stage);
    const canNavigate = targetIdx <= 1 ||
      gameState.completedStages.includes(stage) ||
      stageSequence.slice(0, targetIdx).every((s) => gameState.completedStages.includes(s));

    if (canNavigate) {
      setGameState((prev) => ({
        ...prev,
        currentStage: stage
      }));
    }
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
      currentStage: 'pre_test_results'
    }));
  };

  const handleContinueFromPreTestResults = () => {
    markStageCompleted('pre_test_results');
    navigateTo('video');
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
    navigateTo('memory');
  };

  const handleCompleteMemoryCorner = () => {
    markStageCompleted('memory');
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

        {gameState.currentStage === 'pre_test_results' && (
          <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 bg-white rounded-3xl border-4 border-amber-400 shadow-2xl my-8">
            <PikoMascot mood={gameState.preTestResult && gameState.preTestResult.score >= 7 ? 'celebrating' : 'happy'} size="lg" />

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-amber-600" /> Pre-Test Assessment Complete
              </div>
              <h2 className="text-3xl font-black text-slate-800">YOUR PRE-TEST RESULT</h2>
              <p className="text-slate-600 text-sm font-semibold">
                Explorer <span className="font-extrabold text-indigo-600 underline">{gameState.studentName}</span>
              </p>
            </div>

            {gameState.preTestResult && (
              <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-2xl space-y-2 max-w-sm mx-auto">
                <span className="text-xs uppercase font-extrabold text-amber-900 block tracking-wider">
                  Initial Assessment Score
                </span>
                <div className="text-5xl font-black text-amber-600">
                  {gameState.preTestResult.score} <span className="text-2xl text-slate-400 font-extrabold">/ 10</span>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full inline-block">
                  Percentage: {gameState.preTestResult.score * 10}%
                </span>
              </div>
            )}

            <p className="text-slate-700 text-base font-extrabold leading-relaxed px-4">
              “Great effort, {gameState.studentName}! You scored {gameState.preTestResult?.score || 0} out of 10. Every question is a chance to learn something new in Polygonia!”
            </p>

            <button
              onClick={handleContinueFromPreTestResults}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>CONTINUE TO LEARNING VIDEO</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
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

        {gameState.currentStage === 'memory' && (
          <Stage7MemoryCorner onCompleteMemoryCorner={handleCompleteMemoryCorner} />
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
