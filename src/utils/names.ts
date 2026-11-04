// Tên gọi kiểu Việt là từ cuối: "Phạm Đức Anh" -> "Anh".
export function givenName(name: string): string {
  const words = name.trim().split(/\s+/);
  return words[words.length - 1] || name;
}

// Thứ tự nhóm danh bạ: bảng chữ cái có Đ đứng sau D, ký tự lạ dồn về '#'.
export const INDEX_LETTERS = 'ABCDĐEFGHIJKLMNOPQRSTUVWXYZ#';

// Chữ cái nhóm A-Z cho danh bạ: bỏ dấu (Ă/Â -> A) nhưng giữ Đ là một chữ riêng.
export function indexLetter(name: string): string {
  const first = Array.from(name.trim())[0] ?? '';
  const letter = first
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return /^[A-ZĐ]$/.test(letter) ? letter : '#';
}
