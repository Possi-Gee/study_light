'use server';

/**
 * @fileOverview An AI agent for generating study note content.
 *
 * - generateNoteContent - A function that generates a note title and content based on a topic.
 * - GenerateNoteContentInput - The input type for the function.
 * - GenerateNoteContentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateNoteContentInputSchema = z.object({
  topic: z.string().describe('The topic to generate a note about.'),
});
export type GenerateNoteContentInput = z.infer<typeof GenerateNoteContentInputSchema>;

const GenerateNoteContentOutputSchema = z.object({
  title: z.string().describe('The generated title for the note.'),
  content: z.string().describe('The generated content for the note.'),
});
export type GenerateNoteContentOutput = z.infer<typeof GenerateNoteContentOutputSchema>;


export async function generateNoteContent(
  input: GenerateNoteContentInput
): Promise<GenerateNoteContentOutput> {
    try {
        const result = await generateNoteContentFlow(input);
        if (!result || !result.title || !result.content) {
            throw new Error('Invalid output from AI model.');
        }
        return result;
    } catch (error) {
        console.error("Error in generateNoteContent flow:", error);
        throw new Error("Failed to generate note content from AI.");
    }
}


const generateNoteContentPrompt = ai.definePrompt({
  name: 'generateNoteContentPrompt',
  input: { schema: GenerateNoteContentInputSchema },
  output: { schema: GenerateNoteContentOutputSchema },
  prompt: `You are an expert educator and content creator. Your task is to generate a concise and informative study note for a student based on the provided topic.

The note should have a clear title and well-structured content that is easy to understand.

Topic: {{{topic}}}

Generate a suitable title and the main content for the study note. The content should be a comprehensive but digestible summary of the key points related to the topic.

Your response must be only the structured JSON output.
`,
});

const generateNoteContentFlow = ai.defineFlow(
  {
    name: 'generateNoteContentFlow',
    inputSchema: GenerateNoteContentInputSchema,
    outputSchema: GenerateNoteContentOutputSchema,
  },
  async (input) => {
    const { output } = await generateNoteContentPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return any output.");
    }
    return output;
  }
);
