import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { colors } from '../theme';

type HighlightTextProps = {
  text: string;
  query: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

// Tô đậm đoạn khớp từ khoá (không phân biệt hoa thường), giống cách lọc danh sách.
export function HighlightText({
  text,
  query,
  style,
  numberOfLines,
}: HighlightTextProps) {
  const needle = query.trim().toLowerCase();
  const start = needle ? text.toLowerCase().indexOf(needle) : -1;

  if (start < 0) {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {text}
      </Text>
    );
  }

  const end = start + needle.length;
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {text.slice(0, start)}
      <Text style={styles.match}>{text.slice(start, end)}</Text>
      {text.slice(end)}
    </Text>
  );
}

const styles = StyleSheet.create({
  match: {
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    fontWeight: '800',
  },
});
