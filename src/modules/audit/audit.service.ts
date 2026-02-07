import { getAppDataSource } from '../../config/database';
import { Audit } from '../../infrastructure/entities/Audit';

export interface AuditData {
    action: string;
    entityId: string;
    entityType: string;
    userId: number;
    details?: Record<string, any>;
}

export class AuditService {
    static async logAction(auditData: AuditData): Promise<Audit> {
        const dataSource = await getAppDataSource();
        const auditRepo = dataSource.getRepository(Audit);

        const audit = auditRepo.create({
            action: auditData.action,
            userId: auditData.userId,
            details: auditData.details || {},
            timestamp: new Date().toISOString(),
        });

        return auditRepo.save(audit);
    }
}
