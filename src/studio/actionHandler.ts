import type {
  ActionDeltaUpdate,
  DocumentAction,
} from "@chili-publish/studio-sdk";
import type SDK from "@chili-publish/studio-sdk";
import { Result } from "typescript-result";
import { handleStudioFunc } from "./utils";

type ActionData = {
  studio: SDK;
  name: string;
};

class ActionNotFoundError extends Error {
  readonly _tag = "ActionNotFoundError";
}

async function getAction({
  studio,
  name,
}: ActionData): Promise<Result<DocumentAction, Error>> {
  const actionsResult = await handleStudioFunc(studio.action.getAll);

  return actionsResult.map((actions) => {
    const sgAction = actions.find((a) => a.name == name);

    if (sgAction == null) {
      return Result.error(new ActionNotFoundError("Action not found, null"));
    }

    return sgAction;
  });
}

async function createAction({ studio, name }: ActionData) {
  return handleStudioFunc(studio.action.create);
}

async function updateAction(actionData: ActionData, script: ActionDeltaUpdate) {
  const { studio } = actionData;
  const actionResult = await getAction(actionData);

  return actionResult
    .recover(async (error) => {
      if (error instanceof ActionNotFoundError) {
        return createAction(actionData);
      } else {
        return Result.error(error);
      }
    })
    .map((value) => {
      return handleStudioFunc(studio.action.update, "", script);
    });
}
