import React, { useState } from 'react';
import { Course } from '../../types';
import { BookOpen, Check, ArrowRight, Clock, Users, Shield, Sparkles } from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
  onSelectCourseForEnquiry: (courseName: string, classGrade: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  onSelectCourseForEnquiry,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('All');

  const gradeOptions = ['All', 'Class 12', 'Class 11', 'Class 10'];

  const filteredCourses = selectedGrade === 'All'
    ? courses
    : courses.filter(c => c.classGrade === selectedGrade);

  return (
    <section id="courses" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum & Streams</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Offline Coaching Programs
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Tailored physical batches structured around CBSE & State Board syllabus, combined with rigorous problem-solving foundation for competitive entrances.
          </p>

          {/* Grade Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {gradeOptions.map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedGrade === grade
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Course Header Banner */}
                <div className="p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white relative">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded-md font-mono">
                      {course.classGrade} • {course.stream}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Monthly Tuition Fee</span>
                      <span className="text-xl font-extrabold text-white">
                        ₹{course.monthlyFee.toLocaleString('en-IN')}
                        <span className="text-xs text-slate-300 font-normal"> / mo</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mt-3">
                    {course.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Course Content & Highlights */}
                <div className="p-6 sm:p-7 space-y-5">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span><strong>{course.durationMonths} Months</strong> Duration</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span><strong>Max 28</strong> Batch Cap</span>
                    </div>
                  </div>

                  {/* Highlights Checklist */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Program Inclusions
                    </span>
                    <ul className="space-y-2">
                      {course.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => onSelectCourseForEnquiry(course.name, course.classGrade)}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Enquire for {course.code} Batch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
