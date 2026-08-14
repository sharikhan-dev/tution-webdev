import React from 'react';
import { Batch, Course, Teacher } from '../../types';
import { Clock, MapPin, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface BatchesSectionProps {
  batches: Batch[];
  courses: Course[];
  teachers: Teacher[];
  onSelectBatchForEnquiry: (batchName: string) => void;
}

export const BatchesSection: React.FC<BatchesSectionProps> = ({
  batches,
  courses,
  teachers,
  onSelectBatchForEnquiry,
}) => {
  return (
    <section id="batches" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Classroom Timetable</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Physical Batches & Classroom Schedules
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            All batches are conducted physically inside our dedicated, air-conditioned lecture halls. Choose a morning or evening slot that fits your regular school routine.
          </p>
        </div>

        {/* Batches Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map(batch => {
            const course = courses.find(c => c.id === batch.courseId);
            const teacher = teachers.find(t => t.id === batch.teacherId);
            const availableSeats = batch.maxStudents - batch.currentEnrolled;

            return (
              <div
                key={batch.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-100 font-mono">
                      {course?.classGrade || 'Class 12'}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      availableSeats <= 5
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {availableSeats > 0 ? `${availableSeats} Seats Left` : 'Batch Full'}
                    </span>
                  </div>

                  {/* Batch Title */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {batch.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Mentor: <strong className="text-slate-700">{teacher?.name || 'Senior Faculty'}</strong>
                    </p>
                  </div>

                  {/* Schedule Details */}
                  <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Timing: <strong>{batch.startTime} - {batch.endTime}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Days: <strong>{batch.daysOfWeek.join(', ')}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Location: <strong>{batch.roomNo}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Capacity: <strong>{batch.currentEnrolled} / {batch.maxStudents} Enrolled</strong></span>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => onSelectBatchForEnquiry(batch.name)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Request Seat in this Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Classroom Rules Footer Note */}
        <div className="mt-12 p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>Strict Attendance Policy:</strong> Biometric/manual attendance is recorded within 10 minutes of batch start time. Parents receive instant notification for any absence.
            </span>
          </div>
          <span className="font-semibold text-blue-700 whitespace-nowrap">
            Batch switch allowed upon request
          </span>
        </div>
      </div>
    </section>
  );
};
