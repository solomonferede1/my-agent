import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { COMMIT_MESSAGE_PROMPT, SYSTEM_PROMPT } from "./prompts";
import { createMarkdownFileTool, getFileChangesInDirectoryTool } from "./tools";

const codeReviewAgent = async (prompt: string) => {
  const result = streamText({
    model: google("models/gemini-1.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: getFileChangesInDirectoryTool,
      createMarkdownFileTool: createMarkdownFileTool,
    },
    stopWhen: stepCountIs(10),
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
};

const commitMessageAgent = async (prompt: string) => {
  const result = streamText({
    model: google("models/gemini-1.5-flash"),
    prompt,
    system: COMMIT_MESSAGE_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: getFileChangesInDirectoryTool,
    },
    stopWhen: stepCountIs(10),
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
};

// Specify which directory the code review agent should review changes in your prompt
//await codeReviewAgent(
//  "Review the code changes in '../my-agent' directory, make your reviews and suggestions file by file",
//);

// Example of how to use the commit message agent
await commitMessageAgent(
  "Generate a commit message for the changes in the '../my-agent' directory."
);
