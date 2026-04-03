// Временный файл для обратной совместимости
// Каждый роут будет переписан под PostgreSQL
export async function getDB() {
  throw new Error('Этот роут ещё не адаптирован под PostgreSQL. Используйте query() из utils/db');
}
