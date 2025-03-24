import type SDK from "@chili-publish/studio-sdk";
import { Result } from "typescript-result";
import { handleStudioFunc } from "./utils";
import type { PrivateData, VariableType } from "@chili-publish/studio-sdk";

export async function getAllVariables(studio:SDK) {
    return handleStudioFunc(studio.next.variable.getAll)
}

type SetVariableValueProps = {
    studio:SDK,
    id:string,
    value:string
}

export async function setVariableValue({
    studio,
    id,
    value
}:SetVariableValueProps) {
    return handleStudioFunc(studio.variable.setValue, id, value)
}

type CreateVariableValue = {
    studio:SDK
    variableType: VariableType,
    name:string
}

export async function createVariable({studio, variableType, name}:CreateVariableValue) {
    const createResult = await handleStudioFunc(studio.variable.create, "", variableType);
    return createResult.map(async id => {
        const result = await handleStudioFunc(studio.variable.rename, id, name);
        if (result.isOk()) return id;
        return Result.error(result.value);
    });
}