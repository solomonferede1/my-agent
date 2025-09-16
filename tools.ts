import { tool } from "ai";
import { simpleGit } from "simple-git";
import { z } from "zod";
import fs from "fs";

const excludeFiles = ["dist", "bun.lock"];

const fileChange = z.object({
  rootDir: z.string().min(1).describe("The root directory"),
});

type FileChange = z.infer<typeof fileChange>;

async function getFileChangesInDirectory({ rootDir }: FileChange) {
  const git = simpleGit(rootDir);
  const summary = await git.diffSummary();
  const diffs: { file: string; diff: string }[] = [];

  for (const file of summary.files) {
    if (excludeFiles.includes(file.file)) continue;
    const diff = await git.diff(["--", file.file]);
    diffs.push({ file: file.file, diff });
  }

  return diffs;
}

export const getFileChangesInDirectoryTool = tool({
  description: "Gets the code changes made in given directory",
  inputSchema: fileChange,
  execute: getFileChangesInDirectory,
});

const markdownFileSchema = z.object({
	filePath: z.string().min(1).describe("The path for the markdown file"),
	content: z.string().min(1).describe("The content for the markdown file"),
});

type MarkdownFile = z.infer<typeof markdownFileSchema>;

function createMarkdownFile({ filePath, content }: MarkdownFile) {
	if (!filePath.endsWith(".md")) {
		throw new Error("File path must end with .md");
	}
	fs.writeFileSync(filePath, content);
	return `File ${filePath} created successfully`;
}

export const createMarkdownFileTool = tool({
	description: "Creates a markdown file with the given content",
	inputSchema: markdownFileSchema,
	execute: createMarkdownFile,
});