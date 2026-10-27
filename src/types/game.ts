export type GameStage =
  | 'name_entry' // Stage 1
  | 'home'       // Stage 2
  | 'pre_test'   // Stage 3
  | 'video'      // Stage 4
  | 'meet'       // Stage 5
  | 'explore'    // Stage 6
  | 'workshop'   // Stage 7
  | 'post_test'  // Stage 8
  | 'results';   // Stage 9

export interface QuestionOption {
  id: string;
  text: string;
  svgType?: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon' | 'irregular_pentagon' | 'irregular_hexagon' | 'rotated_hexagon' | 'rotated_pentagon' | 'rotated_octagon' | 'triangle' | 'square';
  isRegular?: boolean;
  sides?: number;
}

export interface PatternCompletionItem {
  sequence: Array<{
    id: string;
    polygon: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon';
    color: string;
  }>;
  missingIndex: number;
  options: Array<{
    id: string;
    polygon: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon';
    color: string;
    label: string;
  }>;
  correctOptionId: string;
}

export interface AssessmentItem {
  id: number;
  type: 'identification' | 'property' | 'visual' | 'pattern';
  question: string;
  illustrationType?: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon' | 'irregular_hexagon' | 'rotated_heptagon' | 'rotated_octagon' | 'rotated_pentagon' | 'counting_pentagon' | 'counting_hexagon';
  rotationDegrees?: number;
  highlightSides?: boolean;
  highlightVertices?: boolean;
  options?: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  learningObjective: string;
  patternData?: PatternCompletionItem;
}

export interface TestResult {
  score: number;
  total: number;
  answers: Record<number, string>; // questionId -> selectedOptionId
  completedAt?: Date;
}

export interface WorkshopShape {
  id: string;
  type: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon';
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
}

export interface GameState {
  studentName: string;
  currentStage: GameStage;
  completedStages: GameStage[];
  preTestResult: TestResult | null;
  postTestResult: TestResult | null;
  exploredPolygons: string[];
  workshopShapes: WorkshopShape[];
  isTeacherGuideOpen: boolean;
}
