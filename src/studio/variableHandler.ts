import type SDK from "@chili-publish/studio-sdk";
import { Result } from "typescript-result";
import { handleStudioFunc } from "./utils";
import type { PrivateData } from "@chili-publish/studio-sdk";

export async function getAllVariables(studio:SDK) {
    return handleStudioFunc(studio.next.variable.getAll)
}
