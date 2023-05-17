import {
  BaseHandlerArgs,
  EventTypes,
  FunctionModule,
  ViewClosedInvocationBody,
} from "./types.ts";
import { UnhandledEventError } from "./run-unhandled-event.ts";

export const RunViewClosed = async (
  baseHandlerArgs: BaseHandlerArgs,
  functionModule: FunctionModule,
  // deno-lint-ignore no-explicit-any
): Promise<any> => {
  const handler = functionModule.viewClosed ||
    functionModule.default?.viewClosed;
  if (!handler) {
    throw new UnhandledEventError(
      `Received a ${EventTypes.VIEW_CLOSED} payload but the function does not define a viewClosed handler`,
    );
  }

  const viewClosedBody = baseHandlerArgs.body as ViewClosedInvocationBody;
  // We don't catch any errors the handlers may throw, we let them throw, and stop the process
  // deno-lint-ignore no-explicit-any
  const response: any = await handler({
    ...baseHandlerArgs,
    body: viewClosedBody,
    view: viewClosedBody.view,
  });

  return response || {};
};
