import { useMutation } from "@tanstack/react-query";

/**
 * Shape of the request expected by your solo AI host
 */
export interface AIBuildRequest {
    prompt: string;
    budget: number | null;
    locked_in_build: Record<string, number | number[]>;
    allow_upgrade: boolean;
}

/**
 * Shape of the response returned by your solo AI host
 */
export interface AIBuildResponse {
    model_message: string;
    build_ids: Record<string, number | number[]>;
    succeeded: boolean;
}

const AI_HOST_URL = import.meta.env.VITE_AI_HOST_URL || "https://your-ai-host.com/generate-build";

/**
 * Hook to interact with the AI Model Host.
 * Set VITE_AI_HOST_URL in your .env to point at the real endpoint.
 */
export const useGenerateAIBuild = () => {
    return useMutation({
        mutationFn: async (data: AIBuildRequest): Promise<AIBuildResponse> => {
            const response = await fetch(AI_HOST_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add authorization headers here if needed
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to communicate with AI service");
            }

            return response.json();
        },
    });
};