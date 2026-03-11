import { AppLayout } from '@/components/common/layout/AppLayout';
import { Header } from '@/components/common/layout/Header';

export default function FallBackPage() {
  return (
    <AppLayout
      header={<Header title="" showBackButton={false} showSettingButton={false} />}
      pageBackgroundClassName="bg-white"
    >
      {''}
    </AppLayout>
  );
}
