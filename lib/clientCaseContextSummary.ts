import type { PrismaClient } from '@prisma/client';

export type ClientCaseContextSummary = Readonly<{
  clientCaseId: string;
  displayName: string;
  status: string;
  participantCount: number;
}>;

export class ClientCaseContextSummaryError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

function clientCaseId(value: string) {
  const normalized = value.trim();
  if (!normalized || normalized.length > 100 || /[<>]/.test(normalized)) {
    throw new ClientCaseContextSummaryError('INVALID_REQUEST', 'Client Case context is unavailable.');
  }
  return normalized;
}

export function createClientCaseContextSummaryService(prisma: Pick<PrismaClient, 'clientCase'>) {
  return {
    async load(ownerAgentSubject: string, rawClientCaseId: string): Promise<ClientCaseContextSummary> {
      const id = clientCaseId(rawClientCaseId);
      const clientCase = await prisma.clientCase.findFirst({
        where: { id, ownerAgentSubject },
        select: {
          id: true,
          displayName: true,
          status: true,
          _count: { select: { parties: true } },
        },
      });
      if (!clientCase) throw new ClientCaseContextSummaryError('NOT_FOUND', 'Client Case context is unavailable.');
      return {
        clientCaseId: clientCase.id,
        displayName: clientCase.displayName,
        status: clientCase.status,
        participantCount: clientCase._count.parties,
      };
    },
  };
}
