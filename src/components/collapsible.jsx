"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible@1.1.3";
import PropTypes from "prop-types";

export function Collapsible({ children, ...props }) {
  return (
    <CollapsiblePrimitive.Root data-slot="collapsible" {...props}>
      {children}
    </CollapsiblePrimitive.Root>
  );
}

Collapsible.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
};

export function CollapsibleTrigger({ children, asChild, ...props }) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      asChild={asChild}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleTrigger>
  );
}

CollapsibleTrigger.propTypes = {
  children: PropTypes.node,
  asChild: PropTypes.bool,
};

export function CollapsibleContent({ children, ...props }) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  );
}

CollapsibleContent.propTypes = {
  children: PropTypes.node,
};