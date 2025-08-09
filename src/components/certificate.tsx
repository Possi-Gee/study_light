
'use client';

import { GraduationCap } from 'lucide-react';
import React, { forwardRef } from 'react';

interface CertificateProps {
  studentName: string;
  quizTitle: string;
  score: string;
  date: string;
}

export const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ studentName, quizTitle, score, date }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[800px] h-[600px] bg-slate-800 text-white p-10 flex flex-col font-serif"
        style={{ fontFamily: 'Lora, serif' }}
      >
        <div className="flex-grow flex flex-col justify-center items-center text-center border-4 border-amber-400 p-8 rounded-lg">
          <div className="mb-4">
            <GraduationCap className="h-20 w-20 text-amber-400" />
          </div>
          <h1 className="text-5xl font-bold text-amber-400 tracking-wider">
            Certificate of Achievement
          </h1>
          <p className="mt-6 text-xl">This certificate is proudly presented to</p>
          <p className="mt-4 text-4xl font-extrabold text-white tracking-wide underline decoration-amber-400">
            {studentName}
          </p>
          <p className="mt-6 text-xl">
            for successfully completing the quiz
          </p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">
            "{quizTitle}"
          </p>
          <p className="mt-6 text-xl">with a score of</p>
          <p className="mt-2 text-3xl font-bold text-white">{score}</p>
          <div className="flex justify-between w-full mt-auto pt-8">
            <div className="text-center">
              <p className="text-lg font-semibold border-t-2 border-amber-400 pt-1 px-4">
                SmartStudy Lite
              </p>
              <p className="text-sm">Authorized Platform</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold border-t-2 border-amber-400 pt-1 px-4">
                {date}
              </p>
              <p className="text-sm">Date of Completion</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';
