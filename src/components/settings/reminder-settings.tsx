import { SymbolView } from 'expo-symbols';
import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { Notice } from '@/components/ui/notice';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { adjustReminderTimeByStep, formatReminderTime } from '@/lib/reminder';
import { usePreferences } from '@/providers/preferences-provider';
import { openReminderSettings } from '@/services/reminders';

export function ReminderSettings() {
  const theme = useTheme();
  const {
    preferences,
    reminderStatus,
    reminderSupported,
    setReminderEnabled,
    setReminderTime,
  } = usePreferences();

  const reminder = preferences.reminder;
  const formattedTime = formatReminderTime(reminder);
  const busy = reminderStatus === 'loading';

  function adjustTime(steps: number) {
    void setReminderTime(adjustReminderTimeByStep(reminder, steps));
  }

  return (
    <Card style={styles.card}>
      <View style={styles.toggleRow}>
        <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
          <SymbolView
            name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
            size={IconSize.md}
            tintColor={theme.accent}
          />
        </View>

        <View style={styles.copy}>
          <ThemedText type="bodyStrong">प्रार्थना रिमाइंडर</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            {reminderSupported
              ? 'वैकल्पिक दैनिक स्मरण · केवल इस डिवाइस पर'
              : 'इस प्लेटफ़ॉर्म पर उपलब्ध नहीं'}
          </ThemedText>
        </View>

        <Switch
          accessibilityLabel="प्रार्थना रिमाइंडर"
          accessibilityHint={
            reminder.enabled
              ? 'दैनिक रिमाइंडर बंद करें'
              : 'दैनिक रिमाइंडर चालू करें; सूचना अनुमति माँगी जाएगी'
          }
          accessibilityState={{ checked: reminder.enabled, disabled: !reminderSupported || busy }}
          disabled={!reminderSupported || busy}
          onValueChange={(value) => {
            void setReminderEnabled(value);
          }}
          trackColor={{ false: theme.border, true: theme.accentBorder }}
          thumbColor={reminder.enabled ? theme.accent : theme.surface}
          ios_backgroundColor={theme.border}
          value={reminder.enabled}
        />
      </View>

      <View style={[styles.timeBlock, { borderTopColor: theme.border }]}>
        <View style={styles.timeLabels}>
          <ThemedText type="label">रिमाइंडर का समय</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            5 मिनट के अंतराल में
          </ThemedText>
        </View>

        <View style={styles.timeRow}>
          <IconButton
            accessibilityLabel="रिमाइंडर का समय 5 मिनट कम करें"
            disabled={!reminderSupported || busy}
            icon={{ ios: 'minus', android: 'remove', web: 'remove' }}
            onPress={() => adjustTime(-1)}
          />

          <View
            accessible
            accessibilityLabel={`रिमाइंडर का समय ${formattedTime}, स्थानीय समय`}
            style={styles.timeValue}>
            <ThemedText type="title" style={styles.timeText}>
              {formattedTime}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              स्थानीय समय
            </ThemedText>
          </View>

          <IconButton
            accessibilityLabel="रिमाइंडर का समय 5 मिनट बढ़ाएँ"
            disabled={!reminderSupported || busy}
            icon={{ ios: 'plus', android: 'add', web: 'add' }}
            onPress={() => adjustTime(1)}
          />
        </View>
      </View>

      {reminderStatus === 'scheduled' ? (
        <Notice
          tone="success"
          title="रिमाइंडर चालू है"
          description={`हर दिन लगभग ${formattedTime} बजे एक स्थानीय सूचना भेजी जाएगी। फ़ोन की बैटरी या सिस्टम सेटिंग्स से समय थोड़ा बदल सकता है।`}
        />
      ) : null}

      {reminderStatus === 'permission-denied' ? (
        <>
          <Notice
            title="सूचना अनुमति नहीं मिली"
            description={
              reminder.enabled
                ? 'फ़ोन की सेटिंग्स में भक्ति दैनिक के लिए सूचनाएँ चालू करें, फिर स्विच बंद करके दोबारा चालू करें।'
                : 'फ़ोन की सेटिंग्स में भक्ति दैनिक के लिए सूचनाएँ चालू करें, फिर रिमाइंडर स्विच चालू करें।'
            }
          />
          {reminderSupported ? (
            <Button
              label="सूचना सेटिंग्स खोलें"
              variant="secondary"
              onPress={() => {
                void openReminderSettings();
              }}
            />
          ) : null}
        </>
      ) : null}

      {reminderStatus === 'unsupported' ? (
        <Notice
          title="स्थानीय रिमाइंडर उपलब्ध नहीं"
          description="दैनिक रिमाइंडर केवल Android और iOS ऐप में काम करते हैं। वेब संस्करण में कोई सूचना नहीं भेजी जाएगी।"
        />
      ) : null}

      {reminderStatus === 'error' ? (
        <Notice
          title="रिमाइंडर अपडेट नहीं हो सका"
          description="स्थानीय सूचना सेट या बंद करने में समस्या आई। कृपया ऐप दोबारा खोलकर फिर कोशिश करें।"
        />
      ) : null}

      {reminderStatus === 'loading' ? (
        <ThemedText type="caption" themeColor="textSecondary">
          रिमाइंडर तैयार किया जा रहा है…
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: Spacing.xxs,
  },
  timeBlock: {
    gap: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.lg,
  },
  timeLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  timeValue: {
    minWidth: 104,
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  timeText: {
    fontVariant: ['tabular-nums'],
  },
});
