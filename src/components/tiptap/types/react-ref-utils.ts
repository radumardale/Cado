import React from 'react';

/**
 * Helper type for accessing refs from React elements across different React versions.
 * React 18 stores refs directly on the element, while React 19 stores them in props.
 * Note: Uses `any` for ref type to maintain compatibility with React's flexible ref system
 * where refs can point to any element type.
 */
export type ReactElementWithRef = React.ReactElement & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: React.Ref<any>;
  props?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref?: React.Ref<any>;
  };
};

/**
 * Extracts ref from a React element, handling both React 18 and React 19 patterns.
 * @param element - The React element to extract ref from
 * @returns The ref if found, undefined otherwise
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractRef(element: React.ReactElement): React.Ref<any> | undefined {
  if (!React.isValidElement(element)) {
    return undefined;
  }

  const elementWithRef = element as ReactElementWithRef;
  const reactVersion = parseInt(React.version, 10);

  // React 19+ stores ref in props, React 18 stores it on the element
  return reactVersion >= 19 ? elementWithRef.props?.ref : elementWithRef.ref;
}
