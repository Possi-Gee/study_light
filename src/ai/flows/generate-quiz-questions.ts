'use server';

/**
 * @fileOverview An AI agent for generating quiz questions.
 *
 * - generateQuizQuestions - A function that generates quiz questions based on a topic and notes.
 * - GenerateQuizQuestionsInput - The input type for the function.
 * - GenerateQuizQuestionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { QuizQuestion } from '@/lib/quiz-store';
import { z } from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz questions.'),
  notes: z.string().optional().describe('Optional notes or context to base the questions on.'),
  numQuestions: z.number().min(1).max(10).default(5).describe('The number of questions to generate.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

// Define a Zod schema for a single quiz question that matches our existing `QuizQuestion` type
const QuizQuestionSchema = z.object({
    id: z.string().describe("A unique identifier for the question, e.g., 'q-1718886921321'"),
    text: z.string().describe('The text of the question.'),
    options: z.array(z.string()).length(4).describe('An array of exactly four possible answers.'),
    correctAnswer: z.string().describe('The correct answer from the options array.'),
});

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('An array of generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;


export async function generateQuizQuestions(
  input: GenerateQuizQuestionsInput
): Promise<GenerateQuizQuestionsOutput> {
    try {
        const result = await generateQuizQuestionsFlow(input);
        // Ensure the output conforms to the expected structure.
        if (!result || !Array.isArray(result.questions)) {
            throw new Error('Invalid output from AI model.');
        }
        return result;
    } catch (error) {
        console.error("Error in generateQuizQuestions flow:", error);
        // In case of an error, return an empty array of questions
        return { questions: [] };
    }
}


const generateQuizQuestionsPrompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: { schema: GenerateQuizQuestionsInputSchema },
  output: { schema: GenerateQuizQuestionsOutputSchema },
  prompt: `You are an expert quiz creator for an educational platform. Your task is to generate a series of multiple-choice questions based on the provided topic and notes.

Topic: {{{topic}}}
{{#if notes}}
Contextual Notes:
{{{notes}}}
{{/if}}
Number of Questions to Generate: {{{numQuestions}}}

Please generate exactly {{{numQuestions}}} questions.
For each question:
1. Create a clear and concise question text.
2. Provide exactly four distinct options.
3. One of the options must be the correct answer.
4. Ensure the correct answer is one of the provided options.
5. Create a unique ID for each question using a "q-" prefix followed by a random timestamp-like number.

Your response must be only the structured JSON output.
`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateQuizQuestionsPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return any output.");
    }
    return output;
  }
);
