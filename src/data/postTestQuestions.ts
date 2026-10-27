import type { AssessmentItem } from '../types/game';

export const POST_TEST_QUESTIONS: AssessmentItem[] = [
  // Item 1: Name identification (Octagon)
  {
    id: 1,
    type: 'identification',
    question: 'What is the name of a regular polygon with 8 straight sides of equal length?',
    illustrationType: 'octagon',
    options: [
      { id: 'a', text: 'Regular Pentagon' },
      { id: 'b', text: 'Regular Hexagon' },
      { id: 'c', text: 'Regular Heptagon' },
      { id: 'd', text: 'Regular Octagon' }
    ],
    correctOptionId: 'd',
    explanation: 'A regular polygon with 8 equal straight sides is called an octagon.',
    learningObjective: '7.3.1 Identify regular octagon.'
  },
  // Item 2: Side counting (Pentagon)
  {
    id: 2,
    type: 'property',
    question: 'How many straight sides does a regular pentagon have?',
    illustrationType: 'pentagon',
    options: [
      { id: 'a', text: '5 sides' },
      { id: 'b', text: '6 sides' },
      { id: 'c', text: '7 sides' },
      { id: 'd', text: '8 sides' }
    ],
    correctOptionId: 'a',
    explanation: 'A pentagon always has 5 straight sides.',
    learningObjective: '7.3.1 Determine the number of straight sides of a pentagon.'
  },
  // Item 3: Vertex counting (Heptagon)
  {
    id: 3,
    type: 'property',
    question: 'How many vertices (corners) does a regular heptagon have?',
    illustrationType: 'heptagon',
    options: [
      { id: 'a', text: '5 vertices' },
      { id: 'b', text: '6 vertices' },
      { id: 'c', text: '7 vertices' },
      { id: 'd', text: '8 vertices' }
    ],
    correctOptionId: 'c',
    explanation: 'A heptagon has 7 vertices (corners).',
    learningObjective: '7.3.1 Determine the number of vertices of a heptagon.'
  },
  // Item 4: Regular characteristics
  {
    id: 4,
    type: 'property',
    question: 'A shape has 6 straight sides, but two sides are longer than the others. Is it a regular hexagon?',
    options: [
      { id: 'a', text: 'Yes, because it has 6 sides' },
      { id: 'b', text: 'No, because regular polygons must have ALL sides equal in length' },
      { id: 'c', text: 'Yes, because all hexagons are regular' },
      { id: 'd', text: 'No, because it should have 8 sides' }
    ],
    correctOptionId: 'b',
    explanation: 'A regular hexagon must have all 6 sides equal in length.',
    learningObjective: '7.3.1 Recognise basic characteristics of regular polygons.'
  },
  // Item 5: Regular vs Irregular
  {
    id: 5,
    type: 'property',
    question: 'Look at the polygon below. Is this shape a REGULAR or IRREGULAR polygon?',
    illustrationType: 'irregular_hexagon',
    options: [
      { id: 'a', text: 'Regular Polygon' },
      { id: 'b', text: 'Irregular Polygon' },
      { id: 'c', text: 'Circle' }
    ],
    correctOptionId: 'b',
    explanation: 'The sides of this polygon are unequal in length, so it is an irregular polygon.',
    learningObjective: '7.3.1 Distinguish regular polygons from irregular polygons.'
  },
  // Item 6: Rotated orientation recognition
  {
    id: 6,
    type: 'identification',
    question: 'This regular polygon is turned on its side. What polygon is it?',
    illustrationType: 'rotated_heptagon',
    rotationDegrees: 90,
    options: [
      { id: 'a', text: 'Pentagon' },
      { id: 'b', text: 'Hexagon' },
      { id: 'c', text: 'Heptagon' },
      { id: 'd', text: 'Octagon' }
    ],
    correctOptionId: 'c',
    explanation: 'Counting the 7 straight sides shows it is a Heptagon, even when rotated!',
    learningObjective: '7.3.1 Recognise polygons when displayed in different orientations.'
  },
  // Item 7: Hexagon identification
  {
    id: 7,
    type: 'identification',
    question: 'Count the sides of this shape carefully. What is its name?',
    illustrationType: 'hexagon',
    options: [
      { id: 'a', text: 'Pentagon' },
      { id: 'b', text: 'Hexagon' },
      { id: 'c', text: 'Heptagon' },
      { id: 'd', text: 'Octagon' }
    ],
    correctOptionId: 'b',
    explanation: 'A regular polygon with 6 straight sides is a hexagon.',
    learningObjective: '7.3.1 Identify regular hexagon.'
  },
  // Item 8: Visual selection
  {
    id: 8,
    type: 'visual',
    question: 'Which of these shapes is a Regular Pentagon?',
    options: [
      { id: 'a', text: 'Shape A', svgType: 'pentagon', isRegular: true, sides: 5 },
      { id: 'b', text: 'Shape B', svgType: 'irregular_pentagon', isRegular: false, sides: 5 },
      { id: 'c', text: 'Shape C', svgType: 'hexagon', isRegular: true, sides: 6 },
      { id: 'd', text: 'Shape D', svgType: 'heptagon', isRegular: true, sides: 7 }
    ],
    correctOptionId: 'a',
    explanation: 'Shape A is a regular pentagon with 5 equal straight sides.',
    learningObjective: '7.3.1 Apply understanding of polygon characteristics to visual problems.'
  },
  // Item 9: Visual application problem
  {
    id: 9,
    type: 'visual',
    question: 'A honeybee cell grid is made of regular polygons with 6 straight sides of equal length. What shape are they?',
    illustrationType: 'hexagon',
    options: [
      { id: 'a', text: 'Pentagons' },
      { id: 'b', text: 'Hexagons' },
      { id: 'c', text: 'Heptagons' },
      { id: 'd', text: 'Octagons' }
    ],
    correctOptionId: 'b',
    explanation: 'Honeybee cells are shaped like regular hexagons with 6 equal sides.',
    learningObjective: '7.3.1 Apply understanding to visual real-world problems.'
  },
  // Item 10: Pattern Construction / Completion
  {
    id: 10,
    type: 'pattern',
    question: 'Look at the floor tile pattern below. Which polygon tile completes the missing spot [ ? ]?',
    correctOptionId: 'opt-octagon-amber',
    explanation: 'The pattern repeats: Heptagon, Octagon, Pentagon, Heptagon, [Octagon], Pentagon.',
    learningObjective: '7.3.2 Create and complete patterns based on regular polygons.',
    patternData: {
      sequence: [
        { id: 's1', polygon: 'heptagon', color: '#8b5cf6' },
        { id: 's2', polygon: 'octagon', color: '#f59e0b' },
        { id: 's3', polygon: 'pentagon', color: '#3b82f6' },
        { id: 's4', polygon: 'heptagon', color: '#8b5cf6' },
        { id: 's5', polygon: 'octagon', color: 'missing' },
        { id: 's6', polygon: 'pentagon', color: '#3b82f6' }
      ],
      missingIndex: 4,
      options: [
        { id: 'opt-hexagon-green', polygon: 'hexagon', color: '#10b981', label: 'Green Hexagon (6 sides)' },
        { id: 'opt-octagon-amber', polygon: 'octagon', color: '#f59e0b', label: 'Amber Octagon (8 sides)' },
        { id: 'opt-pentagon-blue', polygon: 'pentagon', color: '#3b82f6', label: 'Blue Pentagon (5 sides)' },
        { id: 'opt-heptagon-purple', polygon: 'heptagon', color: '#8b5cf6', label: 'Purple Heptagon (7 sides)' }
      ],
      correctOptionId: 'opt-octagon-amber'
    }
  }
];
