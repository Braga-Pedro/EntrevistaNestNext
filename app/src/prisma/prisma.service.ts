import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    // ao iniciar o módulo, iniciar a conexão com o banco
    async onModuleInit() {
        await this.$connect();
    }

    // para fechar conexões ao terminar o uso do módulo
    enableShutdownHooks(app: INestApplication){
        (this.$on as any)('beforeExit', async () => {
            await app.close();
        });
    }
}   
 