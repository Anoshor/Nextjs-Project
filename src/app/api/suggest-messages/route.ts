'use client';

import { useChat } from 'ai/react';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

// Create an OpenAI client that is edge-friendly
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Set runtime to edge
export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by a '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal and sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a Hobby you've recently started?||If you could have a historical figure over for dinner, who would it be?|| What is a simple thing that makes you happy?' Ensure the questions are intriguing and foster curiosity, and contribute to a welcoming environment.";

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 200,
            stream: true,
            prompt,
        });

        // Assuming the new recommended streaming approach replaces OpenAIStream
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({
                name, status, headers, message
            }, { status: 500 });
        } else {
            throw error;
        }
    }
}
