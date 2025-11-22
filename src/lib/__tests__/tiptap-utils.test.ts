import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  isEmptyNode,
  convertFileToBase64,
  handleImageUpload,
  isMarkInSchema,
  isNodeInSchema,
  getActiveMarkAttrs,
  findNodePosition,
} from '@/lib/tiptap-utils';

/**
 * TipTap Utility Functions Tests
 *
 * Tests for TipTap editor utility functions including:
 * - Pure utilities (cn, isEmptyNode, file conversion)
 * - Image upload handling with progress tracking
 * - Editor-dependent functions (schema validation, mark/node operations)
 */

describe('TipTap Utilities', () => {
  describe('cn() - Class Name Joiner', () => {
    it('should join single class', () => {
      expect(cn('text-red-500')).toBe('text-red-500');
    });

    it('should join multiple classes', () => {
      expect(cn('text-red-500', 'bg-blue-500', 'p-4')).toBe('text-red-500 bg-blue-500 p-4');
    });

    it('should filter out falsy values', () => {
      expect(cn('valid', false, null, undefined, '', 'another')).toBe('valid another');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;

      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle all falsy values', () => {
      expect(cn(false, null, undefined, '')).toBe('');
    });

    it('should join classes without trimming individual strings', () => {
      expect(cn('  class1  ', '  class2  ')).toBe('  class1     class2  ');
    });
  });

  describe('isEmptyNode()', () => {
    it('should return false for undefined node', () => {
      expect(isEmptyNode(undefined)).toBe(false);
    });

    it('should return false for null node', () => {
      expect(isEmptyNode(null)).toBe(false);
    });

    it('should return true for node with empty content', () => {
      const emptyNode = {
        content: { size: 0 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      expect(isEmptyNode(emptyNode)).toBe(true);
    });

    it('should return false for node with content', () => {
      const nodeWithContent = {
        content: { size: 10 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      expect(isEmptyNode(nodeWithContent)).toBe(false);
    });

    it('should return true for node with zero-sized content', () => {
      const zeroSizeNode = {
        content: { size: 0 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      expect(isEmptyNode(zeroSizeNode)).toBe(true);
    });
  });

  describe('convertFileToBase64()', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockFileReader: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let originalFileReader: any;

    beforeEach(() => {
      // Save original FileReader
      originalFileReader = global.FileReader;

      // Create mock FileReader
      mockFileReader = {
        readAsDataURL: vi.fn(),
        abort: vi.fn(),
        onloadend: null,
        onerror: null,
        result: null,
      };

      // Mock FileReader constructor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      global.FileReader = vi.fn(() => mockFileReader) as any;
    });

    afterEach(() => {
      // Restore original FileReader
      global.FileReader = originalFileReader;
      vi.clearAllMocks();
    });

    it('should successfully convert file to base64', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const expectedBase64 = 'data:text/plain;base64,dGVzdCBjb250ZW50';

      const promise = convertFileToBase64(mockFile);

      // Simulate successful file read
      mockFileReader.result = expectedBase64;
      mockFileReader.onloadend?.();

      const result = await promise;
      expect(result).toBe(expectedBase64);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
    });

    it('should reject on file read error', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockError = new Error('Read error');

      const promise = convertFileToBase64(mockFile);

      // Simulate file read error
      mockFileReader.onerror?.(mockError);

      await expect(promise).rejects.toThrow('File reading error:');
    });

    it('should handle abort signal', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const abortController = new AbortController();

      const promise = convertFileToBase64(mockFile, abortController.signal);

      // Abort the operation
      abortController.abort();

      await expect(promise).rejects.toThrow('Upload cancelled');
    });

    it('should handle empty file', async () => {
      const mockFile = new File([], 'empty.txt', { type: 'text/plain' });
      const expectedBase64 = 'data:text/plain;base64,';

      const promise = convertFileToBase64(mockFile);

      mockFileReader.result = expectedBase64;
      mockFileReader.onloadend?.();

      const result = await promise;
      expect(result).toBe(expectedBase64);
    });

    it('should handle image files', async () => {
      const mockFile = new File(['fake image data'], 'image.png', { type: 'image/png' });
      const expectedBase64 = 'data:image/png;base64,ZmFrZSBpbWFnZSBkYXRh';

      const promise = convertFileToBase64(mockFile);

      mockFileReader.result = expectedBase64;
      mockFileReader.onloadend?.();

      const result = await promise;
      expect(result).toBe(expectedBase64);
      expect(result).toContain('image/png');
    });

    it('should reject if no file provided', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(convertFileToBase64(null as any)).rejects.toThrow('No file provided');
    });
  });

  describe('handleImageUpload()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.clearAllMocks();
    });

    it('should successfully upload image with progress tracking', async () => {
      const mockFile = new File(['image data'], 'test.jpg', { type: 'image/jpeg' });
      const onProgress = vi.fn();

      const promise = handleImageUpload(mockFile, onProgress);

      // Fast-forward through all setTimeout calls
      await vi.runAllTimersAsync();

      const result = await promise;
      expect(result).toBe('/images/placeholder-image.png');

      // Should have called onProgress with incremental values
      expect(onProgress).toHaveBeenCalledWith({ progress: 0 });
      expect(onProgress).toHaveBeenCalledWith({ progress: 10 });
      expect(onProgress).toHaveBeenCalledWith({ progress: 100 });
    });

    it('should reject if no file provided', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(handleImageUpload(null as any)).rejects.toThrow('No file provided');
    });

    it('should reject if file size exceeds limit', async () => {
      const largeData = new Array(6 * 1024 * 1024).fill('x').join(''); // 6MB
      const mockFile = new File([largeData], 'large.jpg', { type: 'image/jpeg' });

      await expect(handleImageUpload(mockFile)).rejects.toThrow(
        'File size exceeds maximum allowed'
      );
    });

    it('should handle abort signal during upload', async () => {
      const mockFile = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
      const abortController = new AbortController();

      const promise = handleImageUpload(mockFile, undefined, abortController.signal);

      // Attach error handler before aborting to prevent unhandled rejection
      const expectation = expect(promise).rejects.toThrow('Upload cancelled');

      // Abort mid-upload
      abortController.abort();
      await vi.runAllTimersAsync();

      await expectation;
    });

    it('should work without progress callback', async () => {
      const mockFile = new File(['data'], 'test.jpg', { type: 'image/jpeg' });

      const promise = handleImageUpload(mockFile);
      await vi.runAllTimersAsync();

      const result = await promise;
      expect(result).toBe('/images/placeholder-image.png');
    });

    it('should call onProgress with correct structure', async () => {
      const mockFile = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
      const onProgress = vi.fn();

      const promise = handleImageUpload(mockFile, onProgress);
      await vi.runAllTimersAsync();

      await promise;

      // Verify each call has the correct structure
      onProgress.mock.calls.forEach(call => {
        expect(call[0]).toHaveProperty('progress');
        expect(typeof call[0].progress).toBe('number');
        expect(call[0].progress).toBeGreaterThanOrEqual(0);
        expect(call[0].progress).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle cn with very long class names', () => {
      const longClass = 'a'.repeat(1000);
      const result = cn(longClass, 'short');

      expect(result).toContain(longClass);
      expect(result).toContain('short');
    });

    it('should handle isEmptyNode with node having content', () => {
      const nodeWithContent = {
        content: { size: 50 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      expect(isEmptyNode(nodeWithContent)).toBe(false);
    });

    it('should handle isEmptyNode with various content sizes', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodeWithSize1 = { content: { size: 1 } } as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodeWithSize100 = { content: { size: 100 } } as any;

      expect(isEmptyNode(nodeWithSize1)).toBe(false);
      expect(isEmptyNode(nodeWithSize100)).toBe(false);
    });

    it('should handle cn with special characters', () => {
      expect(cn('class-with-dash', 'class_with_underscore', 'class:with:colon')).toBe(
        'class-with-dash class_with_underscore class:with:colon'
      );
    });

    it('should handle cn with Unicode characters', () => {
      expect(cn('class-你好', 'class-🎉')).toBe('class-你好 class-🎉');
    });
  });

  describe('Editor-Dependent Functions', () => {
    describe('isMarkInSchema()', () => {
      it('should return false when editor is null', () => {
        expect(isMarkInSchema('bold', null)).toBe(false);
      });

      it('should return false when editor has no schema', () => {
        const editorWithoutSchema = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isMarkInSchema('bold', editorWithoutSchema)).toBe(false);
      });

      it('should return true when mark exists in schema', () => {
        const mockEditor = {
          schema: {
            spec: {
              marks: new Map([
                ['bold', { name: 'bold' }],
                ['italic', { name: 'italic' }],
              ]),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isMarkInSchema('bold', mockEditor)).toBe(true);
      });

      it('should return false when mark does not exist in schema', () => {
        const mockEditor = {
          schema: {
            spec: {
              marks: new Map([
                ['bold', { name: 'bold' }],
                ['italic', { name: 'italic' }],
              ]),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isMarkInSchema('underline', mockEditor)).toBe(false);
      });

      it('should return true for all registered marks', () => {
        const mockEditor = {
          schema: {
            spec: {
              marks: new Map([
                ['bold', {}],
                ['italic', {}],
                ['underline', {}],
                ['strike', {}],
              ]),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isMarkInSchema('bold', mockEditor)).toBe(true);
        expect(isMarkInSchema('italic', mockEditor)).toBe(true);
        expect(isMarkInSchema('underline', mockEditor)).toBe(true);
        expect(isMarkInSchema('strike', mockEditor)).toBe(true);
      });

      it('should handle empty marks map', () => {
        const mockEditor = {
          schema: {
            spec: {
              marks: new Map(),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isMarkInSchema('bold', mockEditor)).toBe(false);
      });
    });

    describe('isNodeInSchema()', () => {
      it('should return false when editor is null', () => {
        expect(isNodeInSchema('paragraph', null)).toBe(false);
      });

      it('should return false when editor has no schema', () => {
        const editorWithoutSchema = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isNodeInSchema('paragraph', editorWithoutSchema)).toBe(false);
      });

      it('should return true when node exists in schema', () => {
        const mockEditor = {
          schema: {
            spec: {
              nodes: new Map([
                ['paragraph', { name: 'paragraph' }],
                ['heading', { name: 'heading' }],
              ]),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isNodeInSchema('paragraph', mockEditor)).toBe(true);
      });

      it('should return false when node does not exist in schema', () => {
        const mockEditor = {
          schema: {
            spec: {
              nodes: new Map([
                ['paragraph', { name: 'paragraph' }],
                ['heading', { name: 'heading' }],
              ]),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isNodeInSchema('blockquote', mockEditor)).toBe(false);
      });

      it('should return true for all registered nodes', () => {
        const mockEditor = {
          schema: {
            spec: {
              nodes: new Map([
                ['doc', {}],
                ['paragraph', {}],
                ['heading', {}],
                ['codeBlock', {}],
              ]),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isNodeInSchema('doc', mockEditor)).toBe(true);
        expect(isNodeInSchema('paragraph', mockEditor)).toBe(true);
        expect(isNodeInSchema('heading', mockEditor)).toBe(true);
        expect(isNodeInSchema('codeBlock', mockEditor)).toBe(true);
      });

      it('should handle empty nodes map', () => {
        const mockEditor = {
          schema: {
            spec: {
              nodes: new Map(),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(isNodeInSchema('paragraph', mockEditor)).toBe(false);
      });
    });

    describe('getActiveMarkAttrs()', () => {
      it('should return null when editor is null', () => {
        expect(getActiveMarkAttrs(null, 'bold')).toBeNull();
      });

      it('should return null when no marks are active', () => {
        const mockEditor = {
          state: {
            storedMarks: null,
            selection: {
              $from: {
                marks: () => [],
              },
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(getActiveMarkAttrs(mockEditor, 'bold')).toBeNull();
      });

      it('should return mark attributes when mark is active in storedMarks', () => {
        const mockAttrs = { href: 'https://example.com', target: '_blank' };
        const mockEditor = {
          state: {
            storedMarks: [
              {
                type: { name: 'link' },
                attrs: mockAttrs,
              },
            ],
            selection: {
              $from: {
                marks: () => [],
              },
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(getActiveMarkAttrs(mockEditor, 'link')).toEqual(mockAttrs);
      });

      it('should return mark attributes when mark is active in selection', () => {
        const mockAttrs = { color: '#ff0000' };
        const mockEditor = {
          state: {
            storedMarks: null,
            selection: {
              $from: {
                marks: () => [
                  {
                    type: { name: 'textColor' },
                    attrs: mockAttrs,
                  },
                ],
              },
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(getActiveMarkAttrs(mockEditor, 'textColor')).toEqual(mockAttrs);
      });

      it('should return null when requested mark is not in active marks', () => {
        const mockEditor = {
          state: {
            storedMarks: null,
            selection: {
              $from: {
                marks: () => [
                  {
                    type: { name: 'bold' },
                    attrs: {},
                  },
                  {
                    type: { name: 'italic' },
                    attrs: {},
                  },
                ],
              },
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(getActiveMarkAttrs(mockEditor, 'underline')).toBeNull();
      });

      it('should prioritize storedMarks over selection marks', () => {
        const storedAttrs = { href: 'https://stored.com' };
        const selectionAttrs = { href: 'https://selection.com' };
        const mockEditor = {
          state: {
            storedMarks: [
              {
                type: { name: 'link' },
                attrs: storedAttrs,
              },
            ],
            selection: {
              $from: {
                marks: () => [
                  {
                    type: { name: 'link' },
                    attrs: selectionAttrs,
                  },
                ],
              },
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(getActiveMarkAttrs(mockEditor, 'link')).toEqual(storedAttrs);
      });

      it('should handle marks with empty attributes', () => {
        const mockEditor = {
          state: {
            storedMarks: null,
            selection: {
              $from: {
                marks: () => [
                  {
                    type: { name: 'bold' },
                    attrs: {},
                  },
                ],
              },
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(getActiveMarkAttrs(mockEditor, 'bold')).toEqual({});
      });
    });

    describe('findNodePosition()', () => {
      it('should return null when editor is null', () => {
        expect(findNodePosition({ editor: null })).toBeNull();
      });

      it('should return null when editor has no state or doc', () => {
        const editorWithoutState = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(findNodePosition({ editor: editorWithoutState })).toBeNull();
      });

      it('should return null when neither node nor nodePos is provided', () => {
        const mockEditor = {
          state: {
            doc: {},
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(findNodePosition({ editor: mockEditor })).toBeNull();
      });

      it('should find node at given position', () => {
        const mockNode = { type: { name: 'paragraph' } };
        const mockEditor = {
          state: {
            doc: {
              nodeAt: vi.fn().mockReturnValue(mockNode),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        const result = findNodePosition({ editor: mockEditor, nodePos: 10 });

        expect(result).toEqual({ pos: 10, node: mockNode });
        expect(mockEditor.state.doc.nodeAt).toHaveBeenCalledWith(10);
      });

      it('should return null when node not found at position', () => {
        const mockEditor = {
          state: {
            doc: {
              nodeAt: vi.fn().mockReturnValue(null),
              descendants: vi.fn(), // Add descendants method even though not used when nodePos is null
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        const result = findNodePosition({ editor: mockEditor, nodePos: 10 });

        expect(result).toBeNull();
        expect(mockEditor.state.doc.nodeAt).toHaveBeenCalledWith(10);
      });

      it('should handle position 0', () => {
        const mockNode = { type: { name: 'doc' } };
        const mockEditor = {
          state: {
            doc: {
              nodeAt: vi.fn().mockReturnValue(mockNode),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        const result = findNodePosition({ editor: mockEditor, nodePos: 0 });

        expect(result).toEqual({ pos: 0, node: mockNode });
        expect(mockEditor.state.doc.nodeAt).toHaveBeenCalledWith(0);
      });

      it('should search for node in document when only node is provided', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockNode = { type: { name: 'paragraph' } } as any;
        const mockEditor = {
          state: {
            doc: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              descendants: vi.fn((callback: any) => {
                // Simulate finding the node at position 5
                callback(mockNode, 5);
              }),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        const result = findNodePosition({ editor: mockEditor, node: mockNode });

        expect(result).toEqual({ pos: 5, node: mockNode });
        expect(mockEditor.state.doc.descendants).toHaveBeenCalled();
      });

      it('should return null when node not found in document', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const searchNode = { type: { name: 'paragraph' } } as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const differentNode = { type: { name: 'heading' } } as any;
        const mockEditor = {
          state: {
            doc: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              descendants: vi.fn((callback: any) => {
                // Simulate traversing nodes but not finding the target
                callback(differentNode, 0);
                callback(differentNode, 10);
              }),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        const result = findNodePosition({ editor: mockEditor, node: searchNode });

        expect(result).toBeNull();
      });

      it('should handle errors when checking node at position', () => {
        const mockEditor = {
          state: {
            doc: {
              nodeAt: vi.fn().mockImplementation(() => {
                throw new Error('Invalid position');
              }),
            },
          },
        } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = findNodePosition({ editor: mockEditor, nodePos: 999 });

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error checking node at position:',
          expect.any(Error)
        );

        consoleSpy.mockRestore();
      });
    });
  });
});
