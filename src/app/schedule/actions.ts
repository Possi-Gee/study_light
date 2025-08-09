'use server';

import { generateStudySchedule, GenerateStudyScheduleInput } from '@/ai/flows/generate-study-schedule';

export async function generateStudyScheduleAction(input: GenerateStudyScheduleInput): Promise<{ studySchedule: string }> {
    try {
        const result = await generateStudySchedule(input);
        if(!result.studySchedule){
            throw new Error("The AI failed to generate a schedule.");
        }
        return result;
    } catch(e) {
        console.error("Error generating schedule:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        // Return a structured error that the client can display
        return { studySchedule: `Error: Could not generate a study schedule. ${errorMessage}` };
    }
}
