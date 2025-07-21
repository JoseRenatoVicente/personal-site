// Tempo padrão de expiração do cache em memória (10 minutos em milissegundos)
const DEFAULT_MEMORY_CACHE_TTL = 10 * 60 * 1000

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
    // Cache em memória existe e está válido
    return memoryCacheItem.data as T
  }

  return null
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
