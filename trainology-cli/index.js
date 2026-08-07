#!/usr/bin/env node

async function main() {
  const { default: prompts } = await import("prompts");

  while (true) {
    console.clear();

    console.log(`
╔══════════════════════════════════════╗
║        TRAINOLOGY DEVELOPER KIT      ║
╚══════════════════════════════════════╝

1. Create Page
2. Create Section
3. Create Calculator
4. Exit
`);

    const { action } = await prompts({
      type: "number",
      name: "action",
      message: "Select:",
    });

    switch (action) {
      case 1:
        console.log("Create Page (Yakında)");
        break;

      case 2:
        console.log("Create Section (Yakında)");
        break;

      case 3:
        console.log("Create Calculator (Yakında)");
        break;

      case 4:
        process.exit(0);

      default:
        console.log("Geçersiz seçim.");
    }

    await prompts({
      type: "text",
      name: "continue",
      message: "Devam etmek için Enter...",
    });
  }
}

main();
