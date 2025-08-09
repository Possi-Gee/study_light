
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
        className="w-full bg-card text-card-foreground p-6 sm:p-8 flex flex-col font-headline border-2 border-primary"
      >
        <div className="flex-grow flex flex-col justify-center items-center text-center border-4 border-primary/50 p-4 sm:p-6 rounded-lg relative">
           <div className="absolute top-4 left-4 text-left">
             <h2 className="text-lg font-bold tracking-wider text-primary">StudyLight</h2>
           </div>
          <div className="mb-2 sm:mb-4 mt-6 sm:mt-0">
            <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-primary tracking-wider">
            Certificate of Achievement
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg">This certificate is proudly presented to</p>
          <p className="mt-1 sm:mt-2 text-xl sm:text-3xl font-extrabold text-foreground tracking-wide underline decoration-primary">
            {studentName}
          </p>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg">
            for successfully completing the quiz
          </p>
          <p className="mt-1 text-lg sm:text-2xl font-semibold text-primary/90">
            "{quizTitle}"
          </p>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg">with a score of</p>
          <p className="mt-1 text-lg sm:text-2xl font-bold text-foreground">{score}</p>
          <div className="flex justify-between w-full mt-auto pt-4 sm:pt-6 text-xs sm:text-sm">
            <div className="text-center">
              <p className="font-semibold border-t-2 border-primary pt-1 px-2 sm:px-4">
                StudyLight
              </p>
              <p className="text-xs">Authorized Platform</p>
            </div>
            <div className="text-center">
              <p className="font-semibold border-t-2 border-primary pt-1 px-2 sm:px-4">
                {date}
              </p>
              <p className="text-xs">Date of Completion</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';
