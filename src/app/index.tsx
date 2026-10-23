import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ObservanceRow } from '@/components/calendar/observance-row';
import { ReviewStatusPill } from '@/components/content/review-status-pill';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notice } from '@/components/ui/notice';
import { Pill } from '@/components/ui/pill';
import { QuickAction } from '@/components/ui/quick-action';
import { Screen, SectionHeader } from '@/components/ui/screen';
import { AppInfo, ContentPolicy } from '@/constants/app';
import { IconSize, Spacing } from '@/constants/theme';
import { describeContentProvenance } from '@/content/presentation';
import type { CalendarObservance } from '@/content/types';
import { getUpcomingSampleObservances } from '@/data/calendar';
import { HomeContent } from '@/data/home';
import { useTheme } from '@/hooks/use-theme';
import { formatHindiDate, getHindiGreeting } from '@/lib/date';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const now = useMemo(() => new Date(), []);
  const upcoming = useMemo(() => getUpcomingSampleObservances(now, 1), [now]);
  const nextObservance = upcoming[0];

  return (
    <Screen
      eyebrow={getHindiGreeting(now)}
      title="आज की भक्ति"
      subtitle="आज के लिए एक शांत क्षण और अगला सरल कदम।">
      <View style={styles.dateRow}>
        <SymbolView
          name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
          size={IconSize.md}
          tintColor={theme.accent}
        />
        <ThemedText type="label" themeColor="textSecondary" style={styles.dateText}>
          {formatHindiDate(now)}
        </ThemedText>
        <Pill label="आज" tone="outline" />
      </View>

      <Card tone="accent" style={styles.thoughtCard}>
        <View style={styles.cardHeader}>
          <Pill label="आज का चिंतन" />
          <ReviewStatusPill status={HomeContent.thought.reviewStatus} />
        </View>

        <ThemedText type="lead">{HomeContent.thought.body}</ThemedText>

        <View style={styles.sourceRow}>
          <SymbolView
            name={{ ios: 'text.quote', android: 'format_quote', web: 'format_quote' }}
            size={IconSize.sm}
            tintColor={theme.textSecondary}
          />
          <ThemedText type="caption" themeColor="textSecondary" style={styles.sourceText}>
            {HomeContent.thought.attribution}
          </ThemedText>
        </View>

        {HomeContent.thought.reviewStatus === 'reviewed' ? (
          <ThemedText type="caption" themeColor="textSecondary">
            {describeContentProvenance(HomeContent.thought)}
          </ThemedText>
        ) : null}
      </Card>

      <Card style={styles.prayerCard}>
        <View style={styles.cardHeader}>
          <Pill label="प्रार्थना" tone="muted" />
          <ReviewStatusPill status={HomeContent.prayer.reviewStatus} />
        </View>

        <ThemedText type="heading">{HomeContent.prayer.title}</ThemedText>
        <ThemedText type="body" themeColor="textSecondary">
          {HomeContent.prayer.description}
        </ThemedText>

        <View style={styles.inlineStatus}>
          <SymbolView
            name={{ ios: 'checkmark.shield', android: 'verified', web: 'verified' }}
            size={IconSize.sm}
            tintColor={theme.success}
          />
          <ThemedText type="caption" themeColor="textSecondary" style={styles.sourceText}>
            केवल सत्यापित स्रोत के साथ प्रकाशित होगी
          </ThemedText>
        </View>
      </Card>

      <View style={styles.section}>
        <SectionHeader
          title="आगामी अवसर"
          actionLabel="कैलेंडर"
          onAction={() => router.push('/calendar')}
        />

        <Card style={styles.upcomingCard}>
          {renderUpcomingContent(nextObservance)}

          <Button
            label="कैलेंडर में देखें"
            variant="ghost"
            icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
            onPress={() => router.push('/calendar')}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title="अभी शुरू करें" hint="दो सरल कदम" />

        <View style={styles.quickRow}>
          <QuickAction
            href="/puja"
            icon={{ ios: 'flame.fill', android: 'temple_hindu', web: 'temple_hindu' }}
            title="पूजा गाइड"
            description="सामग्री और चरण"
          />
          <QuickAction
            href="/jaap"
            icon={{ ios: 'repeat', android: 'repeat', web: 'repeat' }}
            title="जाप"
            description="अपनी गति से स्मरण"
          />
        </View>
      </View>

      <Notice
        title="सामग्री नीति"
        description={ContentPolicy.verifiedOnly}
        icon={{ ios: 'checkmark.shield', android: 'verified', web: 'verified' }}
      />

      <ThemedText type="caption" themeColor="textSecondary" style={styles.footer}>
        {AppInfo.name} · {AppInfo.tagline}
      </ThemedText>
    </Screen>
  );
}

function renderUpcomingContent(observance: CalendarObservance | undefined) {
  if (!observance) {
    return (
      <View style={styles.emptyUpcoming}>
        <ThemedText type="bodyStrong">कोई सत्यापित अवसर नहीं</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          सत्यापित तिथि मिलते ही यहाँ दिखाई देगी।
        </ThemedText>
      </View>
    );
  }

  return (
    <>
      <ObservanceRow observance={observance} showDivider={false} />
      <Notice
        tone="sample"
        title="नमूना प्रविष्टि"
        description="यह तिथि केवल UI परीक्षण के लिए है। वास्तविक पर्व तिथि सत्यापन के बाद ही जोड़ी जाएगी।"
      />
    </>
  );
}

const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateText: {
    flex: 1,
  },
  thoughtCard: {
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  sourceText: {
    flex: 1,
  },
  prayerCard: {
    gap: Spacing.sm,
  },
  inlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  section: {
    gap: Spacing.md,
  },
  upcomingCard: {
    gap: Spacing.md,
  },
  emptyUpcoming: {
    gap: Spacing.xxs,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  footer: {
    textAlign: 'center',
  },
});
