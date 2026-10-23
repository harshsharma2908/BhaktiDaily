import { StyleSheet, View } from 'react-native';

import { ReviewStatusPill } from '@/components/content/review-status-pill';
import { ThemedText } from '@/components/themed-text';
import { Pill } from '@/components/ui/pill';
import { Radius, Spacing } from '@/constants/theme';
import { getSourceLine } from '@/content/presentation';
import type { CalendarObservance } from '@/content/types';
import { useTheme } from '@/hooks/use-theme';
import { formatHindiMonthShort, parseDateKey } from '@/lib/date';

type ObservanceRowProps = {
  observance: CalendarObservance;
  showDivider?: boolean;
};

export function ObservanceRow({ observance, showDivider = true }: ObservanceRowProps) {
  const theme = useTheme();
  const date = parseDateKey(observance.date);
  const sourceLine = getSourceLine(observance.sourceIds);

  return (
    <View
      style={[
        styles.row,
        showDivider && { borderColor: theme.border, borderTopWidth: StyleSheet.hairlineWidth },
      ]}>
      <View style={[styles.dateBadge, { backgroundColor: theme.accentSoft }]}>
        <ThemedText type="title" themeColor="accent" style={styles.dayNumber}>
          {date.getDate()}
        </ThemedText>
        <ThemedText type="caption" themeColor="accent">
          {formatHindiMonthShort(date)}
        </ThemedText>
      </View>

      <View style={styles.copy}>
        <View style={styles.pills}>
          <Pill label={observance.category} tone="muted" />
          <ReviewStatusPill status={observance.reviewStatus} />
        </View>
        <ThemedText type="bodyStrong">{observance.title}</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
          {observance.description}
        </ThemedText>
        {sourceLine ? (
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={2}>
            {sourceLine}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.md,
  },
  dateBadge: {
    width: 54,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    paddingVertical: Spacing.xs,
  },
  dayNumber: {
    lineHeight: 30,
    fontVariant: ['tabular-nums'],
  },
  copy: {
    flex: 1,
    gap: Spacing.xxs,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xxs,
  },
});
