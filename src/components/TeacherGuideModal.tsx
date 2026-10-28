import React from 'react';
import { BookOpen, X, Award, Target, FileText, BarChart2, CheckCircle2 } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-4 border-amber-400 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                TEACHER & EDUCATOR GUIDE
              </h2>
              <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">
                Polygon Explorer: The Adventure of Polygonia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section 1 — Curriculum Alignment */}
        <div className="space-y-3 bg-amber-50/70 p-5 rounded-2xl border border-amber-200">
          <h3 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" /> Curriculum Alignment (KSSR Semakan Year 3)
          </h3>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 font-medium list-disc pl-5">
            <li><strong>Learning Area:</strong> Measurement and Geometry</li>
            <li><strong>Topic:</strong> Regular Polygons</li>
            <li><strong>Learning Standard 7.3.1:</strong> Identify regular polygons, including pentagons, hexagons, heptagons and octagons.</li>
            <li><strong>Learning Standard 7.3.2:</strong> Create patterns based on regular polygons.</li>
          </ul>
        </div>

        {/* Section 2 — Educational Objectives & Target Difficulties */}
        <div className="space-y-3 bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200">
          <h3 className="font-extrabold text-emerald-950 text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" /> Target Learning Difficulty Addressed
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            This application specifically addresses pupils' difficulties in identifying regular polygons and recognising their key properties (such as straight side count, equal lengths, vertex count, and orientation invariance).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-emerald-900 pt-1">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1. Identify pentagon, hexagon, heptagon, octagon
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 2. Determine sides and vertices count
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3. Distinguish regular vs irregular
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 4. Create geometric patterns
            </div>
          </div>
        </div>

        {/* Section 3 — Assessment Blueprint & Structure */}
        <div className="space-y-3 bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200">
          <h3 className="font-extrabold text-indigo-950 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Assessment Blueprint (Pre-Test & Post-Test)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-indigo-200/80 text-indigo-950 font-black">
                  <th className="p-2 rounded-tl-lg">Component</th>
                  <th className="p-2 text-center">Items</th>
                  <th className="p-2 text-center rounded-tr-lg">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100 text-slate-700 font-medium">
                <tr>
                  <td className="p-2">Polygon identification and properties</td>
                  <td className="p-2 text-center">7</td>
                  <td className="p-2 text-center">7</td>
                </tr>
                <tr>
                  <td className="p-2">Visual application problems</td>
                  <td className="p-2 text-center">2</td>
                  <td className="p-2 text-center">2</td>
                </tr>
                <tr>
                  <td className="p-2">Pattern completion or construction</td>
                  <td className="p-2 text-center">1</td>
                  <td className="p-2 text-center">1</td>
                </tr>
                <tr className="font-bold bg-indigo-100 text-indigo-950">
                  <td className="p-2">Total Assessment Marks</td>
                  <td className="p-2 text-center">10</td>
                  <td className="p-2 text-center">10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4 — Evaluating Outcomes and Methodology */}
        <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-slate-600" /> Interpreting Score Differences & Academic Notes
          </h3>
          <p>
            • The pre-test and post-test utilize parallel 10-item forms assessing identical learning standards at equivalent difficulty levels.
          </p>
          <p>
            • The score difference (Post-Test Score minus Pre-Test Score) provides an indicator for preliminary evaluation.
          </p>
          <p className="italic text-slate-500">
            Note for academic reporting: Score differences serve as observational indicators within classroom research. They do not constitute sole proof of causality without controlled experimental conditions.
          </p>
        </div>

        {/* Close button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="py-3 px-6 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
};
