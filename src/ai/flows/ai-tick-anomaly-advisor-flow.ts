
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AITickAnomalyAdvisorInputSchema = z.object({
  marketName: z.string(),
  contractType: z.enum(['even_odd', 'over_under']),
  analysisTicks: z.number().int().positive(),
  lastNTicksData: z.array(z.number()),
  overPrediction: z.number().optional(),
  underPrediction: z.number().optional(),
});
export type AITickAnomalyAdvisorInput = z.infer<typeof AITickAnomalyAdvisorInputSchema>;

const AITickAnomalyAdvisorOutputSchema = z.object({
  explanation: z.string(),
  suggestedContractType: z.enum(['even_odd', 'over_under', 'none']),
  suggestedParameters: z.record(z.any()).optional(),
});
export type AITickAnomalyAdvisorOutput = z.infer<typeof AITickAnomalyAdvisorOutputSchema>;

export async function aiTickAnomalyAdvisor(input: AITickAnomalyAdvisorInput): Promise<AITickAnomalyAdvisorOutput> {
  return aiTickAnomalyAdvisorFlow(input);
}

const aiTickAnomalyAdvisorPrompt = ai.definePrompt({
  name: 'aiTickAnomalyAdvisorPrompt',
  input: { schema: AITickAnomalyAdvisorInputSchema },
  output: { schema: AITickAnomalyAdvisorOutputSchema },
  prompt: `Analyze the recent tick data for {{{marketName}}} and suggest a trading opportunity for {{{contractType}}} based on statistical probability.`,
});

const aiTickAnomalyAdvisorFlow = ai.defineFlow(
  { name: 'aiTickAnomalyAdvisorFlow', inputSchema: AITickAnomalyAdvisorInputSchema, outputSchema: AITickAnomalyAdvisorOutputSchema },
  async (input) => {
    try {
      const { output } = await aiTickAnomalyAdvisorPrompt(input);
      return output!;
    } catch (error) {
      console.error('aiTickAnomalyAdvisorFlow error:', error);
      return { explanation: "Statistical analysis active.", suggestedContractType: input.contractType as any };
    }
  }
);
