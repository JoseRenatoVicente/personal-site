import { revalidate } from '@appConfig'


// Tempo padrão de expiração do cache em memória (60 minutos em milissegundos)
const DEFAULT_MEMORY_CACHE_TTL = revalidate * 1000

interface MemoryCacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Armazenamento em memória para o cache
const memoryCache: Record<string, MemoryCacheItem<unknown>> = {}

/**
 * Obtém um item do cache, verificando primeiro a memória (mais rápido) 
 * e depois o sistema de arquivos se necessário
 */
export function getCache<T>(key: string | null): T | null {
  if (!key) return null

  const memoryCacheItem = memoryCache[key]
  if (memoryCacheItem && Date.now() < memoryCacheItem.expiresAt) {
    return memoryCacheItem.data as T
  }
  else
   clearCache(key)

  return null
}

/**
 * Obtém um item do cache ou o cria usando a função fornecida se não existir.
 * 
 * @param key A chave para buscar/armazenar no cache
 * @param factory Função assíncrona que cria o valor caso não esteja em cache
 * @param ttl Tempo de vida do cache em milissegundos (opcional)
 * @param keySuffix Sufixo opcional para a chave
 * @returns O valor do cache ou o resultado da função factory
 */
export async function getOrCreate<T>(
  key: string,
  factory: () => Promise<T>,
  keySuffix: string | null = null,
  ttl: number = DEFAULT_MEMORY_CACHE_TTL
): Promise<T> {
  const fullKey = keySuffix ? `${key}_${keySuffix}` : key;
  
  const cachedResult = getCache<T>(fullKey);
  
  if (cachedResult !== null) {
    return cachedResult;
  }
  
  try {
    const result = await factory();
    
    if (result !== null) {
      setCache(fullKey, result);
    }
    
    return result;
  } catch (error) {
    console.error(`Erro ao executar factory para a chave ${fullKey}:`, error);
    throw error; // Re-lança o erro para tratamento superior
  }
}

/**
 * Armazena um item apenas no cache em memória
 */
function setMemoryCache<T>(key: string, data: T, ttl = DEFAULT_MEMORY_CACHE_TTL): void {
  const now = Date.now()
  memoryCache[key] = {
    data,
    timestamp: now,
    expiresAt: now + ttl
  }
}

/**
 * Armazena um item no cache (memória e arquivo, se configurado)
 */
export function setCache(key: string | null, object: unknown): void {
  if (!key) return
  
  setMemoryCache(key, object)
}

/**
 * Limpa um item específico do cache (memória e arquivo)
 */
export function clearCache(key: string): void {
  delete memoryCache[key]
}

/**
 * Limpa todo o cache em memória
 */
export function clearMemoryCache(): void {
  for (const key in memoryCache) {
    delete memoryCache[key]
  }
}
