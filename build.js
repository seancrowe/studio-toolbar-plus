import { build } from "bun";

async function buildForWeb() {
  console.log("Building for web...");

  try {
    const result = await build({
      entrypoints: ["./src/index.tsx"],
      outdir: "./dist",
      target: "browser",
      format: "esm",
      minify: false,
      sourcemap: "external",
      // plugins: [
      //   {
      //     name: "react-jsx-plugin",
      //     setup(build) {
      //       // This ensures React JSX is properly handled
      //       build.onLoad({ filter: /\.(tsx|jsx)$/ }, async (args) => {
      //         return {
      //           loader: "tsx",
      //         };
      //       });
      //     },
      //   },
      // ],
    });

    console.log("Build completed successfully!");
    console.log(`Output: ${result.outputs.map((o) => o.path).join(", ")}`);
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

buildForWeb();

