import process from "node:process";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
  return value;
}

function git(commandArgs) {
  const result = spawnSync("git", commandArgs, { encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${commandArgs.join(" ")} failed`);
  return result.stdout.trim();
}

const owner = option("--owner") ?? process.env.GITHUB_OWNER;
const repository = option("--repo");
const branch = option("--branch") ?? "main";
const host = option("--host") ?? "github.com";

if (!owner || !repository) {
  console.error("Usage: npm run verify:handoff -- --owner <owner> --repo <customer-repo> [--branch main]");
  process.exit(1);
}

try {
  if (git(["rev-parse", "--is-inside-work-tree"]) !== "true") throw new Error("Not inside a Git worktree");

  const remote = git(["config", "--get", "remote.origin.url"]);
  const scpStyle = remote.match(/^git@([^:]+):(.+)$/i);
  let remoteHost;
  let remotePath;
  if (scpStyle) {
    remoteHost = scpStyle[1];
    remotePath = scpStyle[2];
  } else if (/^(?:ssh|https):\/\//i.test(remote)) {
    remoteHost = new URL(remote).hostname;
    remotePath = new URL(remote).pathname;
  }
  const normalizedRemotePath = remotePath?.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\.git$/i, "");
  const expectedPath = `${owner}/${repository}`.toLowerCase();
  if (remoteHost?.toLowerCase() !== host.toLowerCase() || !normalizedRemotePath || normalizedRemotePath.toLowerCase() !== expectedPath) {
    throw new Error(`origin is not the expected customer repository: ${owner}/${repository}`);
  }

  const currentBranch = git(["branch", "--show-current"]);
  if (currentBranch !== branch) throw new Error(`Current branch is ${currentBranch || "detached"}, expected ${branch}`);

  const status = git(["status", "--porcelain"]);
  if (status) throw new Error("Worktree is not clean");

  const tracked = git(["ls-files"]).split(/\r?\n/).filter(Boolean);
  const forbidden = tracked.filter((file) => {
    const normalized = file.replace(/\\/g, "/");
    if (normalized === "materials/README.md" || normalized === ".env.example") return false;
    return normalized.startsWith("materials/")
      || normalized.startsWith("node_modules/")
      || normalized.startsWith("dist/")
      || normalized.startsWith(".astro/")
      || normalized.startsWith(".tmp/")
      || normalized === ".env"
      || normalized.startsWith(".env.");
  });
  if (forbidden.length > 0) throw new Error(`Private or generated files are tracked: ${forbidden.join(", ")}`);

  const localHead = git(["rev-parse", "HEAD"]);
  const remoteLine = git(["ls-remote", "--exit-code", "origin", `refs/heads/${branch}`]);
  const remoteHead = remoteLine.split(/\s+/)[0];
  if (localHead !== remoteHead) throw new Error(`Remote ${branch} does not match local HEAD`);

  console.log(`[handoff] origin: ${remote}`);
  console.log(`[handoff] ${branch}: ${localHead}`);
  console.log("[handoff] Customer repository delivery verified.");
} catch (error) {
  console.error(`[handoff] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
