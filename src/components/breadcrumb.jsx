import * as React from "react";
import { Slot } from "@radix-ui/react-slot@1.1.2";
import { ChevronRight, MoreHorizontal } from "lucide-react@0.487.0";
import PropTypes from "prop-types";
import { cn } from "./utils";

export function Breadcrumb({ children, ...props }) {
  return (
    <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props}>
      {children}
    </nav>
  );
}

Breadcrumb.propTypes = {
  children: PropTypes.node,
};

export function BreadcrumbList({ className, children, ...props }) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    >
      {children}
    </ol>
  );
}

BreadcrumbList.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function BreadcrumbItem({ className, children, ...props }) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      {children}
    </li>
  );
}

BreadcrumbItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function BreadcrumbLink({
  asChild = false,
  className,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

BreadcrumbLink.propTypes = {
  asChild: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

export function BreadcrumbPage({ className, children, ...props }) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    >
      {children}
    </span>
  );
}

BreadcrumbPage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function BreadcrumbSeparator({ children, className, ...props }) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

BreadcrumbSeparator.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export function BreadcrumbEllipsis({ className, ...props }) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

BreadcrumbEllipsis.propTypes = {
  className: PropTypes.string,
};
