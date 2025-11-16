import { assertIsDefinedOrThrow } from 'twenty-shared/utils';

import { type WorkspacePreQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';
import { type CreateOneResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';

import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { type AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { WorkspaceMemberPreQueryHookService } from 'src/modules/workspace-member/query-hooks/workspace-member-pre-query-hook.service';
import { WorkspaceNotFoundDefaultError } from 'src/engine/core-modules/workspace/workspace.exception';

@WorkspaceQueryHook(`workspaceMember.createOne`)
export class WorkspaceMemberCreateOnePreQueryHook
  implements WorkspacePreQueryHookInstance
{
  constructor(
    private readonly workspaceMemberPreQueryHookService: WorkspaceMemberPreQueryHookService,
  ) {}

  async execute(
    authContext: AuthContext,
    _objectName: string,
    payload: CreateOneResolverArgs,
  ): Promise<CreateOneResolverArgs> {
    const workspace = authContext.workspace;

    assertIsDefinedOrThrow(workspace, WorkspaceNotFoundDefaultError);

    await this.workspaceMemberPreQueryHookService.validateWorkspaceMemberCreatePermissionOrThrow(
      {
        userWorkspaceId: authContext.userWorkspaceId,
        workspaceId: workspace.id,
        apiKey: authContext.apiKey,
      },
    );

    return payload;
  }
}
