import type { AssessmentItem } from '../types/game';

export const PRE_TEST_QUESTIONS: AssessmentItem[] = [
  // Item 1: Name identification (Pentagon)
  {
    id: 1,
    type: 'identification',
    question: 'What is the name of a regular polygon with 5 straight sides of equal length?',
    illustrationType: 'pentagon',
    options: [
      { id: 'a', text: 'Regular Pentagon' },
      { id: 'b', text: 'Regular Hexagon' },
      { id: 'c', text: 'Regular Heptagon' },
      { id: 'd', text: 'Regular Octagon' }
    ],
    correctOptionId: 'a',
    explanation: 'A regular polygon with 5 equal straight sides is called a pentagon.',
    learningObjective: '7.3.1 Identify regular pentagon.'
  },
  // Item 2: Side counting (Hexagon)
  {
    id: 2,
    type: 'property',
    question: 'How many straight sides does a regular hexagon have?',
    illustrationType: 'hexagon',
    options: [
      { id: 'a', text: '5 sides' },
      { id: 'b', text: '6 sides' },
      { id: 'c', text: '7 sides' },
      { id: 'd', text: '8 sides' }
    ],
    correctOptionId: 'b',
    explanation: 'A hexagon always has 6 straight sides.',
    learningObjective: '7.3.1 Determine the number of straight sides of a hexagon.'
  },
  // Item 3: Vertex counting (Octagon)
  {
    id: 3,
    type: 'property',
    question: 'How many vertices (corners) does a regular octagon have?',
    illustrationType: 'octagon',
    options: [
      { id: 'a', text: '6 vertices' },
      { id: 'b', text: '7 vertices' },
      { id: 'c', text: '8 vertices' },
      { id: 'd', text: '10 vertices' }
    ],
    correctOptionId: 'c',
    explanation: 'An octagon has 8 vertices (corners).',
    learningObjective: '7.3.1 Determine the number of vertices of an octagon.'
  },
  // Item 4: Regular characteristics
  {
    id: 4,
    type: 'property',
    question: 'Which statement is TRUE about all regular polygons?',
    options: [
      { id: 'a', text: 'All sides are curved lines' },
      { id: 'b', text: 'All straight sides are equal in length' },
      { id: 'c', text: 'They always have only 3 sides' },
      { id: 'd', text: 'Their sides are all different lengths' }
    ],
    correctOptionId: 'b',
    explanation: 'A regular polygon has straight sides that are all equal in length.',
    learningObjective: '7.3.1 Recognise basic characteristics of regular polygons.'
  },
  // Item 5: Regular vs Irregular
  {
    id: 5,
    type: 'property',
    question: 'Look at the polygon below. Is this a REGULAR or IRREGULAR polygon?',
    illustrationType: 'irregular_hexagon',
    options: [
      { id: 'a', text: 'Regular Polygon (all sides equal)' },
      { id: 'b', text: 'Irregular Polygon (sides are NOT all equal)' },
      { id: 'c', text: 'Not a polygon at all' }
    ],
    correctOptionId: 'b',
    explanation: 'This polygon has sides of different lengths, so it is an irregular polygon.',
    learningObjective: '7.3.1 Distinguish regular polygons from irregular polygons.'
  },
  // Item 6: Rotated orientation recognition
  {
    id: 6,
    type: 'identification',
    question: 'This shape has been rotated (turned around). What polygon is it?',
    illustrationType: 'rotated_pentagon',
    rotationDegrees: 72,
    options: [
      { id: 'a', text: 'Pentagon (5 sides)' },
      { id: 'b', text: 'Hexagon (6 sides)' },
      { id: 'c', text: 'Heptagon (7 sides)' },
      { id: 'd', text: 'Octagon (8 sides)' }
    ],
    correctOptionId: 'a',
    explanation: 'Rotating a polygon does not change its number of sides. It still has 5 sides, so it is a pentagon.',
    learningObjective: '7.3.1 Recognise polygons when rotated or displayed in different orientations.'
  },
  // Item 7: Heptagon identification
  {
    id: 7,
    type: 'identification',
    question: 'Count the sides of this shape carefully. What is its name?',
    illustrationType: 'heptagon',
    options: [
      { id: 'a', text: 'Hexagon' },
      { id: 'b', text: 'Heptagon' },
      { id: 'c', text: 'Octagon' },
      { id: 'd', text: 'Pentagon' }
    ],
    correctOptionId: 'b',
    explanation: 'A regular polygon with 7 straight sides is a heptagon.',
    learningObjective: '7.3.1 Identify regular heptagon.'
  },
  // Item 8: Visual selection
  {
    id: 8,
    type: 'visual',
    question: 'Which of these shapes is a Regular Hexagon?',
    options: [
      { id: 'a', text: 'Shape A', svgType: 'pentagon', isRegular: true, sides: 5 },
      { id: 'b', text: 'Shape B', svgType: 'hexagon', isRegular: true, sides: 6 },
      { id: 'c', text: 'Shape C', svgType: 'irregular_hexagon', isRegular: false, sides: 6 },
      { id: 'd', text: 'Shape D', svgType: 'octagon', isRegular: true, sides: 8 }
    ],
    correctOptionId: 'b',
    explanation: 'Shape B is a regular hexagon with 6 equal sides.',
    learningObjective: '7.3.1 Apply understanding of polygon characteristics to visual problems.'
  },
  // Item 9: Visual application problem
  {
    id: 9,
    type: 'visual',
    question: 'A stop sign is shaped like a polygon with 8 straight sides of equal length. What type of polygon is it?',
    illustrationType: 'octagon',
    options: [
      { id: 'a', text: 'Pentagon' },
      { id: 'b', text: 'Hexagon' },
      { id: 'c', text: 'Heptagon' },
      { id: 'd', text: 'Octagon' }
    ],
    correctOptionId: 'd',
    explanation: 'A shape with 8 equal straight sides is an octagon.',
    learningObjective: '7.3.1 Apply understanding to visual real-world problems.'
  },
  // Item 10: Pattern Completion
  {
    id: 10,
    type: 'pattern',
    question: 'Look at the pattern below. Which polygon tile goes into the missing space [ ? ] to complete the pattern?',
    correctOptionId: 'opt-hexagon-green',
    explanation: 'The pattern repeats: Pentagon, Hexagon, Octagon, Pentagon, [Hexagon], Octagon.',
    learningObjective: '7.3.2 Create and complete patterns based on regular polygons.',
    patternData: {
      sequence: [
        { id: 's1', polygon: 'pentagon', color: '#3b82f6' },
        { id: 's2', polygon: 'hexagon', color: '#10b981' },
        { id: 's3', polygon: 'octagon', color: '#f59e0b' },
        { id: 's4', polygon: 'pentagon', color: '#3b82f6' },
        { id: 's5', polygon: 'hexagon', color: 'missing' },
        { id: 's6', polygon: 'octagon', color: '#f59e0b' }
      ],
      missingIndex: 4,
      options: [
        { id: 'opt-pentagon-blue', polygon: 'pentagon', color: '#3b82f6', label: 'Blue Pentagon (5 sides)' },
        { id: 'opt-hexagon-green', polygon: 'hexagon', color: '#10b981', label: 'Green Hexagon (6 sides)' },
        { id: 'opt-heptagon-purple', polygon: 'heptagon', color: '#8b5cf6', label: 'Purple Heptagon (7 sides)' },
        { id: 'opt-octagon-amber', polygon: 'octagon', color: '#f59e0b', label: 'Amber Octagon (8 sides)' }
      ],
      correctOptionId: 'opt-hexagon-green'
    }
  }
];
