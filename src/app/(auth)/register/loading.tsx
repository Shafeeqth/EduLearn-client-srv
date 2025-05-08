import Container from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function loading() {
  return (
    <Container className="flex min-h-screen justify-around">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </Container>
  );
}
