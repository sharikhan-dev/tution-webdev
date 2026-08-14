import React from 'react';
import { Teacher } from '../../types';
import { Award, BookOpen, CheckCircle, GraduationCap, Star, Users, MapPin } from 'lucide-react';

interface AboutTeacherSectionProps {
  teachers: Teacher[];
  onOpenEnquiryModal: () => void;
}

export const AboutTeacherSection: React.FC<AboutTeacherSectionProps> = ({
  teachers,
  onOpenEnquiryModal,
}) => {
  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Experienced Offline Mentors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Learn Directly From Proven Classroom Educators
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Our faculty members are full-time offline educators with decades of physical teaching experience. No recorded video shortcuts — every class is taught live in person with daily chalkboard derivations and interactive Q&A.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.map(teacher => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col"
            >
              {/* Photo & Badge */}
              <div className="relative h-60 bg-slate-100 overflow-hidden">
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{teacher.rating || '4.9'} ({teacher.experienceYears}+ Yrs Exp)</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {teacher.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-700">
                    {teacher.designation}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {teacher.qualification}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {teacher.bio}
                    </p>
                  </div>
                </div>

                {/* Subjects Handled */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Classroom Subjects
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((subj, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Feature Banner */}
        <div className="mt-14 bg-white rounded-2xl border border-blue-100 p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Physical Chalk & Board Rigor</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every concept is derived by hand step-by-step to build deep cognitive retention and board exam writing speed.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Daily Evening Doubt Desk</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated faculty available physically from 4:00 PM to 7:00 PM every weekday for 1-on-1 problem solving.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Weekly Subjective Tests</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Board pattern checked answer sheets returned within 72 hours with detailed error analysis remarks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
