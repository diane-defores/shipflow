import path from "node:path";
import { fileURLToPath } from "node:url";
import { readDashboardData } from "./sources/readers.ts";
import { mountOpenTuiDashboard } from "./views/dashboardView.ts";

function assertBunRuntime(): void {
  if (!("Bun" in globalThis)) {
    throw new Error("Bun runtime missing. Install Bun then run `bun run dev` in tui/. See tui/README.md");
  }
}

async function run(): Promise<void> {
  assertBunRuntime();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(process.cwd());
  const shipflowRepoRoot = path.resolve(__dirname, "../../");
  const workspaceRoots = process.env.SHIPFLOW_TUI_WORKSPACE_ROOTS
    ?.split(",")
    .map((root) => root.trim())
    .filter(Boolean)
    .map((root) => path.resolve(root));
  if (!workspaceRoots?.length) {
    workspaceRoots?.push(shipflowRepoRoot);
  } else if (!workspaceRoots.includes(shipflowRepoRoot)) {
    workspaceRoots.push(shipflowRepoRoot);
  }

  const data = await readDashboardData({
    projectRoot,
    workspaceRoots: workspaceRoots ?? [shipflowRepoRoot],
    shipflowRepoRoot
  });

  try {
    await mountOpenTuiDashboard(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Failed to initialize OpenTUI renderer: ${message}`);
    console.error("Check Bun/OpenTUI install. See tui/README.md");
    process.exit(1);
  }
}

run().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
