import { Pill } from '@/components/ui/pill';
import { getReviewStatusLabel } from '@/content/presentation';
import type { ContentReviewStatus } from '@/content/types';

type ReviewStatusPillProps = {
  status: ContentReviewStatus;
};

export function ReviewStatusPill({ status }: ReviewStatusPillProps) {
  return (
    <Pill
      label={getReviewStatusLabel(status)}
      tone={status === 'reviewed' ? 'success' : 'outline'}
    />
  );
}
