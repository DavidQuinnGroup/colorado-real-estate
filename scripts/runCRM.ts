import { runCRMTasks } from "../workers/runCRMTasks";

async function main() {
  try {
    await runCRMTasks();
    process.exit(0);
  } catch (error) {
    console.error("❌ CRM Worker crashed:", error);
    process.exit(1);
  }
}

main();