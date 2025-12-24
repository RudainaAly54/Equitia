"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio@1.1.2";
import PropTypes from "prop-types";

export function AspectRatio({ children, ratio = 16 / 9, ...props }) {
  return (
    <AspectRatioPrimitive.Root data-slot="aspect-ratio" ratio={ratio} {...props}>
      {children}
    </AspectRatioPrimitive.Root>
  );
}

AspectRatio.propTypes = {
  children: PropTypes.node,
  ratio: PropTypes.number,
};