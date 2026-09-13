import { ICatFactClient } from '../interfaces/ICatFactClient.js';
import { IFileStorageService } from '../interfaces/IFileStorageService.js';
import { ICatFactService } from '../interfaces/ICatFactService.js';
import { CatFactClient } from '../services/CatFactClient.js';
import { FileStorageService } from '../services/FileStorageService.js';
import { CatFactService } from '../services/CatFactService.js';

export const ServiceTokens = {
  CatFactClient: Symbol('ICatFactClient'),
  FileStorageService: Symbol('IFileStorageService'),
  CatFactService: Symbol('ICatFactService'),
} as const;

export type ServiceIdentifier = symbol | string;

/**
 * Lightweight IoC / Dependency Injection Container
 * Mimics Microsoft's IServiceCollection / IServiceProvider architecture.
 */
export class ServiceContainer {
  private services = new Map<ServiceIdentifier, any>();
  private factories = new Map<ServiceIdentifier, (container: ServiceContainer) => any>();
  private singletons = new Map<ServiceIdentifier, any>();

  /**
   * Register a singleton factory: instance is created once and reused
   */
  registerSingleton<T>(token: ServiceIdentifier, factory: (container: ServiceContainer) => T): this {
    this.factories.set(token, factory);
    return this;
  }

  /**
   * Register an existing instance directly
   */
  registerInstance<T>(token: ServiceIdentifier, instance: T): this {
    this.singletons.set(token, instance);
    return this;
  }

  /**
   * Resolve a registered dependency from the container
   */
  resolve<T>(token: ServiceIdentifier): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }

    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`[DI Container] Service not registered for token: ${String(token)}`);
    }

    const instance = factory(this);
    this.singletons.set(token, instance);
    return instance as T;
  }
}

/**
 * Configure and build the default Application Service Provider
 * Demonstrating IoC (Inversion of Control) and Dependency Injection:
 */
export function createConfiguredContainer(options?: {
  endpoint?: string;
  storageFileName?: string;
}): ServiceContainer {
  const container = new ServiceContainer();

  // 1. Register ICatFactClient (HTTP Client)
  container.registerSingleton<ICatFactClient>(ServiceTokens.CatFactClient, () => {
    return new CatFactClient(options?.endpoint || 'https://catfact.ninja/fact');
  });

  // 2. Register IFileStorageService (Local file persistence)
  container.registerSingleton<IFileStorageService>(ServiceTokens.FileStorageService, () => {
    return new FileStorageService(options?.storageFileName || 'cat_facts.txt');
  });

  // 3. Register ICatFactService with Constructor Injection of (1) and (2)
  container.registerSingleton<ICatFactService>(ServiceTokens.CatFactService, (c) => {
    const client = c.resolve<ICatFactClient>(ServiceTokens.CatFactClient);
    const storage = c.resolve<IFileStorageService>(ServiceTokens.FileStorageService);
    return new CatFactService(client, storage);
  });

  return container;
}
