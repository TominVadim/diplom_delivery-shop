// Временное хранилище кодов для восстановления пароля
// Используем globalThis для сохранения между запросами в dev-режиме

declare global {
  var _resetCodes: Map<string, { code: string; expiresAt: number }> | undefined;
}

const getGlobalMap = () => {
  if (!globalThis._resetCodes) {
    globalThis._resetCodes = new Map();
  }
  return globalThis._resetCodes;
};

export const getResetCodes = () => getGlobalMap();
export const setResetCode = (key: string, code: string, expiresAt: number) => {
  getGlobalMap().set(key, { code, expiresAt });
};
export const deleteResetCode = (key: string) => getGlobalMap().delete(key);
export const getResetCode = (key: string) => getGlobalMap().get(key);
