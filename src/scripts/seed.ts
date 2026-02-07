import 'dotenv/config';
import { getAppDataSource } from '../config/database';
import { Role } from '../infrastructure/entities/Role';
import { User } from '../infrastructure/entities/User';
import { hashPassword } from '../utils/password.util';
import { Permissions } from '../modules/roles/permission.constants';

async function seed() {
    console.log('Iniciando seed do banco de dados...');

    try {
        const dataSource = await getAppDataSource();
        const roleRepo = dataSource.getRepository(Role);
        const userRepo = dataSource.getRepository(User);

        // Create Admin Role
        let adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
        if (!adminRole) {
            adminRole = roleRepo.create({
                name: 'admin',
                permissions: [
                    Permissions.SYSTEM_ADMIN,
                    Permissions.USER_CREATE,
                    Permissions.USER_READ,
                    Permissions.USER_UPDATE,
                    Permissions.USER_DELETE,
                    Permissions.ROLE_CREATE,
                    Permissions.ROLE_READ,
                    Permissions.ROLE_UPDATE,
                    Permissions.ROLE_DELETE,
                    Permissions.AUDIT_READ,
                    Permissions.EVENT_READ,
                ],
            });
            await roleRepo.save(adminRole);
            console.log('✓ Role "admin" criada');
        } else {
            console.log('✓ Role "admin" já existe');
        }

        // Create User Role
        let userRole = await roleRepo.findOne({ where: { name: 'user' } });
        if (!userRole) {
            userRole = roleRepo.create({
                name: 'user',
                permissions: [
                    Permissions.USER_READ,
                ],
            });
            await roleRepo.save(userRole);
            console.log('✓ Role "user" criada');
        } else {
            console.log('✓ Role "user" já existe');
        }

        // Create default admin user
        const adminUsername = 'admin';
        let adminUser = await userRepo.findOne({ where: { username: adminUsername } });
        if (!adminUser) {
            const hashedPassword = await hashPassword('admin123');
            adminUser = userRepo.create({
                username: adminUsername,
                password: hashedPassword,
                email: 'admin@backendblueprint.com',
                role: adminRole,
            });
            await userRepo.save(adminUser);
            console.log('✓ Usuário admin criado (username: admin, password: admin123)');
        } else {
            console.log('✓ Usuário admin já existe');
        }

        // Create default regular user
        const regularUsername = 'user';
        let regularUser = await userRepo.findOne({ where: { username: regularUsername } });
        if (!regularUser) {
            const hashedPassword = await hashPassword('user123');
            regularUser = userRepo.create({
                username: regularUsername,
                password: hashedPassword,
                email: 'user@backendblueprint.com',
                role: userRole,
            });
            await userRepo.save(regularUser);
            console.log('✓ Usuário regular criado (username: user, password: user123)');
        } else {
            console.log('✓ Usuário regular já existe');
        }

        console.log('\n✅ Seed concluído com sucesso!');
        console.log('\nCredenciais de acesso:');
        console.log('  Admin - username: admin, password: admin123');
        console.log('  User  - username: user, password: user123');

        await dataSource.destroy();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Erro ao executar seed:', error.message);
        process.exit(1);
    }
}

seed();
