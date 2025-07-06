'use server';

/**
 * @fileOverview AI-powered suggestions for bin locations based on historical waste data.
 *
 * - suggestBinLocations - A function that suggests zones needing more bins.
 * - SuggestBinLocationsInput - The input type for the suggestBinLocations function.
 * - SuggestBinLocationsOutput - The return type for the suggestBinLocations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBinLocationsInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical waste collection data, including zone, waste type, and quantity over time.'
    ),
});
export type SuggestBinLocationsInput = z.infer<typeof SuggestBinLocationsInputSchema>;

const SuggestBinLocationsOutputSchema = z.object({
  suggestedZones: z
    .array(z.string())
    .describe(
      'A list of zones that are predicted to require more bins based on the historical data.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why these zones were suggested, based on trends in the historical data.'
    ),
});
export type SuggestBinLocationsOutput = z.infer<typeof SuggestBinLocationsOutputSchema>;

export async function suggestBinLocations(
  input: SuggestBinLocationsInput
): Promise<SuggestBinLocationsOutput> {
  return suggestBinLocationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBinLocationsPrompt',
  input: {schema: SuggestBinLocationsInputSchema},
  output: {schema: SuggestBinLocationsOutputSchema},
  prompt: `Analyze the following historical waste collection data and suggest zones that may need more bins to prevent overflow. Explain the reasoning behind your suggestions.

Historical Data: {{{historicalData}}}

Based on this data, which zones should be prioritized for additional bins, and why?

Output in JSON format:
`,
});

const suggestBinLocationsFlow = ai.defineFlow(
  {
    name: 'suggestBinLocationsFlow',
    inputSchema: SuggestBinLocationsInputSchema,
    outputSchema: SuggestBinLocationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
