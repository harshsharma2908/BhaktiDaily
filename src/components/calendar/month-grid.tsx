import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getMonthCells, WEEKDAY_LABELS } from '@/lib/calendar';
import { formatHindiFullDate, isSameDay, toDateKey } from '@/lib/date';

type MonthGridProps = {
  year: number;
  month: number;
  selectedDate: Date;
  eventDates: string[];
  onSelectDate: (date: Date) => void;
};

export function MonthGrid({ year, month, selectedDate, eventDates, onSelectDate }: MonthGridProps) {
  const theme = useTheme();
  const today = new Date();
  const cells = getMonthCells(year, month);
  const eventDateSet = new Set(eventDates);

  return (
    <View>
      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={styles.weekCell}>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.centerText}>
              {label}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, index) => {
          if (!cell) {
            return <View key={`empty-${index}`} style={styles.daySlot} />;
          }

          const isSelected = isSameDay(cell.date, selectedDate);
          const isToday = isSameDay(cell.date, today);
          const hasEvent = eventDateSet.has(toDateKey(cell.date));
          const stateLabel = [
            hasEvent ? 'नमूना प्रविष्टि' : null,
            isToday ? 'आज' : null,
            isSelected ? 'चयनित' : null,
          ]
            .filter(Boolean)
            .join(', ');

          return (
            <View key={cell.key} style={styles.daySlot}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${formatHindiFullDate(cell.date)}${stateLabel ? `, ${stateLabel}` : ''}`}
                accessibilityState={{ selected: isSelected }}
                android_ripple={{ color: theme.accentSoft, borderless: true }}
                hitSlop={{ top: 0, bottom: 0, left: 2, right: 2 }}
                onPress={() => onSelectDate(cell.date)}
                style={({ pressed }) => [
                  styles.day,
                  isToday &&
                    !isSelected && {
                      borderColor: theme.accent,
                      borderWidth: 1.5,
                    },
                  isSelected && { backgroundColor: theme.accent },
                  pressed && !isSelected && { backgroundColor: theme.surfaceMuted },
                ]}>
                <ThemedText
                  type="label"
                  themeColor={isSelected ? 'onAccent' : isToday ? 'accent' : 'text'}
                  style={styles.dayText}>
                  {cell.day}
                </ThemedText>

                {hasEvent ? (
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isSelected ? theme.onAccent : theme.accent },
                    ]}
                  />
                ) : null}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    paddingBottom: Spacing.sm,
  },
  weekCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  daySlot: {
    width: `${100 / 7}%`,
    paddingVertical: 2,
  },
  day: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm + 2,
  },
  dayText: {
    fontVariant: ['tabular-nums'],
  },
  dot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  centerText: {
    textAlign: 'center',
  },
});
