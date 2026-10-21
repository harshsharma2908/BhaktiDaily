import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MonthGrid } from '@/components/calendar/month-grid';
import { ObservanceRow } from '@/components/calendar/observance-row';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Notice } from '@/components/ui/notice';
import { Pill } from '@/components/ui/pill';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { AppInfo } from '@/constants/app';
import { IconSize, Layout, Radius, Spacing, TouchTarget } from '@/constants/theme';
import { getSampleObservancesForMonth, getUpcomingSampleObservances } from '@/data/calendar';
import { useTheme } from '@/hooks/use-theme';
import { addMonths, formatHindiFullDate, formatHindiMonth, formatHindiDate, startOfMonth, toDateKey } from '@/lib/date';

export default function CalendarScreen() {
  const theme = useTheme();
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthObservances = useMemo(
    () => getSampleObservancesForMonth(year, month),
    [year, month]
  );
  const upcoming = useMemo(() => getUpcomingSampleObservances(today, 3), [today]);

  const selectedKey = toDateKey(selectedDate);
  const selectedObservances = monthObservances.filter((observance) => observance.date === selectedKey);
  const eventDates = monthObservances.map((observance) => observance.date);
  const isTodaySelected = selectedKey === toDateKey(today);

  function changeMonth(offset: number) {
    const nextMonth = addMonths(viewDate, offset);
    setViewDate(nextMonth);
    setSelectedDate(nextMonth);
  }

  function goToToday() {
    setViewDate(startOfMonth(today));
    setSelectedDate(today);
  }

  return (
    <Screen
      eyebrow={AppInfo.name}
      title="कैलेंडर"
      subtitle="महीना देखें, दिन चुनें और आगामी अवसरों की तैयारी करें।">
      <Notice
        tone="sample"
        title="नमूना डेटा"
        description="अभी कैलेंडर में केवल UI परीक्षण के लिए बनाई गई प्रविष्टियाँ हैं। कोई भी तिथि वास्तविक पर्व, व्रत या मुहूर्त नहीं है।"
      />

      <Card style={styles.calendarCard}>
        <View style={styles.monthNav}>
          <MonthButton
            icon={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            label="पिछला महीना"
            onPress={() => changeMonth(-1)}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${formatHindiMonth(viewDate)}, आज पर लौटें`}
            hitSlop={4}
            onPress={goToToday}
            style={({ pressed }) => [styles.monthLabel, pressed && styles.pressed]}>
            <ThemedText type="title" style={styles.centerText}>
              {formatHindiMonth(viewDate)}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" style={styles.centerText}>
              आज पर लौटें
            </ThemedText>
          </Pressable>

          <MonthButton
            icon={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            label="अगला महीना"
            onPress={() => changeMonth(1)}
          />
        </View>

        <MonthGrid
          year={year}
          month={month}
          selectedDate={selectedDate}
          eventDates={eventDates}
          onSelectDate={setSelectedDate}
        />

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.accent }]} />
            <ThemedText type="caption" themeColor="textSecondary">
              नमूना प्रविष्टि
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendToday, { borderColor: theme.accent }]} />
            <ThemedText type="caption" themeColor="textSecondary">
              आज
            </ThemedText>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <SectionHeader title="चयनित दिन" />

        <View style={styles.selectedDateRow}>
          <SymbolView
            name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
            size={IconSize.md}
            tintColor={theme.accent}
          />
          <ThemedText type="bodyStrong" style={styles.selectedDateText}>
            {formatHindiFullDate(selectedDate)}
          </ThemedText>
          {isTodaySelected ? <Pill label="आज" tone="outline" /> : null}
        </View>

        {selectedObservances.length > 0 ? (
          <Card>
            {selectedObservances.map((observance, index) => (
              <ObservanceRow
                key={observance.id}
                observance={observance}
                showDivider={index > 0}
              />
            ))}
          </Card>
        ) : (
          <EmptyState
            compact
            icon={{ ios: 'calendar', android: 'event_busy', web: 'event_busy' }}
            title="इस दिन कोई नमूना अवसर नहीं"
            description="बिंदु वाले दिनों पर नमूना प्रविष्टियाँ हैं। सत्यापित तिथियाँ बाद में जोड़ी जाएँगी।"
          />
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader title="आगामी नमूना प्रविष्टियाँ" hint="स्रोत लंबित" />

        {upcoming.length > 0 ? (
          <Card>
            {upcoming.map((observance, index) => (
              <ObservanceRow
                key={observance.id}
                observance={observance}
                showDivider={index > 0}
              />
            ))}
          </Card>
        ) : (
          <EmptyState
            icon={{ ios: 'calendar.badge.clock', android: 'event_upcoming', web: 'event_upcoming' }}
            title="कोई आगामी प्रविष्टि नहीं"
            description="सत्यापित तिथि उपलब्ध होते ही यहाँ दिखाई देगी।"
          />
        )}
      </View>

      <Notice
        title="तिथियाँ कैसे जोड़ी जाएँगी"
        description="हर वास्तविक प्रविष्टि प्रामाणिक पंचांग स्रोत, समीक्षक और अंतिम जाँच की तारीख के साथ जोड़ी जाएगी।"
      />

      <ThemedText type="caption" themeColor="textSecondary" style={styles.footer}>
        आज: {formatHindiDate(today)}
      </ThemedText>
    </Screen>
  );
}

type MonthButtonProps = {
  icon: SymbolViewProps['name'];
  label: string;
  onPress: () => void;
};

function MonthButton({ icon, label, onPress }: MonthButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: theme.accentSoft, borderless: true }}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.monthButton,
        { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <SymbolView name={icon} size={IconSize.md} tintColor={theme.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: Layout.calendarMaxWidth,
    gap: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  monthLabel: {
    flex: 1,
    minHeight: TouchTarget.min,
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  monthButton: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendToday: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 4,
  },
  section: {
    gap: Spacing.md,
  },
  selectedDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  selectedDateText: {
    flex: 1,
  },
  centerText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  footer: {
    textAlign: 'center',
  },
});
