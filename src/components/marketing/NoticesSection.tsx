import React from 'react';
import { Notice } from '../../types';
import { Bell, Calendar, AlertCircle, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface NoticesSectionProps {
  notices: Notice[];
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({ notices }) => {
  const activeNotices = notices.filter(n => n.isActive && (n.targetAudience === 'All' || n.targetAudience === 'Public'));

  const getBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <section id="notices" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" />
            <span>Institute Notice Board</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Official Announcements & Schedules
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Stay updated with holiday circulars, offline parent-teacher meeting (PTM) timings, and admissions alert announcements.
          </p>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeNotices.map(notice => (
            <div
              key={notice.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 transition duration-200 space-y-4"
            >
              <div className="space-y-3">
                {/* Meta Pills */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{notice.publishDate}</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(notice.priority)}`}>
                    {notice.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {notice.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {notice.description}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Audience: <strong>{notice.targetAudience}</strong></span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ● Active Notice
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
