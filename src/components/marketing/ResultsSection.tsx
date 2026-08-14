import React from 'react';
import { WebsiteSettings } from '../../types';
import { Trophy, Award, Star, CheckCircle, GraduationCap } from 'lucide-react';

interface ResultsSectionProps {
  results: WebsiteSettings['results'];
  onOpenEnquiryModal: () => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  onOpenEnquiryModal,
}) => {
  return (
    <section id="results" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Proven Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Hall of Fame & Board Toppers
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Consistent 95%+ scores in CBSE Board examinations and top single-digit ranks in medical and engineering competitive entrances from our offline classroom batches.
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(res => (
            <div
              key={res.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col items-center text-center hover:shadow-md transition duration-200"
            >
              {/* Photo & Crown Badge */}
              <div className="relative mb-4">
                <img
                  src={res.photoUrl}
                  alt={res.studentName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md shadow-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {/* Details */}
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                {res.studentName}
              </h3>
              <p className="text-xs font-semibold text-blue-700 mt-1">
                {res.exam} ({res.year})
              </p>

              {/* Score Highlight */}
              <div className="my-3 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-lg text-xs font-bold text-amber-900">
                {res.scoreRank}
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                {res.college}
              </p>
            </div>
          ))}
        </div>

        {/* Result Verification Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            * All results published above are 100% verified classroom students enrolled in our offline physical coaching center.
          </p>
        </div>
      </div>
    </section>
  );
};
