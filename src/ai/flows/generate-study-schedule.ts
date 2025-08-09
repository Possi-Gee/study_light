'use server';

/**
 * @fileOverview A study schedule generator AI agent.
 *
 * - generateStudySchedule - A function that generates a study schedule.
 * - GenerateStudyScheduleInput - The input type for the generateStudySchedule function.
 * - GenerateStudyScheduleOutput - The return type for the generateStudySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyScheduleInputSchema = z.object({
  examDate: z
    .string()
    .describe('The date of the exam in ISO 8601 format (YYYY-MM-DD).'),
  studyGoals: z
    .string()
    .describe(
      'The study goals or topics the student wants to cover for the exam.'
    ),
  weeklyStudyHours: z
    .number()
    .describe(
      'The number of hours per week the student can commit to studying.'
    ),
  quizHistoryData: z
    .string()
    .optional()
    .describe(
      'The historical quiz data of the student, including topics and scores.'
    ),
});
export type GenerateStudyScheduleInput = z.infer<typeof GenerateStudyScheduleInputSchema>;

const GenerateStudyScheduleOutputSchema = z.object({
  studySchedule: z
    .string()
    .describe('The generated study schedule, including topics and dates.'),
});
export type GenerateStudyScheduleOutput = z.infer<typeof GenerateStudyScheduleOutputSchema>;

export async function generateStudySchedule(
  input: GenerateStudyScheduleInput
): Promise<GenerateStudyScheduleOutput> {
  return generateStudyScheduleFlow(input);
}

const generateStudySchedulePrompt = ai.definePrompt({
  name: 'generateStudySchedulePrompt',
  input: {schema: GenerateStudyScheduleInputSchema},
  output: {schema: GenerateStudyScheduleOutputSchema},
  prompt: `You are an AI study schedule generator. You will take the exam date, study goals, weekly study hours, and quiz history data to generate a personalized study schedule.

Exam Date: {{{examDate}}}
Study Goals: {{{studyGoals}}}
Weekly Study Hours: {{{weeklyStudyHours}}}
Quiz History Data: {{{quizHistoryData}}}

Generate a study schedule:
`,
});

const generateStudyScheduleFlow = ai.defineFlow(
  {
    name: 'generateStudyScheduleFlow',
    inputSchema: GenerateStudyScheduleInputSchema,
    outputSchema: GenerateStudyScheduleOutputSchema,
  },
  async input => {
    const {output} = await generateStudySchedulePrompt(input);
    return output!;
  }
);
