import type { AssessmentItem } from '../types/game';

export const PRE_TEST_QUESTIONS: AssessmentItem[] = [
  // Question 1 (Type A: Identify the Polygon - Pentagon)
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

  // Question 2 (Type B: Count the Sides - Hexagon)
  {
    id: 2,
    type: 'property',
    question: 'How many straight sides does this regular hexagon have?',
    illustrationType: 'hexagon',
    options: [
      { id: 'a', text: '5 sides' },
      { id: 'b', text: '6 sides' },
      { id: 'c', text: '7 sides' },
      { id: 'd', text: '8 sides' }
    ],
    correctOptionId: 'b',
    explanation: 'A regular hexagon always has 6 straight sides.',
    learningObjective: '7.3.1 Determine the number of straight sides of a hexagon.'
  },

  // Question 3 (Type C: Count the Vertices - Heptagon)
  {
    id: 3,
    type: 'property',
    question: 'How many vertices (corners) can you count in this regular heptagon?',
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

  // Question 4 (Type G: Choose the Correct Statement)
  {
    id: 4,
    type: 'property',
    question: 'Which statement is TRUE about all regular polygons?',
    options: [
      { id: 'a', text: 'All straight sides are equal in length' },
      { id: 'b', text: 'All sides are curved lines' },
      { id: 'c', text: 'They always have only 3 sides' },
      { id: 'd', text: 'Their sides are all different lengths' }
    ],
    correctOptionId: 'a',
    explanation: 'A regular polygon has straight sides that are all equal in length.',
    learningObjective: '7.3.1 Recognise basic characteristics of regular polygons.'
  },

  // Question 5 (Type D: Regular or Irregular - Irregular Hexagon)
  {
    id: 5,
    type: 'property',
    question: 'Look at the polygon below. Is this a REGULAR or IRREGULAR polygon?',
    illustrationType: 'irregular_hexagon',
    options: [
      { id: 'a', text: 'Regular Polygon (all sides are equal)' },
      { id: 'b', text: 'Irregular Polygon (sides are NOT all equal)' },
      { id: 'c', text: 'Curved shape (not made of straight lines)' }
    ],
    correctOptionId: 'b',
    explanation: 'This polygon has 6 straight sides of unequal lengths, so it is an irregular polygon.',
    learningObjective: '7.3.1 Distinguish regular polygons from irregular polygons.'
  },

  // Question 6 (Type F: Recognise a Rotated Polygon - Pentagon)
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

  // Question 7 (Type E: Find the Correct Polygon - Octagon)
  {
    id: 7,
    type: 'identification',
    question: 'Piko needs a regular polygon with 8 vertices. Which shape has 8 vertices?',
    illustrationType: 'octagon',
    options: [
      { id: 'a', text: 'Pentagon' },
      { id: 'b', text: 'Hexagon' },
      { id: 'c', text: 'Heptagon' },
      { id: 'd', text: 'Octagon' }
    ],
    correctOptionId: 'd',
    explanation: 'An octagon has 8 straight sides and 8 vertices.',
    learningObjective: '7.3.1 Identify regular octagon characteristics.'
  },

  // Question 8 (Type H: Visual Comparison)
  {
    id: 8,
    type: 'visual',
    question: 'Which polygon has MORE straight sides: a Regular Pentagon or a Regular Octagon?',
    options: [
      { id: 'a', text: 'Regular Octagon (8 sides vs 5 sides)' },
      { id: 'b', text: 'Regular Pentagon (5 sides vs 8 sides)' },
      { id: 'c', text: 'They both have the same number of sides' }
    ],
    correctOptionId: 'a',
    explanation: 'A regular octagon has 8 sides, which is more than a pentagon with 5 sides.',
    learningObjective: '7.3.1 Apply understanding to visual comparisons.'
  },

  // Question 9 (Type I: Apply Polygon Knowledge - Heptagon Selection)
  {
    id: 9,
    type: 'visual',
    question: 'Piko is looking for a polygon with 7 straight sides. Which shape should he choose?',
    options: [
      { id: 'a', text: 'Shape A (Pentagon - 5 sides)', svgType: 'pentagon' },
      { id: 'b', text: 'Shape B (Hexagon - 6 sides)', svgType: 'hexagon' },
      { id: 'c', text: 'Shape C (Heptagon - 7 sides)', svgType: 'heptagon' },
      { id: 'd', text: 'Shape D (Octagon - 8 sides)', svgType: 'octagon' }
    ],
    correctOptionId: 'c',
    explanation: 'Shape C is a regular heptagon, which has 7 straight sides.',
    learningObjective: '7.3.1 Apply understanding of polygon properties.'
  },

  // Question 10 (Type J: Interactive Pattern Completion)
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
