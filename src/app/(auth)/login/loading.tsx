import Container from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Container className="grid min-h-screen place-items-center">
      <Skeleton className="grid min-h-[35rem] w-full max-w-lg md:max-w-4xl md:grid-cols-2" />
    </Container>
  );
}
