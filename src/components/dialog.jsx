"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog@1.1.6";
import { XIcon } from "lucide-react@0.487.0";
import PropTypes from "prop-types";
import { cn } from "./utils";

export function Dialog({ children, ...props }) {
  return (
    <DialogPrimitive.Root data-slot="dialog" {...props}>
      {children}
    </DialogPrimitive.Root>
  );
}

Dialog.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  defaultOpen: PropTypes.bool,
};

export function DialogTrigger({ children, asChild, ...props }) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      asChild={asChild}
      {...props}
    >
      {children}
    </DialogPrimitive.Trigger>
  );
}

DialogTrigger.propTypes = {
  children: PropTypes.node,
  asChild: PropTypes.bool,
};

export function DialogPortal({ children, ...props }) {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...props}>
      {children}
    </DialogPrimitive.Portal>
  );
}

DialogPortal.propTypes = {
  children: PropTypes.node,
};

export function DialogClose({ children, asChild, ...props }) {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" asChild={asChild} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}

DialogClose.propTypes = {
  children: PropTypes.node,
  asChild: PropTypes.bool,
};

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

DialogOverlay.propTypes = {
  className: PropTypes.string,
};

export function DialogContent({ className, children, ...props }) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

DialogContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function DialogHeader({ className, children, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    >
      {children}
    </div>
  );
}

DialogHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function DialogFooter({ className, children, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

DialogFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function DialogTitle({ className, children, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

DialogTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function DialogDescription({ className, children, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
}

DialogDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};