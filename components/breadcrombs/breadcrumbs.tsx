import Link from "next/link";
import { DotIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items = [] }: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items?.map((item, i) => (
          <span key={i} className="flex gap-2 items-center">
            <BreadcrumbItem key={i}>
              <BreadcrumbLink asChild>
                <Link href={item.href || "#"}>{item.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i < items.length - 1 && (
              <BreadcrumbSeparator>
                <DotIcon />
              </BreadcrumbSeparator>
            )}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
