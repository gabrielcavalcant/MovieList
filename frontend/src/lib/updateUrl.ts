import { useRouter, usePathname, useSearchParams } from "next/navigation";

function useUpdateUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = (updatedPage: string, paramName: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(paramName, updatedPage);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return updateUrl;
}

export default useUpdateUrl;
